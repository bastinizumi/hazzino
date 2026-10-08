/**
 * HAZZINO INTERIORS — BESPOKE ARCHITECTURAL MODULAR CUPBOARD & BAR VITRINE
 * High-end Milanese modernist showcase credenza & illuminated display vitrine:
 * - Architectural trestle stiletto base with turned champagne brass ferrules
 * - Lower credenza with 3D vertical fluted acoustic slatted drawers & cabinets
 * - Honed Calacatta Gold marble countertop inset reveal
 * - Upper vitrine with crystal-clear fluted glass doors in brushed brass frames
 * - Concealed warm LED cove & shelf downlight illumination (Brilliantly visible!)
 * - Curated interior barware: crystal decanters, amber carafes, tumblers, and ceramic vessels
 * - Fully articulated 90° swinging glass doors and sliding soft-close drawers
 */
import * as THREE from 'three';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createInteriorLiningMaterial,
  createEmissiveWarmGlowMaterial,
} from './modelMaterials';

export class ModularCupboardModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'ModularCupboardModel';

    // Main Carcass Material (reacts to user material/color choices)
    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0x22382e),
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // Wood, Metals, Glass & Stone Materials
    this.woodMaterial = createFurnitureMaterial('natural_oak');
    this.woodMaterial.side = THREE.DoubleSide;

    this.interiorWoodMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfd4c4,
      roughness: 0.5,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    this.marbleMaterial = createFurnitureMaterial('marble');
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();

    // Crystal-clear showcase glass with realistic subtle refraction & specular sheen
    this.flutedGlassMat = new THREE.MeshStandardMaterial({
      color: 0xf5f8fa,
      transparent: true,
      opacity: 0.16,
      roughness: 0.04,
      metalness: 0.15,
    });

    this.coveGlowMat = createEmissiveWarmGlowMaterial(3.2);

    this.shelfGlassMat = new THREE.MeshStandardMaterial({
      color: 0xf0f5f8,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
    });

    this.doorOpenProgress = 0;
    this.drawerOpenProgress = 0;
    this.explodeProgress = 0;

    // Track mesh collections for dynamic material updates
    this.carcassMeshes = [];
    this.woodMeshes = [];
    this.drawers = [];

    this.buildModel();
  }

  buildModel() {
    const width = 1.52;
    const height = 1.76;
    const depth = 0.48;
    const baseH = 0.20;
    const lowerH = 0.54;
    const marbleH = 0.038;
    const upperH = height - baseH - lowerH - marbleH; // ~0.98m

    // =========================================================================
    // 1. ARCHITECTURAL TRESTLE BASE WITH STILETTO LEGS & BRASS FERRULES
    // =========================================================================
    this.baseGroup = new THREE.Group();
    this.baseGroup.name = 'TrestleBaseGroup';
    this.baseGroup.position.set(0, 0, 0);

    const legGeo = new THREE.CylinderGeometry(0.016, 0.011, baseH, 16);
    const ferruleGeo = new THREE.CylinderGeometry(0.0125, 0.011, 0.055, 16);

    const legCoords = [
      { lx: -width / 2 + 0.06, lz: depth / 2 - 0.06 },
      { lx: width / 2 - 0.06, lz: depth / 2 - 0.06 },
      { lx: -width / 2 + 0.06, lz: -depth / 2 + 0.06 },
      { lx: width / 2 - 0.06, lz: -depth / 2 + 0.06 },
    ];

    legCoords.forEach((coord) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(coord.lx, baseH / 2, coord.lz);

      const legMesh = new THREE.Mesh(legGeo, this.woodMaterial);
      legMesh.castShadow = true;
      legPivot.add(legMesh);
      this.woodMeshes.push(legMesh);

      // Machined satin brass footer cup
      const ferrule = new THREE.Mesh(ferruleGeo, this.brassMaterial);
      ferrule.position.y = -baseH / 2 + 0.0275;
      legPivot.add(ferrule);

      this.baseGroup.add(legPivot);
    });

    // Lower bronze perimeter tie frame
    const tieFrame = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.12, 0.024, depth - 0.12),
      this.brassMaterial
    );
    tieFrame.position.set(0, baseH - 0.012, 0);
    this.baseGroup.add(tieFrame);

    this.root.add(this.baseGroup);

    // =========================================================================
    // 2. LOWER CREDENZA SECTION (FLUTED ACOUSTIC SLATTED DRAWERS & CABINETS)
    // =========================================================================
    this.lowerGroup = new THREE.Group();
    this.lowerGroup.name = 'LowerCredenzaGroup';
    this.lowerGroup.position.set(0, baseH + lowerH / 2, 0);

    // Carcass box
    const lowerCarcass = new THREE.Mesh(
      new THREE.BoxGeometry(width, lowerH, depth),
      this.mainMaterial
    );
    lowerCarcass.castShadow = true;
    lowerCarcass.receiveShadow = true;
    this.lowerGroup.add(lowerCarcass);
    this.carcassMeshes.push(lowerCarcass);

    // 2.1 Center Tiered Sliding Drawers (2 Drawers, stacked)
    const centerW = width * 0.52;
    const dH = (lowerH - 0.06) / 2;
    const dDepth = depth - 0.06;
    this.baseDrawerZ = depth / 2 + 0.008;

    [-1, 1].forEach((dir, idx) => {
      const drawer = new THREE.Group();
      const dy = (dir * (dH + 0.015)) / 2;
      drawer.position.set(0, dy, this.baseDrawerZ);

      // Fluted wood drawer front
      const dFront = new THREE.Mesh(
        new THREE.BoxGeometry(centerW - 0.015, dH - 0.01, 0.024),
        this.mainMaterial
      );
      dFront.castShadow = true;
      drawer.add(dFront);
      this.carcassMeshes.push(dFront);

      // 3D vertical fluted acoustic micro-ribs across drawer face
      const numRibs = 24;
      const ribStep = (centerW - 0.03) / numRibs;
      for (let r = 0; r < numRibs; r++) {
        const rx = -(centerW - 0.03) / 2 + ribStep * (r + 0.5);
        const rib = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0045, 0.0045, dH - 0.02, 10),
          this.woodMaterial
        );
        rib.scale.set(1.0, 1.0, 0.5);
        rib.position.set(rx, 0, 0.014);
        drawer.add(rib);
        this.woodMeshes.push(rib);
      }

      // Interior cedar box
      const dBox = new THREE.Mesh(
        new THREE.BoxGeometry(centerW - 0.06, dH - 0.03, dDepth),
        this.interiorMaterial
      );
      dBox.position.set(0, 0, -dDepth / 2);
      drawer.add(dBox);

      // Recessed satin brass pull profile
      const dPull = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.014, 0.014),
        this.brassMaterial
      );
      dPull.position.set(0, dH / 2 - 0.014, 0.016);
      drawer.add(dPull);

      this.lowerGroup.add(drawer);
      this.drawers.push({ group: drawer, baseZ: this.baseDrawerZ, idx });
    });

    // 2.2 Left and Right Fluted Cabinet Doors
    const sideW = (width - centerW) / 2 - 0.012;
    [-1, 1].forEach((sideDir) => {
      const doorX = sideDir * (width / 2 - sideW / 2 - 0.006);
      const sideDoor = new THREE.Group();
      sideDoor.position.set(doorX, 0, this.baseDrawerZ);

      const dMesh = new THREE.Mesh(
        new THREE.BoxGeometry(sideW, lowerH - 0.03, 0.024),
        this.mainMaterial
      );
      dMesh.castShadow = true;
      sideDoor.add(dMesh);
      this.carcassMeshes.push(dMesh);

      // Fluted micro-ribs on side doors
      const sideRibs = 11;
      const sStep = (sideW - 0.02) / sideRibs;
      for (let r = 0; r < sideRibs; r++) {
        const rx = -(sideW - 0.02) / 2 + sStep * (r + 0.5);
        const rib = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0045, 0.0045, lowerH - 0.05, 10),
          this.woodMaterial
        );
        rib.scale.set(1.0, 1.0, 0.5);
        rib.position.set(rx, 0, 0.014);
        sideDoor.add(rib);
        this.woodMeshes.push(rib);
      }

      // Vertical brass bar handle
      const sidePull = new THREE.Mesh(
        new THREE.BoxGeometry(0.014, 0.16, 0.014),
        this.brassMaterial
      );
      sidePull.position.set(sideDir === 1 ? -sideW / 2 + 0.025 : sideW / 2 - 0.025, 0, 0.018);
      sideDoor.add(sidePull);

      this.lowerGroup.add(sideDoor);
    });

    this.root.add(this.lowerGroup);

    // =========================================================================
    // 3. HONED CALACATTA MARBLE COUNTERTOP INSET SLAB
    // =========================================================================
    const marbleY = baseH + lowerH + marbleH / 2;
    const marbleGeom = new THREE.BoxGeometry(width + 0.015, marbleH, depth + 0.015);
    this.marbleTopMesh = new THREE.Mesh(marbleGeom, this.marbleMaterial);
    this.marbleTopMesh.position.set(0, marbleY, 0);
    this.marbleTopMesh.castShadow = true;
    this.marbleTopMesh.receiveShadow = true;
    this.root.add(this.marbleTopMesh);

    // =========================================================================
    // 4. UPPER ILLUMINATED GLASS VITRINE SHOWCASE (MAXIMUM DESIGN VISIBILITY)
    // =========================================================================
    this.upperGroup = new THREE.Group();
    this.upperGroup.name = 'UpperVitrineGroup';
    const upperBaseY = baseH + lowerH + marbleH;
    this.upperGroup.position.set(0, upperBaseY + upperH / 2, 0);

    const vitrineW = width;
    const vitrineH = upperH;
    const vitrineD = depth - 0.02;
    const carcassWall = 0.032;

    // 4.1 Carcass Shell (Top, Sides, and Warm Back Wall)
    // Top crown slab
    this.topCrown = new THREE.Mesh(
      new THREE.BoxGeometry(vitrineW, carcassWall, vitrineD),
      this.mainMaterial
    );
    this.topCrown.position.set(0, vitrineH / 2 - carcassWall / 2, 0);
    this.topCrown.castShadow = true;
    this.upperGroup.add(this.topCrown);
    this.carcassMeshes.push(this.topCrown);

    // Left Side Panel
    const sideGeom = new THREE.BoxGeometry(carcassWall, vitrineH - carcassWall, vitrineD);
    this.sideL = new THREE.Mesh(sideGeom, this.mainMaterial);
    this.sideL.position.set(-vitrineW / 2 + carcassWall / 2, -carcassWall / 2, 0);
    this.sideL.castShadow = true;
    this.upperGroup.add(this.sideL);
    this.carcassMeshes.push(this.sideL);

    // Right Side Panel
    this.sideR = new THREE.Mesh(sideGeom, this.mainMaterial);
    this.sideR.position.set(vitrineW / 2 - carcassWall / 2, -carcassWall / 2, 0);
    this.sideR.castShadow = true;
    this.upperGroup.add(this.sideR);
    this.carcassMeshes.push(this.sideR);

    // Warm Natural Oak Ribbed Back Wall (illuminated backdrop)
    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(vitrineW - carcassWall * 2, vitrineH - carcassWall, 0.022),
      this.interiorWoodMaterial
    );
    backPanel.position.set(0, -carcassWall / 2, -vitrineD / 2 + 0.015);
    this.upperGroup.add(backPanel);

    // Vertical micro-fluting slats on back panel for exquisite interior depth
    const backSlats = 36;
    const bStep = (vitrineW - carcassWall * 2 - 0.04) / backSlats;
    for (let bs = 0; bs < backSlats; bs++) {
      const bx = -(vitrineW - carcassWall * 2 - 0.04) / 2 + bStep * (bs + 0.5);
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.007, vitrineH - carcassWall - 0.02, 0.008),
        this.interiorWoodMaterial
      );
      slat.position.set(bx, -carcassWall / 2, -vitrineD / 2 + 0.028);
      this.upperGroup.add(slat);
    }

    // 4.2 Architectural LED Warm Lighting Strips
    // Top ceiling LED cove strip washing light downward
    const topLight = new THREE.Mesh(
      new THREE.BoxGeometry(vitrineW - carcassWall * 2 - 0.06, 0.016, 0.028),
      this.coveGlowMat
    );
    topLight.position.set(0, vitrineH / 2 - carcassWall - 0.01, 0.08);
    this.upperGroup.add(topLight);

    // 4.3 2 Floating Smoked Glass & Brass Interior Display Shelves
    const shelfW = vitrineW - carcassWall * 2 - 0.01;
    const shelfD = vitrineD - 0.06;

    [-0.14, 0.18].forEach((sy) => {
      const shelfGroup = new THREE.Group();
      shelfGroup.position.set(0, sy, 0.01);

      // Glass shelf plate
      const sMesh = new THREE.Mesh(
        new THREE.BoxGeometry(shelfW, 0.014, shelfD),
        this.shelfGlassMat
      );
      shelfGroup.add(sMesh);

      // Front satin brass protective lip
      const sLip = new THREE.Mesh(
        new THREE.BoxGeometry(shelfW, 0.022, 0.016),
        this.brassMaterial
      );
      sLip.position.set(0, 0, shelfD / 2);
      shelfGroup.add(sLip);

      // Under-shelf LED glow strip
      const sLight = new THREE.Mesh(
        new THREE.BoxGeometry(shelfW - 0.1, 0.012, 0.022),
        this.coveGlowMat
      );
      sLight.position.set(0, -0.012, 0.04);
      shelfGroup.add(sLight);

      this.upperGroup.add(shelfGroup);
    });

    // 4.4 Curated Luxury Barware & Display Artifacts (Visible Design!)
    this.buildCuratedDisplayItems(this.upperGroup);

    // 4.5 Twin Symmetrical Crystal Fluted Glass Doors with Brass Frames
    const doorW = (vitrineW - carcassWall * 2) / 2 + 0.012;
    const doorH = vitrineH - carcassWall - 0.02;

    // LEFT GLASS DOOR (Pivots from outer left edge)
    this.doorLeft = new THREE.Group();
    this.doorLeft.position.set(-vitrineW / 2 + carcassWall + 0.005, -carcassWall / 2, vitrineD / 2 + 0.01);

    const lDoorContent = this.createGlassDoorUnit(doorW, doorH, 'left');
    this.doorLeft.add(lDoorContent);
    this.upperGroup.add(this.doorLeft);

    // RIGHT GLASS DOOR (Pivots from outer right edge)
    this.doorRight = new THREE.Group();
    this.doorRight.position.set(vitrineW / 2 - carcassWall - 0.005, -carcassWall / 2, vitrineD / 2 + 0.01);

    const rDoorContent = this.createGlassDoorUnit(doorW, doorH, 'right');
    this.doorRight.add(rDoorContent);
    this.upperGroup.add(this.doorRight);

    this.root.add(this.upperGroup);
  }

  // ---------------------------------------------------------------------------
  // GLASS DOOR BUILDER (Crystal clear glass + brass frame + knurled pull handle)
  // ---------------------------------------------------------------------------
  createGlassDoorUnit(w, h, side) {
    const isLeft = side === 'left';
    const group = new THREE.Group();
    const pivotOffsetX = isLeft ? w / 2 : -w / 2;

    // Crystal-clear fluted glass panel
    const glassMesh = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.01, h - 0.01, 0.008),
      this.flutedGlassMat
    );
    glassMesh.position.set(pivotOffsetX, 0, 0);
    group.add(glassMesh);

    // Slim Champagne Brass Outer Frame Perimeter
    const barThick = 0.024;
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(w, barThick, 0.02), this.brassMaterial);
    topBar.position.set(pivotOffsetX, h / 2 - barThick / 2, 0);
    group.add(topBar);

    const btmBar = new THREE.Mesh(new THREE.BoxGeometry(w, barThick, 0.02), this.brassMaterial);
    btmBar.position.set(pivotOffsetX, -h / 2 + barThick / 2, 0);
    group.add(btmBar);

    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(barThick, h, 0.02), this.brassMaterial);
    leftBar.position.set(pivotOffsetX - w / 2 + barThick / 2, 0, 0);
    group.add(leftBar);

    const rightBar = new THREE.Mesh(new THREE.BoxGeometry(barThick, h, 0.02), this.brassMaterial);
    rightBar.position.set(pivotOffsetX + w / 2 - barThick / 2, 0, 0);
    group.add(rightBar);

    // Full-length vertical satin brass knurled handle near the center opening
    const handleX = isLeft ? pivotOffsetX + w / 2 - 0.038 : pivotOffsetX - w / 2 + 0.038;
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.46, 16),
      this.brassMaterial
    );
    handle.position.set(handleX, 0, 0.022);
    group.add(handle);

    return group;
  }

  // ---------------------------------------------------------------------------
  // CURATED INTERIOR LUXURY DISPLAY ARTIFACTS (Brilliantly Visible!)
  // ---------------------------------------------------------------------------
  buildCuratedDisplayItems(parent) {
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
    });
    const amberGlassMat = new THREE.MeshStandardMaterial({
      color: 0xefa240,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0xf6f2ea,
      roughness: 0.65,
    });
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x221f1d,
      roughness: 0.7,
    });

    // 1. TOP SHELF (y ≈ 0.18): Crystal Decanter & Stemware
    const decanter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.075, 0.22, 16),
      glassMat
    );
    decanter.position.set(-0.36, 0.18 + 0.11, 0.04);
    parent.add(decanter);

    const decanterStopper = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 16, 16),
      this.brassMaterial
    );
    decanterStopper.position.set(-0.36, 0.18 + 0.23, 0.04);
    parent.add(decanterStopper);

    // Amber Glass Carafe
    const carafe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.065, 0.19, 16),
      amberGlassMat
    );
    carafe.position.set(-0.16, 0.18 + 0.095, 0.04);
    parent.add(carafe);

    // 3 Lowball crystal tumblers
    [0.18, 0.30, 0.42].forEach((tx) => {
      const tumbler = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.032, 0.08, 16),
        glassMat
      );
      tumbler.position.set(tx, 0.18 + 0.04, 0.04);
      parent.add(tumbler);
    });

    // 2. MIDDLE SHELF (y ≈ -0.14): Sculptural Ceramics & Art Books
    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.05, 0.24, 24),
      ceramicMat
    );
    vase.scale.set(1.2, 1.0, 0.8);
    vase.position.set(-0.38, -0.14 + 0.12, 0.03);
    parent.add(vase);

    // Stacked Luxury Art Monographs
    const bookStack = new THREE.Group();
    bookStack.position.set(0.04, -0.14 + 0.035, 0.03);
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.038, 0.22), darkStoneMat);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.032, 0.21), ceramicMat);
    b2.position.set(0.015, 0.035, 0);
    b2.rotation.y = 0.08;
    bookStack.add(b1);
    bookStack.add(b2);
    parent.add(bookStack);

    // Sculptural Brass Ring Artifact
    const brassRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.065, 0.018, 16, 32),
      this.brassMaterial
    );
    brassRing.rotation.y = Math.PI / 4;
    brassRing.position.set(0.38, -0.14 + 0.08, 0.04);
    parent.add(brassRing);

    // 3. LOWER SHELF / COUNTERTOP: Cocktail Shaker & Champagne Flutes
    const shaker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.035, 0.20, 20),
      this.brassMaterial
    );
    shaker.position.set(-0.42, -0.44 + 0.10, 0.06);
    parent.add(shaker);

    [0.34, 0.44].forEach((fx) => {
      const flute = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.012, 0.18, 16),
        glassMat
      );
      flute.position.set(fx, -0.44 + 0.09, 0.06);
      parent.add(flute);
    });
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: DOOR OPENING (Twin 90° swinging vitrine doors)
  // ---------------------------------------------------------------------------
  setDoorOpen(progress) {
    this.doorOpenProgress = progress;
    const p = progress;
    // Left door swings open outward to the left
    this.doorLeft.rotation.y = -Math.PI * 0.55 * p;
    // Right door swings open outward to the right
    this.doorRight.rotation.y = Math.PI * 0.55 * p;
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: DRAWER SLIDING
  // ---------------------------------------------------------------------------
  setDrawerOpen(progress) {
    this.drawerOpenProgress = progress;
    const p = progress;
    this.drawers.forEach((dr) => {
      dr.group.position.z = dr.baseZ + p * (0.28 + dr.idx * 0.06);
    });
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: EXPLODE VIEW
  // ---------------------------------------------------------------------------
  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    // Top crown floats upward
    this.topCrown.position.y = (this.upperGroup.position.y + 0.98 / 2) + p * 0.65;

    // Doors float forward and swing
    this.doorLeft.position.z = 0.24 + p * 0.55;
    this.doorRight.position.z = 0.24 + p * 0.55;
    this.doorLeft.rotation.y = -Math.PI * 0.35 * p;
    this.doorRight.rotation.y = Math.PI * 0.35 * p;

    // Marble shelf lifts
    this.marbleTopMesh.position.y = (0.20 + 0.54 + 0.038 / 2) + p * 0.35;

    // Side panels push outward
    this.sideL.position.x = -1.52 / 2 + 0.016 - p * 0.45;
    this.sideR.position.x = 1.52 / 2 - 0.016 + p * 0.45;

    // Lower drawers slide forward
    this.drawers.forEach((dr) => {
      dr.group.position.z = dr.baseZ + p * 0.65;
    });

    // Base drops slightly
    this.baseGroup.position.y = -p * 0.25;
  }

  // ---------------------------------------------------------------------------
  // DYNAMIC MATERIAL & COLOR SWITCHING
  // ---------------------------------------------------------------------------
  updateMaterials(mainMat, secondaryMat) {
    // 1. Update Carcass & Main Elements
    if (mainMat) {
      this.carcassMeshes.forEach((mesh) => {
        mesh.material = mainMat;
      });
    }

    // 2. Update Wood & Slatting
    if (secondaryMat) {
      this.woodMeshes.forEach((mesh) => {
        mesh.material = secondaryMat;
      });
    }
  }

  reset() {
    this.setDoorOpen(0);
    this.setDrawerOpen(0);
    this.setExplode(0);
    this.root.rotation.y = 0;
  }

  dispose() {
    this.root.traverse((c) => {
      if (c.isMesh && c.geometry) {
        c.geometry.dispose();
      }
    });
  }
}
