import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { FurnitureInteractionController } from './FurnitureInteractionController';
import ShowroomControls from '../showroom/ShowroomControls';
import MaterialSelector from '../showroom/MaterialSelector';

/**
 * InteractiveFurnitureViewer
 *
 * Reusable master interactive 3D product experience component.
 * Integrates:
 * - ProductCameraController (adaptive non-extreme framing)
 * - FurnitureInteractionController (master state & component raycasting)
 * - DoorController, DrawerController, ExplodeController, AssemblyController
 * - RotationController (360° turntable)
 * - MaterialController (seamless PBR transitions)
 * - Smart dynamic toolbar visibility
 * - Component hover highlight & tooltip
 */
export default function InteractiveFurnitureViewer({
  scene,
  camera,
  renderer,
  furnitureMap = {},
  selectedFurnitureId,
  interactionMode = 'room',
  isLightOn = true,
  onSelectFurniture,
  onReturnToRoom,
  onToggleInteractionMode,
  onToggleLight,
  onClose,
}) {
  const containerRef = useRef(null);
  const controllerRef = useRef(null);

  const [controllerState, setControllerState] = useState({
    activeFurnitureId: selectedFurnitureId,
    activeFurniture: furnitureMap[selectedFurnitureId] || null,
    activeComponent: null,
    hoveredComponent: null,
    isDoorOpen: false,
    isDrawerOpen: false,
    isExploded: false,
    selectedMaterial: 'natural_oak',
    supportedControls: {
      hasDoors: false,
      hasDrawers: false,
      canExplode: false,
      canRotate: true,
      canMaterial: true,
    },
  });

  const [isMaterialPanelOpen, setIsMaterialPanelOpen] = useState(false);
  const [componentTooltip, setComponentTooltip] = useState(null);

  // Initialize FurnitureInteractionController
  useEffect(() => {
    if (!camera) return;

    const controller = new FurnitureInteractionController(camera, {
      onStateChange: (newState) => {
        setControllerState((prev) => ({ ...prev, ...newState }));
      },
    });

    controller.setFurnitureMap(furnitureMap);
    controllerRef.current = controller;

    if (selectedFurnitureId && furnitureMap[selectedFurnitureId]) {
      controller.selectFurniture(selectedFurnitureId);
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.clearHover();
      }
    };
  }, [camera]);

  // Sync furniture map updates (e.g. on room switch)
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setFurnitureMap(furnitureMap);
      if (selectedFurnitureId && furnitureMap[selectedFurnitureId]) {
        controllerRef.current.selectFurniture(selectedFurnitureId);
      }
    }
  }, [furnitureMap, selectedFurnitureId]);

  // Handle pointer move for component hover raycasting
  const handlePointerMove = useCallback((e) => {
    if (!controllerRef.current || !renderer?.domElement) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hovered = controllerRef.current.handlePointerMove(
      x,
      y,
      rect.width,
      rect.height
    );

    if (hovered) {
      setComponentTooltip({
        name: hovered.name,
        x: e.clientX,
        y: e.clientY,
      });
    } else {
      setComponentTooltip(null);
    }
  }, [renderer]);

  const handlePointerLeave = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.clearHover();
    }
    setComponentTooltip(null);
  }, []);

  const handleClick = useCallback(() => {
    if (controllerRef.current && controllerState.hoveredComponent) {
      controllerRef.current.selectComponent(controllerState.hoveredComponent);
    }
  }, [controllerState.hoveredComponent]);

  const activeItem = controllerState.activeFurniture;
  const supported = controllerState.supportedControls;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 45,
      }}
    >
      {/* Component Hover Tooltip */}
      {componentTooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${componentTooltip.x + 14}px`,
            top: `${componentTooltip.y - 14}px`,
            pointerEvents: 'none',
            zIndex: 80,
            backgroundColor: 'rgba(15, 14, 13, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-accent-gold)',
            borderRadius: '16px',
            padding: '5px 12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
            transform: 'translateY(-50%)',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          <div
            style={{
              fontSize: '8.5px',
              letterSpacing: '0.22em',
              fontWeight: 600,
              color: 'var(--color-accent-gold)',
              textTransform: 'uppercase',
            }}
          >
            COMPONENT
          </div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: '#ffffff',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {componentTooltip.name}
          </div>
        </div>
      )}

      {/* Material Selector Floating Panel */}
      <MaterialSelector
        isOpen={isMaterialPanelOpen}
        onClose={() => setIsMaterialPanelOpen(false)}
        selectedMaterialKey={controllerState.selectedMaterial}
        onSelectMaterial={(matKey) => {
          if (controllerRef.current) {
            controllerRef.current.setMaterial(matKey);
          }
        }}
        supportedMaterials={activeItem?.materialsSupported}
      />

      {/* Floating Architectural Control Bar */}
      <div style={{ pointerEvents: 'auto' }}>
        <ShowroomControls
          interactionMode={interactionMode}
          onToggleInteractionMode={onToggleInteractionMode}
          canRotate={supported.canRotate}
          hasExplode={supported.canExplode}
          hasDoors={supported.hasDoors}
          hasDrawers={supported.hasDrawers}
          hasMaterials={supported.canMaterial}
          isExploded={controllerState.isExploded}
          isDoorOpen={controllerState.isDoorOpen}
          isDrawerOpen={controllerState.isDrawerOpen}
          isLightOn={isLightOn}
          activePanel={isMaterialPanelOpen ? 'material' : null}
          onToggleExplode={() => controllerRef.current?.toggleExplode()}
          onExplode={() => controllerRef.current?.explode()}
          onAssemble={() => controllerRef.current?.assemble()}
          onToggleDoor={() => controllerRef.current?.toggleDoors()}
          onToggleDrawer={() => controllerRef.current?.toggleDrawers()}
          onToggleLight={onToggleLight}
          onToggleMaterial={() => setIsMaterialPanelOpen((prev) => !prev)}
          onReset={() => {
            if (controllerRef.current) {
              controllerRef.current.resetAll();
            }
            if (onReturnToRoom) onReturnToRoom();
          }}
        />
      </div>
    </div>
  );
}
