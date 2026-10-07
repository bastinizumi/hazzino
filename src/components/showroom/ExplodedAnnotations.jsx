import React from 'react';

export default function ExplodedAnnotations({ parts, explodeProgress }) {
  if (!parts || parts.length === 0 || explodeProgress < 0.25) return null;

  // Staggered opacity based on explode progress
  const globalOpacity = Math.min(1, (explodeProgress - 0.25) / 0.5);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        opacity: globalOpacity,
        transition: 'opacity 0.4s ease',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {parts.map((part, index) => {
          if (!part.visible) return null;

          // Determine label position offset (alternate left/right based on X position)
          const isRightSide = part.screenX >= window.innerWidth * 0.5;
          const targetX = isRightSide ? part.screenX + 80 : part.screenX - 80;
          const targetY = part.screenY - 30;

          return (
            <g key={part.id}>
              {/* Part anchor dot */}
              <circle
                cx={part.screenX}
                cy={part.screenY}
                r="3.5"
                fill="#ffffff"
                stroke="var(--color-accent-gold)"
                strokeWidth="1.5"
              />

              {/* Connecting hairline technical leader line */}
              <polyline
                points={`
                  ${part.screenX},${part.screenY} 
                  ${isRightSide ? part.screenX + 35 : part.screenX - 35},${targetY} 
                  ${targetX},${targetY}
                `}
                fill="none"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          );
        })}
      </svg>

      {/* HTML Labels positioned over the SVG points */}
      {parts.map((part, index) => {
        if (!part.visible) return null;
        const isRightSide = part.screenX >= window.innerWidth * 0.5;
        const targetX = isRightSide ? part.screenX + 85 : part.screenX - 85;
        const targetY = part.screenY - 45;

        return (
          <div
            key={part.id}
            style={{
              position: 'absolute',
              left: `${targetX}px`,
              top: `${targetY}px`,
              transform: isRightSide ? 'translate(0, 0)' : 'translate(-100%, 0)',
              backgroundColor: 'rgba(12, 11, 10, 0.82)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(197, 160, 89, 0.35)',
              padding: '6px 12px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                fontSize: '9px',
                letterSpacing: '0.22em',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--color-accent-gold)',
                marginBottom: '2px',
              }}
            >
              {part.label}
            </div>
            {part.spec && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  letterSpacing: '0.04em',
                }}
              >
                {part.spec}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
