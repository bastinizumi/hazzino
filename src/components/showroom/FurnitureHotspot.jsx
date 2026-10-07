import React from 'react';

export default function FurnitureHotspot({
  item,
  isActive,
  onClick,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${item.hotspot.x}%`,
        top: `${item.hotspot.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 35,
      }}
    >
      <button
        onClick={() => onClick(item)}
        aria-label={`Inspect ${item.name}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          outline: 'none',
        }}
        className="group"
      >
        {/* Pulsing circular indicator */}
        <div
          style={{
            position: 'relative',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: isActive ? 'var(--color-accent-gold)' : '#ffffff',
            boxShadow: isActive
              ? '0 0 20px var(--color-accent-gold), 0 0 35px rgba(197, 160, 89, 0.6)'
              : '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(197, 160, 89, 0.4)',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isActive ? 'scale(1.3)' : 'scale(1)',
          }}
        >
          {/* Subtle radiating wave ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              animation: 'pulse-ring 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
            }}
          />
        </div>

        {/* Minimal label tag on hover/active */}
        <div
          style={{
            backgroundColor: 'rgba(12, 11, 10, 0.85)',
            backdropFilter: 'blur(10px)',
            border: isActive ? '1px solid var(--color-accent-gold)' : '1px solid rgba(255, 255, 255, 0.15)',
            padding: '5px 10px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: isActive ? 1 : 0.85,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--color-accent-gold)' : '#ffffff',
              whiteSpace: 'nowrap',
            }}
          >
            {item.hotspot.label || item.shortName}
          </span>
          <span
            style={{
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase',
            }}
          >
            {item.type === 'table' ? '360°' : item.type === 'chair' ? 'VIEW' : 'INSPECT'}
          </span>
        </div>
      </button>
    </div>
  );
}
