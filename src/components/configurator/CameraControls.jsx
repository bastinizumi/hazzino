import React from 'react';
import { CAMERA_PRESETS } from '../../data/furnitureLabData';

export default function CameraControls({
  activePreset,
  onSelectPreset,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 6px',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(20, 20, 20, 0.1)',
        borderRadius: '30px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
      }}
    >
      <span
        style={{
          fontSize: '8px',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#7a756c',
          padding: '0 6px',
        }}
      >
        CAMERA
      </span>

      {CAMERA_PRESETS.map((preset) => {
        const isActive = activePreset === preset.id;
        return (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset.id)}
            style={{
              background: isActive ? '#121110' : 'none',
              color: isActive ? '#ffffff' : '#121110',
              border: 'none',
              borderRadius: '20px',
              padding: '5px 9px',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            {preset.name}
          </button>
        );
      })}
    </div>
  );
}
