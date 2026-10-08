/**
 * HAZZINO INTERIORS — BESPOKE ARCHITECT EXECUTIVE WRITING DESK 3D MODEL
 * Milanese modernist executive workspace:
 * - Aerodynamic sculpted desktop with beveled knife-edge and curved rear gallery curb
 * - Inlaid full-grain saddle leather blotter pad with perimeter satin brass reveal lip
 * - Cantilevered arch satin brass executive desk lamp with glowing warm LED head
 * - 3D fluted acoustic slatted drawers with full-width satin brass knife-edge pulls
 * - Center slimline lap drawer + tiered side pedestal storage with cedar lining
 * - Sculpted tapered stiletto trestle legs with turned champagne brass footer ferrules
 * - Satin brass architectural tie-stretcher rod with knurled joinery sleeves
 * - Curated executive desk set: brass pen trough, fountain pen, valet tray & art journal
 */
import * as THREE from 'three';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createInteriorLiningMaterial,
  createEmissiveWarmGlowMaterial,
} from './modelMaterials';

export class ArchitectWritingDeskModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'ArchitectWritingDeskModel';

    // Main Desktop & Body Material (reacts to user material/color choices)
    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0x4a3224),
      roughness: 0.6,
      metalness: 0.03,
      side: THREE.DoubleSide,
    });

    // Secondary Materials
    this.woodMaterial = createFurnitureMaterial('warm_walnut');
    this.woodMaterial.side = THREE.DoubleSide;

    this.leatherMaterial = createFurnitureMaterial('leather');
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();
    this.glowMaterial = createEmissiveWarmGlowMaterial(2.8);

    this.drawerOpenProgress = 0;
    this.explodeProgress = 0;

    this.mainMeshes = [];
    this.woodMeshes = [];
    this.leatherMeshes = [];
    this.drawers = [];

    this.buildModel();
  }

  buildModel() {
    const deskW = 1.68;
    const deskD = 0.80;
    const deskH = 0.76;
    const topThick = 0.042;

    // =========================================================================
    // 1. SCULPTURAL AERODYNAMIC DESKTOP & RAISED REAR GALLERY CURB
    // =========================================================================
    this.topGroup = new THREE.Group();
    this.topGroup.name = 'DesktopGroup';
    this.topGroup.position.set(0, deskH - topThick / 2, 0);

    // 1.1 Main Worktop Slab with Beveled Undercut
    const topGeom = new THREE.BoxGeometry(deskW, topThick, deskD);
    this.topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    this.topGroup.add(this.topMesh);
    this.mainMeshes.push(this.topMesh);

    // Rounded edge bevel fillets along front and sides
    const frontBevel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, deskW, 20),
      this.mainMaterial
    );
    frontBevel.rotation.z = Math.PI / 2;
    frontBevel.position.set(0, 0, deskD / 2);
    this.topGroup.add(frontBevel);
    this.mainMeshes.push(frontBevel);

    // 1.2 Elevated Curved Rear Gallery Curb (Executive Cockpit Surround)
    this.galleryGroup = new THREE.Group();
    this.galleryGroup.name = 'GalleryGroup';
    const galleryH = 0.055;
    const galleryThick = 0.028;

    // Rear gallery wall
    const rearGallery = new THREE.Mesh(
      new THREE.BoxGeometry(deskW - 0.08, galleryH, galleryThick),
      this.mainMaterial
    );
    rearGallery.position.set(0, topThick / 2 + galleryH / 2, -deskD / 2 + galleryThick / 2 + 0.02);
    rearGallery.castShadow = true;
    this.galleryGroup.add(rearGallery);
    this.mainMeshes.push(rearGallery);

    // Left and Right return gallery walls
    [-1, 1].forEach((dir) => {
      const returnWall = new THREE.Mesh(
        new THREE.BoxGeometry(galleryThick, galleryH, deskD * 0.38),
        this.mainMaterial
      );
      returnWall.position.set(
        dir * (deskW / 2 - 0.04 - galleryThick / 2),
        topThick / 2 + galleryH / 2,
        -deskD / 2 + 0.02 + (deskD * 0.38) / 2
      );
      returnWall.castShadow = true;
      this.galleryGroup.add(returnWall);
      this.mainMeshes.push(returnWall);
    });

    // Satin brass top protective lip along rear gallery
    const galleryBrassLip = new THREE.Mesh(
      new THREE.BoxGeometry(deskW - 0.06, 0.008, galleryThick + 0.006),
      this.brassMaterial
    );
    galleryBrassLip.position.set(0, topThick / 2 + galleryH + 0.004, -deskD / 2 + galleryThick / 2 + 0.02);
    this.galleryGroup.add(galleryBrassLip);

    this.topGroup.add(this.galleryGroup);

    // 1.3 Inlaid Full-Grain Saddle Leather Desk Blotter with Brass Reveal
    const blotterW = 0.94;
    const blotterD = 0.54;
    const blotterZ = 0.04;
    const blotterX = -0.14; // Shifted left to balance right pedestal

    // Brass perimeter reveal border tray
    const brassReveal = new THREE.Mesh(
      new THREE.BoxGeometry(blotterW + 0.016, 0.006, blotterD + 0.016),
      this.brassMaterial
    );
    brassReveal.position.set(blotterX, topThick / 2 + 0.002, blotterZ);
    this.topGroup.add(brassReveal);

    // Inlaid leather blotter pad
    const blotterGeom = new THREE.BoxGeometry(blotterW, 0.007, blotterD);
    this.blotterMesh = new THREE.Mesh(blotterGeom, this.leatherMaterial);
    this.blotterMesh.position.set(blotterX, topThick / 2 + 0.005, blotterZ);
    this.blotterMesh.receiveShadow = true;
    this.topGroup.add(this.blotterMesh);
    this.leatherMeshes.push(this.blotterMesh);

    // Subtle debossed Hazzino monogram crest in leather
    const crestInlay = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.008, 20),
      this.brassMaterial
    );
    crestInlay.position.set(blotterX + blotterW / 2 - 0.06, topThick / 2 + 0.006, blotterZ - blotterD / 2 + 0.06);
    this.topGroup.add(crestInlay);

    // 1.4 Flush Brass Cable Management Raceway & Wireless Port
    const cableBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.01, 0.07),
      this.brassMaterial
    );
    cableBox.position.set(0.42, topThick / 2 + 0.005, -deskD / 2 + 0.12);
    this.topGroup.add(cableBox);

    // Wireless induction charger disc
    const chargerPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.007, 24),
      this.leatherMaterial
    );
    chargerPad.position.set(0.60, topThick / 2 + 0.005, -deskD / 2 + 0.12);
    this.topGroup.add(chargerPad);
    this.leatherMeshes.push(chargerPad);

    // 1.5 Cantilevered Minimalist Brass Executive Desk Lamp (Integrated Warm LED!)
    this.buildCantileverDeskLamp(this.topGroup, topThick);

    // 1.6 Curated Executive Stationery Set
    this.buildExecutiveAccessories(this.topGroup, topThick, blotterX, blotterZ);

    this.root.add(this.topGroup);

    // =========================================================================
    // 2. SLIMLINE CENTER LAP DRAWER (SOFT-CLOSE VELVET/CEDAR LINED)
    // =========================================================================
    const lapW = 0.88;
    const lapH = 0.068;
    const lapD = 0.52;
    this.baseLapZ = deskD / 2 - 0.01;

    this.lapDrawerGroup = new THREE.Group();
    this.lapDrawerGroup.name = 'LapDrawerGroup';
    this.lapDrawerGroup.position.set(-0.14, deskH - topThick - lapH / 2, this.baseLapZ);

    // Front face
    const lapFront = new THREE.Mesh(
      new THREE.BoxGeometry(lapW, lapH, 0.024),
      this.mainMaterial
    );
    lapFront.castShadow = true;
    this.lapDrawerGroup.add(lapFront);
    this.mainMeshes.push(lapFront);

    // Full-width satin brass recessed knife-edge pull profile
    const lapPull = new THREE.Mesh(
      new THREE.BoxGeometry(lapW - 0.08, 0.012, 0.016),
      this.brassMaterial
    );
    lapPull.position.set(0, -lapH / 2 + 0.008, 0.014);
    this.lapDrawerGroup.add(lapPull);

    // Interior cedar tray
    const lapBox = new THREE.Mesh(
      new THREE.BoxGeometry(lapW - 0.04, lapH - 0.02, lapD),
      this.interiorMaterial
    );
    lapBox.position.set(0, 0, -lapD / 2);
    this.lapDrawerGroup.add(lapBox);

    // Velvet interior dividers for sketches, pens, and drafting tools
    [-0.20, 0.16].forEach((divX) => {
      const div = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, lapH - 0.028, lapD - 0.04),
        this.woodMaterial
      );
      div.position.set(divX, 0, -lapD / 2);
      this.lapDrawerGroup.add(div);
      this.woodMeshes.push(div);
    });

    this.root.add(this.lapDrawerGroup);
    this.drawers.push({ group: this.lapDrawerGroup, baseZ: this.baseLapZ, maxSlide: 0.38 });

    // =========================================================================
    // 3. RIGHT FLOATING STORAGE PEDESTAL (3D FLUTED MICRO-RIBBED DRAWERS)
    // =========================================================================
    const pedW = 0.42;
    const pedH = 0.36;
    const pedD = 0.64;
    const pedX = deskW / 2 - pedW / 2 - 0.06;
    const pedY = deskH - topThick - pedH / 2 - 0.015;

    this.pedestalGroup = new THREE.Group();
    this.pedestalGroup.name = 'StoragePedestalGroup';
    this.pedestalGroup.position.set(pedX, pedY, 0.01);

    // Floating spacer brass reveal line between top and pedestal
    const pedSpacer = new THREE.Mesh(
      new THREE.BoxGeometry(pedW - 0.04, 0.014, pedD - 0.04),
      this.brassMaterial
    );
    pedSpacer.position.set(0, pedH / 2 + 0.007, 0);
    this.pedestalGroup.add(pedSpacer);

    // Pedestal outer casing
    const pedCasing = new THREE.Mesh(
      new THREE.BoxGeometry(pedW, pedH, pedD),
      this.mainMaterial
    );
    pedCasing.castShadow = true;
    pedCasing.receiveShadow = true;
    this.pedestalGroup.add(pedCasing);
    this.mainMeshes.push(pedCasing);

    // 2 Tiered Fluted Sliding Drawers inside pedestal
    const tierH = (pedH - 0.04) / 2;
    const tierZ = pedD / 2 + 0.008;

    [-1, 1].forEach((dir, idx) => {
      const tierDrawer = new THREE.Group();
      const dy = (dir * (tierH + 0.01)) / 2;
      tierDrawer.position.set(0, dy, tierZ);

      // Fluted drawer front
      const tFront = new THREE.Mesh(
        new THREE.BoxGeometry(pedW - 0.018, tierH - 0.01, 0.024),
        this.mainMaterial
      );
      tFront.castShadow = true;
      tierDrawer.add(tFront);
      this.mainMeshes.push(tFront);

      // 3D vertical fluted acoustic micro-ribs across drawer face
      const numRibs = 14;
      const ribStep = (pedW - 0.04) / numRibs;
      for (let r = 0; r < numRibs; r++) {
        const rx = -(pedW - 0.04) / 2 + ribStep * (r + 0.5);
        const rib = new THREE.Mesh(
          new THREE.CylinderGeometry(0.004, 0.004, tierH - 0.018, 10),
          this.woodMaterial
        );
        rib.scale.set(1.0, 1.0, 0.5);
        rib.position.set(rx, 0, 0.014);
        tierDrawer.add(rib);
        this.woodMeshes.push(rib);
      }

      // Satin brass recessed knife-edge pull profile
      const tPull = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.012, 0.014),
        this.brassMaterial
      );
      tPull.position.set(0, tierH / 2 - 0.012, 0.015);
      tierDrawer.add(tPull);

      // Interior box
      const tBox = new THREE.Mesh(
        new THREE.BoxGeometry(pedW - 0.05, tierH - 0.02, pedD - 0.06),
        this.interiorMaterial
      );
      tBox.position.set(0, 0, -(pedD - 0.06) / 2);
      tierDrawer.add(tBox);

      this.pedestalGroup.add(tierDrawer);
      this.drawers.push({ group: tierDrawer, baseZ: tierZ, maxSlide: 0.32, isPedestal: true });
    });

    this.root.add(this.pedestalGroup);

    // =========================================================================
    // 4. ARCHITECTURAL STILETTO TRESTLE BASE WITH TURNED BRASS FERRULES
    // =========================================================================
    this.legsGroup = new THREE.Group();
    this.legsGroup.name = 'TrestleBaseGroup';

    // 4.1 Left Sculpted Trestle Leg Assembly (A-frame architectural wishbone)
    const leftTrestleX = -deskW / 2 + 0.14;
    const legH = deskH - topThick;
    const legGeo = new THREE.CylinderGeometry(0.018, 0.012, legH, 16);
    const ferruleGeo = new THREE.CylinderGeometry(0.0135, 0.012, 0.07, 16);

    const trestleConfigs = [
      { x: leftTrestleX, zFront: deskD * 0.34, zRear: -deskD * 0.34 },
      { x: pedX, zFront: deskD * 0.32, zRear: -deskD * 0.32 },
    ];

    trestleConfigs.forEach((tCfg) => {
      const trestlePair = new THREE.Group();
      trestlePair.position.set(tCfg.x, legH / 2, 0);

      // Front leg (tapered & angled forward)
      const frontPivot = new THREE.Group();
      frontPivot.position.set(0, 0, tCfg.zFront);
      frontPivot.rotation.x = 0.09;

      const legF = new THREE.Mesh(legGeo, this.woodMaterial);
      legF.castShadow = true;
      frontPivot.add(legF);
      this.woodMeshes.push(legF);

      const ferruleF = new THREE.Mesh(ferruleGeo, this.brassMaterial);
      ferruleF.position.y = -legH / 2 + 0.035;
      frontPivot.add(ferruleF);
      trestlePair.add(frontPivot);

      // Rear leg (tapered & angled backward)
      const rearPivot = new THREE.Group();
      rearPivot.position.set(0, 0, tCfg.zRear);
      rearPivot.rotation.x = -0.09;

      const legR = new THREE.Mesh(legGeo, this.woodMaterial);
      legR.castShadow = true;
      rearPivot.add(legR);
      this.woodMeshes.push(legR);

      const ferruleR = new THREE.Mesh(ferruleGeo, this.brassMaterial);
      ferruleR.position.y = -legH / 2 + 0.035;
      rearPivot.add(ferruleR);
      trestlePair.add(rearPivot);

      // Top connecting arch rail
      const topRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.036, 0.038, deskD * 0.76),
        this.woodMaterial
      );
      topRail.position.set(0, legH / 2 - 0.019, 0);
      trestlePair.add(topRail);
      this.woodMeshes.push(topRail);

      // Lower joinery cross-rail
      const btmRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.024, 0.022, deskD * 0.68),
        this.woodMaterial
      );
      btmRail.position.set(0, -legH / 2 + 0.16, 0);
      trestlePair.add(btmRail);
      this.woodMeshes.push(btmRail);

      this.legsGroup.add(trestlePair);
    });

    // 4.2 Solid Satin Champagne Brass Horizontal Tie Stretcher Rod
    const tieLen = Math.abs(pedX - leftTrestleX);
    this.tieRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.013, 0.013, tieLen, 16),
      this.brassMaterial
    );
    this.tieRod.rotation.z = Math.PI / 2;
    this.tieRod.position.set((leftTrestleX + pedX) / 2, 0.16, 0);
    this.legsGroup.add(this.tieRod);

    // Turned brass joinery collars at both ends
    [-tieLen / 2, tieLen / 2].forEach((cx) => {
      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.035, 16),
        this.brassMaterial
      );
      collar.rotation.z = Math.PI / 2;
      collar.position.set((leftTrestleX + pedX) / 2 + cx, 0.16, 0);
      this.legsGroup.add(collar);
    });

    this.root.add(this.legsGroup);
  }

  // ---------------------------------------------------------------------------
  // INTEGRATED CANTILEVER DESK LAMP (BRUSHED BRASS & WARM LED)
  // ---------------------------------------------------------------------------
  buildCantileverDeskLamp(parent, topThick) {
    const lampGroup = new THREE.Group();
    lampGroup.name = 'DeskLampGroup';
    lampGroup.position.set(-0.62, topThick / 2, -0.28);

    // Heavy machined brass base plinth
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.048, 0.018, 24),
      this.brassMaterial
    );
    lampBase.position.y = 0.009;
    lampGroup.add(lampBase);

    // Vertical riser tube
    const riser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.34, 16),
      this.brassMaterial
    );
    riser.position.set(0, 0.17, 0);
    lampGroup.add(riser);

    // Curved cantilever horizontal arm reaching over the desk
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.32, 16),
      this.brassMaterial
    );
    arm.rotation.x = Math.PI / 2;
    arm.position.set(0, 0.34, 0.15);
    lampGroup.add(arm);

    // Conical brass luminaire head
    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.048, 0.075, 20),
      this.brassMaterial
    );
    shade.position.set(0, 0.32, 0.30);
    lampGroup.add(shade);

    // Warm luminous LED downlight glow disc (washing light downward!)
    const ledDiffuser = new THREE.Mesh(
      new THREE.CircleGeometry(0.044, 20),
      this.glowMaterial
    );
    ledDiffuser.rotation.x = Math.PI / 2;
    ledDiffuser.position.set(0, 0.282, 0.30);
    lampGroup.add(ledDiffuser);

    parent.add(lampGroup);
    this.deskLamp = lampGroup;
  }

  // ---------------------------------------------------------------------------
  // CURATED EXECUTIVE DESK ACCESSORIES
  // ---------------------------------------------------------------------------
  buildExecutiveAccessories(parent, topThick, blotterX, blotterZ) {
    // 1. Machined Satin Brass Pen Trough
    const penTrough = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.014, 0.055),
      this.brassMaterial
    );
    penTrough.position.set(blotterX, topThick / 2 + 0.008, blotterZ - 0.22);
    parent.add(penTrough);

    // Luxury fountain pen
    const penBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.15, 12),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2, metalness: 0.8 })
    );
    penBody.rotation.z = Math.PI / 2;
    penBody.position.set(blotterX, topThick / 2 + 0.016, blotterZ - 0.22);
    parent.add(penBody);

    const penNib = new THREE.Mesh(
      new THREE.ConeGeometry(0.004, 0.016, 12),
      this.brassMaterial
    );
    penNib.rotation.z = -Math.PI / 2;
    penNib.position.set(blotterX + 0.082, topThick / 2 + 0.016, blotterZ - 0.22);
    parent.add(penNib);

    // 2. Leather Valet Catch-All Tray
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.022, 0.14),
      this.leatherMaterial
    );
    tray.position.set(0.48, topThick / 2 + 0.011, 0.08);
    parent.add(tray);
    this.leatherMeshes.push(tray);

    // 3. Architectural Sketch Monograph / Journal
    const book = new THREE.Group();
    book.position.set(0.46, topThick / 2 + 0.015, -0.12);
    book.rotation.y = -0.15;

    const bookCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.024, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x24201c, roughness: 0.7 })
    );
    book.add(bookCover);

    const bookPages = new THREE.Mesh(
      new THREE.BoxGeometry(0.152, 0.02, 0.21),
      new THREE.MeshStandardMaterial({ color: 0xf2ece1, roughness: 0.9 })
    );
    bookPages.position.set(0.004, 0, 0);
    book.add(bookPages);

    const goldRibbon = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.002, 0.24),
      this.brassMaterial
    );
    goldRibbon.position.set(0, 0.013, 0);
    book.add(goldRibbon);

    parent.add(book);
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: DRAWER SLIDING
  // ---------------------------------------------------------------------------
  setDrawerOpen(progress) {
    this.drawerOpenProgress = progress;
    const p = progress;

    // Lap drawer slides forward
    this.lapDrawerGroup.position.z = this.baseLapZ + p * 0.38;

    // Pedestal drawers slide forward
    this.drawers.forEach((d) => {
      if (d.isPedestal) {
        d.group.position.z = d.baseZ + p * d.maxSlide;
      }
    });
  }

  // ---------------------------------------------------------------------------
  // INTERACTION: EXPLODE VIEW
  // ---------------------------------------------------------------------------
  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    // Desktop lifts upward
    this.topGroup.position.y = 0.76 - 0.042 / 2 + p * 0.65;

    // Gallery rail lifts higher
    this.galleryGroup.position.y = p * 0.35;

    // Desk lamp floats upward
    if (this.deskLamp) this.deskLamp.position.y = 0.042 / 2 + p * 0.45;

    // Center lap drawer glides forward
    this.lapDrawerGroup.position.z = this.baseLapZ + p * 0.55;
    this.lapDrawerGroup.position.y = (0.76 - 0.042 - 0.068 / 2) + p * 0.25;

    // Pedestal floats outward to the right
    this.pedestalGroup.position.x = (1.68 / 2 - 0.42 / 2 - 0.06) + p * 0.45;

    // Pedestal drawers slide forward
    this.drawers.forEach((d) => {
      if (d.isPedestal) {
        d.group.position.z = d.baseZ + p * 0.45;
      }
    });

    // Trestle legs drop slightly
    this.legsGroup.position.y = -p * 0.22;
  }

  // ---------------------------------------------------------------------------
  // DYNAMIC MATERIAL & COLOR SWITCHING
  // ---------------------------------------------------------------------------
  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.mainMeshes.forEach((mesh) => {
        mesh.material = mainMat;
      });
    }
    if (secondaryMat) {
      this.leatherMeshes.forEach((mesh) => {
        mesh.material = secondaryMat;
      });
    }
  }

  reset() {
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
