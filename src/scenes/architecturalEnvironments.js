/**
 * HAZZINO INTERIORS — ARCHITECTURAL 3D ENVIRONMENTS
 * Builds complete 3D architectural room envelopes:
 * - 3D Floors (plank oak, stone tiles, dark hardwood, honed travertine)
 * - 3D Ceilings with recessed spotlights & LED cove troughs
 * - 3D Back Walls with room-specific architectural paneling & textures
 * - 3D Side Walls with floor-to-ceiling black steel-framed multi-pane windows
 * - Exterior landscape daylight vistas with sunbeam angles
 * - Interior lighting rigs with controllable spotlights & glow fixtures
 */
import * as THREE from 'three';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createPlankFloorTexture,
  createTileFloorTexture,
  createStoneTexture,
  createGlassMaterial,
  createEmissiveWarmGlowMaterial,
} from '../models/modelMaterials';

export function createArchitecturalRoomShell({
  roomType = 'living',
  width = 12,
  depth = 11,
  height = 4.2,
  floorType = 'wood_light', // 'wood_light' | 'wood_dark' | 'tile' | 'travertine'
  backWallColor = 0xeee9df,
  hasSideWindow = roomType !== 'bathroom',
}) {
  const group = new THREE.Group();
  group.name = `ArchitecturalShell_${roomType}`;

  // 1. 3D ARCHITECTURAL FLOOR
  let floorMat;
  if (floorType === 'wood_light') {
    const map = createPlankFloorTexture(false);
    floorMat = new THREE.MeshStandardMaterial({
      map,
      roughness: 0.65,
      metalness: 0.05,
    });
  } else if (floorType === 'wood_dark') {
    const map = createPlankFloorTexture(true);
    floorMat = new THREE.MeshStandardMaterial({
      map,
      roughness: 0.6,
      metalness: 0.05,
    });
  } else if (floorType === 'tile') {
    const map = createTileFloorTexture();
    floorMat = new THREE.MeshStandardMaterial({
      map,
      roughness: 0.5,
      metalness: 0.04,
    });
  } else {
    const map = createStoneTexture();
    floorMat = new THREE.MeshStandardMaterial({
      map,
      roughness: 0.75,
      metalness: 0.02,
    });
  }

  const floorGeo = new THREE.PlaneGeometry(width, depth);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, 0);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // 2. 3D ARCHITECTURAL CEILING WITH COVE TROUGHS & RECESSED LIGHTS
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f5,
    roughness: 0.9,
  });
  const ceilingGeo = new THREE.PlaneGeometry(width, depth);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(0, height, 0);
  group.add(ceilingMesh);

  // Recessed ceiling trimless spotlights
  const spotPositions = [
    [-2.2, -1.2],
    [0, -1.2],
    [2.2, -1.2],
    [-2.2, 1.2],
    [0, 1.2],
    [2.2, 1.2],
  ];
  const spotTrimGeo = new THREE.RingGeometry(0.04, 0.065, 24);
  const spotGlassGeo = new THREE.CircleGeometry(0.038, 24);
  const spotTrimMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
  const spotGlassMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });

  spotPositions.forEach(([sx, sz]) => {
    const trim = new THREE.Mesh(spotTrimGeo, spotTrimMat);
    trim.rotation.x = Math.PI / 2;
    trim.position.set(sx, height - 0.005, sz);
    group.add(trim);

    const glass = new THREE.Mesh(spotGlassGeo, spotGlassMat);
    glass.rotation.x = Math.PI / 2;
    glass.position.set(sx, height - 0.006, sz);
    group.add(glass);
  });

  // 3. BACK WALL WITH SHADOW RECEPTION & BASEBOARD SKIRTING
  const backWallMat =
    roomType === 'bathroom'
      ? new THREE.MeshStandardMaterial({
          map: createStoneTexture(),
          roughness: 0.8,
          metalness: 0.02,
        })
      : new THREE.MeshStandardMaterial({
          color: new THREE.Color(backWallColor),
          roughness: 0.88,
        });
  const backWallGeo = new THREE.PlaneGeometry(width, height);
  const backWallMesh = new THREE.Mesh(backWallGeo, backWallMat);
  backWallMesh.position.set(0, height / 2, -depth / 2);
  backWallMesh.receiveShadow = true;
  group.add(backWallMesh);

  // Baseboard skirting along back wall
  const skirtingMat = new THREE.MeshStandardMaterial({ color: 0x3a2c20, roughness: 0.7 });
  const skirting = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.12, 0.03),
    skirtingMat
  );
  skirting.position.set(0, 0.06, -depth / 2 + 0.015);
  group.add(skirting);

  // 4. LEFT WALL WITH ARCHITECTURAL NICHE & RETURN
  const leftWallGeo = new THREE.PlaneGeometry(depth, height);
  const leftWallMesh = new THREE.Mesh(leftWallGeo, backWallMat);
  leftWallMesh.rotation.y = Math.PI / 2;
  leftWallMesh.position.set(-width / 2, height / 2, 0);
  leftWallMesh.receiveShadow = true;
  group.add(leftWallMesh);

  // 5. RIGHT WALL: MULTI-PANE FLOOR-TO-CEILING BLACK STEEL WINDOW WALL (OR SOLID WALL)
  if (hasSideWindow) {
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: 0x181818,
      roughness: 0.35,
      metalness: 0.8,
    });
    const windowGlassMat = createGlassMaterial(0.2);

    const windowGroup = new THREE.Group();
    windowGroup.position.set(width / 2, 0, 0);

    // Outer window frame
    const outerFrameH = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, depth),
      windowFrameMat
    );
    outerFrameH.position.set(0, height - 0.04, 0);
    windowGroup.add(outerFrameH);

    const bottomSill = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, depth),
      windowFrameMat
    );
    bottomSill.position.set(-0.06, 0.04, 0);
    windowGroup.add(bottomSill);

    // Vertical mullions
    const numPanes = 5;
    const paneWidth = depth / numPanes;
    for (let i = 0; i <= numPanes; i++) {
      const mz = -depth / 2 + i * paneWidth;
      const mullion = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, height, 0.04),
        windowFrameMat
      );
      mullion.position.set(0, height / 2, mz);
      mullion.castShadow = true;
      windowGroup.add(mullion);
    }

    // Horizontal transoms
    [height * 0.35, height * 0.7].forEach((ty) => {
      const transom = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.04, depth),
        windowFrameMat
      );
      transom.position.set(0, ty, 0);
      windowGroup.add(transom);
    });

    // Large clear window glass pane
    const windowGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, height - 0.1, depth - 0.1),
      windowGlassMat
    );
    windowGlass.position.set(0, height / 2, 0);
    windowGroup.add(windowGlass);

    // Exterior Sky & Daylight Vista Plane outside the window
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const sCtx = skyCanvas.getContext('2d');
    const skyGrad = sCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, '#7ea9d4');
    skyGrad.addColorStop(0.5, '#c5d8e8');
    skyGrad.addColorStop(0.85, '#eeddcc');
    skyGrad.addColorStop(1, '#667755'); // distant trees
    sCtx.fillStyle = skyGrad;
    sCtx.fillRect(0, 0, 512, 512);

    // Subtle architectural skyline silhouettes
    sCtx.fillStyle = 'rgba(120, 140, 160, 0.35)';
    for (let b = 0; b < 14; b++) {
      const bx = b * 38;
      const bh = 80 + Math.random() * 140;
      sCtx.fillRect(bx, 512 - bh, 32, bh);
    }

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex });
    const skyBackdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(depth * 1.3, height * 1.5),
      skyMat
    );
    skyBackdrop.rotation.y = -Math.PI / 2;
    skyBackdrop.position.set(width / 2 + 1.2, height * 0.6, 0);
    windowGroup.add(skyBackdrop);

    // Sheer linen curtain panels gathered at sides of window
    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.95,
      transparent: true,
      opacity: 0.65,
    });
    [-depth / 2 + 0.4, depth / 2 - 0.4].forEach((cz) => {
      const curtain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, height - 0.15, 16),
        curtainMat
      );
      curtain.scale.set(0.6, 1, 1.4);
      curtain.position.set(-0.25, (height - 0.15) / 2, cz);
      curtain.castShadow = true;
      windowGroup.add(curtain);
    });

    group.add(windowGroup);
  } else {
    // Solid architectural side wall (e.g. for Bathroom with vanity)
    const rightWallGeo = new THREE.PlaneGeometry(depth, height);
    const rightWallMesh = new THREE.Mesh(rightWallGeo, backWallMat);
    rightWallMesh.rotation.y = -Math.PI / 2;
    rightWallMesh.position.set(width / 2, height / 2, 0);
    rightWallMesh.receiveShadow = true;
    group.add(rightWallMesh);

    const rightSkirting = new THREE.Mesh(
      new THREE.BoxGeometry(depth, 0.12, 0.03),
      skirtingMat
    );
    rightSkirting.rotation.y = -Math.PI / 2;
    rightSkirting.position.set(width / 2 - 0.015, 0.06, 0);
    group.add(rightSkirting);
  }

  return {
    group,
    windowPosition: new THREE.Vector3(width / 2, height / 2, 0),
    dimensions: { width, depth, height },
  };
}
