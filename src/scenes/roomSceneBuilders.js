/**
 * HAZZINO INTERIORS — COMPLETE REAL-TIME 3D ARCHITECTURAL ROOM & FURNITURE SYSTEM
 * Builds 5 realistic interior design showrooms with full 3D architecture
 * (floors, ceilings, walls, windows with daylight, recessed lights) and
 * independent, physically interactive 3D furniture with real hinge doors,
 * sliding drawers, staggered explode/assemble, 360° turntable, and material customization:
 *
 * 01 — LIVING ROOM (Curved Bouclé Sofa, Travertine Coffee Table, Fluted Cabinet, Side Table, Armchairs)
 * 02 — KITCHEN (Waterfall Island, Green Cabinetry, Tall Pantry, Wall Oven, Refrigerator, Bar Stools)
 * 03 — BEDROOM (Floating King Bed, Acoustic Slat Wardrobe, Nightstands, Dresser & Mirror, Bench)
 * 04 — DINING (Travertine Table, 8 Symmetrically Arranged Chairs, Sideboard Credenza, Glass Vitrine)
 * 05 — BATHROOM (Double Vanity, Backlit Mirrors, Freestanding Oval Tub, Hinged Glass Shower, Linen Tower)
 */
import * as THREE from 'three';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createGlassMaterial,
  createEmissiveWarmGlowMaterial,
  createStoneTexture,
  createMarbleTexture,
  createPlankFloorTexture,
  createTileFloorTexture,
} from '../models/modelMaterials';
import { createReferenceArmchair } from '../models/ReferenceArmchair';
import { createArchitecturalRoomShell } from './architecturalEnvironments';

// Helper to create woven area rugs
function createRug(width, depth, color = 0xdad4c8) {
  const geom = new THREE.BoxGeometry(width, 0.015, depth);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.95,
  });
  const rug = new THREE.Mesh(geom, mat);
  rug.position.set(0, 0.008, 0);
  rug.receiveShadow = true;
  return rug;
}

// Helper for Museum-Grade Bas-Relief Plaster Art
function createMuseumBasReliefArtwork() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // 1. Warm chalk alabaster background with fine plaster grain
  const grad = ctx.createLinearGradient(0, 0, 1024, 768);
  grad.addColorStop(0, '#f6f2e9');
  grad.addColorStop(0.5, '#ede6da');
  grad.addColorStop(1, '#e4dccf');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 768);

  // Micro plaster noise/stippling
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 768;
    const r = Math.random() * 2.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.4)' : 'rgba(180,165,145,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Sculpted architectural geometric relief layers (Axel Vervoordt / Studio Liaigre aesthetic)
  ctx.shadowColor = 'rgba(70, 55, 40, 0.16)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetX = 12;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#e5dfd2';
  ctx.beginPath();
  ctx.arc(512, 420, 260, Math.PI, 0, false);
  ctx.lineTo(772, 660);
  ctx.lineTo(252, 660);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#dbd3c2';
  ctx.beginPath();
  ctx.arc(512, 420, 190, Math.PI, 0, false);
  ctx.lineTo(702, 660);
  ctx.lineTo(322, 660);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#d2c8b4';
  ctx.beginPath();
  ctx.arc(512, 420, 120, Math.PI, 0, false);
  ctx.lineTo(632, 660);
  ctx.lineTo(392, 660);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Tactile impasto palette knife strokes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 4;
  for (let s = 0; s < 12; s++) {
    const sy = 280 + s * 28;
    ctx.beginPath();
    ctx.moveTo(340 + Math.sin(s) * 30, sy);
    ctx.lineTo(680 - Math.sin(s) * 30, sy);
    ctx.stroke();
  }

  // Subtle graphite architectural registration marks
  ctx.strokeStyle = 'rgba(120, 105, 90, 0.25)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(120, 680);
  ctx.lineTo(904, 680);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// Helper for Luxury High-Pile Organic Wool Bouclé Area Rug
function createLuxuryOrganicRug(width, depth) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ede8dd';
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 1.2 + Math.random() * 2.2;
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255,255,255,0.55)' : 'rgba(195,180,160,0.32)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Debossed border lines
  ctx.strokeStyle = 'rgba(175, 160, 140, 0.35)';
  ctx.lineWidth = 6;
  ctx.strokeRect(55, 55, 914, 914);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(58, 58, 908, 908);

  const rugTex = new THREE.CanvasTexture(canvas);
  rugTex.wrapS = THREE.RepeatWrapping;
  rugTex.wrapT = THREE.RepeatWrapping;

  const geom = new THREE.BoxGeometry(width, 0.02, depth, 16, 2, 16);
  const mat = new THREE.MeshStandardMaterial({
    map: rugTex,
    roughness: 0.94,
    metalness: 0.0,
  });
  const rug = new THREE.Mesh(geom, mat);
  rug.position.set(0, 0.01, 0);
  rug.receiveShadow = true;
  return rug;
}

// ============================================================================
// 01 — LIVING ROOM SCENE
// ============================================================================
export function buildLivingRoomScene() {
  const fixedGroup = new THREE.Group();
  fixedGroup.name = 'LivingRoom_FixedArchitecture';

  const woodFloorMat = createFurnitureMaterial('natural_oak');
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xede8df, roughness: 0.9 });
  const boucleMat = createFurnitureMaterial('boucle');
  const walnutMat = createFurnitureMaterial('smoked_walnut');
  const travertineMat = createFurnitureMaterial('travertine');
  const calacattaMat = createFurnitureMaterial('calacatta');
  const brassMat = createBrassAccentMaterial();

  // 1. COMPLETE 3D ARCHITECTURAL ROOM ENVELOPE
  const shell = createArchitecturalRoomShell({
    roomType: 'living',
    width: 12,
    depth: 11,
    height: 4.2,
    floorType: 'wood_light',
    backWallColor: 0xede8df,
  });
  fixedGroup.add(shell.group);

  // Grand Architectural Roman Travertine Accent Wall Panel (Replaces harsh dark barcode slats)
  const travertineWallMesh = new THREE.Mesh(
    new THREE.BoxGeometry(6.4, 4.16, 0.08),
    travertineMat
  );
  travertineWallMesh.position.set(0, 2.08, -5.44);
  travertineWallMesh.receiveShadow = true;
  fixedGroup.add(travertineWallMesh);

  // Vertical Aged Brushed Brass Inset Reveal Channels
  [-3.21, 3.21].forEach((bx) => {
    const brassReveal = new THREE.Mesh(
      new THREE.BoxGeometry(0.024, 4.16, 0.09),
      brassMat
    );
    brassReveal.position.set(bx, 2.08, -5.43);
    fixedGroup.add(brassReveal);
  });

  // Soft Architectural Plaster Micro-Fluting on Side Margins
  const flutedPlasterMat = new THREE.MeshStandardMaterial({ color: 0xe6e0d4, roughness: 0.88 });
  for (let fx = -5.2; fx <= -3.26; fx += 0.09) {
    const flute = new THREE.Mesh(new THREE.BoxGeometry(0.045, 4.16, 0.035), flutedPlasterMat);
    flute.position.set(fx, 2.08, -5.46);
    flute.receiveShadow = true;
    fixedGroup.add(flute);
  }
  for (let fx = 3.26; fx <= 5.2; fx += 0.09) {
    const flute = new THREE.Mesh(new THREE.BoxGeometry(0.045, 4.16, 0.035), flutedPlasterMat);
    flute.position.set(fx, 2.08, -5.46);
    flute.receiveShadow = true;
    fixedGroup.add(flute);
  }

  // Floating Cantilevered Travertine Display Hearth Plinth at wall base
  const hearthPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.22, 0.46),
    travertineMat
  );
  hearthPlinth.position.set(0, 0.11, -5.24);
  hearthPlinth.castShadow = true;
  hearthPlinth.receiveShadow = true;
  fixedGroup.add(hearthPlinth);

  // Concealed warm 2700K ambient LED cove wash under the hearth
  const underHearthGlow = new THREE.Mesh(
    new THREE.BoxGeometry(6.4, 0.025, 0.06),
    createEmissiveWarmGlowMaterial()
  );
  underHearthGlow.position.set(0, 0.02, -5.18);
  fixedGroup.add(underHearthGlow);

  // Recessed warm ceiling cove light strip above the feature wall
  const coveGlow = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.04, 0.08),
    createEmissiveWarmGlowMaterial()
  );
  coveGlow.position.set(0, 4.14, -5.38);
  fixedGroup.add(coveGlow);

  // Large Framed Museum-Grade Bas-Relief Plaster Artwork
  const artGroup = new THREE.Group();
  artGroup.position.set(0, 2.35, -5.38);
  const artFrame = new THREE.Mesh(new THREE.BoxGeometry(2.84, 1.74, 0.04), brassMat);
  artGroup.add(artFrame);

  const artTex = createMuseumBasReliefArtwork();
  const artMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 1.7),
    new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.92 })
  );
  artMesh.position.z = 0.022;
  artGroup.add(artMesh);
  fixedGroup.add(artGroup);

  // Woven Luxury High-Pile Organic Wool Bouclé Area Rug
  fixedGroup.add(createLuxuryOrganicRug(6.6, 4.6));

  // Sculptural Botanical Black Olive Tree in Fluted Pedestal Urn (Right background)
  const plantGroup = new THREE.Group();
  plantGroup.position.set(3.4, 0, -2.6);

  const urnPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.24, 0.72, 32),
    travertineMat
  );
  urnPot.position.y = 0.36;
  urnPot.castShadow = true;
  plantGroup.add(urnPot);

  const treeTrunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.045, 1.6, 16),
    walnutMat
  );
  treeTrunk.position.y = 1.1;
  treeTrunk.castShadow = true;
  plantGroup.add(treeTrunk);

  [
    [-0.15, 1.5, 0.08, -0.25],
    [0.18, 1.7, -0.1, 0.3],
    [-0.1, 1.9, 0.12, 0.2],
  ].forEach(([bx, by, bz, bRot]) => {
    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.02, 0.65, 12),
      walnutMat
    );
    branch.position.set(bx, by, bz);
    branch.rotation.z = bRot;
    branch.castShadow = true;
    plantGroup.add(branch);
  });

  const oliveLeafMat = new THREE.MeshStandardMaterial({ color: 0x3d5438, roughness: 0.6 });
  [
    [0, 1.85, 0, 0.42],
    [0.32, 2.1, -0.16, 0.38],
    [-0.28, 2.25, 0.18, 0.36],
    [0.24, 2.45, 0.12, 0.32],
    [-0.18, 2.55, -0.12, 0.30],
    [0.05, 2.7, 0, 0.26],
  ].forEach(([lx, ly, lz, lr]) => {
    const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(lr, 2), oliveLeafMat);
    leaf.scale.set(1.3, 0.7, 1.2);
    leaf.position.set(lx, ly, lz);
    leaf.castShadow = true;
    plantGroup.add(leaf);
  });
  fixedGroup.add(plantGroup);

  // Architectural Arched Brass & Frosted Sphere Floor Lamp (Left background)
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-3.3, 0, -2.4);
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.30, 0.06, 32), travertineMat);
  lampBase.position.y = 0.03;
  lampBase.castShadow = true;
  lampGroup.add(lampBase);

  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.05, 16), brassMat);
  lampStem.position.y = 1.05;
  lampStem.castShadow = true;
  lampGroup.add(lampStem);

  const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.65, 16), brassMat);
  lampArm.position.set(0.24, 2.05, 0.18);
  lampArm.rotation.z = -Math.PI * 0.32;
  lampGroup.add(lampArm);

  const lampShade = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xfff6ec, roughness: 0.15, transparent: true, opacity: 0.95 })
  );
  lampShade.position.set(0.48, 1.95, 0.35);
  lampGroup.add(lampShade);

  const lampLight = new THREE.PointLight(0xffeedd, 0.85, 4.5);
  lampLight.position.set(0.48, 1.95, 0.35);
  lampGroup.add(lampLight);
  fixedGroup.add(lampGroup);

  // Sculptural Swivel Barrel Club Chair in Cognac Saddle Leather (Right foreground)
  const clubChairRight = new THREE.Group();
  clubChairRight.position.set(2.4, 0, 0.6);
  clubChairRight.rotation.y = -Math.PI * 0.38;

  const saddleLeatherMat = createFurnitureMaterial('leather');

  const swivelBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.36, 0.05, 32),
    brassMat
  );
  swivelBase.position.y = 0.025;
  clubChairRight.add(swivelBase);

  const clubSeat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.18, 32),
    saddleLeatherMat
  );
  clubSeat.position.y = 0.20;
  clubSeat.castShadow = true;
  clubChairRight.add(clubSeat);

  const clubBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.74, 0.52, 0.22, 10, 6, 6),
    saddleLeatherMat
  );
  clubBack.position.set(0, 0.45, -0.22);
  clubBack.castShadow = true;
  clubChairRight.add(clubBack);

  [-0.34, 0.34].forEach((ax, idx) => {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.38, 0.54, 6, 6, 8),
      saddleLeatherMat
    );
    arm.position.set(ax, 0.40, -0.06);
    arm.rotation.y = idx === 0 ? 0.16 : -0.16;
    arm.castShadow = true;
    clubChairRight.add(arm);
  });

  const clubPillow = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.22, 0.10),
    boucleMat
  );
  clubPillow.position.set(0, 0.32, -0.14);
  clubPillow.rotation.x = 0.12;
  clubPillow.castShadow = true;
  clubChairRight.add(clubPillow);

  fixedGroup.add(clubChairRight);

  // 2. INTERACTIVE FURNITURE PIECES
  const interactiveFurniture = {};

  // --------------------------------------------------------------------------
  // OBJECT A: CURVED BESPOKE BOUCLÉ LOUNGE SECTIONAL (Hero center piece)
  // --------------------------------------------------------------------------
  const sofaRoot = new THREE.Group();
  sofaRoot.name = 'Interactive_Sofa';
  sofaRoot.position.set(0, 0, -0.65);

  const sofaMaterials = { current: boucleMat };

  // Main Curved Modular Lounge Cushions (Smooth, plush, organic)
  const sofaCenterCushion = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.40, 1.05, 12, 6, 12),
    sofaMaterials.current
  );
  sofaCenterCushion.position.set(0, 0.24, 0);
  sofaCenterCushion.castShadow = true;
  sofaCenterCushion.receiveShadow = true;
  sofaRoot.add(sofaCenterCushion);

  const sofaLeftWing = new THREE.Mesh(
    new THREE.BoxGeometry(1.36, 0.40, 1.02, 10, 6, 10),
    sofaMaterials.current
  );
  sofaLeftWing.position.set(-1.38, 0.24, 0.20);
  sofaLeftWing.rotation.y = 0.26;
  sofaLeftWing.castShadow = true;
  sofaRoot.add(sofaLeftWing);

  const sofaRightWing = new THREE.Mesh(
    new THREE.BoxGeometry(1.36, 0.40, 1.02, 10, 6, 10),
    sofaMaterials.current
  );
  sofaRightWing.position.set(1.38, 0.24, 0.20);
  sofaRightWing.rotation.y = -0.26;
  sofaRightWing.castShadow = true;
  sofaRoot.add(sofaRightWing);

  // Sculptural Low-Slung Curved Backrests
  const sofaBackCenter = new THREE.Mesh(
    new THREE.BoxGeometry(1.70, 0.52, 0.30, 12, 6, 6),
    sofaMaterials.current
  );
  sofaBackCenter.position.set(0, 0.60, -0.42);
  sofaBackCenter.castShadow = true;
  sofaRoot.add(sofaBackCenter);

  const sofaBackLeft = new THREE.Mesh(
    new THREE.BoxGeometry(1.34, 0.52, 0.30, 10, 6, 6),
    sofaMaterials.current
  );
  sofaBackLeft.position.set(-1.36, 0.60, -0.22);
  sofaBackLeft.rotation.y = 0.26;
  sofaBackLeft.castShadow = true;
  sofaRoot.add(sofaBackLeft);

  const sofaBackRight = new THREE.Mesh(
    new THREE.BoxGeometry(1.34, 0.52, 0.30, 10, 6, 6),
    sofaMaterials.current
  );
  sofaBackRight.position.set(1.36, 0.60, -0.22);
  sofaBackRight.rotation.y = -0.26;
  sofaBackRight.castShadow = true;
  sofaRoot.add(sofaBackRight);

  // Outer Arm Returns
  const sofaArmLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.30, 0.44, 0.88, 6, 6, 8),
    sofaMaterials.current
  );
  sofaArmLeft.position.set(-2.02, 0.52, 0.34);
  sofaArmLeft.rotation.y = 0.26;
  sofaArmLeft.castShadow = true;
  sofaRoot.add(sofaArmLeft);

  const sofaArmRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.30, 0.44, 0.88, 6, 6, 8),
    sofaMaterials.current
  );
  sofaArmRight.position.set(2.02, 0.52, 0.34);
  sofaArmRight.rotation.y = -0.26;
  sofaArmRight.castShadow = true;
  sofaRoot.add(sofaArmRight);

  // Artfully Styled Designer Pillows & Draped Cashmere Throw
  const cushionsGroup = new THREE.Group();

  // Cylindrical Bolster in Cognac Saddle Leather
  const bolsterGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.46, 24);
  const bolster = new THREE.Mesh(bolsterGeo, createFurnitureMaterial('leather'));
  bolster.rotation.z = Math.PI / 2;
  bolster.rotation.y = 0.26;
  bolster.position.set(-1.20, 0.50, -0.14);
  bolster.castShadow = true;
  cushionsGroup.add(bolster);

  // Tailored Bouclé Accent Pillow (Ivory, resting naturally against backrest)
  const pillowA = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.38, 0.14), boucleMat);
  pillowA.position.set(-0.62, 0.48, -0.22);
  pillowA.rotation.set(0.18, 0.14, -0.05);
  pillowA.castShadow = true;
  cushionsGroup.add(pillowA);

  // Soft Camel Velvet Accent Pillow (Resting naturally against backrest)
  const pillowB = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.36, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x9c7953, roughness: 0.85 })
  );
  pillowB.position.set(0.72, 0.48, -0.22);
  pillowB.rotation.set(0.18, -0.16, 0.05);
  pillowB.castShadow = true;
  cushionsGroup.add(pillowB);

  // Draped Cashmere Throw Blanket cascading naturally
  const throwMat = new THREE.MeshStandardMaterial({
    color: 0xa49888,
    roughness: 0.94,
  });
  const throwBlanket = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.038, 0.74),
    throwMat
  );
  throwBlanket.position.set(1.42, 0.44, 0.18);
  throwBlanket.rotation.y = -0.26;
  throwBlanket.castShadow = true;
  cushionsGroup.add(throwBlanket);

  sofaRoot.add(cushionsGroup);

  // Recessed Smoked Walnut Plinth Base
  const sofaPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.75, 0.08, 0.96), walnutMat);
  sofaPlinth.position.set(0, 0.04, 0);
  sofaPlinth.castShadow = true;
  sofaRoot.add(sofaPlinth);

  const sofaMeshes = [
    sofaCenterCushion,
    sofaLeftWing,
    sofaRightWing,
    sofaBackCenter,
    sofaBackLeft,
    sofaBackRight,
    sofaArmLeft,
    sofaArmRight,
  ];

  interactiveFurniture.sofa = {
    id: 'sofa',
    name: 'BESPOKE SCULPTURAL BOUCLÉ MODULAR SECTIONAL',
    shortName: 'BOUCLÉ SOFA',
    type: 'sofa',
    group: sofaRoot,
    hotspotPos: [0, 0.75, -0.65],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['boucle', 'linen', 'leather', 'smoked_walnut'],
    defaultMaterial: 'boucle',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      sofaMeshes.forEach((m) => {
        m.material = newMat;
      });
    },
    setExplode: (progress) => {
      sofaCenterCushion.position.y = 0.24 + progress * 0.45;
      sofaLeftWing.position.x = -1.38 - progress * 0.55;
      sofaLeftWing.position.y = 0.24 + progress * 0.45;
      sofaRightWing.position.x = 1.38 + progress * 0.55;
      sofaRightWing.position.y = 0.24 + progress * 0.45;

      sofaBackCenter.position.z = -0.42 - progress * 0.60;
      sofaBackCenter.position.y = 0.60 + progress * 0.35;
      sofaBackLeft.position.z = -0.22 - progress * 0.50;
      sofaBackLeft.position.x = -1.36 - progress * 0.40;
      sofaBackRight.position.z = -0.22 - progress * 0.50;
      sofaBackRight.position.x = 1.36 + progress * 0.40;

      sofaArmLeft.position.x = -2.02 - progress * 0.45;
      sofaArmRight.position.x = 2.02 + progress * 0.45;

      cushionsGroup.position.y = progress * 0.75;
      sofaPlinth.position.y = 0.04 - progress * 0.15;
    },
    reset: () => {
      sofaRoot.rotation.y = 0;
      sofaCenterCushion.position.set(0, 0.24, 0);
      sofaLeftWing.position.set(-1.38, 0.24, 0.20);
      sofaRightWing.position.set(1.38, 0.24, 0.20);
      sofaBackCenter.position.set(0, 0.60, -0.42);
      sofaBackLeft.position.set(-1.36, 0.60, -0.22);
      sofaBackRight.position.set(1.36, 0.60, -0.22);
      sofaArmLeft.position.set(-2.02, 0.52, 0.34);
      sofaArmRight.position.set(2.02, 0.52, 0.34);
      cushionsGroup.position.y = 0;
      sofaPlinth.position.set(0, 0.04, 0);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT B: DUAL-TIER NESTING TRAVERTINE & BRONZE COCKTAIL TABLE SET
  // --------------------------------------------------------------------------
  const tableRoot = new THREE.Group();
  tableRoot.name = 'Interactive_CoffeeTable';
  tableRoot.position.set(0, 0, 0.55);

  // 1. Primary Low Monolithic Honed Travertine Slab
  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.68, 0.07, 0.84),
    travertineMat
  );
  tableTop.position.set(0, 0.31, 0);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  tableRoot.add(tableTop);

  // Two Sculptural Fluted Elliptical Travertine Plinth Bases
  const tableBaseColL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.28, 32),
    travertineMat
  );
  tableBaseColL.position.set(-0.48, 0.14, 0);
  tableBaseColL.castShadow = true;
  tableRoot.add(tableBaseColL);

  const tableBaseColR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.28, 32),
    travertineMat
  );
  tableBaseColR.position.set(0.48, 0.14, 0);
  tableBaseColR.castShadow = true;
  tableRoot.add(tableBaseColR);

  // Inset Brushed Brass Leveling Base Rings
  const baseRingL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.285, 0.285, 0.02, 32),
    brassMat
  );
  baseRingL.position.set(-0.48, 0.01, 0);
  tableRoot.add(baseRingL);

  const baseRingR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.285, 0.285, 0.02, 32),
    brassMat
  );
  baseRingR.position.set(0.48, 0.01, 0);
  tableRoot.add(baseRingR);

  // 2. Secondary Cantilever Satellite Cocktail Table (Brushed Bronze & Smoked Walnut)
  const satTableGroup = new THREE.Group();
  satTableGroup.position.set(0.56, 0, 0.36);

  const satTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.035, 32),
    brassMat
  );
  satTop.position.y = 0.42;
  satTop.castShadow = true;
  satTableGroup.add(satTop);

  const satStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.39, 16),
    brassMat
  );
  satStem.position.y = 0.205;
  satStem.castShadow = true;
  satTableGroup.add(satStem);

  const satBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.02, 24),
    brassMat
  );
  satBase.position.y = 0.01;
  satTableGroup.add(satBase);

  tableRoot.add(satTableGroup);

  // 3. Curated High-End Tabletop Objects
  const tableDecor = new THREE.Group();
  tableDecor.position.set(0, 0.345, 0);

  // Architectural Monograph Hardcover Art Books
  const book1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.032, 0.24),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.35 })
  );
  book1.position.set(-0.24, 0.016, 0.05);
  book1.rotation.y = 0.06;
  book1.castShadow = true;
  tableDecor.add(book1);

  const book2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.028, 0.22),
    new THREE.MeshStandardMaterial({ color: 0xdfd8cc, roughness: 0.75 })
  );
  book2.position.set(-0.24, 0.046, 0.05);
  book2.rotation.y = 0.16;
  book2.castShadow = true;
  tableDecor.add(book2);

  // Hand-Thrown Wabi-Sabi Ceramic Vase with Delicate Branch
  const ceramicVase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.11, 0.22, 24),
    new THREE.MeshStandardMaterial({ color: 0xeee8dc, roughness: 0.85 })
  );
  ceramicVase.position.set(0.12, 0.11, -0.06);
  ceramicVase.castShadow = true;
  tableDecor.add(ceramicVase);

  const twigStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.008, 0.44, 8),
    walnutMat
  );
  twigStem.position.set(0.12, 0.32, -0.06);
  twigStem.rotation.z = -0.16;
  twigStem.rotation.x = 0.08;
  twigStem.castShadow = true;
  tableDecor.add(twigStem);

  // Carved Organic Marble Catchall Dish with Brass Sphere
  const marbleDish = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.07, 0.035, 24),
    calacattaMat
  );
  marbleDish.position.set(0.26, 0.018, 0.10);
  marbleDish.castShadow = true;
  tableDecor.add(marbleDish);

  const brassSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.024, 16, 16),
    brassMat
  );
  brassSphere.position.set(0.26, 0.042, 0.10);
  tableDecor.add(brassSphere);

  tableRoot.add(tableDecor);

  const tableMeshes = [tableTop, tableBaseColL, tableBaseColR];

  interactiveFurniture.table = {
    id: 'table',
    name: 'DUAL-TIER NESTING TRAVERTINE & BRONZE COCKTAIL TABLE',
    shortName: 'COFFEE TABLE',
    type: 'table',
    group: tableRoot,
    hotspotPos: [0, 0.45, 0.55],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['travertine', 'calacatta', 'natural_oak', 'smoked_walnut'],
    defaultMaterial: 'travertine',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      tableMeshes.forEach((m) => {
        m.material = newMat;
      });
    },
    setExplode: (progress) => {
      tableTop.position.y = 0.31 + progress * 0.55;
      tableBaseColL.position.x = -0.48 - progress * 0.40;
      tableBaseColR.position.x = 0.48 + progress * 0.40;
      satTableGroup.position.x = 0.56 + progress * 0.45;
      satTableGroup.position.z = 0.36 + progress * 0.25;
      tableDecor.position.y = 0.345 + progress * 0.85;
    },
    reset: () => {
      tableRoot.rotation.y = 0;
      tableTop.position.set(0, 0.31, 0);
      tableBaseColL.position.set(-0.48, 0.14, 0);
      tableBaseColR.position.set(0.48, 0.14, 0);
      satTableGroup.position.set(0.56, 0, 0.36);
      tableDecor.position.set(0, 0.345, 0);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT C: FLUTED OAK CREDENZA / CABINET WITH REAL HINGE DOORS & SLIDING DRAWERS
  // --------------------------------------------------------------------------
  const cabinetRoot = new THREE.Group();
  cabinetRoot.name = 'Interactive_Cabinet';
  cabinetRoot.position.set(0, 0, -4.8);

  const cedarMat = new THREE.MeshStandardMaterial({
    color: 0xb58a63,
    roughness: 0.75,
    metalness: 0.02,
  });

  // 1. Top Panel (Travertine / Stone Slab)
  const cabinetTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.05, 0.48),
    travertineMat
  );
  cabinetTop.position.set(0, 0.68, 0);
  cabinetTop.castShadow = true;
  cabinetTop.receiveShadow = true;
  cabinetTop.userData = { componentId: 'top_panel', componentName: 'ARCHITECTURAL TOP SLAB' };
  cabinetRoot.add(cabinetTop);

  // 2. Main Carcass Structure (Hollow Interior with Divisions)
  const carcassGroup = new THREE.Group();
  carcassGroup.name = 'Credenza_Carcass';
  carcassGroup.position.set(0, 0, 0);

  // Bottom Plinth
  const basePlinth = new THREE.Mesh(
    new THREE.BoxGeometry(3.02, 0.06, 0.42),
    walnutMat
  );
  basePlinth.position.set(0, 0.03, 0);
  basePlinth.castShadow = true;
  basePlinth.userData = { componentId: 'plinth', componentName: 'RECESSED BASE PLINTH' };
  carcassGroup.add(basePlinth);

  // Bottom base panel
  const bottomPanel = new THREE.Mesh(
    new THREE.BoxGeometry(3.16, 0.035, 0.46),
    walnutMat
  );
  bottomPanel.position.set(0, 0.075, 0);
  bottomPanel.castShadow = true;
  bottomPanel.userData = { componentId: 'carcass', componentName: 'CABINET BOTTOM PANEL' };
  carcassGroup.add(bottomPanel);

  // Back panel
  const backPanel = new THREE.Mesh(
    new THREE.BoxGeometry(3.14, 0.56, 0.02),
    walnutMat
  );
  backPanel.position.set(0, 0.37, -0.22);
  backPanel.castShadow = true;
  backPanel.userData = { componentId: 'back_panel', componentName: 'REAR ENCLOSURE PANEL' };
  carcassGroup.add(backPanel);

  // Left End Panel
  const leftSidePanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 0.56, 0.46),
    walnutMat
  );
  leftSidePanel.position.set(-1.56, 0.37, 0);
  leftSidePanel.castShadow = true;
  leftSidePanel.userData = { componentId: 'side_left', componentName: 'LEFT RETURN PANEL' };
  carcassGroup.add(leftSidePanel);

  // Right End Panel
  const rightSidePanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 0.56, 0.46),
    walnutMat
  );
  rightSidePanel.position.set(1.56, 0.37, 0);
  rightSidePanel.castShadow = true;
  rightSidePanel.userData = { componentId: 'side_right', componentName: 'RIGHT RETURN PANEL' };
  carcassGroup.add(rightSidePanel);

  // Left Vertical Interior Divider
  const leftDivider = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 0.56, 0.44),
    walnutMat
  );
  leftDivider.position.set(-0.76, 0.37, 0);
  leftDivider.castShadow = true;
  carcassGroup.add(leftDivider);

  // Right Vertical Interior Divider
  const rightDivider = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 0.56, 0.44),
    walnutMat
  );
  rightDivider.position.set(0.76, 0.37, 0);
  rightDivider.castShadow = true;
  carcassGroup.add(rightDivider);

  // Center Horizontal Drawer Divider
  const centerShelfDivider = new THREE.Mesh(
    new THREE.BoxGeometry(1.50, 0.025, 0.44),
    walnutMat
  );
  centerShelfDivider.position.set(0, 0.36, 0);
  centerShelfDivider.castShadow = true;
  carcassGroup.add(centerShelfDivider);

  // Left Interior Adjustable Shelf with Brass Support Pins
  const shelfLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.025, 0.42),
    walnutMat
  );
  shelfLeft.position.set(-1.16, 0.37, 0);
  shelfLeft.castShadow = true;
  shelfLeft.userData = { componentId: 'shelf_left', componentName: 'INTERIOR OAK SHELF (LEFT)' };
  carcassGroup.add(shelfLeft);

  // Right Interior Adjustable Shelf
  const shelfRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.025, 0.42),
    walnutMat
  );
  shelfRight.position.set(1.16, 0.37, 0);
  shelfRight.castShadow = true;
  shelfRight.userData = { componentId: 'shelf_right', componentName: 'INTERIOR OAK SHELF (RIGHT)' };
  carcassGroup.add(shelfRight);

  cabinetRoot.add(carcassGroup);

  // 3. Left Door with Physical Hinge Pivot & Brass Knurled Pull
  const leftDoorPivot = new THREE.Group();
  leftDoorPivot.position.set(-1.54, 0.37, 0.23);

  const leftDoorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.55, 0.026),
    walnutMat
  );
  leftDoorMesh.position.set(0.375, 0, 0);
  leftDoorMesh.castShadow = true;
  leftDoorMesh.userData = { componentId: 'door_left', componentName: 'LEFT FLUTED PIVOT DOOR' };
  leftDoorPivot.add(leftDoorMesh);

  // Left Door Vertical Fluting Strips
  for (let fx = 0.04; fx <= 0.72; fx += 0.05) {
    const flute = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.54, 0.008),
      walnutMat
    );
    flute.position.set(fx, 0, 0.017);
    leftDoorPivot.add(flute);
  }

  // Left Door Handle (Vertical Brushed Brass Knurled Pull)
  const leftHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.007, 0.007, 0.24, 16),
    brassMat
  );
  leftHandle.position.set(0.71, 0, 0.03);
  leftHandle.castShadow = true;
  leftHandle.userData = { componentId: 'handle_left', componentName: 'BRASS KNURLED HANDLE' };
  leftDoorPivot.add(leftHandle);

  // Brass Hinge Knuckles at pivot
  [-0.22, 0.22].forEach((hy) => {
    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 0.04, 16),
      brassMat
    );
    hinge.position.set(0, hy, 0);
    leftDoorPivot.add(hinge);
  });

  cabinetRoot.add(leftDoorPivot);

  // 4. Right Door with Physical Hinge Pivot & Brass Knurled Pull
  const rightDoorPivot = new THREE.Group();
  rightDoorPivot.position.set(1.54, 0.37, 0.23);

  const rightDoorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.55, 0.026),
    walnutMat
  );
  rightDoorMesh.position.set(-0.375, 0, 0);
  rightDoorMesh.castShadow = true;
  rightDoorMesh.userData = { componentId: 'door_right', componentName: 'RIGHT FLUTED PIVOT DOOR' };
  rightDoorPivot.add(rightDoorMesh);

  // Right Door Vertical Fluting Strips
  for (let fx = -0.72; fx <= -0.04; fx += 0.05) {
    const flute = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.54, 0.008),
      walnutMat
    );
    flute.position.set(fx, 0, 0.017);
    rightDoorPivot.add(flute);
  }

  // Right Door Handle
  const rightHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.007, 0.007, 0.24, 16),
    brassMat
  );
  rightHandle.position.set(-0.71, 0, 0.03);
  rightHandle.castShadow = true;
  rightHandle.userData = { componentId: 'handle_right', componentName: 'BRASS KNURLED HANDLE' };
  rightDoorPivot.add(rightHandle);

  // Brass Hinge Knuckles at pivot
  [-0.22, 0.22].forEach((hy) => {
    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 0.04, 16),
      brassMat
    );
    hinge.position.set(0, hy, 0);
    rightDoorPivot.add(hinge);
  });

  cabinetRoot.add(rightDoorPivot);

  // 5. Center Upper Sliding Drawer (With real interior box & edge pull)
  const drawerUpperSlider = new THREE.Group();
  drawerUpperSlider.position.set(0, 0.49, 0);

  const drawerUpperFront = new THREE.Mesh(
    new THREE.BoxGeometry(1.49, 0.25, 0.025),
    walnutMat
  );
  drawerUpperFront.position.set(0, 0, 0.23);
  drawerUpperFront.castShadow = true;
  drawerUpperFront.userData = { componentId: 'drawer_upper', componentName: 'UPPER CUTLERY DRAWER' };
  drawerUpperSlider.add(drawerUpperFront);

  // Upper Drawer Interior Box (Cedar lining)
  const drawerUpperBottom = new THREE.Mesh(
    new THREE.BoxGeometry(1.44, 0.014, 0.40),
    cedarMat
  );
  drawerUpperBottom.position.set(0, -0.10, 0.02);
  drawerUpperBottom.receiveShadow = true;
  drawerUpperSlider.add(drawerUpperBottom);

  const drawerUpperBack = new THREE.Mesh(
    new THREE.BoxGeometry(1.44, 0.19, 0.014),
    cedarMat
  );
  drawerUpperBack.position.set(0, 0, -0.18);
  drawerUpperSlider.add(drawerUpperBack);

  [[-0.71, 0.02], [0.71, 0.02]].forEach(([sx, sz]) => {
    const side = new THREE.Mesh(
      new THREE.BoxGeometry(0.014, 0.19, 0.40),
      cedarMat
    );
    side.position.set(sx, 0, sz);
    drawerUpperSlider.add(side);
  });

  // Brass Lip Pull
  const upperPull = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.012, 0.022),
    brassMat
  );
  upperPull.position.set(0, 0.12, 0.245);
  drawerUpperSlider.add(upperPull);

  cabinetRoot.add(drawerUpperSlider);

  // 6. Center Lower Sliding Drawer
  const drawerLowerSlider = new THREE.Group();
  drawerLowerSlider.position.set(0, 0.23, 0);

  const drawerLowerFront = new THREE.Mesh(
    new THREE.BoxGeometry(1.49, 0.25, 0.025),
    walnutMat
  );
  drawerLowerFront.position.set(0, 0, 0.23);
  drawerLowerFront.castShadow = true;
  drawerLowerFront.userData = { componentId: 'drawer_lower', componentName: 'LOWER LINEN DRAWER' };
  drawerLowerSlider.add(drawerLowerFront);

  const drawerLowerBottom = new THREE.Mesh(
    new THREE.BoxGeometry(1.44, 0.014, 0.40),
    cedarMat
  );
  drawerLowerBottom.position.set(0, -0.10, 0.02);
  drawerLowerBottom.receiveShadow = true;
  drawerLowerSlider.add(drawerLowerBottom);

  const drawerLowerBack = new THREE.Mesh(
    new THREE.BoxGeometry(1.44, 0.19, 0.014),
    cedarMat
  );
  drawerLowerBack.position.set(0, 0, -0.18);
  drawerLowerSlider.add(drawerLowerBack);

  [[-0.71, 0.02], [0.71, 0.02]].forEach(([sx, sz]) => {
    const side = new THREE.Mesh(
      new THREE.BoxGeometry(0.014, 0.19, 0.40),
      cedarMat
    );
    side.position.set(sx, 0, sz);
    drawerLowerSlider.add(side);
  });

  const lowerPull = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.012, 0.022),
    brassMat
  );
  lowerPull.position.set(0, 0.12, 0.245);
  drawerLowerSlider.add(lowerPull);

  cabinetRoot.add(drawerLowerSlider);

  // Collection of meshes that adopt new timber materials on selection
  const cabinetTimberMeshes = [
    basePlinth,
    bottomPanel,
    backPanel,
    leftSidePanel,
    rightSidePanel,
    leftDivider,
    rightDivider,
    centerShelfDivider,
    shelfLeft,
    shelfRight,
    leftDoorMesh,
    rightDoorMesh,
    drawerUpperFront,
    drawerLowerFront,
  ];

  interactiveFurniture.cabinet = {
    id: 'cabinet',
    name: 'ARCHITECTURAL FLUTED CREDENZA',
    shortName: 'CREDENZA',
    type: 'cabinet',
    group: cabinetRoot,
    hotspotPos: [0, 0.72, -4.8],
    features: { canRotate: true, canExplode: true, hasDoors: true, hasDrawers: true },
    materialsSupported: [
      'natural_oak',
      'walnut',
      'dark_walnut',
      'warm_beige',
      'charcoal',
      'matte_black',
      'ivory',
      'travertine',
    ],
    defaultMaterial: 'walnut',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      cabinetTimberMeshes.forEach((m) => {
        m.material = newMat;
      });
      if (matKey === 'travertine' || matKey === 'calacatta') {
        cabinetTop.material = createFurnitureMaterial(matKey);
      }
    },
    setDoorOpen: (progress) => {
      // Hinge rotation swings outward -100° and +100°
      leftDoorPivot.rotation.y = -Math.PI * 0.58 * progress;
      rightDoorPivot.rotation.y = Math.PI * 0.58 * progress;
    },
    setDrawerOpen: (progress) => {
      // Drawers slide smoothly forward along local Z axis
      drawerUpperSlider.position.z = 0.38 * progress;
      drawerLowerSlider.position.z = 0.30 * progress;
    },
    setExplode: (progress) => {
      // Controlled 0.15 - 0.40m separation within viewport bounds
      cabinetTop.position.y = 0.68 + progress * 0.38;
      leftSidePanel.position.x = -1.56 - progress * 0.28;
      rightSidePanel.position.x = 1.56 + progress * 0.28;
      leftDoorPivot.position.x = -1.54 - progress * 0.32;
      leftDoorPivot.position.z = 0.23 + progress * 0.20;
      rightDoorPivot.position.x = 1.54 + progress * 0.32;
      rightDoorPivot.position.z = 0.23 + progress * 0.20;
      drawerUpperSlider.position.z = progress * 0.38;
      drawerLowerSlider.position.z = progress * 0.28;
      shelfLeft.position.y = 0.37 + progress * 0.16;
      shelfRight.position.y = 0.37 + progress * 0.16;
      backPanel.position.z = -0.22 - progress * 0.22;
      basePlinth.position.y = 0.03 - progress * 0.12;
    },
    reset: () => {
      cabinetRoot.rotation.y = 0;
      leftDoorPivot.rotation.y = 0;
      rightDoorPivot.rotation.y = 0;
      leftDoorPivot.position.set(-1.54, 0.37, 0.23);
      rightDoorPivot.position.set(1.54, 0.37, 0.23);
      drawerUpperSlider.position.set(0, 0.49, 0);
      drawerLowerSlider.position.set(0, 0.23, 0);
      cabinetTop.position.set(0, 0.68, 0);
      leftSidePanel.position.set(-1.56, 0.37, 0);
      rightSidePanel.position.set(1.56, 0.37, 0);
      shelfLeft.position.set(-1.16, 0.37, 0);
      shelfRight.position.set(1.16, 0.37, 0);
      backPanel.position.set(0, 0.37, -0.22);
      basePlinth.position.set(0, 0.03, 0);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT D: FLUTED TRAVERTINE SIDE TABLE WITH CARAFE & GLASSES (Left side)
  // --------------------------------------------------------------------------
  const sideTableRoot = new THREE.Group();
  sideTableRoot.name = 'Interactive_SideTable';
  sideTableRoot.position.set(-2.0, 0, 0.45);

  const sideTableCol = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.52, 28),
    travertineMat
  );
  sideTableCol.position.set(0, 0.26, 0);
  sideTableCol.castShadow = true;
  sideTableRoot.add(sideTableCol);

  const sideTableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.04, 32),
    travertineMat
  );
  sideTableTop.position.set(0, 0.54, 0);
  sideTableTop.castShadow = true;
  sideTableRoot.add(sideTableTop);

  // Glass decanter and glasses
  const carafeMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.07, 0.18, 16),
    createGlassMaterial(0.4)
  );
  carafeMesh.position.set(0, 0.65, 0);
  sideTableRoot.add(carafeMesh);

  interactiveFurniture.sidetable = {
    id: 'sidetable',
    name: 'FLUTED TRAVERTINE CYLINDER SIDE TABLE',
    shortName: 'SIDE TABLE',
    type: 'table',
    group: sideTableRoot,
    hotspotPos: [-2.0, 0.6, 0.45],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['travertine', 'calacatta', 'smoked_walnut'],
    defaultMaterial: 'travertine',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      sideTableCol.material = newMat;
      sideTableTop.material = newMat;
    },
    setExplode: (progress) => {
      sideTableTop.position.y = 0.54 + progress * 0.4;
      carafeMesh.position.y = 0.65 + progress * 0.6;
    },
    reset: () => {
      sideTableRoot.rotation.y = 0;
      sideTableTop.position.set(0, 0.54, 0);
      carafeMesh.position.set(0, 0.65, 0);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT E: SCULPTURAL WALNUT LOUNGE CHAIR (Left side, facing inward)
  // --------------------------------------------------------------------------
  const chairResult = createReferenceArmchair(boucleMat, walnutMat);
  const armchair = chairResult.group;
  armchair.position.set(-2.4, 0.32, 0.5);
  armchair.rotation.y = Math.PI * 0.38;
  armchair.scale.set(1.15, 1.15, 1.15);

  interactiveFurniture.chair = {
    id: 'chair',
    name: 'SCULPTURAL WALNUT & BOUCLÉ ARMCHAIR',
    shortName: 'ARMCHAIR',
    type: 'chair',
    group: armchair,
    hotspotPos: [-2.4, 0.75, 0.5],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['boucle', 'linen', 'leather', 'smoked_walnut'],
    defaultMaterial: 'boucle',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      armchair.traverse((child) => {
        if (child.isMesh && child.name && (child.name.includes('Cushion') || child.name.includes('Seat') || child.name.includes('Back'))) {
          child.material = newMat;
        }
      });
    },
    setExplode: (progress) => {
      armchair.children.forEach((child) => {
        if (child.name === 'Backrest' || child.position.z < -0.1) {
          child.position.z = -0.15 - progress * 0.4;
        } else if (child.name === 'Seat' || child.position.y < 0.4) {
          child.position.y = 0.08 + progress * 0.35;
        }
      });
    },
    reset: () => {
      armchair.rotation.y = Math.PI * 0.38;
    },
  };

  return {
    fixedGroup,
    furniture: interactiveFurniture,
    defaultSelectedId: 'sofa',
    cameraPos: new THREE.Vector3(0, 1.5, 4.5),
    cameraTarget: new THREE.Vector3(0, 0.65, 0),
    cameraBounds: { minDistance: 1.8, maxDistance: 6.8, minPolar: 0.2, maxPolar: 1.48 },
  };
}

// ============================================================================
// 02 — KITCHEN SCENE
// ============================================================================
export function buildKitchenScene() {
  const fixedGroup = new THREE.Group();
  fixedGroup.name = 'Kitchen_FixedArchitecture';

  const greenLacquerMat = createFurnitureMaterial('forest_lacquer');
  const smokedOakMat = createFurnitureMaterial('smoked_walnut');
  const calacattaMat = createFurnitureMaterial('calacatta');
  const brassMat = createBrassAccentMaterial();

  // 1. COMPLETE 3D ARCHITECTURAL ROOM ENVELOPE
  const shell = createArchitecturalRoomShell({
    roomType: 'kitchen',
    width: 12,
    depth: 11,
    height: 4.2,
    floorType: 'tile',
    backWallColor: 0xeae6dc,
  });
  fixedGroup.add(shell.group);

  // 3 Brushed Brass Disc Pendant Lights hanging above the island (matching reference)
  [-1.1, 0, 1.1].forEach((px) => {
    const pendant = new THREE.Group();
    pendant.position.set(px, 3.2, 0);
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 1.6, 8),
      brassMat
    );
    cord.position.y = 0.8;
    pendant.add(cord);
    const discShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.22, 0.04, 32),
      brassMat
    );
    discShade.position.y = 0;
    pendant.add(discShade);
    const bulbGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 16, 16),
      createEmissiveWarmGlowMaterial()
    );
    bulbGlow.position.y = -0.03;
    pendant.add(bulbGlow);
    fixedGroup.add(pendant);
  });

  // Runner rugs on floor
  const runner1 = createRug(2.8, 0.9, 0xb8aba0);
  runner1.position.set(0, 0.008, 1.4);
  fixedGroup.add(runner1);

  // 2. INTERACTIVE FURNITURE OBJECTS
  const interactiveFurniture = {};

  // --------------------------------------------------------------------------
  // OBJECT A: WATERFALL SMOKED OAK ISLAND WITH CALACATTA MARBLE & SINK
  // --------------------------------------------------------------------------
  const islandRoot = new THREE.Group();
  islandRoot.name = 'Interactive_Island';
  islandRoot.position.set(0, 0, 0);

  const islandTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.1, 1.25),
    calacattaMat
  );
  islandTop.position.set(0, 0.92, 0);
  islandTop.castShadow = true;
  islandTop.receiveShadow = true;
  islandRoot.add(islandTop);

  // Waterfall marble left return
  const waterfallLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.92, 1.25),
    calacattaMat
  );
  waterfallLeft.position.set(-1.56, 0.46, 0);
  waterfallLeft.castShadow = true;
  islandRoot.add(waterfallLeft);

  // Waterfall marble right return
  const waterfallRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.92, 1.25),
    calacattaMat
  );
  waterfallRight.position.set(1.56, 0.46, 0);
  waterfallRight.castShadow = true;
  islandRoot.add(waterfallRight);

  // Warm LED light strip running under the countertop overhang
  const islandUnderGlow = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.02, 0.04),
    createEmissiveWarmGlowMaterial()
  );
  islandUnderGlow.position.set(0, 0.86, 0.58);
  islandRoot.add(islandUnderGlow);

  // Island Smoked Oak Casing & Front Drawers
  const islandBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.04, 0.82, 0.9),
    smokedOakMat
  );
  islandBody.position.set(0, 0.43, -0.1);
  islandBody.castShadow = true;
  islandRoot.add(islandBody);

  // Sliding Island Drawers
  const islandDrawerSlider = new THREE.Group();
  islandDrawerSlider.position.set(0, 0.52, 0.36);
  const islandDrawerFront = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.32, 0.03),
    smokedOakMat
  );
  islandDrawerSlider.add(islandDrawerFront);
  islandRoot.add(islandDrawerSlider);

  // Undermount Sink & Gooseneck Faucet
  const sinkBasin = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.22, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.85, roughness: 0.25 })
  );
  sinkBasin.position.set(0.65, 0.88, 0);
  islandRoot.add(sinkBasin);

  const faucetStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.35, 16),
    brassMat
  );
  faucetStem.position.set(0.65, 1.15, -0.18);
  islandRoot.add(faucetStem);

  // Island Tabletop Decor: Cookbook on Stand, Pitcher & Bowl, Basil plant
  const islandDecor = new THREE.Group();
  islandDecor.position.set(0, 0.97, 0);

  const bookStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.2, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.9 })
  );
  bookStand.position.set(0.1, 0.08, 0.22);
  bookStand.rotation.x = -0.35;
  islandDecor.add(bookStand);

  const pitcher = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.09, 0.22, 16),
    new THREE.MeshStandardMaterial({ color: 0xd8cebf, roughness: 0.85 })
  );
  pitcher.position.set(-0.55, 0.11, 0.15);
  islandDecor.add(pitcher);

  const herbPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.06, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0x3d4f3b, roughness: 0.8 })
  );
  herbPot.position.set(-0.35, 0.06, -0.05);
  islandDecor.add(herbPot);

  islandRoot.add(islandDecor);

  const islandMeshes = [islandTop, waterfallLeft, waterfallRight];

  interactiveFurniture.island = {
    id: 'island',
    name: 'WATERFALL SMOKED OAK ISLAND & CALACATTA MARBLE',
    shortName: 'KITCHEN ISLAND',
    type: 'cabinet',
    group: islandRoot,
    hotspotPos: [0, 1.0, 0],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: true },
    materialsSupported: ['calacatta', 'travertine', 'smoked_walnut', 'natural_oak'],
    defaultMaterial: 'calacatta',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      islandMeshes.forEach((m) => {
        m.material = newMat;
      });
    },
    setDrawerOpen: (progress) => {
      islandDrawerSlider.position.z = 0.36 + 0.38 * progress;
    },
    setExplode: (progress) => {
      islandTop.position.y = 0.92 + progress * 0.55;
      waterfallLeft.position.x = -1.56 - progress * 0.45;
      waterfallRight.position.x = 1.56 + progress * 0.45;
      islandDrawerSlider.position.z = 0.36 + progress * 0.4;
      islandDecor.position.y = 0.97 + progress * 0.8;
    },
    reset: () => {
      islandRoot.rotation.y = 0;
      islandTop.position.set(0, 0.92, 0);
      waterfallLeft.position.set(-1.56, 0.46, 0);
      waterfallRight.position.set(1.56, 0.46, 0);
      islandDrawerSlider.position.set(0, 0.52, 0.36);
      islandDecor.position.set(0, 0.97, 0);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT B: MODULAR BASE & WALL JOINERY WITH REAL HINGE DOORS & DRAWERS
  // --------------------------------------------------------------------------
  const baseCabinetRoot = new THREE.Group();
  baseCabinetRoot.name = 'Interactive_BaseCabinet';
  baseCabinetRoot.position.set(-1.8, 0, -4.6);

  const baseCounterTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.08, 0.68),
    calacattaMat
  );
  baseCounterTop.position.set(0, 0.91, 0);
  baseCabinetRoot.add(baseCounterTop);

  // Under-cabinet LED strip lighting illuminating the backsplash
  const backsplashGlow = new THREE.Mesh(
    new THREE.BoxGeometry(3.38, 0.02, 0.04),
    createEmissiveWarmGlowMaterial()
  );
  backsplashGlow.position.set(0, 1.82, -0.28);
  baseCabinetRoot.add(backsplashGlow);

  const baseCarcass = new THREE.Mesh(
    new THREE.BoxGeometry(3.36, 0.88, 0.65),
    greenLacquerMat
  );
  baseCarcass.position.set(0, 0.44, 0);
  baseCabinetRoot.add(baseCarcass);

  // Real Hinge Door on Base Cabinet
  const baseDoorPivot = new THREE.Group();
  baseDoorPivot.position.set(-1.64, 0.44, 0.34);
  const baseDoorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.84, 0.025),
    greenLacquerMat
  );
  baseDoorMesh.position.set(0.39, 0, 0);
  baseDoorPivot.add(baseDoorMesh);
  baseCabinetRoot.add(baseDoorPivot);

  // Sliding Drawer
  const baseDrawerSlider = new THREE.Group();
  baseDrawerSlider.position.set(0.8, 0.66, 0);
  const baseDrawerFront = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.3, 0.025),
    greenLacquerMat
  );
  baseDrawerFront.position.set(0, 0, 0.34);
  baseDrawerSlider.add(baseDrawerFront);
  baseCabinetRoot.add(baseDrawerSlider);

  interactiveFurniture.cabinet = {
    id: 'cabinet',
    name: 'MATTE GREEN MODULAR BASE CABINETS',
    shortName: 'BASE CABINET',
    type: 'cabinet',
    group: baseCabinetRoot,
    hotspotPos: [-1.8, 0.95, -4.6],
    features: { canRotate: false, canExplode: false, hasDoors: true, hasDrawers: true },
    materialsSupported: ['forest_lacquer', 'smoked_walnut', 'natural_oak'],
    defaultMaterial: 'forest_lacquer',
    setDoorOpen: (progress) => {
      baseDoorPivot.rotation.y = -Math.PI * 0.55 * progress;
    },
    setDrawerOpen: (progress) => {
      baseDrawerSlider.position.z = 0.36 * progress;
    },
    reset: () => {
      baseDoorPivot.rotation.y = 0;
      baseDrawerSlider.position.z = 0;
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT C: TALL PANTRY JOINERY WITH ILLUMINATED INTERIOR SHELVES
  // --------------------------------------------------------------------------
  const pantryRoot = new THREE.Group();
  pantryRoot.name = 'Interactive_TallPantry';
  pantryRoot.position.set(1.4, 0, -4.6);

  const pantryCarcass = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2.8, 0.68),
    greenLacquerMat
  );
  pantryCarcass.position.set(0, 1.4, 0);
  pantryRoot.add(pantryCarcass);

  // Interior oak illuminated shelves
  for (let y = 0.6; y <= 2.2; y += 0.45) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.024, 0.6), smokedOakMat);
    shelf.position.set(0, y, 0);
    pantryRoot.add(shelf);
  }

  // Full-Height Pantry Door with Hinge Pivot
  const pantryDoorPivot = new THREE.Group();
  pantryDoorPivot.position.set(-0.78, 1.4, 0.35);
  const pantryDoorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 2.76, 0.025),
    greenLacquerMat
  );
  pantryDoorMesh.position.set(0.39, 0, 0);
  pantryDoorPivot.add(pantryDoorMesh);
  pantryRoot.add(pantryDoorPivot);

  interactiveFurniture.pantry = {
    id: 'pantry',
    name: 'FULL-HEIGHT JOINERY PANTRY WITH ILLUMINATED SHELVES',
    shortName: 'PANTRY',
    type: 'cupboard',
    group: pantryRoot,
    hotspotPos: [1.4, 1.8, -4.6],
    features: { canRotate: false, canExplode: false, hasDoors: true, hasDrawers: false },
    materialsSupported: ['forest_lacquer', 'smoked_walnut'],
    defaultMaterial: 'forest_lacquer',
    setDoorOpen: (progress) => {
      pantryDoorPivot.rotation.y = -Math.PI * 0.55 * progress;
    },
    reset: () => {
      pantryDoorPivot.rotation.y = 0;
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT D: BUILT-IN WALL OVEN (OPENS DOWNWARD ON BOTTOM HINGE!)
  // --------------------------------------------------------------------------
  const ovenRoot = new THREE.Group();
  ovenRoot.name = 'Interactive_Oven';
  ovenRoot.position.set(0.1, 0, -4.6);

  const ovenFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.85, roughness: 0.2 })
  );
  ovenFrame.position.set(0, 1.4, 0);
  ovenRoot.add(ovenFrame);

  // Oven Door with bottom hinge pivot: rotates downwards!
  const ovenDoorPivot = new THREE.Group();
  ovenDoorPivot.position.set(0, 1.05, 0.31);
  const ovenGlassDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.66, 0.66, 0.03),
    new THREE.MeshPhysicalMaterial({ color: 0x111111, transmission: 0.6, roughness: 0.1 })
  );
  ovenGlassDoor.position.set(0, 0.33, 0);
  ovenDoorPivot.add(ovenGlassDoor);
  ovenRoot.add(ovenDoorPivot);

  interactiveFurniture.appliances = {
    id: 'appliances',
    name: 'BUILT-IN BLACK GLASS CONVECTION OVEN',
    shortName: 'OVEN',
    type: 'cabinet',
    group: ovenRoot,
    hotspotPos: [0.1, 1.4, -4.6],
    features: { canRotate: false, canExplode: false, hasDoors: true, hasDrawers: false },
    materialsSupported: ['matte_black', 'forest_lacquer'],
    defaultMaterial: 'matte_black',
    setDoorOpen: (progress) => {
      ovenDoorPivot.rotation.x = -Math.PI * 0.48 * progress; // Physical downward swing!
    },
    reset: () => {
      ovenDoorPivot.rotation.x = 0;
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT E: INTEGRATED REFRIGERATOR (DUAL FRENCH HINGE DOORS)
  // --------------------------------------------------------------------------
  const fridgeRoot = new THREE.Group();
  fridgeRoot.name = 'Interactive_Refrigerator';
  fridgeRoot.position.set(2.8, 0, -4.6);

  const fridgeCarcass = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x1e1e1e, metalness: 0.75, roughness: 0.25 })
  );
  fridgeCarcass.position.set(0, 1.35, 0);
  fridgeRoot.add(fridgeCarcass);

  // Interior illuminated glass shelves
  for (let y = 0.5; y <= 2.1; y += 0.42) {
    const fShelf = new THREE.Mesh(
      new THREE.BoxGeometry(1.08, 0.016, 0.56),
      new THREE.MeshStandardMaterial({ color: 0xddeeff, roughness: 0.1 })
    );
    fShelf.position.set(0, y, 0);
    fridgeRoot.add(fShelf);
  }

  // Left French Door (Hinged on left edge)
  const fridgeDoorLPivot = new THREE.Group();
  fridgeDoorLPivot.position.set(-0.58, 1.35, 0.36);
  const fridgeDoorLMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.57, 2.66, 0.03),
    greenLacquerMat
  );
  fridgeDoorLMesh.position.set(0.285, 0, 0);
  fridgeDoorLPivot.add(fridgeDoorLMesh);
  fridgeRoot.add(fridgeDoorLPivot);

  // Right French Door (Hinged on right edge)
  const fridgeDoorRPivot = new THREE.Group();
  fridgeDoorRPivot.position.set(0.58, 1.35, 0.36);
  const fridgeDoorRMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.57, 2.66, 0.03),
    greenLacquerMat
  );
  fridgeDoorRMesh.position.set(-0.285, 0, 0);
  fridgeDoorRPivot.add(fridgeDoorRMesh);
  fridgeRoot.add(fridgeDoorRPivot);

  interactiveFurniture.refrigerator = {
    id: 'refrigerator',
    name: 'INTEGRATED FRENCH-DOOR REFRIGERATOR',
    shortName: 'REFRIGERATOR',
    type: 'cupboard',
    group: fridgeRoot,
    hotspotPos: [2.8, 1.6, -4.6],
    features: { canRotate: false, canExplode: false, hasDoors: true, hasDrawers: false },
    materialsSupported: ['forest_lacquer', 'matte_black', 'smoked_walnut'],
    defaultMaterial: 'forest_lacquer',
    setDoorOpen: (progress) => {
      fridgeDoorLPivot.rotation.y = -Math.PI * 0.52 * progress;
      fridgeDoorRPivot.rotation.y = Math.PI * 0.52 * progress;
    },
    reset: () => {
      fridgeDoorLPivot.rotation.y = 0;
      fridgeDoorRPivot.rotation.y = 0;
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT F: SCULPTED OAK COUNTER STOOLS (tucked under island overhang)
  // --------------------------------------------------------------------------
  const stoolRoot = new THREE.Group();
  stoolRoot.name = 'Interactive_Stool';
  stoolRoot.position.set(0.4, 0, 0.72);

  const seatMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.19, 0.06, 24),
    smokedOakMat
  );
  seatMesh.position.set(0, 0.65, 0);
  seatMesh.castShadow = true;
  stoolRoot.add(seatMesh);

  const stoolLegs = new THREE.Group();
  const legGeo = new THREE.CylinderGeometry(0.016, 0.012, 0.64, 12);
  [[-0.11, -0.11], [0.11, -0.11], [-0.11, 0.11], [0.11, 0.11]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, brassMat);
    leg.position.set(lx, 0.32, lz);
    stoolLegs.add(leg);
  });
  // Footrest ring
  const footRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.008, 8, 24),
    brassMat
  );
  footRing.rotation.x = Math.PI / 2;
  footRing.position.set(0, 0.22, 0);
  stoolLegs.add(footRing);
  stoolRoot.add(stoolLegs);

  // Second matching stool
  const secondStool = stoolRoot.clone();
  secondStool.position.set(-0.6, 0, 0.72);
  fixedGroup.add(secondStool);

  interactiveFurniture.stools = {
    id: 'stools',
    name: 'SCULPTED OAK & BRASS COUNTER STOOL',
    shortName: 'COUNTER STOOL',
    type: 'chair',
    group: stoolRoot,
    hotspotPos: [0.4, 0.72, 0.72],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['smoked_walnut', 'natural_oak', 'boucle'],
    defaultMaterial: 'smoked_walnut',
    setMaterial: (matKey) => {
      seatMesh.material = createFurnitureMaterial(matKey);
    },
    setExplode: (progress) => {
      seatMesh.position.y = 0.65 + progress * 0.45;
      stoolLegs.position.y = -progress * 0.2;
    },
    reset: () => {
      stoolRoot.rotation.y = 0;
      seatMesh.position.set(0, 0.65, 0);
      stoolLegs.position.set(0, 0, 0);
    },
  };

  return {
    fixedGroup,
    furniture: interactiveFurniture,
    defaultSelectedId: 'island',
    cameraPos: new THREE.Vector3(0.4, 1.65, 4.4),
    cameraTarget: new THREE.Vector3(0, 0.7, -0.4),
    cameraBounds: { minDistance: 1.8, maxDistance: 6.8, minPolar: 0.2, maxPolar: 1.48 },
  };
}

// ============================================================================
// 03 — BEDROOM SCENE
// ============================================================================
export function buildBedroomScene() {
  const fixedGroup = new THREE.Group();
  fixedGroup.name = 'Bedroom_FixedArchitecture';

  const woodFloorMat = createFurnitureMaterial('natural_oak');
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xeae6dc, roughness: 0.9 });
  const fabricMat = createFurnitureMaterial('linen');
  const boucleMat = createFurnitureMaterial('boucle');
  const oakMat = createFurnitureMaterial('natural_oak');
  const walnutMat = createFurnitureMaterial('smoked_walnut');
  const brassMat = createBrassAccentMaterial();

  // 1. COMPLETE 3D ARCHITECTURAL ROOM ENVELOPE
  const shell = createArchitecturalRoomShell({
    roomType: 'bedroom',
    width: 12,
    depth: 11,
    height: 4.2,
    floorType: 'wood_light',
    backWallColor: 0xeae6dc,
  });
  fixedGroup.add(shell.group);

  // Acoustic Walnut Vertical Slats on Back Wall (matching reference)
  const slatGroup = new THREE.Group();
  slatGroup.position.set(0, 2.1, -5.46);
  for (let x = -4.2; x <= 4.2; x += 0.08) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.038, 4.16, 0.025), walnutMat);
    slat.position.set(x, 0, 0);
    slatGroup.add(slat);
  }
  fixedGroup.add(slatGroup);

  // Warm LED light cove grazing the slat wall
  const bedCoveGlow = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.04, 0.08),
    createEmissiveWarmGlowMaterial()
  );
  bedCoveGlow.position.set(0, 4.14, -5.42);
  fixedGroup.add(bedCoveGlow);

  // Framed abstract canvas art above bed
  const artGroup = new THREE.Group();
  artGroup.position.set(-0.8, 2.7, -5.4);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 0.04), oakMat);
  artGroup.add(frame);
  const canvasMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.92, 1.32),
    new THREE.MeshStandardMaterial({ color: 0xdfd9ce, roughness: 0.95 })
  );
  canvasMesh.position.z = 0.022;
  artGroup.add(canvasMesh);
  fixedGroup.add(artGroup);

  // Bedroom Rug
  fixedGroup.add(createRug(5.4, 4.2, 0xdcd6cb));

  // Cozy Bouclé Swivel Armchair in corner (matching reference)
  const bedroomChair = new THREE.Group();
  bedroomChair.position.set(3.2, 0, -0.6);
  bedroomChair.rotation.y = -Math.PI * 0.65;
  const bChairSeat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.44, 0.42, 28),
    boucleMat
  );
  bChairSeat.position.set(0, 0.28, 0);
  bChairSeat.castShadow = true;
  bedroomChair.add(bChairSeat);
  const bChairBack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 0.48, 28, 1, false, 0, Math.PI),
    boucleMat
  );
  bChairBack.position.set(0, 0.62, 0);
  bedroomChair.add(bChairBack);
  // Beside armchair: round wood side table & floor reading lamp
  const bSideTable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.48, 24),
    walnutMat
  );
  bSideTable.position.set(0.68, 0.24, 0.2);
  bedroomChair.add(bSideTable);
  fixedGroup.add(bedroomChair);

  // 2. INTERACTIVE FURNITURE OBJECTS
  const interactiveFurniture = {};

  // --------------------------------------------------------------------------
  // OBJECT A: FLOATING KING PLATFORM BED SUITE
  // --------------------------------------------------------------------------
  const bedRoot = new THREE.Group();
  bedRoot.name = 'Interactive_Bed';
  bedRoot.position.set(0, 0, -1.8);

  const bedBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.2, 2.3),
    walnutMat
  );
  bedBase.position.set(0, 0.1, 0);
  bedBase.castShadow = true;
  bedRoot.add(bedBase);

  // Layered Linen Quilted Mattress & Duvet
  const mattress = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.34, 2.15, 16, 8, 16),
    fabricMat
  );
  mattress.position.set(0, 0.37, 0);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  bedRoot.add(mattress);

  // Textured folded throw blanket across foot of bed
  const throwBlanket = new THREE.Mesh(
    new THREE.BoxGeometry(2.22, 0.08, 0.75),
    boucleMat
  );
  throwBlanket.position.set(0, 0.56, 0.65);
  throwBlanket.castShadow = true;
  bedRoot.add(throwBlanket);

  // Integrated Headboard Panel with top LED light wash
  const headboard = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.95, 0.12),
    walnutMat
  );
  headboard.position.set(0, 0.85, -1.1);
  headboard.castShadow = true;
  bedRoot.add(headboard);

  // Warm LED light strip along top of headboard grazing slat wall
  const headboardGlow = new THREE.Mesh(
    new THREE.BoxGeometry(3.56, 0.02, 0.04),
    createEmissiveWarmGlowMaterial()
  );
  headboardGlow.position.set(0, 1.33, -1.05);
  bedRoot.add(headboardGlow);

  // Sleeping pillows & accent bolsters
  const pillowsGroup = new THREE.Group();
  [-0.6, 0.6].forEach((px) => {
    // Back sleeping pillows
    const pillow1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.18, 0.42),
      fabricMat
    );
    pillow1.position.set(px, 0.62, -0.85);
    pillow1.rotation.x = -0.3;
    pillow1.castShadow = true;
    pillowsGroup.add(pillow1);

    // Front accent pillows
    const pillow2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.16, 0.38),
      boucleMat
    );
    pillow2.position.set(px, 0.6, -0.62);
    pillow2.rotation.x = -0.22;
    pillow2.castShadow = true;
    pillowsGroup.add(pillow2);
  });
  bedRoot.add(pillowsGroup);

  const bedMeshes = [mattress, throwBlanket];

  interactiveFurniture.bed = {
    id: 'bed',
    name: 'FLOATING KING PLATFORM BED SUITE',
    shortName: 'PLATFORM BED',
    type: 'chair',
    group: bedRoot,
    hotspotPos: [0, 0.75, -1.8],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['linen', 'boucle', 'natural_oak', 'smoked_walnut'],
    defaultMaterial: 'linen',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      bedMeshes.forEach((m) => {
        m.material = newMat;
      });
    },
    setExplode: (progress) => {
      headboard.position.z = -1.1 - progress * 0.65;
      headboardGlow.position.z = -1.05 - progress * 0.65;
      mattress.position.y = 0.37 + progress * 0.55;
      throwBlanket.position.y = 0.56 + progress * 0.75;
      pillowsGroup.position.y = progress * 0.55;
      bedBase.position.y = 0.1 - progress * 0.15;
    },
    reset: () => {
      bedRoot.rotation.y = 0;
      headboard.position.set(0, 0.85, -1.1);
      headboardGlow.position.set(0, 1.33, -1.05);
      mattress.position.set(0, 0.37, 0);
      throwBlanket.position.set(0, 0.56, 0.65);
      pillowsGroup.position.set(0, 0, 0);
      bedBase.position.set(0, 0.1, 0);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT B: BESPOKE ACOUSTIC SLAT WARDROBE WITH HINGED DOORS & SUEDE DRAWERS
  // --------------------------------------------------------------------------
  const wardrobeRoot = new THREE.Group();
  wardrobeRoot.name = 'Interactive_Wardrobe';
  wardrobeRoot.position.set(-3.6, 0, -2.6);

  const wardrobeCarcass = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 2.7, 0.68),
    oakMat
  );
  wardrobeCarcass.position.set(0, 1.35, 0);
  wardrobeRoot.add(wardrobeCarcass);

  // Left Wardrobe Door with physical hinge pivot
  const wardrobeDoorLPivot = new THREE.Group();
  wardrobeDoorLPivot.position.set(-0.92, 1.35, 0.35);
  const wardrobeDoorLMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 2.64, 0.026),
    oakMat
  );
  wardrobeDoorLMesh.position.set(0.45, 0, 0);
  wardrobeDoorLPivot.add(wardrobeDoorLMesh);
  wardrobeRoot.add(wardrobeDoorLPivot);

  // Right Wardrobe Door with physical hinge pivot
  const wardrobeDoorRPivot = new THREE.Group();
  wardrobeDoorRPivot.position.set(0.92, 1.35, 0.35);
  const wardrobeDoorRMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 2.64, 0.026),
    oakMat
  );
  wardrobeDoorRMesh.position.set(-0.45, 0, 0);
  wardrobeDoorRPivot.add(wardrobeDoorRMesh);
  wardrobeRoot.add(wardrobeDoorRPivot);

  // Internal suede drawers
  const wardrobeDrawerSlider = new THREE.Group();
  wardrobeDrawerSlider.position.set(0, 0.65, 0.1);
  const wardrobeDrawerFront = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.3, 0.025),
    oakMat
  );
  wardrobeDrawerFront.position.set(0, 0, 0.24);
  wardrobeDrawerSlider.add(wardrobeDrawerFront);
  wardrobeRoot.add(wardrobeDrawerSlider);

  interactiveFurniture.wardrobe = {
    id: 'wardrobe',
    name: 'ACOUSTIC SLAT BESPOKE WARDROBE',
    shortName: 'WARDROBE',
    type: 'cupboard',
    group: wardrobeRoot,
    hotspotPos: [-3.6, 1.5, -2.6],
    features: { canRotate: false, canExplode: false, hasDoors: true, hasDrawers: true },
    materialsSupported: ['natural_oak', 'smoked_walnut'],
    defaultMaterial: 'natural_oak',
    setDoorOpen: (progress) => {
      wardrobeDoorLPivot.rotation.y = -Math.PI * 0.55 * progress;
      wardrobeDoorRPivot.rotation.y = Math.PI * 0.55 * progress;
    },
    setDrawerOpen: (progress) => {
      wardrobeDrawerSlider.position.z = 0.1 + 0.38 * progress;
    },
    reset: () => {
      wardrobeDoorLPivot.rotation.y = 0;
      wardrobeDoorRPivot.rotation.y = 0;
      wardrobeDrawerSlider.position.z = 0.1;
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT C: FLOATING OAK NIGHTSTAND WITH SLIDING DRAWER & CERAMIC LAMP
  // --------------------------------------------------------------------------
  const nightstandRoot = new THREE.Group();
  nightstandRoot.name = 'Interactive_Nightstand';
  nightstandRoot.position.set(-1.65, 0.42, -2.75);

  const nightstandCasing = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.26, 0.45),
    walnutMat
  );
  nightstandRoot.add(nightstandCasing);

  const nightstandDrawerSlider = new THREE.Group();
  const nsDrawerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, 0.22, 0.4),
    walnutMat
  );
  nsDrawerMesh.position.set(0, 0, 0.02);
  nightstandDrawerSlider.add(nsDrawerMesh);
  nightstandRoot.add(nightstandDrawerSlider);

  // Ceramic mushroom table lamp with warm glow
  const tableLamp = new THREE.Group();
  tableLamp.position.set(0, 0.26, 0);
  const lampBaseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.09, 0.15, 20),
    new THREE.MeshStandardMaterial({ color: 0xf5f2ec, roughness: 0.85 })
  );
  lampBaseMesh.position.y = 0.075;
  tableLamp.add(lampBaseMesh);
  const lampDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xffeed8, roughness: 0.4 })
  );
  lampDome.position.y = 0.18;
  tableLamp.add(lampDome);
  nightstandRoot.add(tableLamp);

  interactiveFurniture.nightstand = {
    id: 'nightstand',
    name: 'FLOATING ARCHITECTURAL NIGHTSTAND',
    shortName: 'NIGHTSTAND',
    type: 'cabinet',
    group: nightstandRoot,
    hotspotPos: [-1.65, 0.58, -2.75],
    features: { canRotate: true, canExplode: false, hasDoors: false, hasDrawers: true },
    materialsSupported: ['smoked_walnut', 'natural_oak', 'travertine'],
    defaultMaterial: 'smoked_walnut',
    setDrawerOpen: (progress) => {
      nightstandDrawerSlider.position.z = 0.28 * progress;
    },
    reset: () => {
      nightstandRoot.rotation.y = 0;
      nightstandDrawerSlider.position.z = 0;
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT D: TIMBER DRESSER WITH SLIDING DRAWERS & ROUND VANITY MIRROR
  // --------------------------------------------------------------------------
  const dresserRoot = new THREE.Group();
  dresserRoot.name = 'Interactive_Dresser';
  dresserRoot.position.set(2.8, 0, -2.6);

  const dresserBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.84, 0.54),
    walnutMat
  );
  dresserBody.position.set(0, 0.42, 0);
  dresserBody.castShadow = true;
  dresserRoot.add(dresserBody);

  const dSlider1 = new THREE.Group();
  dSlider1.position.set(0, 0.64, 0);
  const dFront1 = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.34, 0.03), walnutMat);
  dFront1.position.set(0, 0, 0.28);
  dSlider1.add(dFront1);
  dresserRoot.add(dSlider1);

  const dSlider2 = new THREE.Group();
  dSlider2.position.set(0, 0.25, 0);
  const dFront2 = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.34, 0.03), walnutMat);
  dFront2.position.set(0, 0, 0.28);
  dSlider2.add(dFront2);
  dresserRoot.add(dSlider2);

  // Mounted round vanity mirror
  const dresserMirror = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.03, 32),
    new THREE.MeshStandardMaterial({ color: 0xf5f8fa, roughness: 0.05, metalness: 0.95 })
  );
  dresserMirror.rotation.x = Math.PI / 2;
  dresserMirror.position.set(0, 1.34, -0.15);
  dresserRoot.add(dresserMirror);

  interactiveFurniture.dresser = {
    id: 'dresser',
    name: 'BESPOKE TIMBER DRESSER & VANITY MIRROR',
    shortName: 'DRESSER',
    type: 'cabinet',
    group: dresserRoot,
    hotspotPos: [2.8, 0.95, -2.6],
    features: { canRotate: true, canExplode: false, hasDoors: false, hasDrawers: true },
    materialsSupported: ['smoked_walnut', 'natural_oak'],
    defaultMaterial: 'smoked_walnut',
    setDrawerOpen: (progress) => {
      dSlider1.position.z = 0.34 * progress;
      dSlider2.position.z = 0.26 * progress;
    },
    reset: () => {
      dresserRoot.rotation.y = 0;
      dSlider1.position.z = 0;
      dSlider2.position.z = 0;
    },
  };

  return {
    fixedGroup,
    furniture: interactiveFurniture,
    defaultSelectedId: 'bed',
    cameraPos: new THREE.Vector3(0, 1.5, 4.4),
    cameraTarget: new THREE.Vector3(0, 0.7, -0.9),
    cameraBounds: { minDistance: 1.8, maxDistance: 6.8, minPolar: 0.2, maxPolar: 1.48 },
  };
}

// ============================================================================
// 04 — DINING SCENE (Strictly 8 Chairs Arranged Symmetrically Around Table)
// ============================================================================
export function buildDiningScene() {
  const fixedGroup = new THREE.Group();
  fixedGroup.name = 'Dining_FixedArchitecture';

  const travertineMat = createFurnitureMaterial('travertine');
  const oakMat = createFurnitureMaterial('natural_oak');
  const walnutMat = createFurnitureMaterial('smoked_walnut');
  const boucleMat = createFurnitureMaterial('boucle');
  const brassMat = createBrassAccentMaterial();

  // 1. COMPLETE 3D ARCHITECTURAL ROOM ENVELOPE
  const shell = createArchitecturalRoomShell({
    roomType: 'dining',
    width: 12,
    depth: 11,
    height: 4.2,
    floorType: 'wood_dark',
    backWallColor: 0xede7dc,
  });
  fixedGroup.add(shell.group);

  // Undulating Sculptural Fluted Plaster Acoustic Wave Wall (matching reference image)
  const waveWallGroup = new THREE.Group();
  waveWallGroup.position.set(0, 2.1, -5.46);
  const waveMat = new THREE.MeshStandardMaterial({ color: 0xf3eee5, roughness: 0.92 });
  const numWaves = 36;
  const waveSpacing = 9.2 / numWaves;
  for (let i = 0; i < numWaves; i++) {
    const wx = -4.6 + i * waveSpacing;
    const waveColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(waveSpacing * 0.48, waveSpacing * 0.48, 4.16, 16),
      waveMat
    );
    waveColumn.position.set(wx, 0, 0);
    waveWallGroup.add(waveColumn);
  }
  fixedGroup.add(waveWallGroup);

  // Ceiling Cove Light Strip washing down the wave wall
  const diningCoveGlow = new THREE.Mesh(
    new THREE.BoxGeometry(9.4, 0.04, 0.08),
    createEmissiveWarmGlowMaterial()
  );
  diningCoveGlow.position.set(0, 4.14, -5.42);
  fixedGroup.add(diningCoveGlow);

  // Architectural Minimalist Brass Chandelier suspended above table (Accent lighting)
  const chandelierGroup = new THREE.Group();
  chandelierGroup.position.set(0, 2.9, 0);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.2, 8), brassMat);
  stem.position.y = 0.6;
  chandelierGroup.add(stem);
  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.2, 12), brassMat);
  crossbar.rotation.z = Math.PI / 2;
  chandelierGroup.add(crossbar);
  [-0.9, -0.3, 0.3, 0.9].forEach((lx) => {
    const lightTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.22, 16),
      createEmissiveWarmGlowMaterial()
    );
    lightTube.position.set(lx, 0, 0);
    chandelierGroup.add(lightTube);
  });
  fixedGroup.add(chandelierGroup);

  // 2. INTERACTIVE FURNITURE OBJECTS
  const interactiveFurniture = {};

  // --------------------------------------------------------------------------
  // OBJECT A: MONOLITHIC ROMAN TRAVERTINE DINING TABLE (Hero center piece)
  // --------------------------------------------------------------------------
  const tableLength = 2.8;
  const tableWidth = 1.15;
  const tableHeight = 0.75;

  const tableRoot = new THREE.Group();
  tableRoot.name = 'Interactive_DiningTable';
  tableRoot.position.set(0, 0, 0);

  // Solid 45mm Honed Travertine Slab with rough-chiseled beveled edge
  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(tableLength, 0.07, tableWidth),
    travertineMat
  );
  tableTop.position.set(0, tableHeight, 0);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  tableRoot.add(tableTop);

  // Twin monolithic fluted stone column pedestals
  const leftCol = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, tableHeight - 0.07, 32),
    travertineMat
  );
  leftCol.position.set(-tableLength * 0.28, (tableHeight - 0.07) / 2, 0);
  leftCol.castShadow = true;
  tableRoot.add(leftCol);

  const rightCol = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, tableHeight - 0.07, 32),
    travertineMat
  );
  rightCol.position.set(tableLength * 0.28, (tableHeight - 0.07) / 2, 0);
  rightCol.castShadow = true;
  tableRoot.add(rightCol);

  // Tableware: 6 ceramic dinner plates, cloth napkins, wine glasses, centerpiece bowl
  const tablewareGroup = new THREE.Group();
  tablewareGroup.position.set(0, tableHeight + 0.035, 0);

  // Ceramic Plates along north and south sides
  const plateGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.015, 24);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.4 });
  const glassGeo = new THREE.CylinderGeometry(0.032, 0.018, 0.12, 16);
  const glassMat = createGlassMaterial(0.35);

  [-0.85, 0, 0.85].forEach((px) => {
    // North side place settings
    const plateN = new THREE.Mesh(plateGeo, plateMat);
    plateN.position.set(px, 0.008, -0.36);
    tablewareGroup.add(plateN);

    const wineGlassN = new THREE.Mesh(glassGeo, glassMat);
    wineGlassN.position.set(px + 0.12, 0.06, -0.46);
    tablewareGroup.add(wineGlassN);

    // South side place settings
    const plateS = new THREE.Mesh(plateGeo, plateMat);
    plateS.position.set(px, 0.008, 0.36);
    tablewareGroup.add(plateS);

    const wineGlassS = new THREE.Mesh(glassGeo, glassMat);
    wineGlassS.position.set(px + 0.12, 0.06, 0.46);
    tablewareGroup.add(wineGlassS);
  });

  // Centerpiece: Monolithic bronze/stone decorative bowl with dried botanicals
  const centerBowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.14, 0.08, 24),
    brassMat
  );
  centerBowl.position.set(0, 0.04, 0);
  tablewareGroup.add(centerBowl);

  tableRoot.add(tablewareGroup);

  const tableMeshes = [tableTop, leftCol, rightCol];

  interactiveFurniture.table = {
    id: 'table',
    name: 'MONOLITHIC ROMAN TRAVERTINE DINING TABLE',
    shortName: 'DINING TABLE',
    type: 'table',
    group: tableRoot,
    hotspotPos: [0, 0.82, 0],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['travertine', 'calacatta', 'natural_oak', 'smoked_walnut'],
    defaultMaterial: 'travertine',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      tableMeshes.forEach((m) => {
        m.material = newMat;
      });
    },
    setExplode: (progress) => {
      tableTop.position.y = tableHeight + progress * 0.55;
      leftCol.position.x = -tableLength * 0.28 - progress * 0.45;
      rightCol.position.x = tableLength * 0.28 + progress * 0.45;
      tablewareGroup.position.y = tableHeight + 0.035 + progress * 0.8;
    },
    reset: () => {
      tableRoot.rotation.y = 0;
      tableTop.position.set(0, tableHeight, 0);
      leftCol.position.set(-tableLength * 0.28, (tableHeight - 0.07) / 2, 0);
      rightCol.position.set(tableLength * 0.28, (tableHeight - 0.07) / 2, 0);
      tablewareGroup.position.set(0, tableHeight + 0.035, 0);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT B: 8 DINING CHAIRS STRICTLY ARRANGED SYMMETRICALLY AROUND TABLE
  // 3 North, 3 South, 1 West (Interactive), 1 East
  // Aligned perfectly on floor, not floating, not intersecting table!
  // --------------------------------------------------------------------------
  function createDetailedDiningChair() {
    const chairGroup = new THREE.Group();
    const chairInst = createReferenceArmchair(boucleMat, walnutMat);
    chairInst.group.scale.set(0.76, 0.76, 0.76);
    chairInst.group.position.set(0, 0.32, 0);
    chairGroup.add(chairInst.group);
    chairGroup.userData.chairInst = chairInst;
    return chairGroup;
  }

  const allChairsGroup = new THREE.Group();
  allChairsGroup.name = 'All_Dining_Chairs';

  // 1. West End Chair (Selected for 360° Inspection)
  const singleChairInteractive = createDetailedDiningChair();
  singleChairInteractive.position.set(-1.85, 0, 0);
  singleChairInteractive.rotation.y = Math.PI / 2;
  allChairsGroup.add(singleChairInteractive);

  // 2. East End Chair
  const eastChair = createDetailedDiningChair();
  eastChair.position.set(1.85, 0, 0);
  eastChair.rotation.y = -Math.PI / 2;
  allChairsGroup.add(eastChair);

  // 3. North Side 3 Chairs (facing south toward table)
  const chairSpacingX = 0.84;
  [-chairSpacingX, 0, chairSpacingX].forEach((cx) => {
    const c = createDetailedDiningChair();
    c.position.set(cx, 0, -0.86);
    c.rotation.y = 0;
    allChairsGroup.add(c);
  });

  // 4. South Side 3 Chairs (facing north toward table)
  [-chairSpacingX, 0, chairSpacingX].forEach((cx) => {
    const c = createDetailedDiningChair();
    c.position.set(cx, 0, 0.86);
    c.rotation.y = Math.PI;
    allChairsGroup.add(c);
  });

  fixedGroup.add(allChairsGroup);

  interactiveFurniture.chair = {
    id: 'chair',
    name: 'MID-CENTURY SCULPTED WALNUT & BOUCLÉ DINING CHAIRS',
    shortName: 'DINING CHAIR',
    type: 'chair',
    group: singleChairInteractive,
    hotspotPos: [-1.85, 0.72, 0],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['smoked_walnut', 'natural_oak', 'boucle', 'leather'],
    defaultMaterial: 'smoked_walnut',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      singleChairInteractive.traverse((child) => {
        if (child.isMesh) child.material = newMat;
      });
    },
    setExplode: (progress) => {
      const inst = singleChairInteractive.userData.chairInst;
      if (inst) {
        inst.backGroup.position.z = -0.28 - progress * 0.45;
        inst.seatGroup.position.y = 0.08 + progress * 0.35;
      }
    },
    reset: () => {
      singleChairInteractive.rotation.y = Math.PI / 2;
      const inst = singleChairInteractive.userData.chairInst;
      if (inst) {
        inst.backGroup.position.z = -0.28;
        inst.seatGroup.position.y = 0.08;
      }
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT C: FLUTED BRASS & OAK SIDEBOARD CREDENZA
  // --------------------------------------------------------------------------
  const sideboardRoot = new THREE.Group();
  sideboardRoot.name = 'Interactive_Sideboard';
  sideboardRoot.position.set(0, 0, -4.8);

  const credenzaTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.05, 0.48),
    travertineMat
  );
  credenzaTop.position.set(0, 0.76, 0);
  sideboardRoot.add(credenzaTop);

  const credenzaBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.56, 0.7, 0.45),
    oakMat
  );
  credenzaBody.position.set(0, 0.39, 0);
  credenzaBody.castShadow = true;
  sideboardRoot.add(credenzaBody);

  // Left & right fluted hinge doors
  const sbDoorL = new THREE.Group();
  sbDoorL.position.set(-1.24, 0.39, 0.23);
  const sbDoorLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.66, 0.024), oakMat);
  sbDoorLMesh.position.set(0.31, 0, 0);
  sbDoorL.add(sbDoorLMesh);
  sideboardRoot.add(sbDoorL);

  const sbDoorR = new THREE.Group();
  sbDoorR.position.set(1.24, 0.39, 0.23);
  const sbDoorRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.66, 0.024), oakMat);
  sbDoorRMesh.position.set(-0.31, 0, 0);
  sbDoorR.add(sbDoorRMesh);
  sideboardRoot.add(sbDoorR);

  // Center sliding drawers
  const sbDrawerSlider = new THREE.Group();
  sbDrawerSlider.position.set(0, 0.54, 0);
  const sbDrawerFront = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 0.025), oakMat);
  sbDrawerFront.position.set(0, 0, 0.24);
  sbDrawerSlider.add(sbDrawerFront);
  sideboardRoot.add(sbDrawerSlider);

  interactiveFurniture.sideboard = {
    id: 'sideboard',
    name: 'FLUTED BRASS & OAK CREDENZA',
    shortName: 'SIDEBOARD',
    type: 'cabinet',
    group: sideboardRoot,
    hotspotPos: [0, 0.88, -4.8],
    features: { canRotate: true, canExplode: true, hasDoors: true, hasDrawers: true },
    materialsSupported: ['natural_oak', 'smoked_walnut', 'forest_lacquer'],
    defaultMaterial: 'natural_oak',
    setDoorOpen: (progress) => {
      sbDoorL.rotation.y = -Math.PI * 0.55 * progress;
      sbDoorR.rotation.y = Math.PI * 0.55 * progress;
    },
    setDrawerOpen: (progress) => {
      sbDrawerSlider.position.z = 0.34 * progress;
    },
    setExplode: (progress) => {
      credenzaTop.position.y = 0.76 + progress * 0.55;
      sbDoorL.position.x = -1.24 - progress * 0.4;
      sbDoorR.position.x = 1.24 + progress * 0.4;
      sbDrawerSlider.position.z = progress * 0.35;
    },
    reset: () => {
      sideboardRoot.rotation.y = 0;
      sbDoorL.rotation.y = 0;
      sbDoorR.rotation.y = 0;
      sbDrawerSlider.position.z = 0;
      credenzaTop.position.set(0, 0.76, 0);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT D: TEMPERED GLASS DISPLAY VITRINE (Right corner)
  // --------------------------------------------------------------------------
  const vitrineRoot = new THREE.Group();
  vitrineRoot.name = 'Interactive_Vitrine';
  vitrineRoot.position.set(3.2, 0, -3.2);

  const vitrineFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 2.4, 0.5),
    oakMat
  );
  vitrineFrame.position.set(0, 1.2, 0);
  vitrineRoot.add(vitrineFrame);

  // Illuminated glass shelves
  for (let y = 0.5; y <= 2.0; y += 0.45) {
    const gShelf = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.016, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xebf2f7, roughness: 0.1 })
    );
    gShelf.position.set(0, y, 0);
    vitrineRoot.add(gShelf);
  }

  // Left glass door with hinge
  const vDoorLPivot = new THREE.Group();
  vDoorLPivot.position.set(-0.62, 1.2, 0.26);
  const vDoorLMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 2.32, 0.02),
    createGlassMaterial(0.3)
  );
  vDoorLMesh.position.set(0.3, 0, 0);
  vDoorLPivot.add(vDoorLMesh);
  vitrineRoot.add(vDoorLPivot);

  // Right glass door with hinge
  const vDoorRPivot = new THREE.Group();
  vDoorRPivot.position.set(0.62, 1.2, 0.26);
  const vDoorRMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 2.32, 0.02),
    createGlassMaterial(0.3)
  );
  vDoorRMesh.position.set(-0.3, 0, 0);
  vDoorRPivot.add(vDoorRMesh);
  vitrineRoot.add(vDoorRPivot);

  interactiveFurniture.displaycabinet = {
    id: 'displaycabinet',
    name: 'ILLUMINATED GLASS ARCHITECTURAL VITRINE',
    shortName: 'DISPLAY VITRINE',
    type: 'cupboard',
    group: vitrineRoot,
    hotspotPos: [3.2, 1.5, -3.2],
    features: { canRotate: true, canExplode: false, hasDoors: true, hasDrawers: false },
    materialsSupported: ['natural_oak', 'smoked_walnut'],
    defaultMaterial: 'natural_oak',
    setDoorOpen: (progress) => {
      vDoorLPivot.rotation.y = -Math.PI * 0.52 * progress;
      vDoorRPivot.rotation.y = Math.PI * 0.52 * progress;
    },
    reset: () => {
      vitrineRoot.rotation.y = 0;
      vDoorLPivot.rotation.y = 0;
      vDoorRPivot.rotation.y = 0;
    },
  };

  return {
    fixedGroup,
    furniture: interactiveFurniture,
    defaultSelectedId: 'table',
    cameraPos: new THREE.Vector3(0, 1.6, 4.6),
    cameraTarget: new THREE.Vector3(0, 0.72, 0),
    cameraBounds: { minDistance: 1.8, maxDistance: 7.0, minPolar: 0.2, maxPolar: 1.48 },
  };
}

// ============================================================================
// 05 — BATHROOM SCENE
// ============================================================================
export function buildBathroomScene() {
  const fixedGroup = new THREE.Group();
  fixedGroup.name = 'Bathroom_FixedArchitecture';

  const travertineMat = createFurnitureMaterial('travertine');
  const oakMat = createFurnitureMaterial('natural_oak');
  const walnutMat = createFurnitureMaterial('smoked_walnut');
  const brassMat = createBrassAccentMaterial();

  // 1. COMPLETE 3D ARCHITECTURAL ROOM ENVELOPE (Travertine Stone Tile Grid)
  const shell = createArchitecturalRoomShell({
    roomType: 'bathroom',
    width: 12,
    depth: 10,
    height: 4.2,
    floorType: 'travertine',
    backWallColor: 0xe8e2d5,
  });
  fixedGroup.add(shell.group);

  // Large Picture Window in center looking out to sunlit garden (matching reference)
  const bathWindowGroup = new THREE.Group();
  bathWindowGroup.position.set(0, 2.1, -4.95);

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x141414,
    metalness: 0.85,
    roughness: 0.3,
  });

  // Top header
  const fTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.12), frameMat);
  fTop.position.set(0, 1.66, 0);
  bathWindowGroup.add(fTop);

  // Bottom sill
  const fBottom = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.12), frameMat);
  fBottom.position.set(0, -1.66, 0);
  bathWindowGroup.add(fBottom);

  // Left jamb
  const fLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.4, 0.12), frameMat);
  fLeft.position.set(-1.76, 0, 0);
  bathWindowGroup.add(fLeft);

  // Right jamb
  const fRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.4, 0.12), frameMat);
  fRight.position.set(1.76, 0, 0);
  bathWindowGroup.add(fRight);

  // Clear window glass pane
  const bathGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(3.44, 3.24),
    createGlassMaterial(0.12)
  );
  bathGlass.position.z = 0;
  bathWindowGroup.add(bathGlass);

  // Exterior lush sunlit garden vista canvas plane behind the tub
  const gardenCanvas = document.createElement('canvas');
  gardenCanvas.width = 1024;
  gardenCanvas.height = 1024;
  const gCtx = gardenCanvas.getContext('2d');

  // Sunlit sky & atmospheric glow
  const gGrad = gCtx.createLinearGradient(0, 0, 0, 1024);
  gGrad.addColorStop(0, '#d2e4f2');
  gGrad.addColorStop(0.3, '#f8f4e6');
  gGrad.addColorStop(0.6, '#b8cca6');
  gGrad.addColorStop(1, '#2c3a22');
  gCtx.fillStyle = gGrad;
  gCtx.fillRect(0, 0, 1024, 1024);

  // Lush organic tree canopy & dappled sunlight leaves
  for (let i = 0; i < 90; i++) {
    const rx = 80 + Math.random() * 860;
    const ry = 60 + Math.random() * 620;
    const rrad = 40 + Math.random() * 95;
    const gLeaf = gCtx.createRadialGradient(rx, ry, 5, rx, ry, rrad);
    gLeaf.addColorStop(0, 'rgba(130, 175, 102, 0.9)');
    gLeaf.addColorStop(0.65, 'rgba(68, 108, 48, 0.75)');
    gLeaf.addColorStop(1, 'rgba(35, 60, 24, 0)');
    gCtx.fillStyle = gLeaf;
    gCtx.beginPath();
    gCtx.arc(rx, ry, rrad, 0, Math.PI * 2);
    gCtx.fill();
  }

  // Dark vertical cedar privacy fence (matching reference photo)
  gCtx.fillStyle = '#221e1a';
  gCtx.fillRect(0, 710, 1024, 314);
  for (let p = 0; p < 36; p++) {
    gCtx.fillStyle = p % 2 === 0 ? '#1c1815' : '#28231e';
    gCtx.fillRect(p * 29, 710, 27, 314);
    gCtx.fillStyle = 'rgba(0,0,0,0.4)';
    gCtx.fillRect(p * 29 + 26, 710, 3, 314);
  }

  // Soft low garden shrubs in front of the timber fence
  for (let s = 0; s < 45; s++) {
    const sx = Math.random() * 1024;
    const sy = 670 + Math.random() * 180;
    const srad = 32 + Math.random() * 58;
    gCtx.fillStyle = 'rgba(48, 82, 34, 0.8)';
    gCtx.beginPath();
    gCtx.arc(sx, sy, srad, 0, Math.PI * 2);
    gCtx.fill();
  }

  const gardenTex = new THREE.CanvasTexture(gardenCanvas);
  const gardenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 3.3),
    new THREE.MeshBasicMaterial({ map: gardenTex })
  );
  gardenMesh.position.z = -0.05;
  bathWindowGroup.add(gardenMesh);
  fixedGroup.add(bathWindowGroup);

  // 2. INTERACTIVE FURNITURE OBJECTS
  const interactiveFurniture = {};

  // --------------------------------------------------------------------------
  // OBJECT A: FREESTANDING SCULPTURAL OVAL SOAKING TUB (Centerpiece before window)
  // --------------------------------------------------------------------------
  const tubRoot = new THREE.Group();
  tubRoot.name = 'Interactive_Bathtub';
  tubRoot.position.set(0, 0, -2.4);

  // Oval mineral cast soaking tub
  const tubOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.52, 0.65, 36),
    new THREE.MeshStandardMaterial({ color: 0xfbfaf8, roughness: 0.35 })
  );
  tubOuter.scale.set(1.5, 1.0, 0.9);
  tubOuter.position.y = 0.325;
  tubOuter.castShadow = true;
  tubRoot.add(tubOuter);

  // Clear still bathwater inside the tub
  const tubWater = new THREE.Mesh(
    new THREE.CylinderGeometry(0.53, 0.47, 0.02, 32),
    new THREE.MeshStandardMaterial({
      color: 0xc4dde3,
      roughness: 0.06,
      metalness: 0.08,
      transparent: true,
      opacity: 0.8,
    })
  );
  tubWater.scale.set(1.44, 1.0, 0.85);
  tubWater.position.y = 0.52;
  tubRoot.add(tubWater);

  // Freestanding floor-mounted brass mixer tap
  const mixerStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 0.95, 16),
    brassMat
  );
  mixerStem.position.set(0, 0.48, -0.6);
  tubRoot.add(mixerStem);

  const mixerSpout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.22, 12),
    brassMat
  );
  mixerSpout.rotation.x = Math.PI / 2;
  mixerSpout.position.set(0, 0.92, -0.5);
  tubRoot.add(mixerSpout);

  // Folded neutral bath towel draped over rim
  const towelDrape = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.35, 0.04),
    createFurnitureMaterial('linen')
  );
  towelDrape.position.set(0.35, 0.52, 0.44);
  towelDrape.castShadow = true;
  tubRoot.add(towelDrape);

  // Three-legged wooden stool beside tub (matching reference)
  const stool = new THREE.Group();
  stool.position.set(1.15, 0, 0.2);
  const stoolTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.04, 20),
    walnutMat
  );
  stoolTop.position.y = 0.42;
  stoolTop.castShadow = true;
  stool.add(stoolTop);
  [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((ang) => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.012, 0.42, 12),
      walnutMat
    );
    leg.position.set(Math.cos(ang) * 0.12, 0.21, Math.sin(ang) * 0.12);
    stool.add(leg);
  });
  tubRoot.add(stool);

  interactiveFurniture.bathtub = {
    id: 'bathtub',
    name: 'FREESTANDING SCULPTURAL OVAL SOAKING TUB',
    shortName: 'SOAKING TUB',
    type: 'table',
    group: tubRoot,
    hotspotPos: [0, 0.68, -2.4],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: false },
    materialsSupported: ['travertine', 'calacatta'],
    defaultMaterial: 'travertine',
    setMaterial: (matKey) => {
      tubOuter.material = createFurnitureMaterial(matKey);
    },
    setExplode: (progress) => {
      tubOuter.position.y = 0.325 + progress * 0.45;
      tubWater.position.y = 0.52 + progress * 0.45;
      mixerStem.position.z = -0.6 - progress * 0.35;
      mixerSpout.position.z = -0.5 - progress * 0.35;
      stool.position.x = 1.15 + progress * 0.4;
    },
    reset: () => {
      tubRoot.rotation.y = 0;
      tubOuter.position.set(0, 0.325, 0);
      tubWater.position.set(0, 0.52, 0);
      mixerStem.position.set(0, 0.48, -0.6);
      mixerSpout.position.set(0, 0.92, -0.5);
      stool.position.set(1.15, 0, 0.2);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT B: FLOATING DOUBLE VANITY WITH TWIN BASINS & SLIDING DRAWERS (Right wall)
  // --------------------------------------------------------------------------
  const vanityRoot = new THREE.Group();
  vanityRoot.name = 'Interactive_Vanity';
  vanityRoot.position.set(3.4, 0.72, -1.8);

  const vanityTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.14, 0.65),
    travertineMat
  );
  vanityTop.castShadow = true;
  vanityTop.receiveShadow = true;
  vanityRoot.add(vanityTop);

  // Twin carved rectangular sinks
  [-0.6, 0.6].forEach((sx) => {
    const sinkHole = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.12, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xcfc5b5, roughness: 0.9 })
    );
    sinkHole.position.set(sx, 0.02, 0);
    vanityRoot.add(sinkHole);

    // Wall-mounted brushed brass spout
    const spout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.18, 12),
      brassMat
    );
    spout.rotation.x = Math.PI / 2;
    spout.position.set(sx, 0.22, -0.28);
    vanityRoot.add(spout);
  });

  const vanityBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.38, 0.42, 0.62),
    travertineMat
  );
  vanityBody.position.set(0, -0.28, 0);
  vanityBody.castShadow = true;
  vanityRoot.add(vanityBody);

  // Dual Sliding Drawers
  const vanityDrawerSlider = new THREE.Group();
  vanityDrawerSlider.position.set(0, -0.28, 0.32);
  const drawerFront = new THREE.Mesh(
    new THREE.BoxGeometry(2.32, 0.38, 0.025),
    travertineMat
  );
  vanityDrawerSlider.add(drawerFront);
  vanityRoot.add(vanityDrawerSlider);

  // Twin backlit vertical mirrors above vanity (matching reference)
  const mirrorGroup = new THREE.Group();
  mirrorGroup.position.set(0, 0.88, -0.3);
  [-0.6, 0.6].forEach((mx) => {
    // Glowing warm LED halo frame
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xffdfa4 });
    const halo = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 1.18, 0.01),
      haloMat
    );
    halo.position.set(mx, 0, -0.015);
    mirrorGroup.add(halo);

    // Slim brushed brass frame
    const mirrorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.67, 1.13, 0.02),
      brassMat
    );
    mirrorFrame.position.set(mx, 0, 0);
    mirrorGroup.add(mirrorFrame);

    // Ultra-clear silver reflective mirror pane
    const mirrorPane = new THREE.Mesh(
      new THREE.BoxGeometry(0.64, 1.1, 0.022),
      new THREE.MeshStandardMaterial({
        color: 0xedf3f7,
        roughness: 0.03,
        metalness: 0.98,
      })
    );
    mirrorPane.position.set(mx, 0, 0.005);
    mirrorGroup.add(mirrorPane);

    // Minimal vertical brass cylinder pendant light hanging above mirror
    const pendantCord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 1.2, 8),
      brassMat
    );
    pendantCord.position.set(mx, 1.5, 0.05);
    mirrorGroup.add(pendantCord);

    const pendantCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.28, 16),
      brassMat
    );
    pendantCylinder.position.set(mx, 0.8, 0.05);
    mirrorGroup.add(pendantCylinder);
  });
  vanityRoot.add(mirrorGroup);

  // Ceramic vase with olive branch on vanity right edge (matching reference)
  const vaseGroup = new THREE.Group();
  vaseGroup.position.set(1.0, 0.16, 0.1);
  const ceramicVase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.08, 0.2, 16),
    new THREE.MeshStandardMaterial({ color: 0xe8e2d8, roughness: 0.9 })
  );
  vaseGroup.add(ceramicVase);

  const twig = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.006, 0.32, 8),
    walnutMat
  );
  twig.rotation.z = -0.25;
  twig.position.set(0.04, 0.18, 0);
  vaseGroup.add(twig);
  vanityRoot.add(vaseGroup);

  interactiveFurniture.vanity = {
    id: 'vanity',
    name: 'HONED TRAVERTINE DOUBLE VANITY & HALO MIRRORS',
    shortName: 'DOUBLE VANITY',
    type: 'cabinet',
    group: vanityRoot,
    hotspotPos: [3.4, 0.85, -1.8],
    features: { canRotate: true, canExplode: true, hasDoors: false, hasDrawers: true },
    materialsSupported: ['travertine', 'calacatta', 'natural_oak'],
    defaultMaterial: 'travertine',
    setMaterial: (matKey) => {
      const newMat = createFurnitureMaterial(matKey);
      vanityTop.material = newMat;
      vanityBody.material = newMat;
      drawerFront.material = newMat;
    },
    setDrawerOpen: (progress) => {
      vanityDrawerSlider.position.z = 0.32 + 0.36 * progress;
    },
    setExplode: (progress) => {
      vanityTop.position.y = progress * 0.45;
      vanityDrawerSlider.position.z = 0.32 + progress * 0.4;
      mirrorGroup.position.y = 0.88 + progress * 0.35;
      vaseGroup.position.y = 0.16 + progress * 0.55;
    },
    reset: () => {
      vanityRoot.rotation.y = 0;
      vanityTop.position.set(0, 0, 0);
      vanityDrawerSlider.position.set(0, -0.28, 0.32);
      mirrorGroup.position.set(0, 0.88, -0.3);
      vaseGroup.position.set(1.0, 0.16, 0.1);
    },
  };

  // --------------------------------------------------------------------------
  // OBJECT C: FRAMELESS FLUTED GLASS SHOWER WITH HINGED DOOR (Left wall)
  // --------------------------------------------------------------------------
  const showerRoot = new THREE.Group();
  showerRoot.name = 'Interactive_Shower';
  showerRoot.position.set(-2.6, 0, -1.8);

  const flutedGlassMat = createGlassMaterial(0.4);

  // Brass perimeter framing
  const showerFrameH = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.04, 1.8),
    brassMat
  );
  showerFrameH.position.set(0, 2.6, 0);
  showerRoot.add(showerFrameH);

  // Fixed fluted glass divider screen
  const showerFixedPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 2.6, 0.9),
    flutedGlassMat
  );
  showerFixedPanel.position.set(0, 1.3, -0.45);
  showerRoot.add(showerFixedPanel);

  // Hinged glass shower door: rotates open on its hinge (+85°)!
  const showerDoorPivot = new THREE.Group();
  showerDoorPivot.position.set(0, 1.3, 0);
  const showerDoorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.024, 2.58, 0.88),
    flutedGlassMat
  );
  showerDoorMesh.position.set(0, 0, 0.44);
  showerDoorPivot.add(showerDoorMesh);

  // Brass vertical handle on shower door
  const doorHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.45, 12),
    brassMat
  );
  doorHandle.position.set(0.02, 0, 0.8);
  showerDoorPivot.add(doorHandle);

  showerRoot.add(showerDoorPivot);

  // Ceiling-mounted brass rainfall shower downrod and head
  const showerRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 1.2, 12),
    brassMat
  );
  showerRod.position.set(-0.5, 3.4, -0.4);
  showerRoot.add(showerRod);

  const showerHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.028, 24),
    brassMat
  );
  showerHead.position.set(-0.5, 2.8, -0.4);
  showerRoot.add(showerHead);

  interactiveFurniture.shower = {
    id: 'shower',
    name: 'FRAMELESS FLUTED GLASS SHOWER ENCLOSURE',
    shortName: 'GLASS SHOWER',
    type: 'chair',
    group: showerRoot,
    hotspotPos: [-2.6, 1.4, -1.8],
    features: { canRotate: false, canExplode: false, hasDoors: true, hasDrawers: false },
    materialsSupported: ['brushed_brass', 'matte_black'],
    defaultMaterial: 'brushed_brass',
    setDoorOpen: (progress) => {
      showerDoorPivot.rotation.y = Math.PI * 0.48 * progress; // Real glass door hinge rotation!
    },
    reset: () => {
      showerDoorPivot.rotation.y = 0;
    },
  };

  return {
    fixedGroup,
    furniture: interactiveFurniture,
    defaultSelectedId: 'bathtub',
    cameraPos: new THREE.Vector3(0, 1.55, 4.3),
    cameraTarget: new THREE.Vector3(0, 0.7, -1.6),
    cameraBounds: { minDistance: 1.8, maxDistance: 6.8, minPolar: 0.2, maxPolar: 1.48 },
  };
}

export const ROOM_BUILDERS = {
  living: buildLivingRoomScene,
  kitchen: buildKitchenScene,
  bedroom: buildBedroomScene,
  dining: buildDiningScene,
  bathroom: buildBathroomScene,
};
