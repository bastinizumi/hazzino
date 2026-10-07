import React from 'react';
import { LAB_COLORS } from '../../data/furnitureLabData';
import { Check } from 'lucide-react';

export default function ColorSelector({
  selectedColorId,
  onSelectColor,
}) {
  const currentColor =
    LAB_COLORS.find((c) => c.id === selectedColorId) || LAB_COLORS[0];

  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          fontSize: '11px',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#121110',
          }}
        >
          COLOR
        </span>
        <span
          style={{
            color: 'var(--color-accent-gold)',
            fontWeight: 600,
            letterSpacing: '0.12em',
            fontSize: '10px',
            textTransform: 'uppercase',
          }}
        >
          ✓ {currentColor.num} — {currentColor.name}
        </span>
      </div>

      {/* Grid of 10 Hazzino Color Swatches */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
        }}
      >
        {LAB_COLORS.map((col) => {
          const isSelected = col.id === selectedColorId;
          const isLight =
            col.id === 'cloud_white' ||
            col.id === 'warm_ivory' ||
            col.id === 'sand_beige' ||
            col.id === 'champagne_gold';

          return (
            <button
              key={col.id}
              onClick={() => onSelectColor(col.id)}
              title={`${col.num} — ${col.name}`}
              style={{
                position: 'relative',
                height: '42px',
                borderRadius: '4px',
                backgroundColor: col.hex,
                border: isSelected
                  ? '2px solid #121110'
                  : '1px solid rgba(20, 20, 20, 0.16)',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSelected
                  ? '0 0 0 2px #ffffff inset, 0 4px 10px rgba(0, 0, 0, 0.15)'
                  : '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
              }}
            >
              {isSelected ? (
                <Check
                  size={14}
                  strokeWidth={2.5}
                  color={isLight ? '#121110' : '#ffffff'}
                />
              ) : (
                <span
                  style={{
                    fontSize: '8px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: isLight ? 'rgba(18, 17, 16, 0.55)' : 'rgba(255, 255, 255, 0.65)',
                  }}
                >
                  {col.num}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
