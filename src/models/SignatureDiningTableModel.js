/**
 * HAZZINO INTERIORS — SIGNATURE DINING TABLE 3D MODEL
 * Architectural 2.6m soft-rectangular dining table with chamfered edge slab,
 * twin fluted semi-elliptical pedestals, brass collar inlays, and tie stretcher.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial } from './modelMaterials';

export class SignatureDiningTableModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'SignatureDiningTableModel';

    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xd9cdbe),
      roughness: 0.82,
      metalness: 0.02,
    });
    this.brassMaterial = createBrassAccentMaterial();
    this.woodMaterial = createFurnitureMaterial('smoked_walnut');

    this.explodeProgress = 0;
    this.buildModel();
  }

  buildModel() {
    const length = 2.6;
    const width = 1.15;
    const height = 0.76;
    const slabThickness = 0.055;

    // 1. MONOLITHIC SOFT-RECTANGULAR TABLETOP SLAB WITH CHAMFERED EDGES
    const topGroup = new THREE.Group();
    topGroup.position.set(0, height - slabThickness / 2, 0);

    const topGeom = new THREE.BoxGeometry(length, slabThickness, width);
    this.topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    topGroup.add(this.topMesh);

    // Decorative centerpiece: carved stone trough bowl with dried botanical twigs
    const bowlMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.12, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0x221f1d, roughness: 0.75 })
    );
    bowlMesh.scale.set(1.6, 1.0, 0.7);
    bowlMesh.position.set(0, slabThickness / 2 + 0.04, 0);
    topGroup.add(bowlMesh);

    this.topGroup = topGroup;
    this.root.add(this.topGroup);

    // 2. TWIN SCULPTURAL ARCHITECTURAL FLUTED PEDESTALS
    const pedHeight = height - slabThickness - 0.04;
    const pedDist = length * 0.28;

    // Left Pedestal Group
    this.pedLeftGroup = new THREE.Group();
    this.pedLeftGroup.position.set(-pedDist, (pedHeight) / 2 + 0.02, 0);
    this.buildFlutedColumn(this.pedLeftGroup, pedHeight);
    this.root.add(this.pedLeftGroup);

    // Right Pedestal Group
    this.pedRightGroup = new THREE.Group();
    this.pedRightGroup.position.set(pedDist, (pedHeight) / 2 + 0.02, 0);
    this.buildFlutedColumn(this.pedRightGroup, pedHeight);
    this.root.add(this.pedRightGroup);

    // 3. STRUCTURAL DARK WALNUT & BRASS TIE STRETCHER
    this.tieBar = new THREE.Mesh(
      new THREE.BoxGeometry(pedDist * 2 - 0.35, 0.038, 0.05),
      this.woodMaterial
    );
    this.tieBar.position.set(0, 0.18, 0);
    this.root.add(this.tieBar);

    // Dual Brass Plinth Base Plates
    this.plinthLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.02, 32), this.brassMaterial);
    this.plinthLeft.scale.set(1.2, 1.0, 0.85);
    this.plinthLeft.position.set(-pedDist, 0.01, 0);
    this.root.add(this.plinthLeft);

    this.plinthRight = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.02, 32), this.brassMaterial);
    this.plinthRight.scale.set(1.2, 1.0, 0.85);
    this.plinthRight.position.set(pedDist, 0.01, 0);
    this.root.add(this.plinthRight);
  }

  buildFlutedColumn(group, h) {
    // Semi-elliptical main core
    const coreGeom = new THREE.CylinderGeometry(0.28, 0.3, h, 32);
    const coreMesh = new THREE.Mesh(coreGeom, this.mainMaterial);
    coreMesh.scale.set(1.15, 1.0, 0.82);
    coreMesh.castShadow = true;
    group.add(coreMesh);

    // Vertical architectural fluted ribs
    const numRibs = 22;
    for (let i = 0; i < numRibs; i++) {
      const ang = (i / numRibs) * Math.PI * 2;
      const rib = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.014, h - 0.01, 8),
        this.mainMaterial
      );
      rib.position.set(Math.cos(ang) * 0.29 * 1.15, 0, Math.sin(ang) * 0.29 * 0.82);
      group.add(rib);
    }

    // Top brass collar ring
    const collarTop = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.025, 32), this.brassMaterial);
    collarTop.scale.set(1.15, 1.0, 0.82);
    collarTop.position.set(0, h / 2 - 0.012, 0);
    group.add(collarTop);
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;
    const pedDist = 2.6 * 0.28;

    this.topGroup.position.y = 0.76 - 0.055 / 2 + p * 0.85;
    this.pedLeftGroup.position.x = -pedDist - p * 0.65;
    this.pedRightGroup.position.x = pedDist + p * 0.65;
    this.plinthLeft.position.x = -pedDist - p * 0.65;
    this.plinthRight.position.x = pedDist + p * 0.65;
    this.tieBar.position.y = 0.18 - p * 0.15;
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.topMesh.material = mainMat;
      this.pedLeftGroup.children.forEach((c) => {
        if (c.geometry.type !== 'CylinderGeometry' || c.scale.y !== 0.025) {
          c.material = mainMat;
        }
      });
      this.pedRightGroup.children.forEach((c) => {
        if (c.geometry.type !== 'CylinderGeometry' || c.scale.y !== 0.025) {
          c.material = mainMat;
        }
      });
    }
  }

  reset() {
    this.setExplode(0);
    this.root.rotation.y = 0;
  }

  dispose() {
    this.root.traverse((c) => {
      if (c.isMesh && c.geometry) c.geometry.dispose();
    });
  }
}
