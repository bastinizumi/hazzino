import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export default function FurnitureDetailsCard({
  item,
  onClose,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 320);
  };

  if (!item) return null;

  return (
    <div
      role="region"
      aria-label="Furniture Specification"
      style={{
        position: 'absolute',
        top: '110px',
        left: '40px',
        width: '320px',
        maxWidth: '85vw',
        backgroundColor: 'rgba(16, 15, 14, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '14px',
        padding: '20px 22px',
        zIndex: 50,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        animation: isClosing ? 'none' : 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? 'translateY(14px) scale(0.96)' : 'translateY(0) scale(1)',
        transition: isClosing ? 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }}
    >
      {/* Category & Tag */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            letterSpacing: '0.28em',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
          }}
        >
          {item.shortName || 'PIECE'}
        </span>
        <button
          onClick={handleClose}
          aria-label="Close piece details"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 0.2s',
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Title */}
      <h3
        className="font-serif"
        style={{
          fontSize: '20px',
          fontWeight: 400,
          color: '#ffffff',
          letterSpacing: '0.04em',
          lineHeight: 1.15,
          margin: '0 0 8px 0',
        }}
      >
        {item.name}
      </h3>

      {/* Tagline */}
      <p
        style={{
          fontSize: '12px',
          lineHeight: 1.5,
          color: 'rgba(255, 255, 255, 0.65)',
          margin: '0 0 14px 0',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {item.tagline}
      </p>

      {/* Dimensions */}
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '6px',
          marginBottom: '12px',
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: 'rgba(255, 255, 255, 0.75)',
        }}
      >
        <strong style={{ color: 'var(--color-accent-gold)', fontWeight: 600 }}>DIMENSIONS: </strong>
        {item.dimensions}
      </div>

      {/* Expandable Technical Specifications */}
      {item.specs && (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'none',
              border: 'none',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px 0 0 0',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            <span>JOINERY SPEC SHEET</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {isExpanded && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '10px',
                paddingTop: '8px',
              }}
            >
              {item.specs.map((spec, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '11px',
                    lineHeight: 1.35,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    paddingBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.16em',
                      color: 'var(--color-accent-gold)',
                      fontWeight: 600,
                    }}
                  >
                    {spec.label}
                  </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
