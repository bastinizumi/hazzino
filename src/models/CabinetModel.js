/**
 * HAZZINO INTERIORS — PROCEDURAL ARCHITECTURAL CABINET MODEL
 * Includes real hinge pivot doors, sliding drawers, internal shelves,
 * brass hardware, and physical exploded technical separation.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial, createInteriorLiningMaterial } from './modelMaterials';

export class CabinetModel {
  constructor(materialKey = 'natural_oak') {
    this.root = new THREE.Group();
    this.root.name = 'CabinetModel';
    this.materialKey = materialKey;

    this.mainMaterial = createFurnitureMaterial(materialKey);
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();

    this.parts = [];
    this.explodeProgress = 0;
    this.doorOpenProgress = 0;
    this.drawerOpenProgress = 0;

    this.buildModel();
  }

  buildModel() {
    const width = 2.0;
    const height = 0.72;
    const depth = 0.52;
    const thickness = 0.032;

    // 1. CARCASS: Top Panel
    const topGeom = new THREE.BoxGeometry(width, thickness, depth);
    const topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    const topGroup = new THREE.Group();
    topGroup.position.set(0, height / 2, 0);
    topGroup.add(topMesh);
    this.root.add(topGroup);
    this.registerPart('top', 'TOP PANEL', topGroup, [0, 0.9, 0]);

    // 2. CARCASS: Bottom Panel
    const bottomGeom = new THREE.BoxGeometry(width - thickness * 2, thickness, depth);
    const bottomMesh = new THREE.Mesh(bottomGeom, this.mainMaterial);
    bottomMesh.castShadow = true;
    bottomMesh.receiveShadow = true;
    const bottomGroup = new THREE.Group();
    bottomGroup.position.set(0, -height / 2 + 0.12, 0);
    bottomGroup.add(bottomMesh);
    this.root.add(bottomGroup);
    this.registerPart('bottom', 'BOTTOM PANEL', bottomGroup, [0, -0.4, 0]);

    // 3. CARCASS: Left Side Panel
    const sideH = height - 0.12;
    const sideGeom = new THREE.BoxGeometry(thickness, sideH, depth);
    const leftSideMesh = new THREE.Mesh(sideGeom, this.mainMaterial);
    leftSideMesh.castShadow = true;
    leftSideMesh.receiveShadow = true;
    const leftSideGroup = new THREE.Group();
    leftSideGroup.position.set(-width / 2 + thickness / 2, 0.06, 0);
    leftSideGroup.add(leftSideMesh);
    this.root.add(leftSideGroup);
    this.registerPart('side_left', 'LEFT SIDE PANEL', leftSideGroup, [-0.9, 0, 0]);

    // 4. CARCASS: Right Side Panel
    const rightSideMesh = new THREE.Mesh(sideGeom, this.mainMaterial);
    rightSideMesh.castShadow = true;
    rightSideMesh.receiveShadow = true;
    const rightSideGroup = new THREE.Group();
    rightSideGroup.position.set(width / 2 - thickness / 2, 0.06, 0);
    rightSideGroup.add(rightSideMesh);
    this.root.add(rightSideGroup);
    this.registerPart('side_right', 'RIGHT SIDE PANEL', rightSideGroup, [0.9, 0, 0]);

    // 5. CARCASS: Center Divider
    const divGeom = new THREE.BoxGeometry(thickness, sideH - thickness, depth - 0.04);
    const divMesh = new THREE.Mesh(divGeom, this.mainMaterial);
    divMesh.castShadow = true;
    divMesh.receiveShadow = true;
    const divGroup = new THREE.Group();
    divGroup.position.set(0, 0.06, -0.01);
    divGroup.add(divMesh);
    this.root.add(divGroup);
    this.registerPart('divider', 'CENTER DIVIDER', divGroup, [0, 0, -0.4]);

    // 6. CARCASS: Back Panel
    const backGeom = new THREE.BoxGeometry(width - thickness * 2, sideH - thickness, 0.016);
    const backMesh = new THREE.Mesh(backGeom, this.interiorMaterial);
    backMesh.receiveShadow = true;
    const backGroup = new THREE.Group();
    backGroup.position.set(0, 0.06, -depth / 2 + 0.01);
    backGroup.add(backMesh);
    this.root.add(backGroup);
    this.registerPart('back', 'REAR ACOUSTIC PANEL', backGroup, [0, 0, -0.9]);

    // 7. INTERNAL SHELF (Left Section)
    const shelfGeom = new THREE.BoxGeometry((width - thickness * 3) / 2 - 0.02, 0.022, depth - 0.08);
    const shelfMesh = new THREE.Mesh(shelfGeom, this.mainMaterial);
    shelfMesh.castShadow = true;
    shelfMesh.receiveShadow = true;
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-width / 4, 0.06, 0);
    shelfGroup.add(shelfMesh);
    this.root.add(shelfGroup);
    this.registerPart('shelf', 'ADJUSTABLE OAK SHELF', shelfGroup, [-0.4, 0.5, 0.3]);

    // 8. HINGED DOOR (Left Side Compartment)
    // REAL HINGE PIVOT on the far-left outer edge!
    const doorW = (width - thickness * 3) / 2 - 0.006;
    const doorH = sideH - thickness - 0.008;
    const doorGeom = new THREE.BoxGeometry(doorW, doorH, 0.024);

    // Fluted decorative slats on front face of door
    const doorMesh = new THREE.Mesh(doorGeom, this.mainMaterial);
    doorMesh.castShadow = true;
    doorMesh.receiveShadow = true;
    // Offset door mesh so its hinge is at (0, 0, 0) of the pivot group
    doorMesh.position.set(doorW / 2, 0, 0);

    // Slim brass edge handle
    const handleGeom = new THREE.CylinderGeometry(0.007, 0.007, 0.22, 16);
    const handleMesh = new THREE.Mesh(handleGeom, this.brassMaterial);
    handleMesh.rotation.z = Math.PI / 2;
    handleMesh.position.set(doorW - 0.04, 0, 0.02);
    doorMesh.add(handleMesh);

    // Left Hinge Pivot
    this.leftHingePivot = new THREE.Group();
    // Position hinge at outer left edge
    this.leftHingePivot.position.set(-width / 2 + thickness + 0.004, 0.06, depth / 2 - 0.01);
    this.leftHingePivot.add(doorMesh);

    const doorLeftExplodeGroup = new THREE.Group();
    doorLeftExplodeGroup.add(this.leftHingePivot);
    this.root.add(doorLeftExplodeGroup);
    this.registerPart('door_left', 'FLUTED HINGED DOOR', doorLeftExplodeGroup, [-0.8, 0, 0.9]);

    // 9. SLIDING DRAWERS (Right Side Compartment)
    // Drawer 1 (Upper)
    this.drawerUpperGroup = this.createDrawer(
      doorW,
      doorH * 0.46,
      depth - 0.08,
      'drawer_top',
      'UPPER CUTLERY TRAY',
      width / 4,
      0.06 + doorH * 0.24,
      [0, 0.3, 0.8]
    );

    // Drawer 2 (Lower)
    this.drawerLowerGroup = this.createDrawer(
      doorW,
      doorH * 0.46,
      depth - 0.08,
      'drawer_bottom',
      'LOWER DEEP STORAGE',
      width / 4,
      0.06 - doorH * 0.24,
      [0, -0.3, 0.8]
    );

    // 10. ARCHITECTURAL BASE / PLINTH
    const plinthGeom = new THREE.BoxGeometry(width - 0.16, 0.12, depth - 0.12);
    const plinthMesh = new THREE.Mesh(plinthGeom, this.mainMaterial);
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;

    // Brass shadowline trim
    const trimGeom = new THREE.BoxGeometry(width - 0.14, 0.015, depth - 0.1);
    const trimMesh = new THREE.Mesh(trimGeom, this.brassMaterial);
    trimMesh.position.set(0, 0.05, 0);
    plinthMesh.add(trimMesh);

    const plinthGroup = new THREE.Group();
    plinthGroup.position.set(0, -height / 2 + 0.06, 0);
    plinthGroup.add(plinthMesh);
    this.root.add(plinthGroup);
    this.registerPart('base', 'RECESSED TIMBER PLINTH', plinthGroup, [0, -0.8, 0]);
  }

  createDrawer(w, h, d, id, label, posX, posY, explodeDir) {
    const drawerRoot = new THREE.Group();
    drawerRoot.position.set(posX, posY, 0);

    // Sliding group inside drawerRoot
    const sliderGroup = new THREE.Group();
    sliderGroup.position.set(0, 0, 0);
    drawerRoot.add(sliderGroup);

    // Front Face
    const frontGeom = new THREE.BoxGeometry(w, h, 0.024);
    const frontMesh = new THREE.Mesh(frontGeom, this.mainMaterial);
    frontMesh.position.set(0, 0, d / 2 + 0.01);
    frontMesh.castShadow = true;
    sliderGroup.add(frontMesh);

    // Brass edge handle on front
    const handleGeom = new THREE.BoxGeometry(0.18, 0.012, 0.025);
    const handleMesh = new THREE.Mesh(handleGeom, this.brassMaterial);
    handleMesh.position.set(0, h / 2 - 0.02, d / 2 + 0.024);
    sliderGroup.add(handleMesh);

    // Drawer Box Bottom
    const boxBottomGeom = new THREE.BoxGeometry(w - 0.04, 0.015, d - 0.04);
    const boxBottomMesh = new THREE.Mesh(boxBottomGeom, this.interiorMaterial);
    boxBottomMesh.position.set(0, -h / 2 + 0.03, 0);
    sliderGroup.add(boxBottomMesh);

    // Drawer Box Sides
    const boxSideGeom = new THREE.BoxGeometry(0.015, h - 0.06, d - 0.04);
    const leftBoxSide = new THREE.Mesh(boxSideGeom, this.interiorMaterial);
    leftBoxSide.position.set(-w / 2 + 0.03, 0, 0);
    sliderGroup.add(leftBoxSide);

    const rightBoxSide = new THREE.Mesh(boxSideGeom, this.interiorMaterial);
    rightBoxSide.position.set(w / 2 - 0.03, 0, 0);
    sliderGroup.add(rightBoxSide);

    // Drawer Box Back
    const boxBackGeom = new THREE.BoxGeometry(w - 0.04, h - 0.06, 0.015);
    const boxBackMesh = new THREE.Mesh(boxBackGeom, this.interiorMaterial);
    boxBackMesh.position.set(0, 0, -d / 2 + 0.03);
    sliderGroup.add(boxBackMesh);

    this.root.add(drawerRoot);
    this.registerPart(id, label, drawerRoot, explodeDir);

    return sliderGroup;
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
      if (child.isMesh && child.material !== this.brassMaterial && child.material !== this.interiorMaterial) {
        child.material = this.mainMaterial;
      }
    });
  }

  setDoorOpen(progress) {
    this.doorOpenProgress = progress;
    if (this.leftHingePivot) {
      // Rotate around the physical hinge pivot on the edge (-88 degrees)
      const maxAngle = -Math.PI * 0.52;
      this.leftHingePivot.rotation.y = maxAngle * progress;
    }
  }

  setDrawerOpen(progress) {
    this.drawerOpenProgress = progress;
    const maxSlide = 0.38; // 38cm forward extension
    if (this.drawerUpperGroup) {
      this.drawerUpperGroup.position.z = maxSlide * progress;
    }
    if (this.drawerLowerGroup) {
      this.drawerLowerGroup.position.z = maxSlide * progress * 0.75;
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

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat && this.mainMaterial) {
      if (mainMat.color) this.mainMaterial.color.copy(mainMat.color);
      if (typeof mainMat.roughness === 'number') this.mainMaterial.roughness = mainMat.roughness;
      if (typeof mainMat.metalness === 'number') this.mainMaterial.metalness = mainMat.metalness;
    }
  }

  dispose() {
    this.mainMaterial.dispose();
    this.brassMaterial.dispose();
    this.interiorMaterial.dispose();
    this.root.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
      }
    });
  }
}
