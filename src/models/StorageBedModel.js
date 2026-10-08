/**
 * HAZZINO INTERIORS — BESPOKE ARCHITECTURAL MASTER BED 3D MODEL
 * Ultra-luxury low-profile floating platform bed inspired by Hazzino Bedroom Sanctuary:
 * - Wide architectural fluted walnut headboard with concealed warm LED cove wash
 * - Seamless plush upholstered vertical channel-tufted backrest panel
 * - Twin floating integrated walnut nightstands with luminous designer bedside lamps
 * - Deep multi-layer pillow-top mattress with rounded organic profile
 * - Voluminous fluffy European duvet with natural side drapes & folded cuff
 * - Tactile waffle-knit folded throw runner across foot
 * - 6 plush layered pillows (Euro shams, sleeping pillows, bouclé lumbar cushion)
 * - 3 functional cedar-lined sliding storage drawers (Left, Right, Front foot)
 */
import * as THREE from 'three';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createInteriorLiningMaterial,
  createEmissiveWarmGlowMaterial,
} from './modelMaterials';

export class StorageBedModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'StorageBedModel';

    // Main Upholstery Material (reacts to user material/color choices)
    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xede8dd),
      roughness: 0.92,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    // Wood, Lining & Lighting Materials
    this.woodMaterial = createFurnitureMaterial('warm_walnut');
    this.woodMaterial.side = THREE.DoubleSide;

    this.accentLinenMaterial = createFurnitureMaterial('linen');
    this.accentBoucleMaterial = createFurnitureMaterial('boucle');
    this.sheetMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.88,
      metalness: 0.0,
    });
    this.throwMaterial = new THREE.MeshStandardMaterial({
      color: 0xbaa490,
      roughness: 0.95,
      metalness: 0.0,
    });

    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();
    this.coveGlowMaterial = createEmissiveWarmGlowMaterial(2.4);
    this.lampShadeMaterial = createEmissiveWarmGlowMaterial(1.6);
    this.ceramicLampMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8e4dc,
      roughness: 0.55,
      metalness: 0.05,
    });

    this.storageOpenProgress = 0;
    this.explodeProgress = 0;

    // Track mesh collections for dynamic material updates
    this.upholsteryMeshes = [];
    this.woodMeshes = [];
    this.pillowGroups = [];

    this.buildModel();
  }

  // ---------------------------------------------------------------------------
  // PROCEDURAL GEOMETRY GENERATORS FOR ORGANIC SOFT FORMS
  // ---------------------------------------------------------------------------

  /** Creates a realistic crowned feather/foam pillow with soft edge falloff */
  createPuffyPillowGeometry(w, h, d, segments = 16) {
    const geo = new THREE.BoxGeometry(w, h, d, segments, 8, segments);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      const nx = x / (w / 2);
      const nz = z / (d / 2);

      // Pillow crown puff: maximum puff in center, tapering to piped seams
      const falloff = Math.max(0, (1 - nx * nx) * (1 - nz * nz));
      y *= 0.42 + 0.58 * Math.pow(falloff, 0.65);

      // Soft rounded corner tuck
      x *= 0.94 + 0.06 * (1 - Math.abs(nz) * 0.35);
      z *= 0.94 + 0.06 * (1 - Math.abs(nx) * 0.35);

      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /** Creates a deep luxury mattress with rounded corners & subtle crown */
  createMattressGeometry(w, h, d) {
    const geo = new THREE.BoxGeometry(w, h, d, 24, 8, 24);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      const nx = x / (w / 2);
      const nz = z / (d / 2);

      // Soften 4 vertical corners
      if (Math.abs(nx) > 0.75 && Math.abs(nz) > 0.75) {
        x *= 0.96;
        z *= 0.96;
      }
      // Top surface cushion puff
      if (y > 0) {
        const crown = Math.max(0, (1 - nx * nx) * (1 - nz * nz));
        y += crown * 0.025;
      }
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /** Creates a voluminous, fluffy duvet with graceful side and foot drape */
  createDuvetGeometry(w, length, thickness) {
    const geo = new THREE.BoxGeometry(w, thickness, length, 28, 6, 28);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      const nx = x / (w / 2);
      const nz = z / (length / 2);

      // Center fluffy crown
      const crown = Math.max(0, (1 - nx * nx) * (1 - nz * nz));
      if (y >= 0) {
        y += Math.pow(crown, 0.8) * 0.055;
      }

      // Side drape: slopes gracefully down the sides of the mattress
      const sideDist = Math.abs(nx);
      if (sideDist > 0.72) {
        const drapeFactor = Math.pow((sideDist - 0.72) / 0.28, 1.8);
        y -= drapeFactor * 0.12;
      }

      // Foot drape: slopes down at the bottom of the bed
      if (nz > 0.75) {
        const footDrape = Math.pow((nz - 0.75) / 0.25, 1.6);
        y -= footDrape * 0.10;
      }

      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // ---------------------------------------------------------------------------
  // MAIN MODEL BUILDER
  // ---------------------------------------------------------------------------
  buildModel() {
    const bedW = 2.15;
    const bedL = 2.25;
    const frameH = 0.28;

    // =========================================================================
    // 1. ARCHITECTURAL FLUTED HEADBOARD & FLOATING NIGHTSTAND SUITE
    // =========================================================================
    const hbGroup = new THREE.Group();
    hbGroup.name = 'HeadboardSuiteGroup';
    hbGroup.position.set(0, 0, -bedL / 2 + 0.05);

    // 1.1 Wide Smoked Walnut Architectural Backplate (3.3m wide)
    const backplateW = 3.3;
    const backplateH = 1.05;
    const backplateD = 0.07;

    const backplate = new THREE.Mesh(
      new THREE.BoxGeometry(backplateW, backplateH, backplateD),
      this.woodMaterial
    );
    backplate.position.set(0, backplateH / 2, 0);
    backplate.castShadow = true;
    backplate.receiveShadow = true;
    hbGroup.add(backplate);
    this.woodMeshes.push(backplate);

    // Top walnut finishing cap
    const topCap = new THREE.Mesh(
      new THREE.BoxGeometry(backplateW + 0.04, 0.028, backplateD + 0.04),
      this.woodMaterial
    );
    topCap.position.set(0, backplateH + 0.014, 0.005);
    hbGroup.add(topCap);
    this.woodMeshes.push(topCap);

    // 1.2 Concealed Architectural LED Cove Glow Strip washing warm light upward
    const coveLight = new THREE.Mesh(
      new THREE.BoxGeometry(backplateW - 0.06, 0.018, 0.03),
      this.coveGlowMaterial
    );
    coveLight.position.set(0, backplateH - 0.01, backplateD / 2 + 0.01);
    hbGroup.add(coveLight);

    // 1.3 Seamless Plush Upholstered Backrest with Vertical Stitched Channels
    const cushionPanelW = bedW - 0.08;
    const cushionPanelH = 0.74;
    const cushionPanelD = 0.12;

    this.channelGroup = new THREE.Group();
    this.channelGroup.position.set(0, frameH + cushionPanelH / 2 + 0.03, backplateD / 2 + cushionPanelD / 2);

    // Main upholstered cushioned base block
    const cushionGeom = new THREE.BoxGeometry(cushionPanelW, cushionPanelH, cushionPanelD);
    const cushionBase = new THREE.Mesh(cushionGeom, this.mainMaterial);
    cushionBase.castShadow = true;
    cushionBase.receiveShadow = true;
    this.channelGroup.add(cushionBase);
    this.upholsteryMeshes.push(cushionBase);

    // Vertical stitched channel quilting ribs across the headboard
    const numChannels = 7;
    const channelStep = cushionPanelW / numChannels;
    for (let i = 0; i < numChannels; i++) {
      const cx = -cushionPanelW / 2 + channelStep * (i + 0.5);
      const ribGeom = new THREE.CylinderGeometry(
        channelStep * 0.44,
        channelStep * 0.44,
        cushionPanelH - 0.04,
        16,
        1,
        false,
        0,
        Math.PI
      );
      const rib = new THREE.Mesh(ribGeom, this.mainMaterial);
      rib.scale.set(1.0, 1.0, 0.22);
      rib.rotation.y = -Math.PI / 2;
      rib.position.set(cx, 0, cushionPanelD / 2 + 0.005);
      rib.castShadow = true;
      this.channelGroup.add(rib);
      this.upholsteryMeshes.push(rib);

      // Stitched seam groove between channels
      if (i < numChannels - 1) {
        const seam = new THREE.Mesh(
          new THREE.BoxGeometry(0.006, cushionPanelH - 0.02, 0.018),
          new THREE.MeshStandardMaterial({ color: 0x1f1d1b, roughness: 0.9 })
        );
        seam.position.set(cx + channelStep / 2, 0, cushionPanelD / 2 + 0.01);
        this.channelGroup.add(seam);
      }
    }
    hbGroup.add(this.channelGroup);

    // 1.4 Twin Floating Integrated Nightstands with Designer Table Lamps
    this.nightstandLeft = new THREE.Group();
    this.nightstandLeft.position.set(-1.42, 0.32, 0.16);
    this.buildFloatingNightstand(this.nightstandLeft);
    hbGroup.add(this.nightstandLeft);

    this.nightstandRight = new THREE.Group();
    this.nightstandRight.position.set(1.42, 0.32, 0.16);
    this.buildFloatingNightstand(this.nightstandRight);
    hbGroup.add(this.nightstandRight);

    this.hbGroup = hbGroup;
    this.root.add(this.hbGroup);

    // =========================================================================
    // 2. LOW-PROFILE CANTILEVERED WALNUT PLATFORM CHASSIS
    // =========================================================================
    const chassisGroup = new THREE.Group();
    chassisGroup.name = 'BedChassisGroup';
    chassisGroup.position.set(0, frameH / 2, 0);

    // Cantilevered Walnut Platform Surround with rounded corners
    const platformGeom = new THREE.BoxGeometry(bedW, frameH - 0.06, bedL);
    this.chassisMesh = new THREE.Mesh(platformGeom, this.woodMaterial);
    this.chassisMesh.position.y = 0.03;
    this.chassisMesh.castShadow = true;
    this.chassisMesh.receiveShadow = true;
    chassisGroup.add(this.chassisMesh);
    this.woodMeshes.push(this.chassisMesh);

    // Satin Brass Accent Inlay Trim around lower chassis
    const brassTrim = new THREE.Mesh(
      new THREE.BoxGeometry(bedW + 0.008, 0.016, bedL + 0.008),
      this.brassMaterial
    );
    brassTrim.position.y = -frameH / 2 + 0.04;
    chassisGroup.add(brassTrim);

    // Recessed Shadow Base Plinth (creating the iconic floating effect)
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(bedW - 0.38, 0.11, bedL - 0.38),
      new THREE.MeshStandardMaterial({ color: 0x121110, roughness: 0.95 })
    );
    plinth.position.y = -frameH / 2 + 0.055;
    chassisGroup.add(plinth);

    this.chassisGroup = chassisGroup;
    this.root.add(this.chassisGroup);

    // =========================================================================
    // 3. FUNCTIONAL SLIDING STORAGE DRAWERS (LEFT, RIGHT, AND FRONT)
    // =========================================================================
    const drawerH = frameH - 0.09;

    // 3.1 Left Storage Drawer (slides out left on -X)
    this.leftDrawer = new THREE.Group();
    this.leftDrawer.position.set(-bedW / 2 + 0.02, frameH / 2 - 0.01, 0.1);
    this.buildUnderbedDrawer(this.leftDrawer, 0.88, drawerH, 0.98, 'left');
    this.root.add(this.leftDrawer);

    // 3.2 Right Storage Drawer (slides out right on +X)
    this.rightDrawer = new THREE.Group();
    this.rightDrawer.position.set(bedW / 2 - 0.02, frameH / 2 - 0.01, 0.1);
    this.buildUnderbedDrawer(this.rightDrawer, 0.88, drawerH, 0.98, 'right');
    this.root.add(this.rightDrawer);

    // 3.3 Front Foot Storage Drawer (slides out front on +Z)
    this.frontDrawer = new THREE.Group();
    this.frontDrawer.position.set(0, frameH / 2 - 0.01, bedL / 2 - 0.02);
    this.buildUnderbedDrawer(this.frontDrawer, 1.35, drawerH, 0.65, 'front');
    this.root.add(this.frontDrawer);

    // =========================================================================
    // 4. DEEP LUXURY MATTRESS, VOLUMINOUS DUVET, THROWS & 6 LAYERED PILLOWS
    // =========================================================================
    const mattressGroup = new THREE.Group();
    mattressGroup.name = 'BeddingMattressGroup';
    mattressGroup.position.set(0, frameH + 0.02, 0.06);

    const matW = bedW - 0.16;
    const matL = bedL - 0.18;
    const matH = 0.26;

    // 4.1 Deep Mattress Base with Organic Curves
    const matGeo = this.createMattressGeometry(matW, matH, matL);
    this.mattressMesh = new THREE.Mesh(matGeo, this.sheetMaterial);
    this.mattressMesh.position.set(0, matH / 2, 0);
    this.mattressMesh.castShadow = true;
    this.mattressMesh.receiveShadow = true;
    mattressGroup.add(this.mattressMesh);

    // Piped welt cord perimeter around mattress seam
    const weltCord = new THREE.Mesh(
      new THREE.BoxGeometry(matW + 0.01, 0.012, matL + 0.01),
      new THREE.MeshStandardMaterial({ color: 0xded9cf, roughness: 0.8 })
    );
    weltCord.position.set(0, matH - 0.01, 0);
    mattressGroup.add(weltCord);

    // 4.2 Voluminous Luxury Duvet / Comforter
    // Covers from below the pillows down to the foot with draped side overhangs
    const duvetW = matW + 0.14;
    const duvetL = matL * 0.72;
    const duvetThick = 0.13;

    const duvetGeo = this.createDuvetGeometry(duvetW, duvetL, duvetThick);
    this.duvetMesh = new THREE.Mesh(duvetGeo, this.mainMaterial);
    this.duvetMesh.position.set(0, matH + duvetThick / 2 - 0.01, 0.28);
    this.duvetMesh.castShadow = true;
    this.duvetMesh.receiveShadow = true;
    mattressGroup.add(this.duvetMesh);
    this.upholsteryMeshes.push(this.duvetMesh);

    // Rolled / Folded Duvet Turnover Cuff at top of duvet
    const cuffGeom = new THREE.CylinderGeometry(0.045, 0.045, duvetW - 0.06, 24);
    const cuffMesh = new THREE.Mesh(cuffGeom, this.sheetMaterial);
    cuffMesh.rotation.z = Math.PI / 2;
    cuffMesh.scale.set(0.75, 1.0, 1.4);
    cuffMesh.position.set(0, matH + 0.09, 0.28 - duvetL / 2 + 0.04);
    cuffMesh.castShadow = true;
    mattressGroup.add(cuffMesh);

    // 4.3 Tactile Waffle-Knit Throw Blanket / Bed Runner across foot
    const throwW = duvetW + 0.04;
    const throwL = 0.62;
    const throwThick = 0.035;

    const throwGeo = this.createDuvetGeometry(throwW, throwL, throwThick);
    const throwMesh = new THREE.Mesh(throwGeo, this.throwMaterial);
    throwMesh.position.set(0, matH + duvetThick + 0.01, 0.64);
    throwMesh.castShadow = true;
    throwMesh.receiveShadow = true;
    mattressGroup.add(throwMesh);

    // 4.4 Generous Set of 6 Plush Layered Pillows
    this.buildPlushPillows(mattressGroup, matH);

    this.mattressGroup = mattressGroup;
    this.root.add(this.mattressGroup);
  }

  // ---------------------------------------------------------------------------
  // FLOATING NIGHTSTAND CONSOLE & DESIGNER SCONCE / LAMP
  // ---------------------------------------------------------------------------
  buildFloatingNightstand(group) {
    const nsW = 0.52;
    const nsH = 0.22;
    const nsD = 0.38;

    // Smoked walnut floating shelf box
    const shelfGeom = new THREE.BoxGeometry(nsW, nsH, nsD);
    const shelf = new THREE.Mesh(shelfGeom, this.woodMaterial);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    group.add(shelf);
    this.woodMeshes.push(shelf);

    // Open cubby niche interior
    const cubbyGeom = new THREE.BoxGeometry(nsW - 0.06, nsH - 0.06, nsD - 0.04);
    const cubby = new THREE.Mesh(
      cubbyGeom,
      new THREE.MeshStandardMaterial({ color: 0x221a14, roughness: 0.9 })
    );
    cubby.position.set(0, 0, 0.02);
    group.add(cubby);

    // Prop: Stacked design books on shelf
    const bookGeom = new THREE.BoxGeometry(0.24, 0.035, 0.28);
    const book = new THREE.Mesh(
      bookGeom,
      new THREE.MeshStandardMaterial({ color: 0xefeae1, roughness: 0.5 })
    );
    book.position.set(0, -0.05, 0.02);
    group.add(book);

    // Designer Bedside Lamp on top of nightstand
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0, nsH / 2 + 0.01, 0);

    // Ceramic stone lamp base
    const baseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.075, 0.14, 24),
      this.ceramicLampMaterial
    );
    baseMesh.position.y = 0.07;
    baseMesh.castShadow = true;
    lampGroup.add(baseMesh);

    // Satin brass accent collar
    const collarMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.03, 16),
      this.brassMaterial
    );
    collarMesh.position.y = 0.155;
    lampGroup.add(collarMesh);

    // Warm luminous cylindrical shade
    const shadeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.17, 32),
      this.lampShadeMaterial
    );
    shadeMesh.position.y = 0.25;
    shadeMesh.castShadow = true;
    lampGroup.add(shadeMesh);

    group.add(lampGroup);
  }

  // ---------------------------------------------------------------------------
  // UNDER-BED SLIDING STORAGE DRAWERS
  // ---------------------------------------------------------------------------
  buildUnderbedDrawer(group, w, h, d, side) {
    const isFront = side === 'front';
    const frontW = isFront ? w : 0.032;
    const frontD = isFront ? 0.032 : d;

    // Solid Walnut Drawer Front Panel
    const frontMesh = new THREE.Mesh(
      new THREE.BoxGeometry(frontW, h, frontD),
      this.woodMaterial
    );
    frontMesh.castShadow = true;
    group.add(frontMesh);
    this.woodMeshes.push(frontMesh);

    // Interior Cedar Wood Storage Box
    const boxW = isFront ? w - 0.08 : 0.58;
    const boxD = isFront ? 0.58 : d - 0.08;
    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(boxW, h - 0.04, boxD),
      this.interiorMaterial
    );
    boxMesh.position.set(
      isFront ? 0 : side === 'left' ? 0.32 : -0.32,
      0,
      isFront ? -0.32 : 0
    );
    group.add(boxMesh);

    // Machined Satin Brass Flush Pull Bar
    const pullLen = isFront ? 0.24 : 0.02;
    const pullThick = isFront ? 0.02 : 0.24;
    const pullMesh = new THREE.Mesh(
      new THREE.BoxGeometry(pullLen, 0.024, pullThick),
      this.brassMaterial
    );
    pullMesh.position.set(
      isFront ? 0 : side === 'left' ? -0.022 : 0.022,
      0,
      isFront ? 0.022 : 0
    );
    group.add(pullMesh);
  }

  // ---------------------------------------------------------------------------
  // 6 PLUSH LAYERED LUXURY PILLOWS
  // ---------------------------------------------------------------------------
  buildPlushPillows(parent, matH) {
    // TIER 1: 2 King Euro Sham Pillows propped against headboard
    const euroGeo = this.createPuffyPillowGeometry(0.72, 0.38, 0.16);
    [-0.52, 0.52].forEach((px, idx) => {
      const euro = new THREE.Mesh(euroGeo, this.mainMaterial);
      euro.position.set(px, matH + 0.24, -0.74);
      euro.rotation.x = -0.28;
      euro.rotation.y = idx === 0 ? 0.04 : -0.04;
      euro.castShadow = true;
      euro.receiveShadow = true;
      parent.add(euro);
      this.upholsteryMeshes.push(euro);
      this.pillowGroups.push(euro);
    });

    // TIER 2: 2 Soft Sleeping Feather Pillows in front
    const sleepGeo = this.createPuffyPillowGeometry(0.66, 0.22, 0.40);
    [-0.52, 0.52].forEach((px, idx) => {
      const pillow = new THREE.Mesh(sleepGeo, this.sheetMaterial);
      pillow.position.set(px, matH + 0.12, -0.48);
      pillow.rotation.x = -0.12;
      pillow.rotation.y = idx === 0 ? 0.03 : -0.03;
      pillow.castShadow = true;
      pillow.receiveShadow = true;
      parent.add(pillow);
      this.pillowGroups.push(pillow);
    });

    // TIER 3: Centered Long Bouclé Lumbar Cushion
    const lumbarGeo = this.createPuffyPillowGeometry(0.68, 0.18, 0.22);
    const lumbar = new THREE.Mesh(lumbarGeo, this.accentBoucleMaterial);
    lumbar.position.set(0, matH + 0.11, -0.26);
    lumbar.rotation.x = -0.08;
    lumbar.castShadow = true;
    lumbar.receiveShadow = true;
    parent.add(lumbar);
    this.pillowGroups.push(lumbar);

    // Decorative Accent Cushion on the right
    const accentGeo = this.createPuffyPillowGeometry(0.36, 0.16, 0.36);
    const accent = new THREE.Mesh(accentGeo, this.mainMaterial);
    accent.position.set(0.48, matH + 0.12, -0.26);
    accent.rotation.x = -0.15;
    accent.rotation.y = 0.22;
    accent.castShadow = true;
    accent.receiveShadow = true;
    parent.add(accent);
    this.upholsteryMeshes.push(accent);
    this.pillowGroups.push(accent);
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: STORAGE DRAWER SLIDE OPEN
  // ---------------------------------------------------------------------------
  setStorageOpen(progress) {
    this.storageOpenProgress = progress;
    const p = progress;

    // Left drawer slides out left on -X
    this.leftDrawer.position.x = -2.15 / 2 + 0.02 - p * 0.72;

    // Right drawer slides out right on +X
    this.rightDrawer.position.x = 2.15 / 2 - 0.02 + p * 0.72;

    // Front foot drawer slides out front on +Z
    this.frontDrawer.position.z = 2.25 / 2 - 0.02 + p * 0.65;
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: EXPLODE VIEW
  // ---------------------------------------------------------------------------
  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    // Headboard slides backward
    this.hbGroup.position.z = -2.25 / 2 + 0.05 - p * 0.85;

    // Mattress & bedding suite floats smoothly upward
    this.mattressGroup.position.y = 0.28 + 0.02 + p * 0.85;

    // Pillows articulate and float higher
    this.pillowGroups.forEach((pill, idx) => {
      pill.position.y += p * (0.15 + idx * 0.05);
    });

    // Bed platform drops slightly
    this.chassisGroup.position.y = 0.28 / 2 - p * 0.18;

    // Drawers slide outward
    this.leftDrawer.position.x = -2.15 / 2 + 0.02 - p * 0.95;
    this.rightDrawer.position.x = 2.15 / 2 - 0.02 + p * 0.95;
    this.frontDrawer.position.z = 2.25 / 2 - 0.02 + p * 0.85;
  }

  // ---------------------------------------------------------------------------
  // DYNAMIC MATERIAL & COLOR SWITCHING
  // ---------------------------------------------------------------------------
  updateMaterials(mainMat, secondaryMat) {
    // 1. Update Upholstered Channel Flutes, Duvet, and Accent Pillows
    if (mainMat) {
      this.upholsteryMeshes.forEach((mesh) => {
        mesh.material = mainMat;
      });
    }

    // 2. Update Wood Platform Chassis, Headboard Backplate, Nightstands & Drawers
    if (secondaryMat) {
      this.woodMeshes.forEach((mesh) => {
        mesh.material = secondaryMat;
      });
    }
  }

  reset() {
    this.setStorageOpen(0);
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
