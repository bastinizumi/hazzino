import React from 'react';

export default function TechnicalView({
  dimensionsMM,
  objectName,
  subtitle,
}) {
  if (!dimensionsMM) return null;

  return (
    <div
      aria-label="Architectural Technical View"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 40px',
        fontFamily: 'monospace',
      }}
    >
      {/* Top Technical Metadata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(20, 20, 20, 0.15)',
            padding: '8px 14px',
            fontSize: '10px',
            letterSpacing: '0.14em',
            color: '#121110',
          }}
        >
          <div>HAZZINO CAD SPECIFICATION // REV. 04</div>
          <div style={{ color: 'var(--color-accent-gold)', fontWeight: 600, marginTop: '2px' }}>
            {objectName} [{subtitle}]
          </div>
        </div>

        {/* CAD Grid Marker */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            border: '1px solid rgba(20, 20, 20, 0.15)',
            padding: '6px 12px',
            fontSize: '9px',
            letterSpacing: '0.16em',
            color: '#7a756c',
          }}
        >
          SCALE: 1:1 TRUE METRIC
        </div>
      </div>

      {/* Center Dimension Overlay Guides */}
      <div style={{ position: 'relative', width: '100%', height: '60%' }}>
        {/* Horizontal Width Guide */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '20%',
            right: '20%',
            borderBottom: '1px dashed rgba(20, 20, 20, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingBottom: '4px',
          }}
        >
          <span
            style={{
              backgroundColor: '#121110',
              color: '#ffffff',
              padding: '2px 8px',
              fontSize: '10px',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            WIDTH: {dimensionsMM.w} MM
          </span>
        </div>

        {/* Vertical Height Guide */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            bottom: '15%',
            right: '12%',
            borderRight: '1px dashed rgba(20, 20, 20, 0.4)',
            display: 'flex',
            alignItems: 'center',
            paddingRight: '6px',
          }}
        >
          <span
            style={{
              backgroundColor: '#121110',
              color: '#ffffff',
              padding: '2px 8px',
              fontSize: '10px',
              letterSpacing: '0.12em',
              fontWeight: 600,
              transform: 'rotate(-90deg)',
              transformOrigin: 'center right',
              whiteSpace: 'nowrap',
            }}
          >
            HEIGHT: {dimensionsMM.h} MM
          </span>
        </div>

        {/* Depth Callout */}
        <div
          style={{
            position: 'absolute',
            bottom: '22%',
            left: '12%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid rgba(20, 20, 20, 0.2)',
            padding: '4px 8px',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: '#121110',
          }}
        >
          DEPTH: {dimensionsMM.d} MM
        </div>
      </div>

      {/* Bottom Architectural Alignment Marks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#7a756c' }}>
        <span>+ ORIGIN [0.00, 0.00, 0.00]</span>
        <span>TOLERANCE ±0.5MM // SOLID JOINERY INTERFACE</span>
      </div>
    </div>
  );
}
