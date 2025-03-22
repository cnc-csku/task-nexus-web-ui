"use client";

import { Button } from "@heroui/button";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MarkerType,
  Controls,
  Background,
  addEdge,
} from "@xyflow/react";

import type { Node, Edge, NodeTypes, OnConnect, EdgeTypes, OnBeforeDelete } from "@xyflow/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useCallback, useEffect } from "react";
import EditableNode from "@/components/reactflow/EditableNode";
import ButtonEdge from "@/components/reactflow/ButtonEdge";
import EditableStartNode from "@/components/reactflow/EditableStartNode";
import EditableEndNode from "@/components/reactflow/EditableEndNode";
import { UpdateProjectWorkflowType, Workflow } from "@/interfaces/Project";
import { toast } from "sonner";
import { MdSave } from "react-icons/md";

const nodeTypes: NodeTypes = {
  editableNode: EditableNode,
  editableStartNode: EditableStartNode,
  editableEndNode: EditableEndNode,
};

const edgeTypes: EdgeTypes = {
  buttonEdge: ButtonEdge,
};

export interface UpdateProjectWorkflowsFlowProps {
  projectId: string;
  workflows: Workflow[];
  submitFn: (data: UpdateProjectWorkflowType) => void;
  isLoading: boolean;
}

export default function UpdateProjectWorkflowsFlow({
  projectId,
  workflows,
  submitFn,
  isLoading,
}: UpdateProjectWorkflowsFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const { nodes, edges } = transformToNodesAndEdges(workflows);

    setNodes(nodes);
    setEdges(edges);
  }, []);

  const onConnect: OnConnect = useCallback(
    ({ source, target }) => {
      if (source === target) {
        console.error("Cannot connect a node to itself");
        return;
      }

      setEdges((prevEdges) =>
        addEdge(
          {
            id: `${source}->${target}`,
            source: source,
            target: target,
            type: "buttonEdge",
            style: {
              stroke: "#363636",
              strokeWidth: 2,
            },
            markerEnd: {
              color: "#363636",
              type: MarkerType.ArrowClosed,
              strokeWidth: 3,
            },
          },
          prevEdges
        )
      );
    },
    [setEdges]
  );

  const onCreateNode = () => {
    // Get the position of the last node
    const lastNode = nodes[nodes.length - 1];
    const newX = lastNode ? lastNode.position.x + 300 : 200; // Set a default x position
    const newY = lastNode ? lastNode.position.y : 100; // Set a default y position

    const newNode: Node = {
      id: `${nodes.length + 1}`,
      position: { x: newX, y: newY },
      data: { label: "NewState" },
      type: "editableNode",
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const transformToWorkflows = (nodes: Node[], edges: Edge[]): Workflow[] => {
    return nodes.map((node) => {
      const previousStatuses = edges
        .filter((edge) => edge.target === node.id)
        .map((edge) => nodes.find((n) => n.id === edge.source)?.data.label || "")
        .filter((label) => label);

      return {
        previousStatuses: previousStatuses.length > 0 ? previousStatuses : null,
        status: node.data.label,
        isDefault: node.id === "default",
        isDone: node.id === "done",
      } as Workflow;
    });
  };

  const transformToNodesAndEdges = (workflows: Workflow[]): { nodes: Node[]; edges: Edge[] } => {
    // Create a map of workflow status for quick lookup
    const workflowMap = new Map(workflows.map((w) => [w.status, w]));

    // Topological sorting to order nodes
    const sortedWorkflows: Workflow[] = [];
    const visited = new Set<string>();

    const visit = (status: string) => {
      if (visited.has(status)) return;
      visited.add(status);

      const workflow = workflowMap.get(status);
      if (!workflow) return;

      if (workflow.previousStatuses) {
        workflow.previousStatuses.forEach((prev) => visit(prev));
      }

      sortedWorkflows.push(workflow);
    };

    // Start sorting from the default workflow
    workflows.forEach((workflow) => {
      if (workflow.isDefault) visit(workflow.status);
    });

    // Ensure all workflows are included
    workflows.forEach((workflow) => {
      if (!visited.has(workflow.status)) visit(workflow.status);
    });

    // Track node positions dynamically
    const xSpacing = 300;
    const ySpacing = 100;
    const nodePositions: Record<string, { x: number; y: number }> = {};
    const columnYOffsets: Record<number, number> = {}; // Stores current Y position per column

    // Place nodes with the same X as their previous statuses
    sortedWorkflows.forEach((workflow, index) => {
      const id = workflow.isDefault ? "default" : workflow.isDone ? "done" : `node-${index}`;

      // Default position (to be adjusted later)
      let x = 100;
      let y = 100;

      if (workflow.previousStatuses) {
        // Determine X from the first previous node
        const firstPrev = workflow.previousStatuses[0];
        if (nodePositions[firstPrev]) {
          x = nodePositions[firstPrev].x + xSpacing;
        }
      }

      // Set Y dynamically based on column
      const column = x / xSpacing;
      if (!(column in columnYOffsets)) columnYOffsets[column] = 100;
      y = columnYOffsets[column];

      nodePositions[workflow.status] = { x, y };

      // Move next nodes further down if there are multiple branches
      columnYOffsets[column] += ySpacing;
    });

    // Convert sorted workflows to nodes
    const nodes: Node[] = sortedWorkflows.map((workflow, index) => {
      const id = workflow.isDefault ? "default" : workflow.isDone ? "done" : `node-${index}`;
      const { x, y } = nodePositions[workflow.status];

      return {
        id,
        position: { x, y },
        data: { label: workflow.status },
        type: workflow.isDefault
          ? "editableStartNode"
          : workflow.isDone
          ? "editableEndNode"
          : "editableNode",
      };
    });

    // Convert sorted workflows to edges
    const edges: Edge[] = sortedWorkflows.flatMap((workflow) => {
      if (!workflow.previousStatuses) return [];
      return workflow.previousStatuses
        .map((prevStatus) => {
          const sourceNode = nodes.find((n) => n.data.label === prevStatus);
          const targetNode = nodes.find((n) => n.data.label === workflow.status);
          if (sourceNode && targetNode) {
            return {
              id: `${sourceNode.id}->${targetNode.id}`,
              source: sourceNode.id,
              target: targetNode.id,
              type: "buttonEdge",
              style: { stroke: "#363636", strokeWidth: 2 },
              markerEnd: { color: "#363636", type: MarkerType.ArrowClosed, strokeWidth: 3 },
            };
          }
          return null;
        })
        .filter(Boolean) as Edge[];
    });

    return { nodes, edges };
  };

  const isHasDefaultNode = (nodes: Node[]): boolean => {
    return nodes.some((node) => node.id === "default");
  };

  const isHasDoneNode = (nodes: Node[]): boolean => {
    return nodes.some((node) => node.id === "done");
  };

  const isHasNodeWithNoEdges = (nodes: Node[], edges: Edge[]): boolean => {
    return nodes.some(
      (node) => !edges.some((edge) => edge.target === node.id || edge.source === node.id)
    );
  };

  const onSubmit = () => {
    if (!isHasDefaultNode(nodes)) {
      toast.error("Please add a default state");
      return;
    }

    if (!isHasDoneNode(nodes)) {
      toast.error("Please add a done state");
      return;
    }

    if (isHasNodeWithNoEdges(nodes, edges)) {
      toast.error("Please connect all states");
      return;
    }

    const transformedWorkflows = transformToWorkflows(nodes, edges);

    // Sort workflows by previous statuses
    const sortedWorkflows: Workflow[] = [];
    const visited = new Set<string>();

    const visit = (status: string) => {
      if (visited.has(status)) return;
      visited.add(status);

      const workflow = transformedWorkflows.find((w) => w.status === status);
      if (!workflow) return;

      if (workflow.previousStatuses) {
        workflow.previousStatuses.forEach((prev) => visit(prev));
      }

      sortedWorkflows.push(workflow);
    };

    submitFn({ projectId, workflows: transformToWorkflows(nodes, edges) });
  };

  const onBeforeDelete: OnBeforeDelete = async ({ nodes, edges }) => {
    // Find the nodes that are about to be deleted
    const protectedNodeIds = new Set(["default", "done"]);

    // Check if any node in the deletion list is protected
    const hasProtectedNode = nodes.some((node) => protectedNodeIds.has(node.id));

    if (hasProtectedNode) {
      toast.warning("Cannot delete Default or Done state");
      return false;
    }

    // Filter out the nodes that should be deleted
    const updatedNodes = nodes.filter((node) => !protectedNodeIds.has(node.id));

    // Remove edges connected to deleted nodes
    const nodeIdsToDelete = new Set(nodes.map((node) => node.id));
    const updatedEdges = edges.filter(
      (edge) => !nodeIdsToDelete.has(edge.source) && !nodeIdsToDelete.has(edge.target)
    );

    return { nodes: updatedNodes, edges: updatedEdges };
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onBeforeDelete={onBeforeDelete}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        zoomOnScroll={false}
        panOnScroll={true}
      >
        <Background />
        <Controls />
        <div className="absolute right-5 top-5 z-50">
          <div className="flex gap-3">
            <Button
              onPress={onCreateNode}
              color="primary"
              startContent={<AiOutlinePlus />}
            >
              Add State
            </Button>
            <Button
              color="primary"
              startContent={<MdSave />}
              isLoading={isLoading}
              onPress={() => onSubmit()}
            >
              Save
            </Button>
          </div>
        </div>
      </ReactFlow>
    </div>
  );
}
