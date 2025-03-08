"use client";

import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

export default function EditableStartNode({ id }: NodeProps) {
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
    <div className="p-4 border rounded-xl shadow bg-white grid gap-2">
      <Chip color="primary">Default State</Chip>
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
    </div>
  );
}
