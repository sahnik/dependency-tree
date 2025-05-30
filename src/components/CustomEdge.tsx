import React, { useState } from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import type { EdgeProps } from 'reactflow';

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine edge color based on state
  const strokeColor = selected 
    ? '#3b82f6' // Blue when selected
    : isHovered 
      ? '#22d3ee' // Cyan when hovered
      : '#64748b'; // Default gray

  const strokeWidth = selected || isHovered ? 3 : 2;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          cursor: 'pointer',
          transition: 'stroke 0.2s, stroke-width 0.2s',
        }}
      />
      {/* Invisible wider path for better hover detection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
      />
      {/* Show label when selected or hovered */}
      {(selected || isHovered) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              fontWeight: 'bold',
              background: '#1e293b',
              padding: '4px 8px',
              borderRadius: '4px',
              color: '#e2e8f0',
              border: `1px solid ${strokeColor}`,
              pointerEvents: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            {id}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;