/**
 * HAZZINO INTERIORS — REAL-TIME 3D INTERACTIVE ROOM SHOWROOM
 * Premium architectural interior experience built with Three.js WebGL & GSAP:
 * - 100% Real 3D Architectural Environments (No 2D image backgrounds)
 * - 360° Camera Orbit around room with damping, elevation clamping & dolly zoom
 * - Object Inspect Mode with 360° furniture turntable rotation
 * - Staggered 3D Explode & Assemble system
 * - Real Hinge Doors & Sliding Drawers
 * - Physically based Material Customization (Oak, Walnut, Travertine, Calacatta, Bouclé, Linen, Brass)
 * - Architectural Lighting System with functional Light ON / Evening toggle
 * - Luxury Architectural Preloader (No black screen ever)
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, X, Sliders, Info, RotateCw, Eye, Compass, ZoomIn, ZoomOut } from 'lucide-react';

import { SHOWROOM_ROOMS, SHOWROOM_MATERIALS } from '../../data/showroomData';
import { ROOM_BUILDERS } from '../../scenes/roomSceneBuilders';
import RoomNavigation from './RoomNavigation';
import FurnitureDetailsCard from './FurnitureDetailsCard';
import MaterialSelector from './MaterialSelector';
import ShowroomControls from './ShowroomControls';
import { ProductCameraController } from '../interaction/ProductCameraController';

export default function InteractiveShowroom({
  initialRoom,
  isOpen,
  onClose,
  onStartProject,
}) {
  // 1. Current Active Room ID ('living' | 'kitchen' | 'bedroom' | 'dining' | 'bathroom')
  const [activeRoomId, setActiveRoomId] = useState(initialRoom?.id || 'living');
  const activeRoomIdRef = useRef(initialRoom?.id || 'living');

  const currentRoom =
    SHOWROOM_ROOMS.find((r) => r.id === activeRoomId) || SHOWROOM_ROOMS[0];

  // 2. Active Selected Furniture ID inside the room
  const [selectedFurnitureId, setSelectedFurnitureId] = useState('sofa');

  // 3. Camera Interaction Mode: 'room' (orbit room) | 'object' (rotate selected furniture)
  const [interactionMode, setInteractionMode] = useState('room');

  // 4. Panel Visibility States
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // null | 'material'

  // 5. Material State for inspected furniture
  const [selectedMaterial, setSelectedMaterial] = useState('walnut');

  // 6. Physical Interaction States (Doors, Drawers, Explode)
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [explodeProgress, setExplodeProgress] = useState(0);
  const [isLightOn, setIsLightOn] = useState(true);

  // Individual Component Selection and Hover
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // 7. Loading state with luxury preloader (guarantees NO BLACK SCREEN)
  const [isLoadingScene, setIsLoadingScene] = useState(true);
  const [loadingStep, setLoadingStep] = useState('Initializing architectural space...');

  // 8. Projected Hotspots in 3D Screen Coordinates
  const [projectedHotspots, setProjectedHotspots] = useState([]);

  // DOM Refs
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Three.js Core Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const fixedRoomGroupRef = useRef(null);
  const furnitureMapRef = useRef({});
  const activeFurnitureRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // ProductCameraController Ref
  const productCameraControllerRef = useRef(null);

  // Component Raycasting Refs
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseCoordsRef = useRef(new THREE.Vector2());
  const hoveredMeshRef = useRef(null);
  const originalMeshEmissiveRef = useRef(new Map());

  // Lighting Refs
  const ambientLightRef = useRef(null);
  const sunLightRef = useRef(null);
  const spotLightsRef = useRef([]);

  // 360° Spherical Orbit Camera State (Room Mode)
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.65, 0));
  const currentTargetRef = useRef(new THREE.Vector3(0, 0.65, 0));

  const cameraAzimuthRef = useRef(0);
  const targetAzimuthRef = useRef(0);

  const cameraPolarRef = useRef(Math.PI * 0.42); // Elevation angle
  const targetPolarRef = useRef(Math.PI * 0.42);

  const cameraDistanceRef = useRef(4.5);
  const targetDistanceRef = useRef(4.5);

  // 360° Object Turntable Rotation State (Object Mode)
  const objectRotationYRef = useRef(0);
  const targetObjectRotationYRef = useRef(0);
  const objectRotationVelocityRef = useRef(0);
  const explodeProgressRef = useRef(0);

  // Pointer Interaction Tracking
  const isPointerDownRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });

  // Helper to dispose Three.js geometry/materials cleanly to prevent GPU leaks
  const disposeHierarchy = (obj) => {
    if (!obj) return;
    obj.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  };

  // -------------------------------------------------------------------------
  // INITIALIZE THREE.JS SCENE ON OPEN
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || !canvasContainerRef.current) return;

    setIsLoadingScene(true);
    setLoadingStep('Constructing 3D architectural envelope...');

    const container = canvasContainerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0d0c);
    sceneRef.current = scene;

    // 2. Perspective Camera (architectural 40° field of view)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;
    const pCam = new ProductCameraController(camera);
    productCameraControllerRef.current = pCam;

    // 3. WebGL Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      container.replaceChildren(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.error('WebGL initialization error:', e);
      setIsLoadingScene(false);
      return;
    }

    setLoadingStep('Setting up architectural lighting & sunbeams...');

    // 4. Lighting Rig (High-End Architectural Studio Lighting with Deep Contact Shadows)
    const ambientLight = new THREE.AmbientLight(
      currentRoom.ambientColor || 0xfff6ec,
      0.38
    );
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Main Directional Sunlight entering from right window wall
    const sunLight = new THREE.DirectionalLight(
      currentRoom.directionalColor || 0xfffaea,
      2.4
    );
    sunLight.position.set(5.5, 4.8, 2.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 18;
    sunLight.shadow.camera.left = -4.5;
    sunLight.shadow.camera.right = 4.5;
    sunLight.shadow.camera.top = 4.5;
    sunLight.shadow.camera.bottom = -4.5;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Soft sky fill light
    const skyFill = new THREE.HemisphereLight(0xd9e5f2, 0x4a4035, 0.45);
    scene.add(skyFill);

    // Ceiling spotlights pointing down
    const spots = [];
    [-1.8, 1.8].forEach((sx) => {
      const spot = new THREE.SpotLight(0xffeed8, 1.4, 10, Math.PI * 0.28, 0.4, 1);
      spot.position.set(sx, 4.1, 0);
      spot.target.position.set(sx * 0.5, 0.5, 0);
      scene.add(spot);
      scene.add(spot.target);
      spots.push(spot);
    });
    spotLightsRef.current = spots;

    setLoadingStep('Constructing bespoke furniture & PBR materials...');

    // 5. Build Initial Room Scene (Fixed 3D Architecture + Interactive Furniture)
    const startRoomId = initialRoom?.id || activeRoomIdRef.current || 'living';
    activeRoomIdRef.current = startRoomId;
    setActiveRoomId(startRoomId);
    const builder = ROOM_BUILDERS[startRoomId] || ROOM_BUILDERS.living;
    const roomData = builder();

    // Add Complete 3D Architecture (Floors, Ceilings, Walls, Windows, Rugs)
    fixedRoomGroupRef.current = roomData.fixedGroup;
    scene.add(roomData.fixedGroup);

    // Add Interactive Furniture
    furnitureMapRef.current = roomData.furniture;
    Object.values(roomData.furniture).forEach((item) => {
      scene.add(item.group);
    });

    const initialId = roomData.defaultSelectedId || Object.keys(roomData.furniture)[0];
    setSelectedFurnitureId(initialId);
    activeFurnitureRef.current = roomData.furniture[initialId];
    if (activeFurnitureRef.current?.defaultMaterial) {
      setSelectedMaterial(activeFurnitureRef.current.defaultMaterial);
    }

    // Camera initial spherical angles
    cameraTargetRef.current.copy(roomData.cameraTarget);
    currentTargetRef.current.copy(roomData.cameraTarget);
    targetDistanceRef.current = roomData.cameraPos.distanceTo(roomData.cameraTarget) || 4.5;
    cameraDistanceRef.current = targetDistanceRef.current;
    targetAzimuthRef.current = 0;
    cameraAzimuthRef.current = 0;
    targetPolarRef.current = Math.PI * 0.42;
    cameraPolarRef.current = Math.PI * 0.42;
    pCam.setRoomDefaults(roomData.cameraTarget, targetDistanceRef.current, Math.PI * 0.42);

    // 6. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. 60FPS Render & Physics Inertia Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth camera interpolation (Inertia damping on Room Orbit)
      cameraAzimuthRef.current += (targetAzimuthRef.current - cameraAzimuthRef.current) * 0.085;
      cameraPolarRef.current += (targetPolarRef.current - cameraPolarRef.current) * 0.085;
      cameraDistanceRef.current += (targetDistanceRef.current - cameraDistanceRef.current) * 0.09;

      currentTargetRef.current.lerp(cameraTargetRef.current, 0.075);

      // Convert Spherical coordinates to Cartesian camera position
      const az = cameraAzimuthRef.current;
      const pol = cameraPolarRef.current;
      const dist = cameraDistanceRef.current;
      const tgt = currentTargetRef.current;

      camera.position.x = tgt.x + dist * Math.sin(pol) * Math.sin(az);
      camera.position.y = tgt.y + dist * Math.cos(pol);
      camera.position.z = tgt.z + dist * Math.sin(pol) * Math.cos(az);
      camera.lookAt(tgt);

      // Smooth interpolation of active furniture rotation in Object mode
      if (interactionMode === 'object' && !isPointerDownRef.current) {
        targetObjectRotationYRef.current += objectRotationVelocityRef.current;
        objectRotationVelocityRef.current *= 0.88;
      }
      objectRotationYRef.current += (targetObjectRotationYRef.current - objectRotationYRef.current) * 0.12;

      if (interactionMode === 'object' && activeFurnitureRef.current?.group) {
        activeFurnitureRef.current.group.rotation.y = objectRotationYRef.current;
      }

      // Render Three.js Scene
      renderer.render(scene, camera);

      // Project 3D Hotspot Coordinates to 2D Screen Space
      if (furnitureMapRef.current && renderer.domElement) {
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;

        const projected = Object.values(furnitureMapRef.current).map((item) => {
          const v = new THREE.Vector3(...item.hotspotPos);
          v.project(camera);

          const isVisible = v.z < 1;
          const screenX = ((v.x + 1) * w) / 2;
          const screenY = ((-v.y + 1) * h) / 2;

          return {
            id: item.id,
            name: item.name,
            shortName: item.shortName,
            type: item.type,
            screenX: (screenX / w) * 100,
            screenY: (screenY / h) * 100,
            isVisible,
          };
        });

        setProjectedHotspots(projected);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Initial first frame rendered -> reveal scene
    setTimeout(() => {
      setIsLoadingScene(false);
    }, 450);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (fixedRoomGroupRef.current) {
        disposeHierarchy(fixedRoomGroupRef.current);
      }
      Object.values(furnitureMapRef.current).forEach((item) => {
        disposeHierarchy(item.group);
      });
      renderer.dispose();
    };
  }, [isOpen]);

  // -------------------------------------------------------------------------
  // CINEMATIC ROOM SWITCH (Full 3D scene replacement with preloader)
  // -------------------------------------------------------------------------
  const handleSwitchRoom = useCallback(
    (newRoomId) => {
      if (!sceneRef.current) {
        setActiveRoomId(newRoomId);
        activeRoomIdRef.current = newRoomId;
        return;
      }
      if (newRoomId === activeRoomIdRef.current && fixedRoomGroupRef.current) return;

      activeRoomIdRef.current = newRoomId;
      setActiveRoomId(newRoomId);
      setIsLoadingScene(true);
      setLoadingStep(`Transitioning to ${newRoomId.toUpperCase()}...`);

      // Reset interaction states
      setIsDoorOpen(false);
      setIsDrawerOpen(false);
      setIsExploded(false);
      setExplodeProgress(0);
      setIsDetailsOpen(false);
      setActivePanel(null);
      setInteractionMode('room');
      targetObjectRotationYRef.current = 0;
      objectRotationYRef.current = 0;
      objectRotationVelocityRef.current = 0;

      setTimeout(() => {
        const scene = sceneRef.current;
        const nextRoomData =
          SHOWROOM_ROOMS.find((r) => r.id === newRoomId) || SHOWROOM_ROOMS[0];
        const builder = ROOM_BUILDERS[newRoomId] || ROOM_BUILDERS.living;

        // Dispose previous room
        if (fixedRoomGroupRef.current) {
          scene.remove(fixedRoomGroupRef.current);
          disposeHierarchy(fixedRoomGroupRef.current);
        }
        Object.values(furnitureMapRef.current).forEach((item) => {
          scene.remove(item.group);
          disposeHierarchy(item.group);
        });

        // Build new room
        const newRoom = builder();
        fixedRoomGroupRef.current = newRoom.fixedGroup;
        scene.add(newRoom.fixedGroup);

        furnitureMapRef.current = newRoom.furniture;
        Object.values(newRoom.furniture).forEach((item) => {
          scene.add(item.group);
        });

        const newInitialId =
          newRoom.defaultSelectedId || Object.keys(newRoom.furniture)[0];
        setSelectedFurnitureId(newInitialId);
        activeFurnitureRef.current = newRoom.furniture[newInitialId];
        if (activeFurnitureRef.current?.defaultMaterial) {
          setSelectedMaterial(activeFurnitureRef.current.defaultMaterial);
        }

        // Camera viewpoint update
        cameraTargetRef.current.copy(newRoom.cameraTarget);
        targetDistanceRef.current =
          newRoom.cameraPos.distanceTo(newRoom.cameraTarget) || 4.5;
        targetAzimuthRef.current = 0;
        targetPolarRef.current = Math.PI * 0.42;

        if (productCameraControllerRef.current) {
          productCameraControllerRef.current.setRoomDefaults(
            newRoom.cameraTarget,
            targetDistanceRef.current,
            Math.PI * 0.42
          );
        }

        // Lighting Rig Update
        if (ambientLightRef.current && sunLightRef.current) {
          gsap.to(ambientLightRef.current, {
            intensity: nextRoomData.ambientIntensity || 1.15,
            duration: 0.8,
          });
          ambientLightRef.current.color.setHex(nextRoomData.ambientColor || 0xfff6ec);

          gsap.to(sunLightRef.current, {
            intensity: nextRoomData.directionalIntensity || 1.85,
            duration: 0.8,
          });
          sunLightRef.current.color.setHex(nextRoomData.directionalColor || 0xfffaea);
        }

        setActiveRoomId(newRoomId);

        setTimeout(() => {
          setIsLoadingScene(false);
        }, 380);
      }, 250);
    },
    []
  );

  // Sync with external initialRoom changes (e.g., hash changes or clicking different Explore buttons)
  useEffect(() => {
    if (initialRoom?.id && initialRoom.id !== activeRoomIdRef.current) {
      if (sceneRef.current) {
        handleSwitchRoom(initialRoom.id);
      } else {
        setActiveRoomId(initialRoom.id);
        activeRoomIdRef.current = initialRoom.id;
      }
    }
  }, [initialRoom?.id, handleSwitchRoom]);

  // -------------------------------------------------------------------------
  // SELECT FURNITURE (ENTER OBJECT FOCUS MODE WITH ADAPTIVE NON-EXTREME FRAMING)
  // -------------------------------------------------------------------------
  const handleSelectFurniture = (furnitureId) => {
    if (activeFurnitureRef.current?.reset) {
      activeFurnitureRef.current.reset();
    }

    targetObjectRotationYRef.current = 0;
    objectRotationYRef.current = 0;
    objectRotationVelocityRef.current = 0;
    setIsDoorOpen(false);
    setIsDrawerOpen(false);
    setIsExploded(false);
    setExplodeProgress(0);
    setSelectedComponent(null);
    setHoveredComponent(null);

    setSelectedFurnitureId(furnitureId);
    const item = furnitureMapRef.current[furnitureId];
    if (item) {
      activeFurnitureRef.current = item;
      setSelectedMaterial(item.defaultMaterial || 'walnut');
      setIsDetailsOpen(true);
      setInteractionMode('object');

      // Adaptive camera framing with NO EXTREME ZOOM via ProductCameraController
      if (productCameraControllerRef.current) {
        const framing = productCameraControllerRef.current.calculateObjectFraming(
          item.group,
          item.features || {}
        );
        productCameraControllerRef.current.minDistance = framing.minDistance;
        productCameraControllerRef.current.maxDistance = framing.maxDistance;

        const targetY = framing.center.y + framing.size.y * 0.04;
        gsap.to(cameraTargetRef.current, {
          x: framing.center.x,
          y: targetY,
          z: framing.center.z,
          duration: 0.95,
          ease: 'power2.out',
        });
        gsap.to(targetDistanceRef, {
          current: framing.idealDistance,
          duration: 0.95,
          ease: 'power2.out',
        });
        gsap.to(targetAzimuthRef, {
          current: 0,
          duration: 0.95,
          ease: 'power2.out',
        });
        gsap.to(targetPolarRef, {
          current: Math.PI * 0.44,
          duration: 0.95,
          ease: 'power2.out',
        });
      } else {
        const [hx, hy, hz] = item.hotspotPos;
        gsap.to(cameraTargetRef.current, {
          x: hx,
          y: hy * 0.9,
          z: hz,
          duration: 0.95,
          ease: 'power2.out',
        });
        gsap.to(targetDistanceRef, {
          current: 3.35,
          duration: 0.95,
          ease: 'power2.out',
        });
        gsap.to(targetAzimuthRef, {
          current: 0,
          duration: 0.95,
          ease: 'power2.out',
        });
        gsap.to(targetPolarRef, {
          current: Math.PI * 0.44,
          duration: 0.95,
          ease: 'power2.out',
        });
      }
    }
  };

  // Return to wide full room view
  const handleReturnToFullRoom = () => {
    if (activeFurnitureRef.current?.reset) {
      activeFurnitureRef.current.reset();
    }
    targetObjectRotationYRef.current = 0;
    objectRotationYRef.current = 0;
    setIsDoorOpen(false);
    setIsDrawerOpen(false);
    setIsExploded(false);
    setExplodeProgress(0);
    setIsDetailsOpen(false);
    setActivePanel(null);
    setSelectedComponent(null);
    setHoveredComponent(null);
    setInteractionMode('room');

    if (productCameraControllerRef.current) {
      productCameraControllerRef.current.minDistance = 2.4;
      productCameraControllerRef.current.maxDistance = 7.5;
    }

    const builder = ROOM_BUILDERS[activeRoomId] || ROOM_BUILDERS.living;
    const roomData = builder();

    gsap.to(cameraTargetRef.current, {
      x: roomData.cameraTarget.x,
      y: roomData.cameraTarget.y,
      z: roomData.cameraTarget.z,
      duration: 1.0,
      ease: 'power2.inOut',
    });
    gsap.to(targetDistanceRef, {
      current: roomData.cameraPos.distanceTo(roomData.cameraTarget) || 4.5,
      duration: 1.0,
      ease: 'power2.inOut',
    });
    gsap.to(targetPolarRef, {
      current: Math.PI * 0.42,
      duration: 1.0,
      ease: 'power2.inOut',
    });
  };

  // -------------------------------------------------------------------------
  // PHYSICAL DOOR / DRAWER / EXPLODE CONTROLS
  // -------------------------------------------------------------------------
  const handleToggleDoor = () => {
    const item = activeFurnitureRef.current;
    if (!item?.setDoorOpen) return;
    const nextState = !isDoorOpen;
    setIsDoorOpen(nextState);

    const animObj = { progress: isDoorOpen ? 1 : 0 };
    gsap.to(animObj, {
      progress: nextState ? 1 : 0,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        item.setDoorOpen(animObj.progress);
      },
    });
  };

  const handleToggleDrawer = () => {
    const item = activeFurnitureRef.current;
    if (!item?.setDrawerOpen) return;
    const nextState = !isDrawerOpen;
    setIsDrawerOpen(nextState);

    const animObj = { progress: isDrawerOpen ? 1 : 0 };
    gsap.to(animObj, {
      progress: nextState ? 1 : 0,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        item.setDrawerOpen(animObj.progress);
      },
    });
  };

  const handleExplode = () => {
    const item = activeFurnitureRef.current;
    if (!item?.setExplode) return;
    setIsExploded(true);

    const animObj = { progress: explodeProgressRef.current || 0 };
    gsap.to(animObj, {
      progress: 1,
      duration: 1.3,
      ease: 'power3.out',
      onUpdate: () => {
        explodeProgressRef.current = animObj.progress;
        setExplodeProgress(animObj.progress);
        item.setExplode(animObj.progress);
      },
    });
  };

  const handleAssemble = () => {
    const item = activeFurnitureRef.current;
    if (!item?.setExplode) return;
    setIsExploded(false);

    const animObj = { progress: explodeProgressRef.current ?? 1 };
    gsap.to(animObj, {
      progress: 0,
      duration: 1.3,
      ease: 'power3.inOut',
      onUpdate: () => {
        explodeProgressRef.current = animObj.progress;
        setExplodeProgress(animObj.progress);
        item.setExplode(animObj.progress);
      },
    });
  };

  const handleToggleExplode = () => {
    if (isExploded) {
      handleAssemble();
    } else {
      handleExplode();
    }
  };

  const handleReset = () => {
    if (activeFurnitureRef.current?.reset) {
      activeFurnitureRef.current.reset();
    }
    targetObjectRotationYRef.current = 0;
    objectRotationYRef.current = 0;
    objectRotationVelocityRef.current = 0;
    setIsDoorOpen(false);
    setIsDrawerOpen(false);
    setIsExploded(false);
    explodeProgressRef.current = 0;
    setExplodeProgress(0);
    setSelectedComponent(null);
    setHoveredComponent(null);

    if (hoveredMeshRef.current?.material?.emissive) {
      const orig = originalMeshEmissiveRef.current.get(hoveredMeshRef.current);
      if (orig) {
        hoveredMeshRef.current.material.emissive.copy(orig.color);
        hoveredMeshRef.current.material.emissiveIntensity = orig.intensity;
      }
      hoveredMeshRef.current = null;
    }

    handleReturnToFullRoom();
  };

  const handleSelectMaterial = (matKey) => {
    setSelectedMaterial(matKey);
    if (activeFurnitureRef.current?.setMaterial) {
      activeFurnitureRef.current.setMaterial(matKey);
    }
  };

  // -------------------------------------------------------------------------
  // LIGHTING CONTROLLER (LIGHT ON / EVENING TOGGLE)
  // -------------------------------------------------------------------------
  const handleToggleLight = () => {
    const nextState = !isLightOn;
    setIsLightOn(nextState);

    if (ambientLightRef.current && sunLightRef.current) {
      if (nextState) {
        // LIGHT ON: Warm interior illumination
        gsap.to(ambientLightRef.current, { intensity: 1.15, duration: 0.7 });
        ambientLightRef.current.color.setHex(currentRoom.ambientColor || 0xfff6ec);
        gsap.to(sunLightRef.current, { intensity: 1.85, duration: 0.7 });
        sunLightRef.current.color.setHex(currentRoom.directionalColor || 0xfffaea);
        spotLightsRef.current.forEach((sp) => {
          gsap.to(sp, { intensity: 1.4, duration: 0.7 });
        });
      } else {
        // EVENING: Soft atmospheric natural daylight & twilight
        gsap.to(ambientLightRef.current, { intensity: 0.45, duration: 0.7 });
        ambientLightRef.current.color.setHex(0x8faec7);
        gsap.to(sunLightRef.current, { intensity: 0.4, duration: 0.7 });
        sunLightRef.current.color.setHex(0xaec8e6);
        spotLightsRef.current.forEach((sp) => {
          gsap.to(sp, { intensity: 0.2, duration: 0.7 });
        });
      }
    }
  };

  // -------------------------------------------------------------------------
  // 360° DRAG & ZOOM CONTROLS (ROOM ORBIT vs OBJECT TURNTABLE)
  // -------------------------------------------------------------------------
  const handlePointerDown = (e) => {
    if (
      e.target.closest('button') ||
      e.target.closest('aside') ||
      e.target.closest('header') ||
      e.target.closest('nav') ||
      e.target.closest('dialog') ||
      e.target.closest('.no-drag')
    ) {
      return;
    }

    isPointerDownRef.current = true;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    objectRotationVelocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) {
      // Component Hover Raycasting in Object Inspect Mode
      if (
        interactionMode === 'object' &&
        activeFurnitureRef.current?.group &&
        rendererRef.current &&
        cameraRef.current
      ) {
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        mouseCoordsRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoordsRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseCoordsRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(
          activeFurnitureRef.current.group.children,
          true
        );

        let found = null;
        for (let i = 0; i < intersects.length; i++) {
          let obj = intersects[i].object;
          while (obj && obj !== activeFurnitureRef.current.group) {
            if (obj.userData?.componentName || obj.userData?.componentId) {
              found = {
                id: obj.userData.componentId || obj.name,
                name: obj.userData.componentName || obj.name,
                mesh: intersects[i].object,
                screenX: e.clientX,
                screenY: e.clientY,
              };
              break;
            }
            obj = obj.parent;
          }
          if (found) break;
        }

        if (found) {
          if (hoveredMeshRef.current !== found.mesh) {
            if (hoveredMeshRef.current?.material?.emissive) {
              const orig = originalMeshEmissiveRef.current.get(hoveredMeshRef.current);
              if (orig) {
                hoveredMeshRef.current.material.emissive.copy(orig.color);
                hoveredMeshRef.current.material.emissiveIntensity = orig.intensity;
              }
            }
            hoveredMeshRef.current = found.mesh;
            if (
              found.mesh.material &&
              !Array.isArray(found.mesh.material) &&
              found.mesh.material.emissive
            ) {
              if (!originalMeshEmissiveRef.current.has(found.mesh)) {
                originalMeshEmissiveRef.current.set(found.mesh, {
                  color: found.mesh.material.emissive.clone(),
                  intensity: found.mesh.material.emissiveIntensity ?? 0,
                });
              }
              found.mesh.material.emissive.setHex(0xc5a059);
              found.mesh.material.emissiveIntensity = 0.32;
            }
          }
          setHoveredComponent(found);
        } else {
          if (hoveredMeshRef.current?.material?.emissive) {
            const orig = originalMeshEmissiveRef.current.get(hoveredMeshRef.current);
            if (orig) {
              hoveredMeshRef.current.material.emissive.copy(orig.color);
              hoveredMeshRef.current.material.emissiveIntensity = orig.intensity;
            }
            hoveredMeshRef.current = null;
          }
          setHoveredComponent(null);
        }
      }
      return;
    }

    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

    if (interactionMode === 'room') {
      // 360° ROOM ORBIT
      targetAzimuthRef.current -= deltaX * 0.006;
      targetPolarRef.current = THREE.MathUtils.clamp(
        targetPolarRef.current - deltaY * 0.005,
        0.18,
        1.46
      );
    } else {
      // OBJECT TURNTABLE ROTATE
      const rotSpeed = 0.008;
      targetObjectRotationYRef.current -= deltaX * rotSpeed;
      objectRotationVelocityRef.current = -deltaX * rotSpeed * 0.45;

      // Vertical drag elevates camera around object
      targetPolarRef.current = THREE.MathUtils.clamp(
        targetPolarRef.current - deltaY * 0.004,
        0.25,
        1.45
      );
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    if (hoveredComponent) {
      setSelectedComponent(hoveredComponent.name);
    }
  };

  // Mouse wheel zoom / trackpad dolly with STRICT hard minimum clamping
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.0035;
    const minD = productCameraControllerRef.current?.minDistance || 2.8;
    const maxD = productCameraControllerRef.current?.maxDistance || 7.2;
    targetDistanceRef.current = THREE.MathUtils.clamp(
      targetDistanceRef.current + zoomDelta,
      minD,
      maxD
    );
  };

  const handleZoomIn = () => {
    const minD = productCameraControllerRef.current?.minDistance || 2.8;
    const maxD = productCameraControllerRef.current?.maxDistance || 7.2;
    targetDistanceRef.current = THREE.MathUtils.clamp(
      targetDistanceRef.current - 0.45,
      minD,
      maxD
    );
  };

  const handleZoomOut = () => {
    const minD = productCameraControllerRef.current?.minDistance || 2.8;
    const maxD = productCameraControllerRef.current?.maxDistance || 7.2;
    targetDistanceRef.current = THREE.MathUtils.clamp(
      targetDistanceRef.current + 0.45,
      minD,
      maxD
    );
  };

  // Keyboard Navigation: ESC to close, Space to reset, Arrow keys, 1-5 rooms
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        handleReset();
      } else if (e.key === 'e' || e.key === 'E') {
        handleToggleExplode();
      } else if (e.key === 'l' || e.key === 'L') {
        handleToggleLight();
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const roomKeys = ['living', 'kitchen', 'bedroom', 'dining', 'bathroom'];
        handleSwitchRoom(roomKeys[parseInt(e.key) - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeRoomId, isExploded, isLightOn]);

  if (!isOpen) return null;

  const activeFurniture = furnitureMapRef.current[selectedFurnitureId];
  const hasExplode = activeFurniture?.features?.canExplode !== false;
  const hasDoors = activeFurniture?.features?.hasDoors === true;
  const hasDrawers = activeFurniture?.features?.hasDrawers === true;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="interactive-showroom-modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0c0b0a',
        overflow: 'hidden',
        cursor: isPointerDownRef.current ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      {/* 1. LUXURY ARCHITECTURAL PRELOADER (GUARANTEES NO BLACK SCREEN) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0c0b0a',
          zIndex: 100,
          display: isLoadingScene ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: isLoadingScene ? 'auto' : 'none',
          opacity: isLoadingScene ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 24px' }}>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.4em',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
              marginBottom: '10px',
            }}
          >
            HAZZINO INTERIORS • REAL-TIME 3D SHOWROOM
          </div>
          <h2
            className="font-serif"
            style={{
              fontSize: '32px',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '0.06em',
              marginBottom: '16px',
            }}
          >
            {currentRoom.num} — {currentRoom.name}
          </h2>
          {/* Animated Gold Progress Bar */}
          <div
            style={{
              width: '180px',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              margin: '0 auto 16px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '60px',
                backgroundColor: 'var(--color-accent-gold)',
                boxShadow: '0 0 12px var(--color-accent-gold)',
                animation: 'loading-slide 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite',
              }}
            />
          </div>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.55)',
              textTransform: 'uppercase',
            }}
          >
            {loadingStep}
          </div>
        </div>
      </div>

      {/* 2. THREE.JS 3D CANVAS VIEWPORT (REAL-TIME 3D ARCHITECTURAL ROOM) */}
      <div
        ref={canvasContainerRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
        }}
      />

      {/* 3. DYNAMIC 3D ARCHITECTURAL HOTSPOTS */}
      {projectedHotspots.map((hs) => {
        if (!hs.isVisible) return null;
        const isSelected = hs.id === selectedFurnitureId;
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
              onClick={() => handleSelectFurniture(hs.id)}
              aria-label={`Inspect ${hs.name}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                outline: 'none',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? 'var(--color-accent-gold)' : '#ffffff',
                  boxShadow: isSelected
                    ? '0 0 16px var(--color-accent-gold), 0 0 30px rgba(197, 160, 89, 0.8)'
                    : '0 0 12px rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '-5px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    animation: 'pulse-ring 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                  }}
                />
              </div>

              <div
                style={{
                  backgroundColor: isSelected ? '#151413' : 'rgba(15, 14, 13, 0.82)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: isSelected
                    ? '1px solid var(--color-accent-gold)'
                    : '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                  transition: 'all 0.25s ease',
                }}
              >
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: isSelected ? 'var(--color-accent-gold)' : '#ffffff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {hs.shortName}
                </span>
                <span
                  style={{
                    fontSize: '8px',
                    letterSpacing: '0.14em',
                    color: isSelected ? '#ffffff' : 'var(--color-accent-gold)',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  {isSelected ? 'ACTIVE' : 'INSPECT'}
                </span>
              </div>
            </button>
          </div>
        );
      })}

      {/* 4. TOP MINIMAL LUXURY HEADER */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 60,
          background: 'linear-gradient(to bottom, rgba(12, 11, 10, 0.88) 0%, transparent 100%)',
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={onClose}
          className="showroom-back-btn"
          aria-label="Exit Showroom"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.85)',
            cursor: 'pointer',
            padding: '8px 0',
            fontSize: '11px',
            letterSpacing: '0.24em',
            fontWeight: 500,
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={14} />
          <span>RETURN TO HOME [ESC]</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.36em',
              fontWeight: 600,
              color: 'var(--color-accent-gold)',
              marginBottom: '3px',
              textTransform: 'uppercase',
            }}
          >
            {currentRoom.num} — {currentRoom.name}
          </div>
          <div
            className="font-serif"
            style={{
              fontSize: '18px',
              letterSpacing: '0.06em',
              color: '#ffffff',
              fontWeight: 400,
            }}
          >
            {activeFurniture ? activeFurniture.name : currentRoom.subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleReturnToFullRoom}
            style={{
              padding: '9px 18px',
              backgroundColor: interactionMode === 'room' ? 'rgba(197, 160, 89, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: interactionMode === 'room' ? 'var(--color-accent-gold)' : '#ffffff',
              fontSize: '10px',
              letterSpacing: '0.2em',
              fontWeight: 600,
              border: interactionMode === 'room' ? '1px solid var(--color-accent-gold)' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            <Eye size={12} />
            <span>ROOM VIEW</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onStartProject) onStartProject();
            }}
            className="btn-magnetic"
            style={{
              padding: '10px 22px',
              backgroundColor: 'var(--color-accent-gold)',
              color: '#0a0a09',
              fontSize: '11px',
              letterSpacing: '0.2em',
              fontWeight: 600,
              border: 'none',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(197, 160, 89, 0.35)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span>START A PROJECT</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* 5. MINIMAL 5-ROOM SELECTOR (01 LIVING ... 05 BATHROOM) */}
      <RoomNavigation
        currentRoomId={activeRoomId}
        onSelectRoom={handleSwitchRoom}
      />

      {/* 6. EDITORIAL ROOM INFORMATION (Bottom-Left) */}
      <div
        className="no-drag"
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '40px',
          maxWidth: '380px',
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            fontWeight: 600,
            color: 'var(--color-accent-gold)',
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}
        >
          {currentRoom.num} — {currentRoom.name}
        </div>
        <h2
          className="font-serif"
          style={{
            fontSize: '26px',
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            marginBottom: '8px',
          }}
        >
          {selectedComponent
            ? `${activeFurniture ? activeFurniture.name : 'CREDENZA'} • ${selectedComponent}`
            : (activeFurniture ? activeFurniture.name : currentRoom.subtitle)}
        </h2>
        <p
          style={{
            fontSize: '11.5px',
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          {interactionMode === 'room'
            ? 'Drag to orbit camera around 3D room. Scroll to zoom in/out. Click any hotspot to inspect furniture.'
            : `Selected: ${activeFurniture?.name}. Drag horizontally to spin 360°. Hover over components to identify. Click Room View to zoom back out.`}
        </p>
      </div>

      {/* 7. PIECE DETAILS CARD */}
      {isDetailsOpen && activeFurniture && (
        <FurnitureDetailsCard
          item={{
            name: activeFurniture.name,
            shortName: activeFurniture.shortName,
            type: activeFurniture.type,
            tagline: `Architectural ${activeFurniture.shortName.toLowerCase()} crafted with bespoke precision.`,
            specs: [
              { label: 'ROOM', value: currentRoom.name },
              { label: 'MATERIAL', value: SHOWROOM_MATERIALS[selectedMaterial]?.name || 'Natural Finish' },
              { label: 'INTERACTION', value: hasExplode ? '360° Rotate & 3D Explode' : '360° Rotate & Inspect' },
            ],
          }}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}

      {/* 8. MATERIAL PALETTE SELECTOR (Floating architectural finish panel) */}
      <MaterialSelector
        isOpen={activePanel === 'material'}
        onClose={() => setActivePanel(null)}
        selectedMaterialKey={selectedMaterial}
        onSelectMaterial={handleSelectMaterial}
        supportedMaterials={activeFurniture?.materialsSupported}
      />

      {/* 9. FLOATING BOTTOM ARCHITECTURAL CONTROL BAR */}
      <ShowroomControls
        interactionMode={interactionMode}
        onToggleInteractionMode={() =>
          setInteractionMode((prev) => (prev === 'room' ? 'object' : 'room'))
        }
        canRotate={activeFurniture?.features?.canRotate !== false}
        hasExplode={hasExplode}
        hasDoors={hasDoors}
        hasDrawers={hasDrawers}
        hasMaterials={Boolean(activeFurniture?.materialsSupported?.length)}
        isExploded={isExploded}
        isDoorOpen={isDoorOpen}
        isDrawerOpen={isDrawerOpen}
        isLightOn={isLightOn}
        activePanel={activePanel}
        onToggleExplode={handleToggleExplode}
        onExplode={handleExplode}
        onAssemble={handleAssemble}
        onToggleDoor={handleToggleDoor}
        onToggleDrawer={handleToggleDrawer}
        onToggleLight={handleToggleLight}
        onToggleMaterial={() =>
          setActivePanel((prev) => (prev === 'material' ? null : 'material'))
        }
        onReset={handleReset}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* 10. COMPONENT HOVER BADGE */}
      {hoveredComponent && (
        <div
          style={{
            position: 'fixed',
            left: `${hoveredComponent.screenX + 16}px`,
            top: `${hoveredComponent.screenY - 14}px`,
            pointerEvents: 'none',
            zIndex: 85,
            backgroundColor: 'rgba(15, 14, 13, 0.94)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-accent-gold)',
            borderRadius: '16px',
            padding: '5px 12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
            transform: 'translateY(-50%)',
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
            }}
          >
            {hoveredComponent.name}
          </div>
        </div>
      )}
    </div>
  );
}
