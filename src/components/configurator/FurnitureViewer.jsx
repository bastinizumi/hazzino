import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { LAB_OBJECTS, LAB_MATERIALS, LAB_COLORS, CAMERA_PRESETS } from '../../data/furnitureLabData';
import { LAB_MODEL_FACTORIES, createLabPBRMaterial } from '../../models/FurnitureLabModels';
import TechnicalView from './TechnicalView';
import CameraControls from './CameraControls';
import ViewerControls from './ViewerControls';

export default function FurnitureViewer({
  selectedObjectId,
  selectedMaterialId,
  selectedColorId,
  selectedFrameId,
  isAutoRotate,
  onToggleAutoRotate,
  isInteractMode,
  onToggleInteractMode,
  isTechnicalView,
  onToggleTechnicalView,
  activeCameraPreset,
  onSelectCameraPreset,
  onResetView,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Interaction State
  const [rotationStateText, setRotationStateText] = useState('READY');
  const [hoveredDrawer, setHoveredDrawer] = useState(null);
  const [isCabinetDoorOpen, setIsCabinetDoorOpen] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [explodeProgress, setExplodeProgress] = useState(0);
  const [projectedHotspots, setProjectedHotspots] = useState([]);

  // Three.js State Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const currentModelRef = useRef(null);
  const currentGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Material & Color Refs
  const currentMaterialRef = useRef(null);
  const currentSecondaryMaterialRef = useRef(null);

  // Lighting Refs
  const keyLightRef = useRef(null);
  const fillLightRef = useRef(null);
  const rimLightRef = useRef(null);

  // Camera Orbit Refs
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const cameraRadiusRef = useRef(4.2);
  const cameraAzimuthRef = useRef(-0.35);
  const cameraElevationRef = useRef(0.22);

  const targetAzimuthRef = useRef(-0.35);
  const targetElevationRef = useRef(0.22);
  const targetRadiusRef = useRef(4.2);
  const rotationVelocityRef = useRef(0);

  // Pointer Refs
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const mouseParallaxRef = useRef({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef(Date.now());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseCoordsRef = useRef(new THREE.Vector2());

  const currentObjConfig =
    LAB_OBJECTS.find((o) => o.id === selectedObjectId) || LAB_OBJECTS[0];
  const isCabinet = selectedObjectId === 'cabinet';
  const hasExplode = Boolean(currentObjConfig.explodeParts);

  const isAutoRotateRef = useRef(isAutoRotate);
  isAutoRotateRef.current = isAutoRotate;

  const isInteractModeRef = useRef(isInteractMode);
  isInteractModeRef.current = isInteractMode;

  const currentObjConfigRef = useRef(currentObjConfig);
  currentObjConfigRef.current = currentObjConfig;

  // -------------------------------------------------------------------------
  // INITIALIZE THREE.JS SCENE ON MOUNT
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with architectural perspective
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    // 3. Renderer with soft contact shadow mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(4.5, 6.0, 5.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xdde8f5, 0.75);
    fillLight.position.set(-5, 2.5, -2);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight(0xfffaea, 1.35);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const spotLight = new THREE.SpotLight(0xffeed6, 1.4, 12, Math.PI / 4, 0.35, 1);
    spotLight.position.set(0, 4.5, 2.5);
    spotLight.target.position.set(0, 0.4, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // 5. Contact Shadow Floor Plane
    const floorGeom = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. Build Initial Object
    buildActiveModel(selectedObjectId, selectedMaterialId, selectedColorId, scene);

    // 7. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. 60FPS Render & Physics Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = Date.now();

      // Auto-rotation handling (resumes after 3 seconds of no user drag)
      if (isAutoRotateRef.current && !isDraggingRef.current && now - lastInteractionTimeRef.current > 2500) {
        targetAzimuthRef.current += 0.004;
      }

      // Inertia on Azimuth
      if (!isDraggingRef.current) {
        targetAzimuthRef.current += rotationVelocityRef.current;
        rotationVelocityRef.current *= 0.88; // 15-20% motion inertia decay
      }

      // Smooth interpolation toward target camera angles
      cameraAzimuthRef.current += (targetAzimuthRef.current - cameraAzimuthRef.current) * 0.12;
      cameraElevationRef.current += (targetElevationRef.current - cameraElevationRef.current) * 0.12;
      cameraRadiusRef.current += (targetRadiusRef.current - cameraRadiusRef.current) * 0.12;

      // Mouse Parallax
      const parallaxX = mouseParallaxRef.current.x * 0.12;
      const parallaxY = mouseParallaxRef.current.y * 0.08;

      // Calculate camera position in spherical coordinates around target
      const elev = cameraElevationRef.current + parallaxY;
      const azim = cameraAzimuthRef.current + parallaxX;
      const rad = cameraRadiusRef.current;

      const camX = cameraTargetRef.current.x + rad * Math.cos(elev) * Math.sin(azim);
      const camY = cameraTargetRef.current.y + rad * Math.sin(elev);
      const camZ = cameraTargetRef.current.z + rad * Math.cos(elev) * Math.cos(azim);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(cameraTargetRef.current);

      // Render Three.js Scene
      renderer.render(scene, camera);

      // Project 3D Hotspot Coordinates to 2D Screen Percentages
      if (isInteractModeRef.current && currentObjConfigRef.current?.hotspots && renderer.domElement) {
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;

        const projected = currentObjConfigRef.current.hotspots.map((hs) => {
          const v = new THREE.Vector3(...hs.pos);
          v.project(camera);

          const isVisible = v.z < 1;
          const screenX = ((v.x + 1) * w) / 2;
          const screenY = ((-v.y + 1) * h) / 2;

          return {
            ...hs,
            screenX: (screenX / w) * 100,
            screenY: (screenY / h) * 100,
            isVisible,
          };
        });

        setProjectedHotspots(projected);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (currentModelRef.current?.dispose) {
        currentModelRef.current.dispose();
      }
      renderer.dispose();
    };
  }, []);

  // -------------------------------------------------------------------------
  // BUILD & ANIMATE 3D MODEL FOR OBJECT
  // -------------------------------------------------------------------------
  const buildActiveModel = (objId, matId, colId, scene) => {
    if (!scene) return;

    const matConfig = LAB_MATERIALS.find((m) => m.id === matId) || LAB_MATERIALS[0];
    const colConfig = LAB_COLORS.find((c) => c.id === colId) || LAB_COLORS[0];

    const mainMat = createLabPBRMaterial(matConfig, colConfig.hex);
    currentMaterialRef.current = mainMat;

    const secondaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colId === 'walnut_brown' || colId === 'deep_walnut' ? 0x382417 : 0x5a3826),
      roughness: 0.35,
      metalness: 0.02,
    });
    currentSecondaryMaterialRef.current = secondaryMat;

    const factory = LAB_MODEL_FACTORIES[objId] || LAB_MODEL_FACTORIES.chair;
    const model = factory(mainMat, secondaryMat, colConfig.hex);

    currentModelRef.current = model;
    currentGroupRef.current = model.root;
    scene.add(model.root);

    return model;
  };

  // -------------------------------------------------------------------------
  // OBJECT TRANSITION ANIMATION (1.2s - 1.6s)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const oldGroup = currentGroupRef.current;
    const oldModel = currentModelRef.current;

    // Camera pulls back slightly
    gsap.to(cameraRadiusRef.current, {
      duration: 0.6,
      ease: 'power2.in',
    });

    // Animate old object out: scale down and fade
    if (oldGroup) {
      gsap.to(oldGroup.scale, {
        x: 0.05,
        y: 0.05,
        z: 0.05,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          scene.remove(oldGroup);
          if (oldModel?.dispose) oldModel.dispose();

          // Build new object into scene
          const newModel = buildActiveModel(
            selectedObjectId,
            selectedMaterialId,
            selectedColorId,
            scene
          );

          if (newModel) {
            newModel.root.scale.set(0.05, 0.05, 0.05);
            newModel.root.position.y = -0.15;

            // Animate new object entering and settling
            gsap.to(newModel.root.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.95,
              ease: 'power3.out',
            });
            gsap.to(newModel.root.position, {
              y: 0,
              duration: 0.95,
              ease: 'power3.out',
            });
          }

          // Intelligent Camera Framing: smoothly tween to each product's bespoke focus
          const focus = currentObjConfig.cameraFocus || { pos: [0, 0.8, 4.2], target: [0, 0.5, 0] };
          const offset = new THREE.Vector3(
            focus.pos[0] - focus.target[0],
            focus.pos[1] - focus.target[1],
            focus.pos[2] - focus.target[2]
          );
          const rad = offset.length();
          const elev = Math.asin(offset.y / rad);
          const azim = Math.atan2(offset.x, offset.z);

          gsap.to(cameraTargetRef.current, {
            x: focus.target[0],
            y: focus.target[1],
            z: focus.target[2],
            duration: 1.1,
            ease: 'power2.inOut',
          });
          gsap.to(targetRadiusRef, {
            current: rad,
            duration: 1.1,
            ease: 'power2.inOut',
          });
          gsap.to(targetElevationRef, {
            current: elev,
            duration: 1.1,
            ease: 'power2.inOut',
          });
          gsap.to(targetAzimuthRef, {
            current: azim,
            duration: 1.1,
            ease: 'power2.inOut',
          });
        },
      });
    }

    // Reset interaction states
    setIsCabinetDoorOpen(false);
    setIsExploded(false);
    setExplodeProgress(0);
  }, [selectedObjectId]);

  // -------------------------------------------------------------------------
  // LIVE MATERIAL & COLOR TRANSITION
  // -------------------------------------------------------------------------
  useEffect(() => {
    const matConfig = LAB_MATERIALS.find((m) => m.id === selectedMaterialId) || LAB_MATERIALS[0];
    const colConfig = LAB_COLORS.find((c) => c.id === selectedColorId) || LAB_COLORS[0];

    if (currentMaterialRef.current) {
      // Smooth color interpolation
      const targetColor = new THREE.Color(colConfig.hex);
      gsap.to(currentMaterialRef.current.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.to(currentMaterialRef.current, {
        roughness: matConfig.roughness,
        metalness: matConfig.metalness,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (currentModelRef.current?.updateMaterials) {
      currentModelRef.current.updateMaterials(
        currentMaterialRef.current,
        currentSecondaryMaterialRef.current
      );
    }
  }, [selectedMaterialId, selectedColorId]);

  // -------------------------------------------------------------------------
  // FUNCTIONAL DOORS / DRAWERS / STORAGE MECHANICS
  // -------------------------------------------------------------------------
  const handleToggleDoor = () => {
    if (!currentModelRef.current) return;
    const nextState = !isCabinetDoorOpen;
    setIsCabinetDoorOpen(nextState);

    const animObj = { progress: nextState ? 0 : 1 };
    gsap.to(animObj, {
      progress: nextState ? 1 : 0,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (currentModelRef.current?.setDoorOpen) {
          currentModelRef.current.setDoorOpen(animObj.progress);
        }
        if (currentModelRef.current?.setDrawerOpen) {
          currentModelRef.current.setDrawerOpen(animObj.progress);
        }
        if (currentModelRef.current?.setStorageOpen) {
          currentModelRef.current.setStorageOpen(animObj.progress);
        }
      },
    });
  };

  // -------------------------------------------------------------------------
  // EXPLODE / ASSEMBLE CINEMATIC SEQUENCE
  // -------------------------------------------------------------------------
  const handleToggleExplode = () => {
    if (!currentModelRef.current?.setExplode) return;
    const nextState = !isExploded;
    setIsExploded(nextState);

    const animObj = { progress: explodeProgress };
    gsap.to(animObj, {
      progress: nextState ? 1 : 0,
      duration: 1.45,
      ease: 'power3.inOut',
      onUpdate: () => {
        setExplodeProgress(animObj.progress);
        currentModelRef.current.setExplode(animObj.progress);
      },
    });

    const baseRad = (currentObjConfig.cameraFocus?.pos?.[2] || 4.2);
    if (nextState) {
      targetRadiusRef.current = Math.max(baseRad * 1.25, 4.8);
    } else {
      targetRadiusRef.current = baseRad;
    }
  };

  // -------------------------------------------------------------------------
  // CAMERA PRESETS SMOOTH TWEEN
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!activeCameraPreset || !cameraRef.current) return;

    const preset = CAMERA_PRESETS.find((p) => p.id === activeCameraPreset);
    if (!preset) return;

    const [px, py, pz] = preset.pos;
    const [tx, ty, tz] = preset.target;

    const offset = new THREE.Vector3(px - tx, py - ty, pz - tz);
    const rad = offset.length();
    const elev = Math.asin(offset.y / rad);
    const azim = Math.atan2(offset.x, offset.z);

    const animCam = {
      tx: cameraTargetRef.current.x,
      ty: cameraTargetRef.current.y,
      tz: cameraTargetRef.current.z,
      rad: targetRadiusRef.current,
      elev: targetElevationRef.current,
      azim: targetAzimuthRef.current,
    };

    gsap.to(animCam, {
      tx: tx,
      ty: ty,
      tz: tz,
      rad: rad,
      elev: elev,
      azim: azim,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        cameraTargetRef.current.set(animCam.tx, animCam.ty, animCam.tz);
        targetRadiusRef.current = animCam.rad;
        targetElevationRef.current = animCam.elev;
        targetAzimuthRef.current = animCam.azim;
      },
    });
  }, [activeCameraPreset]);

  // -------------------------------------------------------------------------
  // POINTER 360° DRAG & INERTIA HANDLERS
  // -------------------------------------------------------------------------
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.no-drag')) return;

    isDraggingRef.current = true;
    setRotationStateText('ROTATING');
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    rotationVelocityRef.current = 0;
    lastInteractionTimeRef.current = Date.now();
  };

  const handlePointerMove = (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseParallaxRef.current = { x: normX, y: normY };
    mouseCoordsRef.current.set(normX, normY);

    if (!isDraggingRef.current) return;

    lastInteractionTimeRef.current = Date.now();

    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

    const rotSpeed = 0.0055;
    targetAzimuthRef.current -= deltaX * rotSpeed;
    rotationVelocityRef.current = -deltaX * rotSpeed * 0.4;

    // Vertical drag: subtle elevation adjustment
    targetElevationRef.current += deltaY * 0.003;
    targetElevationRef.current = Math.max(-0.25, Math.min(0.85, targetElevationRef.current));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setRotationStateText('READY');
  };

  // Wheel zoom / dolly
  const handleWheel = (e) => {
    e.preventDefault();
    lastInteractionTimeRef.current = Date.now();
    const zoomDelta = e.deltaY * 0.0035;
    targetRadiusRef.current += zoomDelta;
    targetRadiusRef.current = Math.max(1.8, Math.min(7.0, targetRadiusRef.current));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Double click focus on object
  const handleDoubleClick = () => {
    gsap.to(cameraTargetRef.current, {
      x: 0,
      y: 0.5,
      z: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
    targetRadiusRef.current = 3.2;
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="3D Furniture Laboratory Viewer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '620px',
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'none',
        cursor: isDraggingRef.current ? 'grabbing' : 'grab',
        background: 'radial-gradient(ellipse at 50% 45%, #ffffff 0%, #f7f4ed 60%, #ece6da 100%)',
      }}
    >
      {/* 1. THREE.JS 3D CANVAS */}
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
        }}
      />

      {/* 2. FLOATING VIEWER CONTROLS TOOLBAR */}
      <ViewerControls
        selectedObjectId={selectedObjectId}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={onToggleAutoRotate}
        isInteractMode={isInteractMode}
        onToggleInteractMode={onToggleInteractMode}
        isTechnicalView={isTechnicalView}
        onToggleTechnicalView={onToggleTechnicalView}
        onResetView={onResetView}
        isCabinet={isCabinet}
        hasInteractions={Boolean(currentObjConfig?.features?.hasDoors || currentObjConfig?.features?.hasDrawers || currentObjConfig?.features?.hasBedStorage)}
        interactLabel={currentObjConfig?.features?.interactLabel}
        isDoorOpen={isCabinetDoorOpen}
        onToggleDoor={handleToggleDoor}
        isExploded={isExploded}
        onToggleExplode={handleToggleExplode}
        hasExplode={hasExplode}
      />

      {/* 3. CAMERA PRESET VIEWS (Bottom Center) */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
        }}
      >
        <CameraControls
          activePreset={activeCameraPreset}
          onSelectPreset={onSelectCameraPreset}
        />
      </div>

      {/* 4. TECHNICAL VIEW OVERLAY */}
      {isTechnicalView && (
        <TechnicalView
          dimensionsMM={currentObjConfig.dimensionsMM}
          objectName={currentObjConfig.name}
          subtitle={currentObjConfig.subtitle}
        />
      )}

      {/* 5. INTERACTIVE 3D HOTSPOTS */}
      {isInteractMode &&
        projectedHotspots.map((hs) => {
          if (!hs.isVisible) return null;
          return (
            <div
              key={hs.id}
              style={{
                position: 'absolute',
                left: `${hs.screenX}%`,
                top: `${hs.screenY}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 35,
                pointerEvents: 'auto',
              }}
            >
              <button
                onClick={() => {
                  if (hs.id.includes('drawer') || hs.id.includes('door')) {
                    handleToggleDoor();
                  } else {
                    targetRadiusRef.current = 2.4;
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-accent-gold)',
                    boxShadow: '0 0 12px var(--color-accent-gold), 0 0 24px rgba(197, 160, 89, 0.6)',
                  }}
                />
                <div
                  style={{
                    backgroundColor: 'rgba(18, 17, 16, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '16px',
                    fontSize: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {hs.label} • {hs.text}
                </div>
              </button>
            </div>
          );
        })}

      {/* 6. BOTTOM ROTATION & ZOOM STATUS INDICATORS */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '32px',
          zIndex: 25,
          pointerEvents: 'none',
          fontSize: '10px',
          letterSpacing: '0.22em',
          fontWeight: 600,
          color: '#7a756c',
          textTransform: 'uppercase',
        }}
      >
        ↻ DRAG TO ROTATE 360° • <span style={{ color: '#121110' }}>{rotationStateText}</span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          right: '32px',
          zIndex: 25,
          pointerEvents: 'none',
          fontSize: '10px',
          letterSpacing: '0.22em',
          fontWeight: 600,
          color: '#7a756c',
          textTransform: 'uppercase',
        }}
      >
        SCROLL TO ZOOM
      </div>
    </div>
  );
}
