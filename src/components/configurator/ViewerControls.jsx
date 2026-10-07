import React from 'react';
import {
  RotateCw,
  RotateCcw,
  Sparkles,
  Ruler,
  Maximize2,
  Minimize2,
  DoorOpen,
  DoorClosed,
} from 'lucide-react';

export default function ViewerControls({
  selectedObjectId,
  isAutoRotate,
  onToggleAutoRotate,
  isInteractMode,
  onToggleInteractMode,
  isTechnicalView,
  onToggleTechnicalView,
  onResetView,
  isCabinet,
  hasInteractions,
  interactLabel,
  isDoorOpen,
  onToggleDoor,
  isExploded,
  onToggleExplode,
  hasExplode,
}) {
  const showInteractAction = hasInteractions || isCabinet;
  const actionText = isDoorOpen
    ? `CLOSE ${interactLabel ? interactLabel.replace(/^OPEN\s+/i, '') : 'COMPARTMENTS'}`
    : (interactLabel || 'OPEN COMPARTMENTS');
  return (
    <div
      style={{
        position: 'absolute',
        top: '92px',
        left: '32px',
        zIndex: 40,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* AUTO ROTATE */}
      <button
        onClick={onToggleAutoRotate}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: isAutoRotate ? '#121110' : 'rgba(255, 255, 255, 0.85)',
          color: isAutoRotate ? '#ffffff' : '#121110',
          border: '1px solid rgba(20, 20, 20, 0.12)',
          borderRadius: '30px',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.25s ease',
        }}
      >
        <RotateCw size={12} style={{ animation: isAutoRotate ? 'spin 6s linear infinite' : 'none' }} />
        <span>AUTO ROTATE</span>
      </button>

      {/* INTERACT MODE */}
      <button
        onClick={onToggleInteractMode}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: isInteractMode ? '#121110' : 'rgba(255, 255, 255, 0.85)',
          color: isInteractMode ? '#ffffff' : '#121110',
          border: '1px solid rgba(20, 20, 20, 0.12)',
          borderRadius: '30px',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.25s ease',
        }}
      >
        <Sparkles size={12} color={isInteractMode ? 'var(--color-accent-gold)' : 'currentColor'} />
        <span>INTERACT</span>
      </button>

      {/* TECH VIEW */}
      <button
        onClick={onToggleTechnicalView}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: isTechnicalView ? '#121110' : 'rgba(255, 255, 255, 0.85)',
          color: isTechnicalView ? '#ffffff' : '#121110',
          border: '1px solid rgba(20, 20, 20, 0.12)',
          borderRadius: '30px',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.25s ease',
        }}
      >
        <Ruler size={12} />
        <span>TECH VIEW</span>
      </button>

      {/* PHYSICAL INTERACTION: OPEN / CLOSE DOORS, DRAWERS, BED STORAGE */}
      {showInteractAction && (
        <button
          onClick={onToggleDoor}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: isDoorOpen ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.85)',
            color: isDoorOpen ? '#0a0a09' : '#121110',
            border: '1px solid rgba(20, 20, 20, 0.12)',
            borderRadius: '30px',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.25s ease',
          }}
        >
          {isDoorOpen ? <DoorOpen size={12} /> : <DoorClosed size={12} />}
          <span>{actionText}</span>
        </button>
      )}

      {/* EXPLODE / ASSEMBLE */}
      {hasExplode && (
        <button
          onClick={onToggleExplode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: isExploded ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.85)',
            color: isExploded ? '#0a0a09' : '#121110',
            border: '1px solid rgba(20, 20, 20, 0.12)',
            borderRadius: '30px',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.25s ease',
          }}
        >
          {isExploded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          <span>{isExploded ? 'ASSEMBLE' : 'EXPLODE'}</span>
        </button>
      )}

      {/* RESET VIEW */}
      <button
        onClick={onResetView}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          color: '#121110',
          border: '1px solid rgba(20, 20, 20, 0.12)',
          borderRadius: '30px',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.25s ease',
        }}
      >
        <RotateCcw size={12} />
        <span>RESET VIEW</span>
      </button>
    </div>
  );
}
