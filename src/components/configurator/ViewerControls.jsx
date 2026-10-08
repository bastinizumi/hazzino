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
  Inbox,
  Pause,
  Play,
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
  hasDoors,
  hasDrawers,
  isDoorOpen,
  isDrawerOpen,
  onToggleDoor,
  onToggleDrawer,
  doorLabel,
  drawerLabel,
  isExploded,
  onToggleExplode,
  hasExplode,
  animLock,
}) {
  const buttonStyle = (isActive, disabled = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: isActive ? 'var(--color-accent-gold, #c5a059)' : 'rgba(255, 255, 255, 0.92)',
    color: isActive ? '#0a0a09' : '#121110',
    border: isActive ? '1px solid var(--color-accent-gold, #c5a059)' : '1px solid rgba(20, 20, 20, 0.12)',
    borderRadius: '30px',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.22s ease',
    userSelect: 'none',
  });

  return (
    <div
      className="no-drag"
      style={{
        position: 'absolute',
        top: '92px',
        left: '24px',
        right: '24px',
        zIndex: 40,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'auto',
      }}
    >
      {/* 360° ROTATION / PAUSE */}
      <button
        type="button"
        onClick={onToggleAutoRotate}
        style={buttonStyle(isAutoRotate)}
        title={isAutoRotate ? 'Pause 360° turntable rotation' : 'Start 360° turntable rotation'}
      >
        {isAutoRotate ? <Pause size={12} /> : <RotateCw size={12} />}
        <span>{isAutoRotate ? 'PAUSE ROTATION' : '360° ROTATE'}</span>
      </button>

      {/* EXPLODE / ASSEMBLE (Shown only if item supports explode) */}
      {hasExplode && (
        <button
          type="button"
          onClick={onToggleExplode}
          disabled={animLock}
          style={buttonStyle(isExploded, animLock)}
          title={isExploded ? 'Assemble all components back to original position' : 'Explode components outward'}
        >
          {isExploded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          <span>{isExploded ? 'ASSEMBLE' : 'EXPLODE'}</span>
        </button>
      )}

      {/* OPEN / CLOSE DOORS (Shown only if item has doors) */}
      {hasDoors && (
        <button
          type="button"
          onClick={onToggleDoor}
          disabled={animLock}
          style={buttonStyle(isDoorOpen, animLock)}
          title={isDoorOpen ? 'Close cabinet/wardrobe doors' : 'Open doors along realistic hinges'}
        >
          {isDoorOpen ? <DoorOpen size={12} /> : <DoorClosed size={12} />}
          <span>{doorLabel || (isDoorOpen ? 'CLOSE DOORS' : 'OPEN DOORS')}</span>
        </button>
      )}

      {/* OPEN / CLOSE DRAWER (Shown only if item has drawers/storage) */}
      {hasDrawers && (
        <button
          type="button"
          onClick={onToggleDrawer}
          disabled={animLock}
          style={buttonStyle(isDrawerOpen, animLock)}
          title={isDrawerOpen ? 'Close sliding drawers' : 'Slide drawers forward along tracks'}
        >
          <Inbox size={12} />
          <span>{drawerLabel || (isDrawerOpen ? 'CLOSE DRAWER' : 'OPEN DRAWER')}</span>
        </button>
      )}

      {/* INTERACT HOTSPOTS */}
      <button
        type="button"
        onClick={onToggleInteractMode}
        style={buttonStyle(isInteractMode)}
        title="Toggle joinery and material inspection hotspots"
      >
        <Sparkles size={12} />
        <span>HOTSPOTS</span>
      </button>

      {/* TECHNICAL VIEW */}
      <button
        type="button"
        onClick={onToggleTechnicalView}
        style={buttonStyle(isTechnicalView)}
        title="Toggle architectural dimension guides and technical drawings"
      >
        <Ruler size={12} />
        <span>TECH VIEW</span>
      </button>

      {/* RESET VIEW */}
      <button
        type="button"
        onClick={onResetView}
        disabled={animLock}
        style={buttonStyle(false, animLock)}
        title="Reset camera and return all components to default position"
      >
        <RotateCcw size={12} />
        <span>RESET</span>
      </button>
    </div>
  );
}
