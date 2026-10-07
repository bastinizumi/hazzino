import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { SHOWROOM_MATERIALS } from '../../data/showroomData';

export default function MaterialDrawer({
  supportedMaterials,
  selectedMaterialKey,
  onSelectMaterial,
  onClose,
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 320);
  };

  const materialsList = supportedMaterials
    ? supportedMaterials.map((key) => SHOWROOM_MATERIALS[key]).filter(Boolean)
    : Object.values(SHOWROOM_MATERIALS);

  return (
    <div
      role="dialog"
      aria-label="Material Finishes Palette"
      style={{
        position: 'absolute',
        top: '110px',
        right: '40px',
        width: '340px',
        maxWidth: '90vw',
        backgroundColor: 'rgba(18, 17, 16, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '24px',
        zIndex: 55,
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
        animation: isClosing ? 'none' : 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? 'translateY(14px) scale(0.96)' : 'translateY(0) scale(1)',
        transition: isClosing ? 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '12px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.28em',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
              marginBottom: '3px',
            }}
          >
            SPECIFICATION
          </div>
          <h4
            className="font-serif"
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            Material Palette
          </h4>
        </div>
        <button
          onClick={handleClose}
          aria-label="Close Material Palette"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 0.2s',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Materials List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {materialsList.map((mat) => {
          const isSelected = selectedMaterialKey === mat.id;
          return (
            <button
              key={mat.id}
              onClick={() => onSelectMaterial(mat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: isSelected ? '1px solid var(--color-accent-gold)' : '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Swatch circle */}
              <div
                style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: mat.color,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isSelected && <Check size={14} color="#000" strokeWidth={3} />}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {mat.name}
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent-gold)',
                    }}
                  >
                    {mat.category}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    lineHeight: 1.3,
                  }}
                >
                  {mat.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
