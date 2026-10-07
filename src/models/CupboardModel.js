/**
 * HAZZINO INTERIORS — PROCEDURAL ARCHITECTURAL CUPBOARD / WARDROBE MODEL
 * Features tall joinery carcass, sequential multi-door opening,
 * slide-out lower drawer tier, internal illuminated LED shelving, and exploded view.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial, createInteriorLiningMaterial } from './modelMaterials';

export class CupboardModel {
  constructor(materialKey = 'forest_lacquer') {
    this.root = new THREE.Group();
    this.root.name = 'CupboardModel';
    this.materialKey = materialKey;

    this.mainMaterial = createFurnitureMaterial(materialKey);
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();

    // Internal LED shelf glow material
    this.ledMaterial = new THREE.MeshBasicMaterial({
      color: 0xffe6b8,
    });

    this.parts = [];
    this.explodeProgress = 0;
    this.doorOpenProgress = 0;
    this.drawerOpenProgress = 0;
    this.internalLightIntensity = 0;

    this.buildModel();
  }

  buildModel() {
    const width = 1.6;
    const height = 2.1;
    const depth = 0.58;
    const thickness = 0.035;

    // 1. CARCASS: Top Cornice Panel
    const topGeom = new THREE.BoxGeometry(width, thickness, depth);
    const topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    const topGroup = new THREE.Group();
    topGroup.position.set(0, height / 2, 0);
    topGroup.add(topMesh);
    this.root.add(topGroup);
    this.registerPart('cornice', 'ARCHITECTURAL CORNICE', topGroup, [0, 1.2, 0]);

    // 2. CARCASS: Bottom Panel
    const bottomGeom = new THREE.BoxGeometry(width - thickness * 2, thickness, depth);
    const bottomMesh = new THREE.Mesh(bottomGeom, this.mainMaterial);
    bottomMesh.castShadow = true;
    bottomMesh.receiveShadow = true;
    const bottomGroup = new THREE.Group();
    bottomGroup.position.set(0, -height / 2 + 0.1, 0);
    bottomGroup.add(bottomMesh);
    this.root.add(bottomGroup);
    this.registerPart('plinth', 'RECESSED BASE PLINTH', bottomGroup, [0, -0.6, 0]);

    // 3. CARCASS: Left & Right Side Panels
    const sideH = height - 0.1;
    const sideGeom = new THREE.BoxGeometry(thickness, sideH, depth);

    const leftSideMesh = new THREE.Mesh(sideGeom, this.mainMaterial);
    leftSideMesh.castShadow = true;
    leftSideMesh.receiveShadow = true;
    const leftSideGroup = new THREE.Group();
    leftSideGroup.position.set(-width / 2 + thickness / 2, 0.05, 0);
    leftSideGroup.add(leftSideMesh);
    this.root.add(leftSideGroup);
    this.registerPart('side_left', 'LEFT CARCASS RETURN', leftSideGroup, [-1.0, 0, 0]);

    const rightSideMesh = new THREE.Mesh(sideGeom, this.mainMaterial);
    rightSideMesh.castShadow = true;
    rightSideMesh.receiveShadow = true;
    const rightSideGroup = new THREE.Group();
    rightSideGroup.position.set(width / 2 - thickness / 2, 0.05, 0);
    rightSideGroup.add(rightSideMesh);
    this.root.add(rightSideGroup);
    this.registerPart('side_right', 'RIGHT CARCASS RETURN', rightSideGroup, [1.0, 0, 0]);

    // 4. CARCASS: Back Panel
    const backGeom = new THREE.BoxGeometry(width - thickness * 2, sideH, 0.018);
    const backMesh = new THREE.Mesh(backGeom, this.interiorMaterial);
    backMesh.receiveShadow = true;
    const backGroup = new THREE.Group();
    backGroup.position.set(0, 0.05, -depth / 2 + 0.01);
    backGroup.add(backMesh);
    this.root.add(backGroup);
    this.registerPart('back', 'ACOUSTIC REAR LINING', backGroup, [0, 0, -0.9]);

    // 5. INTERNAL FIXED SHELVES WITH DIFFUSED LED STRIP
    const shelfGeom = new THREE.BoxGeometry(width - thickness * 2, 0.025, depth - 0.06);
    const shelvesGroup = new THREE.Group();

    // Shelf 1 (Middle)
    const shelf1 = new THREE.Mesh(shelfGeom, this.interiorMaterial);
    shelf1.position.set(0, 0.1, 0);
    shelf1.castShadow = true;
    shelf1.receiveShadow = true;
    shelvesGroup.add(shelf1);

    // Integrated LED light strip on underside of shelf
    const ledGeom = new THREE.BoxGeometry(width - thickness * 2 - 0.08, 0.008, 0.015);
    this.ledMesh1 = new THREE.Mesh(ledGeom, this.ledMaterial);
    this.ledMesh1.position.set(0, 0.085, 0.15);
    shelvesGroup.add(this.ledMesh1);

    // Shelf 2 (Upper)
    const shelf2 = new THREE.Mesh(shelfGeom, this.interiorMaterial);
    shelf2.position.set(0, 0.6, 0);
    shelf2.castShadow = true;
    shelf2.receiveShadow = true;
    shelvesGroup.add(shelf2);

    this.ledMesh2 = new THREE.Mesh(ledGeom, this.ledMaterial);
    this.ledMesh2.position.set(0, 0.585, 0.15);
    shelvesGroup.add(this.ledMesh2);

    shelvesGroup.position.set(0, 0, 0);
    this.root.add(shelvesGroup);
    this.registerPart('shelves', 'ILLUMINATED SHELVING', shelvesGroup, [0, 0.3, 0.4]);

    // 6. INTERNAL WARDROBE HANGING RAIL (Brushed brass rod)
    const railGeom = new THREE.CylinderGeometry(0.014, 0.014, width - thickness * 2 - 0.02, 16);
    const railMesh = new THREE.Mesh(railGeom, this.brassMaterial);
    railMesh.rotation.z = Math.PI / 2;
    const railGroup = new THREE.Group();
    railGroup.position.set(0, 0.42, 0);
    railGroup.add(railMesh);
    this.root.add(railGroup);
    this.registerPart('rail', 'BRUSHED BRASS WARDROBE RAIL', railGroup, [0, 0.2, -0.2]);

    // 7. REAL HINGE PIVOT DOORS (Upper Left & Right Doors)
    const doorW = (width - thickness * 2) / 2 - 0.004;
    const doorH = sideH * 0.72;
    const doorY = 0.28;

    // --- LEFT DOOR ---
    const doorLeftGeom = new THREE.BoxGeometry(doorW, doorH, 0.025);
    const doorLeftMesh = new THREE.Mesh(doorLeftGeom, this.mainMaterial);
    doorLeftMesh.castShadow = true;
    doorLeftMesh.receiveShadow = true;
    // Offset so hinge pivot is at outer edge
    doorLeftMesh.position.set(doorW / 2, 0, 0);

    // Knurled vertical brass handle
    const handleGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.45, 16);
    const handleLeft = new THREE.Mesh(handleGeom, this.brassMaterial);
    handleLeft.position.set(doorW - 0.04, -0.1, 0.025);
    doorLeftMesh.add(handleLeft);

    this.leftHingePivot = new THREE.Group();
    this.leftHingePivot.position.set(-width / 2 + thickness + 0.002, doorY, depth / 2 - 0.01);
    this.leftHingePivot.add(doorLeftMesh);

    const doorLeftExplodeGroup = new THREE.Group();
    doorLeftExplodeGroup.add(this.leftHingePivot);
    this.root.add(doorLeftExplodeGroup);
    this.registerPart('door_left', 'LEFT PIVOT DOOR', doorLeftExplodeGroup, [-0.9, 0.3, 0.8]);

    // --- RIGHT DOOR ---
    const doorRightGeom = new THREE.BoxGeometry(doorW, doorH, 0.025);
    const doorRightMesh = new THREE.Mesh(doorRightGeom, this.mainMaterial);
    doorRightMesh.castShadow = true;
    doorRightMesh.receiveShadow = true;
    doorRightMesh.position.set(-doorW / 2, 0, 0);

    const handleRight = new THREE.Mesh(handleGeom, this.brassMaterial);
    handleRight.position.set(-doorW + 0.04, -0.1, 0.025);
    doorRightMesh.add(handleRight);

    this.rightHingePivot = new THREE.Group();
    this.rightHingePivot.position.set(width / 2 - thickness - 0.002, doorY, depth / 2 - 0.01);
    this.rightHingePivot.add(doorRightMesh);

    const doorRightExplodeGroup = new THREE.Group();
    doorRightExplodeGroup.add(this.rightHingePivot);
    this.root.add(doorRightExplodeGroup);
    this.registerPart('door_right', 'RIGHT PIVOT DOOR', doorRightExplodeGroup, [0.9, 0.3, 0.8]);

    // 8. LOWER PULL-OUT PANTRY / ACCESSORY DRAWER
    const drawerH = sideH * 0.24;
    const drawerY = -height / 2 + 0.1 + drawerH / 2 + 0.02;

    this.drawerSliderGroup = new THREE.Group();
    this.drawerSliderGroup.position.set(0, 0, 0);

    // Front Panel
    const frontGeom = new THREE.BoxGeometry(width - thickness * 2 - 0.006, drawerH, 0.025);
    const frontMesh = new THREE.Mesh(frontGeom, this.mainMaterial);
    frontMesh.castShadow = true;
    frontMesh.receiveShadow = true;
    frontMesh.position.set(0, 0, depth / 2);
    this.drawerSliderGroup.add(frontMesh);

    // Horizontal brass pull handle
    const lowerHandleGeom = new THREE.BoxGeometry(0.24, 0.014, 0.02);
    const lowerHandle = new THREE.Mesh(lowerHandleGeom, this.brassMaterial);
    lowerHandle.position.set(0, drawerH / 2 - 0.025, depth / 2 + 0.02);
    this.drawerSliderGroup.add(lowerHandle);

    // Inside Drawer Box
    const boxBottomGeom = new THREE.BoxGeometry(width - thickness * 2 - 0.06, 0.015, depth - 0.08);
    const boxBottom = new THREE.Mesh(boxBottomGeom, this.interiorMaterial);
    boxBottom.position.set(0, -drawerH / 2 + 0.02, 0);
    this.drawerSliderGroup.add(boxBottom);

    const lowerDrawerRoot = new THREE.Group();
    lowerDrawerRoot.position.set(0, drawerY, 0);
    lowerDrawerRoot.add(this.drawerSliderGroup);
    this.root.add(lowerDrawerRoot);
    this.registerPart('lower_drawer', 'LOWER STORAGE TIER', lowerDrawerRoot, [0, -0.4, 0.9]);
  }

  registerPart(id, label, group, explodeDir) {
    this.parts.push({
      id,
      label,
      group,
      originalPos: group.position.clone(),
      originalRot: group.rotation.clone(),
      explodeDir: new THREE.Vector3(...explodeDir),
    });
  }

  setMaterial(materialKey) {
    this.materialKey = materialKey;
    const newMat = createFurnitureMaterial(materialKey);
    this.mainMaterial.dispose();
    this.mainMaterial = newMat;

    this.root.traverse((child) => {
      if (
        child.isMesh &&
        child.material !== this.brassMaterial &&
        child.material !== this.interiorMaterial &&
        child.material !== this.ledMaterial
      ) {
        child.material = this.mainMaterial;
      }
    });
  }

  setDoorOpen(progress) {
    this.doorOpenProgress = progress;
    // Sequential opening: Door 1 starts first (0 -> 0.7), Door 2 follows (0.2 -> 1.0)
    const p1 = Math.min(1, Math.max(0, progress * 1.3));
    const p2 = Math.min(1, Math.max(0, (progress - 0.2) * 1.25));

    if (this.leftHingePivot) {
      // Swings outward around edge hinge (-95 deg)
      this.leftHingePivot.rotation.y = -Math.PI * 0.54 * p1;
    }
    if (this.rightHingePivot) {
      // Swings outward around edge hinge (+95 deg)
      this.rightHingePivot.rotation.y = Math.PI * 0.54 * p2;
    }

    // Interior shelf LED activates smoothly as doors open
    const lightLevel = Math.min(1, progress * 1.5);
    this.ledMaterial.color.setRGB(1.0 * lightLevel, 0.9 * lightLevel, 0.72 * lightLevel);
  }

  setDrawerOpen(progress) {
    this.drawerOpenProgress = progress;
    const maxSlide = 0.42;
    if (this.drawerSliderGroup) {
      this.drawerSliderGroup.position.z = maxSlide * progress;
    }
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    this.parts.forEach((part) => {
      const targetPos = part.originalPos
        .clone()
        .add(part.explodeDir.clone().multiplyScalar(progress * 0.65));
      part.group.position.copy(targetPos);
    });
  }

  getPartScreenPositions(camera, renderer) {
    if (!renderer || !camera) return [];
    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;

    return this.parts.map((part) => {
      const worldPos = new THREE.Vector3();
      part.group.getWorldPosition(worldPos);
      worldPos.project(camera);

      const x = ((worldPos.x + 1) * width) / 2;
      const y = ((-worldPos.y + 1) * height) / 2;
      const visible = worldPos.z < 1.0;

      return {
        id: part.id,
        label: part.label,
        screenX: x,
        screenY: y,
        visible,
      };
    });
  }

  dispose() {
    this.mainMaterial.dispose();
    this.brassMaterial.dispose();
    this.interiorMaterial.dispose();
    this.ledMaterial.dispose();
    this.root.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
      }
    });
  }
}
