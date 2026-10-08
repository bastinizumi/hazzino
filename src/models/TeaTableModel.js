/**
 * HAZZINO INTERIORS — SCANDINAVIAN MULTI-TIER DUAL-STORAGE TEA / COFFEE TABLE
 * Faithfully matches the exact reference design:
 * - Rectangular floating tabletop with soft radius rounded corner fillets
 * - Full-width bottom platform deck chassis
 * - Left enclosed storage cabinet with swinging door & vertical curved natural wood handle
 * - Center open display cubby niche for books and ceramic succulent pot
 * - Right dual-tier structure: upper open shelf recess + lower sliding drawer with horizontal curved wooden handle
 * - 4 tapered splayed Scandinavian solid wood legs (8.5° outward rake)
 * - Curated tabletop styling: clear glass floral vase, ceramic dish, citrus lemon trio,
 *   mint-green teacup on saucer, and architectural design monographs
 * - Interactive: Door swings open, Drawer slides out, Exploded view, and Realtime PBR materials
 */
import * as THREE from 'three';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createGlassMaterial,
  createInteriorLiningMaterial,
} from './modelMaterials';

export class TeaTableModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'TeaTableModel';

    // Main Table Body Material (Default Alpine White lacquer, reacts to configurator selection)
    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xfaf8f5),
      roughness: 0.35,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Secondary Natural Wood Material (Legs & Curved Handles)
    this.woodMaterial = createFurnitureMaterial('natural_oak');
    this.woodMaterial.side = THREE.DoubleSide;

    // Additional Specialized Materials
    this.brassMaterial = createBrassAccentMaterial();
    this.glassMaterial = createGlassMaterial(0.28);
    this.interiorMaterial = createInteriorLiningMaterial();

    this.doorOpenProgress = 0;
    this.drawerOpenProgress = 0;
    this.explodeProgress = 0;

    this.mainMeshes = [];
    this.woodMeshes = [];

    this.buildModel();
  }

  buildModel() {
    const tableW = 1.22; // Width / Length (X)
    const tableD = 0.62; // Depth (Z)
    const tableH = 0.45; // Total Height (Y)
    const topThick = 0.024; // 24mm top slab
    const legH = 0.14; // 14cm legs
    const deckThick = 0.020; // 20mm bottom deck
    const bodyH = tableH - legH - topThick; // ~0.286m storage height

    // =========================================================================
    // 1. FOUR TAPERED SPLAYED SCANDINAVIAN SOLID WOOD LEGS
    // =========================================================================
    this.legsGroup = new THREE.Group();
    this.legsGroup.name = 'SplayedLegsGroup';

    const legTopR = 0.022;
    const legBtmR = 0.013;
    const legGeo = new THREE.CylinderGeometry(legTopR, legBtmR, legH * 1.02, 16);
    const ferruleGeo = new THREE.CylinderGeometry(legBtmR * 1.05, legBtmR, 0.018, 16);

    const legPositions = [
      { x: -0.48, z: 0.22, rotZ: -0.13, rotX: 0.13 },  // Front Left
      { x: 0.48, z: 0.22, rotZ: 0.13, rotX: 0.13 },   // Front Right
      { x: -0.48, z: -0.22, rotZ: -0.13, rotX: -0.13 }, // Rear Left
      { x: 0.48, z: -0.22, rotZ: 0.13, rotX: -0.13 },  // Rear Right
    ];

    legPositions.forEach((pos) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(pos.x, legH / 2, pos.z);
      legPivot.rotation.z = pos.rotZ;
      legPivot.rotation.x = pos.rotX;

      const legMesh = new THREE.Mesh(legGeo, this.woodMaterial);
      legMesh.castShadow = true;
      legPivot.add(legMesh);
      this.woodMeshes.push(legMesh);

      // Subtle warm brass footer glide
      const ferrule = new THREE.Mesh(ferruleGeo, this.brassMaterial);
      ferrule.position.y = -legH / 2 + 0.009;
      legPivot.add(ferrule);

      this.legsGroup.add(legPivot);
    });

    this.root.add(this.legsGroup);

    // =========================================================================
    // 2. BOTTOM BASE DECK PLATFORM CHASSIS
    // =========================================================================
    this.deckGroup = new THREE.Group();
    this.deckGroup.name = 'BaseDeckGroup';
    const deckW = 1.10;
    const deckD = 0.54;
    const deckY = legH + deckThick / 2;
    this.deckGroup.position.set(0, deckY, 0);

    const deckMesh = new THREE.Mesh(
      new THREE.BoxGeometry(deckW, deckThick, deckD),
      this.mainMaterial
    );
    deckMesh.castShadow = true;
    deckMesh.receiveShadow = true;
    this.deckGroup.add(deckMesh);
    this.mainMeshes.push(deckMesh);

    // Right extended tray ledge lip
    const rightLip = new THREE.Mesh(
      new THREE.BoxGeometry(0.016, 0.038, deckD),
      this.mainMaterial
    );
    rightLip.position.set(deckW / 2 - 0.008, 0.019 + deckThick / 2, 0);
    this.deckGroup.add(rightLip);
    this.mainMeshes.push(rightLip);

    this.root.add(this.deckGroup);

    // =========================================================================
    // 3. STORAGE COMPARTMENT BODY & PARTITIONS
    // =========================================================================
    const partY = legH + deckThick + bodyH / 2;
    this.bodyGroup = new THREE.Group();
    this.bodyGroup.name = 'StorageBodyGroup';
    this.bodyGroup.position.set(0, partY, 0);

    // 3.1 Left Outer Side Wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, bodyH, deckD),
      this.mainMaterial
    );
    leftWall.position.set(-deckW / 2 + 0.009, 0, 0);
    leftWall.castShadow = true;
    this.bodyGroup.add(leftWall);
    this.mainMeshes.push(leftWall);

    // 3.2 Cabinet/Niche Divider Wall (between left cabinet and center niche)
    const cabDivX = -0.22;
    const cabDivWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, bodyH, deckD - 0.02),
      this.mainMaterial
    );
    cabDivWall.position.set(cabDivX, 0, 0);
    cabDivWall.castShadow = true;
    this.bodyGroup.add(cabDivWall);
    this.mainMeshes.push(cabDivWall);

    // Left Cabinet Back Panel
    const cabBack = new THREE.Mesh(
      new THREE.BoxGeometry(Math.abs(cabDivX - (-deckW / 2)), bodyH - 0.01, 0.016),
      this.mainMaterial
    );
    cabBack.position.set((-deckW / 2 + cabDivX) / 2, 0, -deckD / 2 + 0.012);
    this.bodyGroup.add(cabBack);
    this.mainMeshes.push(cabBack);

    // 3.3 Niche/Drawer Divider Wall (between center niche and right drawer section)
    const drawerDivX = 0.16;
    const drawerDivWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, bodyH, deckD - 0.02),
      this.mainMaterial
    );
    drawerDivWall.position.set(drawerDivX, 0, 0);
    drawerDivWall.castShadow = true;
    this.bodyGroup.add(drawerDivWall);
    this.mainMeshes.push(drawerDivWall);

    // 3.4 Right Outer Side Wall of Drawer Enclosure
    const drawerRightX = 0.52;
    const drawerRightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, bodyH, deckD - 0.04),
      this.mainMaterial
    );
    drawerRightWall.position.set(drawerRightX, 0, 0);
    drawerRightWall.castShadow = true;
    this.bodyGroup.add(drawerRightWall);
    this.mainMeshes.push(drawerRightWall);

    // 3.5 Right Horizontal Intermediate Shelf (dividing upper open recess & drawer)
    const rightShelfY = -bodyH / 2 + 0.16;
    const rightShelfW = drawerRightX - drawerDivX - 0.018;
    const rightShelf = new THREE.Mesh(
      new THREE.BoxGeometry(rightShelfW, 0.018, deckD - 0.03),
      this.mainMaterial
    );
    rightShelf.position.set((drawerDivX + drawerRightX) / 2, rightShelfY, 0);
    rightShelf.castShadow = true;
    this.bodyGroup.add(rightShelf);
    this.mainMeshes.push(rightShelf);

    // Upper shelf vertical divider (matching the reference photo)
    const upperSubDiv = new THREE.Mesh(
      new THREE.BoxGeometry(0.016, bodyH / 2 - rightShelfY, deckD * 0.72),
      this.mainMaterial
    );
    upperSubDiv.position.set((drawerDivX + drawerRightX) / 2 + 0.02, (rightShelfY + bodyH / 2) / 2, 0);
    this.bodyGroup.add(upperSubDiv);
    this.mainMeshes.push(upperSubDiv);

    this.root.add(this.bodyGroup);

    // =========================================================================
    // 4. INTERACTIVE LEFT CABINET DOOR WITH CURVED WOODEN PULL HANDLE
    // =========================================================================
    const doorW = Math.abs(cabDivX - (-deckW / 2)) - 0.01;
    const doorH = bodyH - 0.012;
    const doorThick = 0.018;
    this.doorPivotX = -deckW / 2 + 0.018;
    this.doorBaseZ = deckD / 2 + 0.005;

    this.doorPivot = new THREE.Group();
    this.doorPivot.name = 'CabinetDoorPivot';
    this.doorPivot.position.set(this.doorPivotX, partY, this.doorBaseZ);

    // Door Slab
    const doorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, doorH, doorThick),
      this.mainMaterial
    );
    doorMesh.position.set(doorW / 2, 0, 0);
    doorMesh.castShadow = true;
    this.doorPivot.add(doorMesh);
    this.mainMeshes.push(doorMesh);

    // Vertical Curved Solid Natural Wood Handle (Organic Arched Pull)
    const vertHandle = this.createCurvedWoodHandle(0.11, 0.028, true);
    vertHandle.position.set(doorW - 0.038, 0, doorThick / 2 + 0.014);
    this.doorPivot.add(vertHandle);

    this.root.add(this.doorPivot);

    // =========================================================================
    // 5. INTERACTIVE RIGHT PULL-OUT STORAGE DRAWER
    // =========================================================================
    const drawerW = rightShelfW - 0.014;
    const drawerH = 0.145;
    const drawerD = deckD - 0.06;
    const drawerY = legH + deckThick + drawerH / 2 + 0.004;
    this.drawerBaseZ = 0.01;

    this.drawerGroup = new THREE.Group();
    this.drawerGroup.name = 'StorageDrawerGroup';
    this.drawerGroup.position.set((drawerDivX + drawerRightX) / 2, drawerY, this.drawerBaseZ);

    // Drawer Front Face
    const drawerFront = new THREE.Mesh(
      new THREE.BoxGeometry(drawerW, drawerH, doorThick),
      this.mainMaterial
    );
    drawerFront.position.set(0, 0, drawerD / 2 + doorThick / 2);
    drawerFront.castShadow = true;
    this.drawerGroup.add(drawerFront);
    this.mainMeshes.push(drawerFront);

    // Horizontal Curved Solid Natural Wood Handle
    const horizHandle = this.createCurvedWoodHandle(0.12, 0.028, false);
    horizHandle.position.set(0, 0, drawerD / 2 + doorThick + 0.014);
    this.drawerGroup.add(horizHandle);

    // Drawer Box Body (Birch/Cedar Interior)
    const drawerBox = new THREE.Mesh(
      new THREE.BoxGeometry(drawerW - 0.03, drawerH - 0.02, drawerD),
      this.interiorMaterial
    );
    drawerBox.position.set(0, 0, 0);
    this.drawerGroup.add(drawerBox);

    this.root.add(this.drawerGroup);

    // =========================================================================
    // 6. FLOATING RECTANGULAR TABLETOP WITH RADIUS CORNER FILLETS
    // =========================================================================
    this.topGroup = new THREE.Group();
    this.topGroup.name = 'TabletopGroup';
    this.topBaseY = tableH - topThick / 2;
    this.topGroup.position.set(0, this.topBaseY, 0);

    // Main Floating Top Slab
    const topMesh = new THREE.Mesh(
      new THREE.BoxGeometry(tableW, topThick, tableD),
      this.mainMaterial
    );
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    this.topGroup.add(topMesh);
    this.mainMeshes.push(topMesh);

    // Rounded corner fillet caps on the 4 corners
    const cornerR = 0.022;
    const cornerGeo = new THREE.CylinderGeometry(cornerR, cornerR, topThick * 1.01, 16);
    [
      { x: tableW / 2 - cornerR, z: tableD / 2 - cornerR },
      { x: -tableW / 2 + cornerR, z: tableD / 2 - cornerR },
      { x: tableW / 2 - cornerR, z: -tableD / 2 + cornerR },
      { x: -tableW / 2 + cornerR, z: -tableD / 2 + cornerR },
    ].forEach((cPos) => {
      const cMesh = new THREE.Mesh(cornerGeo, this.mainMaterial);
      cMesh.position.set(cPos.x, 0, cPos.z);
      this.topGroup.add(cMesh);
      this.mainMeshes.push(cMesh);
    });

    // =========================================================================
    // 7. CURATED TABLETOP STYLING & DECORATIVE ARTIFACTS
    // =========================================================================
    this.buildTableAccessories(this.topGroup, topThick);

    this.root.add(this.topGroup);

    // Center Cubby Artifacts (Books & Ceramic Succulent Pot)
    this.buildCenterCubbyArtifacts(this.bodyGroup, bodyH, cabDivX, drawerDivX);
  }

  // ---------------------------------------------------------------------------
  // HELPER: ORGANIC CURVED SOLID NATURAL WOOD HANDLE
  // ---------------------------------------------------------------------------
  createCurvedWoodHandle(length, depth, isVertical = false) {
    const handleGroup = new THREE.Group();
    handleGroup.name = isVertical ? 'VerticalCurvedHandle' : 'HorizontalCurvedHandle';

    const halfL = length / 2;
    const curvePoints = [
      new THREE.Vector3(-halfL, 0, 0),
      new THREE.Vector3(-halfL * 0.6, 0, depth * 0.75),
      new THREE.Vector3(0, 0, depth),
      new THREE.Vector3(halfL * 0.6, 0, depth * 0.75),
      new THREE.Vector3(halfL, 0, 0),
    ];

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.0075, 12, false);
    const handleMesh = new THREE.Mesh(tubeGeo, this.woodMaterial);
    handleMesh.castShadow = true;

    if (isVertical) {
      handleMesh.rotation.z = Math.PI / 2;
    }

    handleGroup.add(handleMesh);
    this.woodMeshes.push(handleMesh);

    return handleGroup;
  }

  // ---------------------------------------------------------------------------
  // CURATED TABLETOP ACCESSORIES (MATCHING PHOTO)
  // ---------------------------------------------------------------------------
  buildTableAccessories(parent, topThick) {
    const yTop = topThick / 2;

    // 1. Slender Glass Floral Vase with White Blossoms
    const vaseGroup = new THREE.Group();
    vaseGroup.position.set(-0.28, yTop, -0.06);

    const vaseGeo = new THREE.CylinderGeometry(0.042, 0.045, 0.18, 20);
    const vaseMesh = new THREE.Mesh(vaseGeo, this.glassMaterial);
    vaseMesh.position.y = 0.09;
    vaseMesh.castShadow = true;
    vaseGroup.add(vaseMesh);

    // Water level inside
    const waterMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.041, 0.09, 16),
      new THREE.MeshStandardMaterial({
        color: 0x98b8c2,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.5,
      })
    );
    waterMesh.position.y = 0.05;
    vaseGroup.add(waterMesh);

    // Organic green stems and delicate white blossoms
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x415b37, roughness: 0.8 });
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const petalGeo = new THREE.SphereGeometry(0.012, 8, 8);

    [-0.015, 0.01, 0.02].forEach((sx, idx) => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.26, 8), stemMat);
      stem.position.set(sx, 0.18, (idx - 1) * 0.01);
      stem.rotation.z = (idx - 1) * 0.12;
      vaseGroup.add(stem);

      // Blossom clusters along stem
      [0.22, 0.28, 0.31].forEach((fy) => {
        const blossom = new THREE.Mesh(petalGeo, flowerMat);
        blossom.position.set(sx + (idx - 1) * 0.02, fy, (idx - 1) * 0.015);
        vaseGroup.add(blossom);
      });
    });

    parent.add(vaseGroup);

    // 2. Ceramic Appetizer Dish with Miniature Glass Spice Jar
    const trayGroup = new THREE.Group();
    trayGroup.position.set(-0.35, yTop, 0.15);

    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.075, 0.012, 24),
      new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.5 })
    );
    plate.position.y = 0.006;
    trayGroup.add(plate);

    const miniJar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.055, 16),
      this.glassMaterial
    );
    miniJar.position.set(0.02, 0.035, 0);
    trayGroup.add(miniJar);

    const corkCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.018, 0.012, 16),
      this.woodMaterial
    );
    corkCap.position.set(0.02, 0.065, 0);
    trayGroup.add(corkCap);

    parent.add(trayGroup);

    // 3. Fresh Sunny Citrus Fruits (Trio of Lemons / Clementines)
    const fruitMat = new THREE.MeshStandardMaterial({
      color: 0xf7b71d,
      roughness: 0.45,
      metalness: 0.02,
    });
    const fruitGeo = new THREE.SphereGeometry(0.027, 16, 16);
    const stemTipGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.008, 6);

    const fruitCoords = [
      { x: -0.09, z: 0.08 },
      { x: -0.04, z: 0.06 },
      { x: -0.06, z: 0.12 },
    ];

    fruitCoords.forEach((fc) => {
      const lemon = new THREE.Mesh(fruitGeo, fruitMat);
      lemon.scale.set(1.15, 0.95, 0.95);
      lemon.position.set(fc.x, yTop + 0.025, fc.z);
      lemon.castShadow = true;
      parent.add(lemon);

      const calyx = new THREE.Mesh(stemTipGeo, stemMat);
      calyx.position.set(fc.x, yTop + 0.05, fc.z);
      parent.add(calyx);
    });

    // 4. Stack of Design Magazines & Art Monographs
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0.25, yTop, 0.08);
    bookGroup.rotation.y = -0.08;

    const book1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.022, 0.32),
      new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.7 })
    );
    book1.position.y = 0.011;
    book1.castShadow = true;
    bookGroup.add(book1);

    const book2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.018, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x242424, roughness: 0.6 })
    );
    book2.position.set(0.01, 0.031, 0.01);
    bookGroup.add(book2);

    parent.add(bookGroup);

    // 5. Mint-Green Ceramic Teacup on Saucer
    const teaGroup = new THREE.Group();
    teaGroup.position.set(0.23, yTop, -0.05);

    const mintMat = new THREE.MeshStandardMaterial({
      color: 0x93b7a5,
      roughness: 0.25,
      metalness: 0.05,
    });

    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.05, 0.012, 24),
      mintMat
    );
    saucer.position.y = 0.006;
    teaGroup.add(saucer);

    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.028, 0.052, 20),
      mintMat
    );
    cup.position.y = 0.032;
    cup.castShadow = true;
    teaGroup.add(cup);

    // Cup handle loop
    const cupHandle = new THREE.Mesh(
      new THREE.TorusGeometry(0.018, 0.004, 10, 16, Math.PI * 1.2),
      mintMat
    );
    cupHandle.rotation.z = Math.PI / 2;
    cupHandle.position.set(0.042, 0.035, 0);
    teaGroup.add(cupHandle);

    // Hot tea liquid surface inside
    const teaLiquid = new THREE.Mesh(
      new THREE.CircleGeometry(0.034, 16),
      new THREE.MeshStandardMaterial({ color: 0x8f5933, roughness: 0.15 })
    );
    teaLiquid.rotation.x = -Math.PI / 2;
    teaLiquid.position.y = 0.054;
    teaGroup.add(teaLiquid);

    parent.add(teaGroup);
  }

  // ---------------------------------------------------------------------------
  // CENTER CUBBY SHELF ARTIFACTS
  // ---------------------------------------------------------------------------
  buildCenterCubbyArtifacts(parent, bodyH, cabDivX, drawerDivX) {
    const midX = (cabDivX + drawerDivX) / 2;
    const shelfFloorY = -bodyH / 2 + 0.012;

    // Stack of 2 colored design books
    const cubbyBook1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.024, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x4f6d7a, roughness: 0.7 })
    );
    cubbyBook1.position.set(midX, shelfFloorY + 0.012, 0.02);
    cubbyBook1.rotation.y = 0.05;
    parent.add(cubbyBook1);

    const cubbyBook2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.19, 0.020, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x7a8b6e, roughness: 0.7 })
    );
    cubbyBook2.position.set(midX + 0.01, shelfFloorY + 0.034, 0.01);
    parent.add(cubbyBook2);

    // Petite White Ceramic Pot with Green Succulent
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.026, 0.048, 16),
      new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.4 })
    );
    pot.position.set(midX, shelfFloorY + 0.068, 0.01);
    parent.add(pot);

    const plantMat = new THREE.MeshStandardMaterial({ color: 0x476930, roughness: 0.6 });
    for (let l = 0; l < 8; l++) {
      const ang = (l / 8) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.035, 6), plantMat);
      leaf.position.set(midX + Math.cos(ang) * 0.022, shelfFloorY + 0.098, 0.01 + Math.sin(ang) * 0.022);
      leaf.rotation.x = Math.sin(ang) * 0.4;
      leaf.rotation.z = -Math.cos(ang) * 0.4;
      parent.add(leaf);
    }
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE CONTROLS: DOOR, DRAWER, EXPLODE
  // ---------------------------------------------------------------------------
  setDoorOpen(progress) {
    this.doorOpenProgress = progress;
    // Door hinges open outward smoothly
    this.doorPivot.rotation.y = -progress * 1.45;
  }

  setDrawerOpen(progress) {
    this.drawerOpenProgress = progress;
    // Drawer glides forward smoothly
    this.drawerGroup.position.z = this.drawerBaseZ + progress * 0.32;
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    // Tabletop lifts upward
    this.topGroup.position.y = this.topBaseY + p * 0.55;

    // Door swings open partially
    this.doorPivot.rotation.y = -p * 1.1;

    // Drawer slides forward
    this.drawerGroup.position.z = this.drawerBaseZ + p * 0.45;

    // Base deck and legs lower slightly
    this.deckGroup.position.y = (0.14 + 0.020 / 2) - p * 0.15;
    this.legsGroup.position.y = -p * 0.18;
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.mainMeshes.forEach((mesh) => {
        mesh.material = mainMat;
      });
    }
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
