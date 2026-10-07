import React, { useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { SHOWROOM_MATERIALS } from '../../data/showroomData';

export default function MaterialSelector({
  isOpen,
  onClose,
  selectedMaterialKey,
  onSelectMaterial,
  supportedMaterials = [],
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !e.target.closest('.showroom-material-toggle')
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Curate available materials based on object-supported materials
  const availableKeys =
    supportedMaterials && supportedMaterials.length > 0
      ? supportedMaterials
      : [
          'natural_oak',
          'walnut',
          'dark_walnut',
          'warm_beige',
          'charcoal',
          'matte_black',
          'ivory',
        ];

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-label="Material Configuration Panel"
      className="no-drag"
      style={{
        position: 'absolute',
        right: '40px',
        bottom: '100px',
        width: '320px',
        maxHeight: 'calc(100vh - 160px)',
        backgroundColor: 'rgba(15, 14, 13, 0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(197, 160, 89, 0.35)',
        borderRadius: '20px',
        padding: '24px',
        zIndex: 65,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
        overflowY: 'auto',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '14px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.32em',
              fontWeight: 600,
              color: 'var(--color-accent-gold)',
              textTransform: 'uppercase',
              marginBottom: '3px',
            }}
          >
            MATERIAL
          </div>
          <h3
            className="font-serif"
            style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '0.04em',
            }}
          >
            Choose your finish
          </h3>
        </div>

        <button
          onClick={onClose}
          aria-label="Close material selector"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Swatches List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {availableKeys.map((key, index) => {
          const mat = SHOWROOM_MATERIALS[key] || {
            name: key.replace('_', ' ').toUpperCase(),
            color: '#a0856c',
            category: 'Finish',
          };
          const isSelected = selectedMaterialKey === key;
          const numStr = String(index + 1).padStart(2, '0');

          return (
            <button
              key={key}
              onClick={() => {
                onSelectMaterial(key);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                backgroundColor: isSelected
                  ? 'rgba(197, 160, 89, 0.15)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? '1px solid var(--color-accent-gold)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.25s ease',
                width: '100%',
              }}
            >
              {/* Circular Color Swatch */}
              <div
                style={{
                  position: 'relative',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: mat.color,
                  border: isSelected
                    ? '2px solid var(--color-accent-gold)'
                    : '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: isSelected
                    ? '0 0 12px rgba(197, 160, 89, 0.6)'
                    : '0 2px 6px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isSelected && <Check size={13} color="#0c0b0a" strokeWidth={3} />}
              </div>

              {/* Information */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    color: isSelected ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.45)',
                    textTransform: 'uppercase',
                    marginBottom: '1px',
                  }}
                >
                  {numStr} — {mat.category || 'ARCHITECTURAL'}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.88)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {mat.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
