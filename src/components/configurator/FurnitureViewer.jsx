import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [explodeProgress, setExplodeProgress] = useState(0);
  const [projectedHotspots, setProjectedHotspots] = useState([]);
  const [animLock, setAnimLock] = useState(false);

  // Three.js State Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const currentModelRef = useRef(null);
  const currentGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Material Refs
  const currentMaterialRef = useRef(null);
  const currentSecondaryMaterialRef = useRef(null);

  // Camera Orbit Refs
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const cameraRadiusRef = useRef(4.2);
  const cameraAzimuthRef = useRef(-0.35);
  const cameraElevationRef = useRef(0.22);

  const targetAzimuthRef = useRef(-0.35);
  const targetElevationRef = useRef(0.22);
  const targetRadiusRef = useRef(4.2);
  const rotationVelocityRef = useRef(0);

  // Pointer & Interaction Tracking
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const mouseParallaxRef = useRef({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef(Date.now());
  const mouseCoordsRef = useRef(new THREE.Vector2());

  const currentObjConfig =
    LAB_OBJECTS.find((o) => o.id === selectedObjectId) || LAB_OBJECTS[0];
  const hasExplode = Boolean(currentObjConfig.explodeParts);
  const hasDoors = Boolean(currentObjConfig.features?.hasDoors);
  const hasDrawers = Boolean(
    currentObjConfig.features?.hasDrawers || currentObjConfig.features?.hasBedStorage
  );

  const isAutoRotateRef = useRef(isAutoRotate);
  isAutoRotateRef.current = isAutoRotate;

  const isInteractModeRef = useRef(isInteractMode);
  isInteractModeRef.current = isInteractMode;

  const currentObjConfigRef = useRef(currentObjConfig);
  currentObjConfigRef.current = currentObjConfig;

  // Track active GSAP tweens for safe cancellation
  const activeGsapRef = useRef([]);
  const killActiveGsap = () => {
    activeGsapRef.current.forEach((t) => t?.kill?.());
    activeGsapRef.current = [];
  };

  // Build model internal helper
  const buildModelInternal = (objId, matId, colId, scene) => {
    if (!scene) return null;

    const matConfig = LAB_MATERIALS.find((m) => m.id === matId) || LAB_MATERIALS[0];
    const colConfig = LAB_COLORS.find((c) => c.id === colId) || LAB_COLORS[0];

    const mainMat = createLabPBRMaterial(matConfig, colConfig.hex);
    currentMaterialRef.current = mainMat;

    const isDarkWood = colId === 'walnut_brown' || colId === 'deep_walnut';
    const secondaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(isDarkWood ? 0x382417 : 0x5a3826),
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

  // Camera focus animation helper
  const tweenCameraToFocus = (focus) => {
    const [px, py, pz] = focus.pos;
    const [tx, ty, tz] = focus.target;

    const offset = new THREE.Vector3(px - tx, py - ty, pz - tz);
    const rad = offset.length();
    const elev = Math.asin(Math.max(-1, Math.min(1, offset.y / rad)));
    const azim = Math.atan2(offset.x, offset.z);

    const animState = {
      tx: cameraTargetRef.current.x,
      ty: cameraTargetRef.current.y,
      tz: cameraTargetRef.current.z,
      rad: targetRadiusRef.current,
      elev: targetElevationRef.current,
      azim: targetAzimuthRef.current,
    };

    const t = gsap.to(animState, {
      tx,
      ty,
      tz,
      rad,
      elev,
      azim,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => {
        cameraTargetRef.current.set(animState.tx, animState.ty, animState.tz);
        targetRadiusRef.current = animState.rad;
        targetElevationRef.current = animState.elev;
        targetAzimuthRef.current = animState.azim;
      },
    });
    activeGsapRef.current.push(t);
  };

  // -------------------------------------------------------------------------
  // INITIALIZE THREE.JS SCENE ON MOUNT
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(4.5, 6.0, 5.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdde8f5, 0.75);
    fillLight.position.set(-5, 2.5, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfffaea, 1.35);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const spot = new THREE.SpotLight(0xffeed6, 1.4, 12, Math.PI / 4, 0.35, 1);
    spot.position.set(0, 4.5, 2.5);
    spot.target.position.set(0, 0.4, 0);
    scene.add(spot);
    scene.add(spot.target);

    // Floor Contact Shadow Plane
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ opacity: 0.18 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 5. Build Initial Active Model
    buildModelInternal(selectedObjectId, selectedMaterialId, selectedColorId, scene);

    // Set initial camera focus
    const initFocus = currentObjConfig.cameraFocus || { pos: [1.6, 0.85, 3.4], target: [0, 0.42, 0] };
    const [px, py, pz] = initFocus.pos;
    const [tx, ty, tz] = initFocus.target;
    cameraTargetRef.current.set(tx, ty, tz);
    const offset = new THREE.Vector3(px - tx, py - ty, pz - tz);
    cameraRadiusRef.current = offset.length();
    targetRadiusRef.current = offset.length();
    cameraElevationRef.current = Math.asin(Math.max(-1, Math.min(1, offset.y / targetRadiusRef.current)));
    targetElevationRef.current = cameraElevationRef.current;
    cameraAzimuthRef.current = Math.atan2(offset.x, offset.z);
    targetAzimuthRef.current = cameraAzimuthRef.current;

    // Handle Window Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop with Smooth Damping
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = Date.now();
      // Auto-rotation when active and user isn't interacting
      if (
        isAutoRotateRef.current &&
        !isDraggingRef.current &&
        now - lastInteractionTimeRef.current > 2000
      ) {
        targetAzimuthRef.current += 0.005;
      }

      // Inertia decay
      if (!isDraggingRef.current) {
        targetAzimuthRef.current += rotationVelocityRef.current;
        rotationVelocityRef.current *= 0.88;
      }

      // Smooth camera interpolation
      cameraAzimuthRef.current += (targetAzimuthRef.current - cameraAzimuthRef.current) * 0.12;
      cameraElevationRef.current += (targetElevationRef.current - cameraElevationRef.current) * 0.12;
      cameraRadiusRef.current += (targetRadiusRef.current - cameraRadiusRef.current) * 0.12;

      // Parallax
      const pxOff = mouseParallaxRef.current.x * 0.1;
      const pyOff = mouseParallaxRef.current.y * 0.06;
      const elev = cameraElevationRef.current + pyOff;
      const azim = cameraAzimuthRef.current + pxOff;
      const rad = cameraRadiusRef.current;

      camera.position.set(
        cameraTargetRef.current.x + rad * Math.cos(elev) * Math.sin(azim),
        cameraTargetRef.current.y + rad * Math.sin(elev),
        cameraTargetRef.current.z + rad * Math.cos(elev) * Math.cos(azim)
      );
      camera.lookAt(cameraTargetRef.current);

      renderer.render(scene, camera);

      // Project 3D Hotspot Coordinates to 2D Screen
      if (isInteractModeRef.current && currentObjConfigRef.current?.hotspots) {
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;

        const projected = currentObjConfigRef.current.hotspots.map((hs) => {
          const v = new THREE.Vector3(...hs.pos);
          v.project(camera);
          return {
            ...hs,
            screenX: ((v.x + 1) * w) / 2 / w * 100,
            screenY: ((-v.y + 1) * h) / 2 / h * 100,
            isVisible: v.z < 1,
          };
        });
        setProjectedHotspots(projected);
      }
    };
    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      killActiveGsap();
      if (currentModelRef.current?.dispose) currentModelRef.current.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // OBJECT SWITCH (Smooth 3D swap)
  // -------------------------------------------------------------------------
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const oldGroup = currentGroupRef.current;
    const oldModel = currentModelRef.current;

    killActiveGsap();
    setIsDoorOpen(false);
    setIsDrawerOpen(false);
    setIsExploded(false);
    setExplodeProgress(0);
    setAnimLock(false);

    if (oldGroup) {
      const tOut = gsap.to(oldGroup.scale, {
        x: 0.05,
        y: 0.05,
        z: 0.05,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          scene.remove(oldGroup);
          if (oldModel?.dispose) oldModel.dispose();

          const newModel = buildModelInternal(
            selectedObjectId,
            selectedMaterialId,
            selectedColorId,
            scene
          );
          if (!newModel) return;

          newModel.root.scale.set(0.05, 0.05, 0.05);
          newModel.root.position.y = -0.15;

          const t1 = gsap.to(newModel.root.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.85,
            ease: 'power3.out',
          });
          const t2 = gsap.to(newModel.root.position, {
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
          });

          const focus = currentObjConfigRef.current.cameraFocus || {
            pos: [0, 0.8, 4.2],
            target: [0, 0.5, 0],
          };
          tweenCameraToFocus(focus);
          activeGsapRef.current.push(t1, t2);
        },
      });
      activeGsapRef.current.push(tOut);
    } else {
      const newModel = buildModelInternal(
        selectedObjectId,
        selectedMaterialId,
        selectedColorId,
        scene
      );
      if (newModel) {
        tweenCameraToFocus(
          currentObjConfigRef.current.cameraFocus || {
            pos: [0, 0.8, 4.2],
            target: [0, 0.5, 0],
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObjectId]);

  // -------------------------------------------------------------------------
  // LIVE MATERIAL & COLOR UPDATE
  // -------------------------------------------------------------------------
  useEffect(() => {
    const matConfig =
      LAB_MATERIALS.find((m) => m.id === selectedMaterialId) || LAB_MATERIALS[0];
    const colConfig =
      LAB_COLORS.find((c) => c.id === selectedColorId) || LAB_COLORS[0];

    if (currentMaterialRef.current) {
      const tc = new THREE.Color(colConfig.hex);
      gsap.to(currentMaterialRef.current.color, {
        r: tc.r,
        g: tc.g,
        b: tc.b,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.to(currentMaterialRef.current, {
        roughness: matConfig.roughness,
        metalness: matConfig.metalness,
        duration: 0.5,
      });
    }

    if (currentModelRef.current?.updateMaterials) {
      currentModelRef.current.updateMaterials(
        currentMaterialRef.current,
        currentSecondaryMaterialRef.current
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaterialId, selectedColorId]);

  // -------------------------------------------------------------------------
  // CAMERA PRESETS
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!activeCameraPreset || !cameraRef.current) return;
    if (activeCameraPreset === 'hero' && currentObjConfigRef.current?.cameraFocus) {
      tweenCameraToFocus(currentObjConfigRef.current.cameraFocus);
      return;
    }
    const preset = CAMERA_PRESETS.find((p) => p.id === activeCameraPreset);
    if (!preset) return;

    tweenCameraToFocus(preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCameraPreset]);

  // -------------------------------------------------------------------------
  // DOOR TOGGLE (Independent, smooth animation)
  // -------------------------------------------------------------------------
  const handleToggleDoor = useCallback(() => {
    if (!currentModelRef.current?.setDoorOpen || animLock) return;
    const model = currentModelRef.current;
    const nextOpen = !isDoorOpen;
    setIsDoorOpen(nextOpen);
    setAnimLock(true);

    const anim = { progress: isDoorOpen ? 1 : 0 };
    gsap.to(anim, {
      progress: nextOpen ? 1 : 0,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => model.setDoorOpen(anim.progress),
      onComplete: () => setAnimLock(false),
    });
  }, [isDoorOpen, animLock]);

  // -------------------------------------------------------------------------
  // DRAWER TOGGLE (Independent, smooth slide)
  // -------------------------------------------------------------------------
  const handleToggleDrawer = useCallback(() => {
    if (!currentModelRef.current || animLock) return;
    const model = currentModelRef.current;
    const setter = model.setStorageOpen || model.setDrawerOpen;
    if (!setter) return;

    const nextOpen = !isDrawerOpen;
    setIsDrawerOpen(nextOpen);
    setAnimLock(true);

    const anim = { progress: isDrawerOpen ? 1 : 0 };
    gsap.to(anim, {
      progress: nextOpen ? 1 : 0,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => setter.call(model, anim.progress),
      onComplete: () => setAnimLock(false),
    });
  }, [isDrawerOpen, animLock]);

  // -------------------------------------------------------------------------
  // EXPLODE / ASSEMBLE TOGGLE
  // -------------------------------------------------------------------------
  const handleToggleExplode = useCallback(() => {
    if (!currentModelRef.current?.setExplode || animLock) return;
    const model = currentModelRef.current;
    const nextExploded = !isExploded;
    setIsExploded(nextExploded);
    setAnimLock(true);

    const baseRad = currentObjConfig.cameraFocus?.pos?.[2] || 4.2;
    const anim = { progress: explodeProgress };
    gsap.to(anim, {
      progress: nextExploded ? 1 : 0,
      duration: 1.35,
      ease: 'power3.inOut',
      onUpdate: () => {
        setExplodeProgress(anim.progress);
        model.setExplode(anim.progress);
      },
      onComplete: () => setAnimLock(false),
    });

    targetRadiusRef.current = nextExploded ? Math.max(baseRad * 1.25, 4.8) : baseRad;
  }, [isExploded, explodeProgress, animLock, currentObjConfig]);

  // -------------------------------------------------------------------------
  // FULL RESET
  // -------------------------------------------------------------------------
  const handleReset = useCallback(() => {
    const model = currentModelRef.current;
    if (!model) return;

    killActiveGsap();
    setAnimLock(false);

    if (model.setDoorOpen && isDoorOpen) {
      setIsDoorOpen(false);
      model.setDoorOpen(0);
    }
    const setter = model.setStorageOpen || model.setDrawerOpen;
    if (setter && isDrawerOpen) {
      setIsDrawerOpen(false);
      setter.call(model, 0);
    }
    if (model.setExplode && isExploded) {
      setIsExploded(false);
      setExplodeProgress(0);
      model.setExplode(0);
    }

    const focus = currentObjConfig.cameraFocus || {
      pos: [0, 0.8, 4.2],
      target: [0, 0.5, 0],
    };
    tweenCameraToFocus(focus);
    onResetView?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDoorOpen, isDrawerOpen, isExploded, currentObjConfig, onResetView]);

  // -------------------------------------------------------------------------
  // POINTER ORBIT / DRAG HANDLERS
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

    const dx = e.clientX - previousPointerPosRef.current.x;
    const dy = e.clientY - previousPointerPosRef.current.y;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

    targetAzimuthRef.current -= dx * 0.0055;
    rotationVelocityRef.current = -dx * 0.0055 * 0.35;
    targetElevationRef.current = Math.max(
      -0.25,
      Math.min(0.85, targetElevationRef.current + dy * 0.003)
    );
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setRotationStateText('READY');
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    lastInteractionTimeRef.current = Date.now();
    targetRadiusRef.current = Math.max(
      2.4,
      Math.min(6.5, targetRadiusRef.current + e.deltaY * 0.0018)
    );
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleDoubleClick = () => {
    const focus = currentObjConfigRef.current?.cameraFocus || {
      pos: [0, 0.8, 4.2],
      target: [0, 0.5, 0],
    };
    tweenCameraToFocus(focus);
  };

  const doorLabel = isDoorOpen
    ? 'CLOSE DOORS'
    : (currentObjConfig.features?.interactLabel && currentObjConfig.features.interactLabel.includes('WARDROBE')
        ? 'OPEN WARDROBE'
        : 'OPEN DOORS');

  const drawerLabel = isDrawerOpen
    ? (currentObjConfig.features?.hasBedStorage ? 'CLOSE BED STORAGE' : 'CLOSE DRAWER')
    : (currentObjConfig.features?.hasBedStorage ? 'OPEN BED STORAGE' : 'OPEN DRAWER');

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
        background:
          'radial-gradient(ellipse at 50% 45%, #ffffff 0%, #f7f4ed 60%, #ece6da 100%)',
      }}
    >
      {/* 3D WebGL Canvas */}
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

      {/* Control Panel with dedicated buttons */}
      <ViewerControls
        selectedObjectId={selectedObjectId}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={onToggleAutoRotate}
        isInteractMode={isInteractMode}
        onToggleInteractMode={onToggleInteractMode}
        isTechnicalView={isTechnicalView}
        onToggleTechnicalView={onToggleTechnicalView}
        onResetView={handleReset}
        hasDoors={hasDoors}
        hasDrawers={hasDrawers}
        isDoorOpen={isDoorOpen}
        isDrawerOpen={isDrawerOpen}
        onToggleDoor={handleToggleDoor}
        onToggleDrawer={handleToggleDrawer}
        doorLabel={doorLabel}
        drawerLabel={drawerLabel}
        isExploded={isExploded}
        onToggleExplode={handleToggleExplode}
        hasExplode={hasExplode}
        animLock={animLock}
      />

      {/* Camera Presets Toolbar */}
      <div
        className="no-drag"
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

      {/* Architectural Technical Dimensions Overlay */}
      {isTechnicalView && (
        <TechnicalView
          dimensionsMM={currentObjConfig.dimensionsMM}
          objectName={currentObjConfig.name}
          subtitle={currentObjConfig.subtitle}
        />
      )}

      {/* 3D Interactive Hotspots */}
      {isInteractMode &&
        projectedHotspots.map((hs) => {
          if (!hs.isVisible) return null;
          return (
            <div
              key={hs.id}
              className="no-drag"
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
                type="button"
                onClick={() => {
                  const isDoor = hs.id.includes('door');
                  const isDrawer = hs.id.includes('drawer') || hs.id.includes('storage');
                  if (isDoor && hasDoors) handleToggleDoor();
                  else if (isDrawer && hasDrawers) handleToggleDrawer();
                  else targetRadiusRef.current = Math.max(1.8, targetRadiusRef.current - 1.0);
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
                    backgroundColor: 'var(--color-accent-gold, #c5a059)',
                    boxShadow: '0 0 12px var(--color-accent-gold, #c5a059)',
                  }}
                />
                <div
                  style={{
                    backgroundColor: 'rgba(18, 17, 16, 0.88)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: '16px',
                    fontSize: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {hs.label} • {hs.text}
                </div>
              </button>
            </div>
          );
        })}

      {/* Bottom Hint Overlays */}
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
