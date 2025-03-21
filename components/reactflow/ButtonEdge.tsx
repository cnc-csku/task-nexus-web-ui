import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from "@xyflow/react";
import { FaTimes } from "react-icons/fa";

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      <EdgeLabelRenderer>
        <button
          className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-500 text-white p-2 rounded-full text-xs shadow-md  focus:outline-none"
          style={{
            left: `${labelX}px`,
            top: `${labelY}px`,
            pointerEvents: "all",
          }}
          onClick={onEdgeClick}
        >
          <FaTimes />
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
