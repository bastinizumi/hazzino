import React from 'react';
import {
  RotateCw,
  Maximize2,
  Minimize2,
  DoorOpen,
  DoorClosed,
  Archive,
  Sun,
  Moon,
  Sliders,
  RotateCcw,
  Compass,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export default function ShowroomControls({
  interactionMode = 'room', // 'room' | 'object'
  onToggleInteractionMode,
  canRotate = true,
  hasExplode = true,
  hasDoors = false,
  hasDrawers = false,
  hasMaterials = true,
  isExploded = false,
  isDoorOpen = false,
  isDrawerOpen = false,
  isLightOn = true,
  activePanel = null,
  onToggleExplode,
  onExplode,
  onAssemble,
  onToggleDoor,
  onToggleDrawer,
  onToggleLight,
  onToggleMaterial,
  onReset,
  onZoomIn,
  onZoomOut,
}) {
  return (
    <nav
      aria-label="3D Furniture Showroom Controls"
      className="no-drag"
      style={{
        position: 'absolute',
        bottom: '36px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        backgroundColor: 'rgba(15, 14, 13, 0.88)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '40px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
        maxWidth: '96vw',
        overflowX: 'auto',
      }}
    >
      {/* 1. [ 360° OBJECT ROTATE ] / [ 360° ROOM ORBIT ] */}
      {canRotate && (
        <button
          id="ctrl-rotate"
          onClick={onToggleInteractionMode}
          className="showroom-ctrl-btn"
          title="Toggle 360° turntable product rotation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '8px 15px',
            backgroundColor:
              interactionMode === 'object'
                ? 'rgba(197, 160, 89, 0.22)'
                : 'rgba(255, 255, 255, 0.08)',
            color:
              interactionMode === 'object'
                ? 'var(--color-accent-gold)'
                : '#ffffff',
            border:
              interactionMode === 'object'
                ? '1px solid var(--color-accent-gold)'
                : '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '30px',
            fontSize: '10px',
            letterSpacing: '0.22em',
            fontWeight: 600,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {interactionMode === 'object' ? (
            <RotateCw size={13} style={{ animation: 'spin 14s linear infinite' }} />
          ) : (
            <Compass size={13} />
          )}
          <span>{interactionMode === 'object' ? '360° OBJECT ROTATE' : '360° ROOM ORBIT'}</span>
        </button>
      )}

      {/* 2. [ EXPLODE ] */}
      {hasExplode && (
        <button
          id="ctrl-explode"
          onClick={onExplode || onToggleExplode}
          className="showroom-ctrl-btn"
          aria-pressed={isExploded}
          title="Explode furniture components"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 13px',
            backgroundColor: isExploded ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.05)',
            color: isExploded ? '#0c0b0a' : 'rgba(255, 255, 255, 0.85)',
            border: isExploded ? '1px solid var(--color-accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '30px',
            fontSize: '10px',
            letterSpacing: '0.2em',
            fontWeight: 600,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Maximize2 size={12} />
          <span>EXPLODE</span>
        </button>
      )}

      {/* 3. [ ASSEMBLE ] */}
      {hasExplode && (
        <button
          id="ctrl-assemble"
          onClick={onAssemble || onToggleExplode}
          className="showroom-ctrl-btn"
          aria-pressed={!isExploded}
          title="Assemble furniture components"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 13px',
            backgroundColor: !isExploded ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
            color: !isExploded ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
            border: !isExploded ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
            borderRadius: '30px',
            fontSize: '10px',
            letterSpacing: '0.2em',
            fontWeight: 600,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Minimize2 size={12} />
          <span>ASSEMBLE</span>
        </button>
      )}

      {/* 4. [ OPEN DOORS ] / [ CLOSE DOORS ] */}
      {hasDoors && (
        <button
          id="ctrl-door"
          onClick={onToggleDoor}
          className="showroom-ctrl-btn"
          aria-pressed={isDoorOpen}
          title={isDoorOpen ? 'Close doors' : 'Open doors'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: isDoorOpen ? 'rgba(197, 160, 89, 0.22)' : 'rgba(255, 255, 255, 0.06)',
            color: isDoorOpen ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.88)',
            border: isDoorOpen ? '1px solid var(--color-accent-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '30px',
            fontSize: '10px',
            letterSpacing: '0.2em',
            fontWeight: 600,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {isDoorOpen ? <DoorClosed size={13} /> : <DoorOpen size={13} />}
          <span>{isDoorOpen ? 'CLOSE DOORS' : 'OPEN DOORS'}</span>
        </button>
      )}

      {/* 5. [ OPEN DRAWERS ] / [ CLOSE DRAWERS ] */}
      {hasDrawers && (
        <button
          id="ctrl-drawer"
          onClick={onToggleDrawer}
          className="showroom-ctrl-btn"
          aria-pressed={isDrawerOpen}
          title={isDrawerOpen ? 'Close drawers' : 'Open drawers'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: isDrawerOpen ? 'rgba(197, 160, 89, 0.22)' : 'rgba(255, 255, 255, 0.06)',
            color: isDrawerOpen ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.88)',
            border: isDrawerOpen ? '1px solid var(--color-accent-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '30px',
            fontSize: '10px',
            letterSpacing: '0.2em',
            fontWeight: 600,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Archive size={13} />
          <span>{isDrawerOpen ? 'CLOSE DRAWERS' : 'OPEN DRAWERS'}</span>
        </button>
      )}

      {/* 6. [ MATERIAL ] */}
      {hasMaterials && (
        <button
          id="ctrl-material"
          onClick={onToggleMaterial}
          className="showroom-ctrl-btn showroom-material-toggle"
          aria-pressed={activePanel === 'material'}
          title="Open finish & material selector"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor:
              activePanel === 'material'
                ? 'var(--color-accent-gold)'
                : 'rgba(255, 255, 255, 0.06)',
            color: activePanel === 'material' ? '#0c0b0a' : 'rgba(255, 255, 255, 0.88)',
            border:
              activePanel === 'material'
                ? '1px solid var(--color-accent-gold)'
                : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '30px',
            fontSize: '10px',
            letterSpacing: '0.2em',
            fontWeight: 600,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Sliders size={13} />
          <span>MATERIAL</span>
        </button>
      )}

      {/* 7. [ LIGHT ON ] / [ EVENING ] */}
      <button
        id="ctrl-light"
        onClick={onToggleLight}
        className="showroom-ctrl-btn"
        aria-pressed={isLightOn}
        title="Toggle showroom daylight vs evening atmosphere"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          color: isLightOn ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '30px',
          fontSize: '10px',
          letterSpacing: '0.2em',
          fontWeight: 600,
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {isLightOn ? <Sun size={13} /> : <Moon size={13} />}
        <span>{isLightOn ? 'LIGHT ON' : 'EVENING'}</span>
      </button>

      {/* Quick Zoom In & Zoom Out Buttons (Guaranteed within bounds) */}
      {onZoomIn && (
        <button
          id="ctrl-zoomin"
          onClick={onZoomIn}
          className="showroom-ctrl-btn"
          aria-label="Zoom in slightly"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 10px',
            backgroundColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
        >
          <ZoomIn size={13} />
        </button>
      )}

      {onZoomOut && (
        <button
          id="ctrl-zoomout"
          onClick={onZoomOut}
          className="showroom-ctrl-btn"
          aria-label="Zoom out"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 10px',
            backgroundColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
        >
          <ZoomOut size={13} />
        </button>
      )}

      {/* 8. [ RESET ] */}
      <button
        id="ctrl-reset"
        onClick={onReset}
        className="showroom-ctrl-btn"
        title="Reset camera and furniture state"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '30px',
          fontSize: '10px',
          letterSpacing: '0.2em',
          fontWeight: 600,
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <RotateCcw size={13} />
        <span>RESET</span>
      </button>
    </nav>
  );
}
