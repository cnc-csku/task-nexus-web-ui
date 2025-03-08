"use client";

import { Input } from "@heroui/input";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

export default function EditableNode({ id }: NodeProps) {
  const { setNodes, getNode } = useReactFlow();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: event.target.value,
            },
          };
        }

        return node;
      })
    );
  };

  return (
    <div className="p-4 bg-white border rounded-xl shadow">
      <div className="grid gap-4">
        <Input
          label="State"
          size="sm"
          value={getNode(id)!.data.label as string}
          onChange={onChange}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
      <Handle
        type="target"
        position={Position.Left}
      />
    </div>
  );
}
