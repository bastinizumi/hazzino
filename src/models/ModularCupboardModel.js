/**
 * HAZZINO INTERIORS — MODULAR CUPBOARD 3D MODEL
 * Medium-height architectural multi-purpose storage system.
 * Left Zone: Upper open display niche with ceramic decor + lower closed cupboard.
 * Right Zone: Upper fluted reeded glass door with brass frame + 3 tiered sliding drawers.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial, createGlassMaterial, createInteriorLiningMaterial } from './modelMaterials';

export class ModularCupboardModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'ModularCupboardModel';

    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0x30483c),
      roughness: 0.55,
      metalness: 0.05,
    });
    this.woodMaterial = createFurnitureMaterial('natural_oak');
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();
    this.flutedGlassMat = createGlassMaterial(0.35);

    this.doorOpenProgress = 0;
    this.drawerOpenProgress = 0;
    this.explodeProgress = 0;
    this.drawers = [];

    this.buildModel();
  }

  buildModel() {
    const width = 1.4;
    const height = 1.68;
    const depth = 0.46;
    const thickness = 0.032;

    // 1. CARCASS: Top and Bottom Panels with soft pill corners
    const topGeom = new THREE.BoxGeometry(width, thickness, depth);
    this.topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    this.topMesh.position.set(0, height - thickness / 2, 0);
    this.topMesh.castShadow = true;
    this.root.add(this.topMesh);

    const plinthH = 0.08;
    const plinthGeom = new THREE.BoxGeometry(width - 0.08, plinthH, depth - 0.08);
    this.plinthMesh = new THREE.Mesh(plinthGeom, this.woodMaterial);
    this.plinthMesh.position.set(0, plinthH / 2, 0);
    this.root.add(this.plinthMesh);

    const bottomGeom = new THREE.BoxGeometry(width, thickness, depth);
    this.bottomMesh = new THREE.Mesh(bottomGeom, this.mainMaterial);
    this.bottomMesh.position.set(0, plinthH + thickness / 2, 0);
    this.root.add(this.bottomMesh);

    // 2. CARCASS: Outer Side Panels & Center Divider
    const sideH = height - plinthH - thickness * 2;
    const sideY = plinthH + thickness + sideH / 2;
    const sideGeom = new THREE.BoxGeometry(thickness, sideH, depth);

    this.sideL = new THREE.Mesh(sideGeom, this.mainMaterial);
    this.sideL.position.set(-width / 2 + thickness / 2, sideY, 0);
    this.sideL.castShadow = true;
    this.root.add(this.sideL);

    this.sideR = new THREE.Mesh(sideGeom, this.mainMaterial);
    this.sideR.position.set(width / 2 - thickness / 2, sideY, 0);
    this.sideR.castShadow = true;
    this.root.add(this.sideR);

    // Center Vertical Divider
    this.divider = new THREE.Mesh(new THREE.BoxGeometry(thickness, sideH, depth - 0.04), this.woodMaterial);
    this.divider.position.set(0, sideY, -0.01);
    this.root.add(this.divider);

    // Back Panel
    const backGeom = new THREE.BoxGeometry(width - thickness * 2, sideH, 0.018);
    this.backMesh = new THREE.Mesh(backGeom, this.woodMaterial);
    this.backMesh.position.set(0, sideY, -depth / 2 + 0.015);
    this.root.add(this.backMesh);

    // Horizontal Shelf dividing upper & lower zones (at y = 0.88m)
    const midY = 0.88;
    const shelfGeomL = new THREE.BoxGeometry(width / 2 - thickness, thickness, depth - 0.04);
    this.midShelfL = new THREE.Mesh(shelfGeomL, this.woodMaterial);
    this.midShelfL.position.set(-width / 4, midY, -0.01);
    this.root.add(this.midShelfL);

    const shelfGeomR = new THREE.BoxGeometry(width / 2 - thickness, thickness, depth - 0.04);
    this.midShelfR = new THREE.Mesh(shelfGeomR, this.woodMaterial);
    this.midShelfR.position.set(width / 4, midY, -0.01);
    this.root.add(this.midShelfR);

    // 3. LEFT ZONE UPPER: Open Architectural Display Niche with Decor
    const vaseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.09, 0.28, 20),
      new THREE.MeshStandardMaterial({ color: 0xe8e2d5, roughness: 0.9 })
    );
    vaseMesh.position.set(-width / 4 - 0.1, midY + 0.16, 0.02);
    this.root.add(vaseMesh);

    // Art books stacked horizontally
    const bookStack = new THREE.Group();
    bookStack.position.set(-width / 4 + 0.12, midY + 0.04, 0.02);
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.2), new THREE.MeshStandardMaterial({ color: 0x1f1e1d, roughness: 0.5 }));
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, 0.19), new THREE.MeshStandardMaterial({ color: 0xb59b7c, roughness: 0.7 }));
    b2.position.set(0.01, 0.04, 0);
    b2.rotation.y = 0.06;
    bookStack.add(b1);
    bookStack.add(b2);
    this.root.add(bookStack);

    // 4. LEFT ZONE LOWER: Solid Timber Door
    const lowerDoorH = midY - plinthH - thickness;
    const doorW = width / 2 - thickness - 0.008;
    this.leftLowerDoorPivot = new THREE.Group();
    this.leftLowerDoorPivot.position.set(-width / 2 + thickness + 0.008, plinthH + thickness + lowerDoorH / 2, depth / 2 + 0.01);

    const lowerDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(doorW, lowerDoorH, 0.022), this.mainMaterial);
    lowerDoorMesh.position.set(doorW / 2, 0, 0);
    lowerDoorMesh.castShadow = true;
    this.leftLowerDoorPivot.add(lowerDoorMesh);

    const lowerHandle = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.18, 0.014), this.brassMaterial);
    lowerHandle.position.set(doorW - 0.03, 0, 0.014);
    this.leftLowerDoorPivot.add(lowerHandle);
    this.root.add(this.leftLowerDoorPivot);

    // 5. RIGHT ZONE UPPER: Fluted Glass Door with Brass Frame
    const upperDoorH = height - thickness - midY - thickness;
    this.rightUpperDoorPivot = new THREE.Group();
    this.rightUpperDoorPivot.position.set(width / 2 - thickness - 0.008, midY + thickness + upperDoorH / 2, depth / 2 + 0.01);

    const glassDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(doorW, upperDoorH, 0.02), this.flutedGlassMat);
    glassDoorMesh.position.set(-doorW / 2, 0, 0);

    const glassFrame = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.01, upperDoorH + 0.01, 0.024), this.brassMaterial);
    glassFrame.position.set(-doorW / 2, 0, 0);
    glassDoorMesh.add(glassFrame);

    this.rightUpperDoorPivot.add(glassDoorMesh);
    this.root.add(this.rightUpperDoorPivot);

    // 6. RIGHT ZONE LOWER: 3 Tiered Sliding Drawers
    const dH = (lowerDoorH - 0.04) / 3;
    const dDepth = depth - 0.08;

    [0, 1, 2].forEach((di) => {
      const drawer = new THREE.Group();
      drawer.position.set(width / 4, plinthH + thickness + 0.02 + di * (dH + 0.015) + dH / 2, 0);

      const dFront = new THREE.Mesh(new THREE.BoxGeometry(doorW, dH - 0.008, 0.022), this.woodMaterial);
      dFront.castShadow = true;
      drawer.add(dFront);

      const dBox = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.04, dH - 0.02, dDepth), this.interiorMaterial);
      dBox.position.set(0, 0, -dDepth / 2);
      drawer.add(dBox);

      // Inset brass pull
      const dPull = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.014, 0.012), this.brassMaterial);
      dPull.position.set(0, 0, 0.014);
      drawer.add(dPull);

      this.root.add(drawer);
      this.drawers.push(drawer);
    });
  }

  setDoorOpen(progress) {
    this.doorOpenProgress = progress;
    this.leftLowerDoorPivot.rotation.y = -Math.PI * 0.55 * progress;
    this.rightUpperDoorPivot.rotation.y = Math.PI * 0.55 * progress;
  }

  setDrawerOpen(progress) {
    this.drawerOpenProgress = progress;
    this.drawers.forEach((dr, idx) => {
      dr.position.z = progress * (0.18 + idx * 0.08);
    });
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    this.topMesh.position.y = 1.68 - 0.032 / 2 + p * 0.5;
    this.sideL.position.x = -0.7 + 0.032 / 2 - p * 0.45;
    this.sideR.position.x = 0.7 - 0.032 / 2 + p * 0.45;
    this.plinthMesh.position.y = 0.04 - p * 0.2;

    this.leftLowerDoorPivot.position.z = 0.23 + 0.01 + p * 0.6;
    this.rightUpperDoorPivot.position.z = 0.23 + 0.01 + p * 0.6;

    this.drawers.forEach((dr, idx) => {
      dr.position.z = p * (0.35 + idx * 0.12);
    });
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.topMesh.material = mainMat;
      this.sideL.material = mainMat;
      this.sideR.material = mainMat;
      this.leftLowerDoorPivot.children[0].material = mainMat;
    }
    if (secondaryMat) {
      this.plinthMesh.material = secondaryMat;
      this.divider.material = secondaryMat;
      this.midShelfL.material = secondaryMat;
      this.midShelfR.material = secondaryMat;
      this.drawers.forEach((dr) => {
        dr.children[0].material = secondaryMat;
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
      if (c.isMesh && c.geometry) c.geometry.dispose();
    });
  }
}
