/**
 * HAZZINO INTERIORS — PROCEDURAL ARCHITECTURAL TABLE MODEL
 * Features monolithic beveled slab, dual fluted architectural columns,
 * subframe joinery, brushed brass bases, and controlled exploded separation.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial, createInteriorLiningMaterial } from './modelMaterials';

export class TableModel {
  constructor(materialKey = 'travertine') {
    this.root = new THREE.Group();
    this.root.name = 'TableModel';
    this.materialKey = materialKey;

    this.mainMaterial = createFurnitureMaterial(materialKey);
    this.brassMaterial = createBrassAccentMaterial();
    this.subframeMaterial = createInteriorLiningMaterial();

    this.parts = [];
    this.explodeProgress = 0;

    this.buildModel();
  }

  buildModel() {
    const tableLength = 2.4;
    const tableWidth = 1.05;
    const slabThickness = 0.05;
    const tableHeight = 0.74;

    // 1. MONOLITHIC SLAB TABLETOP (Chamfered slab)
    const topGeom = new THREE.BoxGeometry(tableLength, slabThickness, tableWidth);
    const topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;

    // Sub-chamfer bevel trim
    const bevelGeom = new THREE.BoxGeometry(tableLength - 0.04, 0.015, tableWidth - 0.04);
    const bevelMesh = new THREE.Mesh(bevelGeom, this.mainMaterial);
    bevelMesh.position.set(0, -slabThickness / 2 - 0.007, 0);
    topMesh.add(bevelMesh);

    const topGroup = new THREE.Group();
    topGroup.position.set(0, tableHeight / 2, 0);
    topGroup.add(topMesh);
    this.root.add(topGroup);
    this.registerPart('top_slab', 'MONOLITHIC HONED SLAB', topGroup, [0, 0.9, 0]);

    // 2. STRUCTURAL STEEL SUBFRAME
    const spineGeom = new THREE.BoxGeometry(tableLength * 0.7, 0.03, tableWidth * 0.35);
    const spineMesh = new THREE.Mesh(spineGeom, this.subframeMaterial);
    spineMesh.castShadow = true;
    const spineGroup = new THREE.Group();
    spineGroup.position.set(0, tableHeight / 2 - slabThickness - 0.02, 0);
    spineGroup.add(spineMesh);
    this.root.add(spineGroup);
    this.registerPart('sub_spine', 'STEEL TENSION SUBFRAME', spineGroup, [0, 0.3, 0]);

    // 3. ARCHITECTURAL PEDESTAL COLUMNS (Left & Right)
    const colRadius = 0.22;
    const colHeight = tableHeight - slabThickness - 0.05;
    const colSpread = tableLength * 0.28;

    // Left Column
    const leftColGroup = this.createPedestalColumn(-colSpread, colHeight, colRadius, 'col_left', 'LEFT FLUTED COLUMN', [-0.8, -0.2, 0]);
    // Right Column
    const rightColGroup = this.createPedestalColumn(colSpread, colHeight, colRadius, 'col_right', 'RIGHT FLUTED COLUMN', [0.8, -0.2, 0]);

    // 4. BRASS FOOTER BASE RINGS
    const footerGeom = new THREE.CylinderGeometry(colRadius + 0.03, colRadius + 0.03, 0.02, 32);
    const footerLeft = new THREE.Mesh(footerGeom, this.brassMaterial);
    footerLeft.position.set(-colSpread, -tableHeight / 2 + 0.01, 0);
    footerLeft.castShadow = true;

    const footerRight = new THREE.Mesh(footerGeom, this.brassMaterial);
    footerRight.position.set(colSpread, -tableHeight / 2 + 0.01, 0);
    footerRight.castShadow = true;

    const footerGroup = new THREE.Group();
    footerGroup.add(footerLeft);
    footerGroup.add(footerRight);
    this.root.add(footerGroup);
    this.registerPart('brass_footers', 'BRASS BASE RINGS', footerGroup, [0, -0.7, 0]);
  }

  createPedestalColumn(posX, height, radius, id, label, explodeDir) {
    const colGroup = new THREE.Group();
    colGroup.position.set(posX, 0, 0);

    // Main cylinder body
    const colGeom = new THREE.CylinderGeometry(radius, radius, height, 32);
    const colMesh = new THREE.Mesh(colGeom, this.mainMaterial);
    colMesh.castShadow = true;
    colMesh.receiveShadow = true;
    colGroup.add(colMesh);

    // Architectural fluting ribs around perimeter
    const flutes = 16;
    for (let i = 0; i < flutes; i++) {
      const angle = (i / flutes) * Math.PI * 2;
      const fluteGeom = new THREE.CylinderGeometry(0.012, 0.012, height, 8);
      const fluteMesh = new THREE.Mesh(fluteGeom, this.mainMaterial);
      fluteMesh.position.set(
        Math.cos(angle) * (radius - 0.005),
        0,
        Math.sin(angle) * (radius - 0.005)
      );
      colGroup.add(fluteMesh);
    }

    this.root.add(colGroup);
    this.registerPart(id, label, colGroup, explodeDir);
    return colGroup;
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
      if (child.isMesh && child.material !== this.brassMaterial && child.material !== this.subframeMaterial) {
        child.material = this.mainMaterial;
      }
    });
  }

  setDoorOpen(progress) {
    // Tables have no hinged doors
  }

  setDrawerOpen(progress) {
    // Tables have no drawers
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
    this.subframeMaterial.dispose();
    this.root.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
      }
    });
  }
}
