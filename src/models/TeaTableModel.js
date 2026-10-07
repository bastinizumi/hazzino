/**
 * HAZZINO INTERIORS — TEA TABLE 3D MODEL
 * Sculptural modern tea/coffee table with organic soft-oval stone top
 * and asymmetric fluted architectural pedestal base with floating shadow plinth.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial } from './modelMaterials';

export class TeaTableModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'TeaTableModel';

    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xd9cdbe),
      roughness: 0.85,
      metalness: 0.02,
    });
    this.woodMaterial = createFurnitureMaterial('smoked_walnut');
    this.brassMaterial = createBrassAccentMaterial();

    this.explodeProgress = 0;
    this.buildModel();
  }

  buildModel() {
    const length = 1.35;
    const width = 0.82;
    const height = 0.38;
    const topThickness = 0.048;

    // 1. SCULPTURAL SOFT-OVAL TABLETOP SLAB (Pebble-form with chamfer)
    // Multi-segment contoured oval slab
    const topGroup = new THREE.Group();
    topGroup.position.set(0, height - topThickness / 2, 0);

    const topGeom = new THREE.CylinderGeometry(0.58, 0.62, topThickness, 48);
    this.topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    this.topMesh.scale.set(length / 1.16, 1.0, width / 1.16);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    topGroup.add(this.topMesh);

    // Decorative ceramic bowl on top
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.06, 0.07, 24),
      new THREE.MeshStandardMaterial({ color: 0x1f1e1d, roughness: 0.6 })
    );
    bowl.position.set(0.15, topThickness / 2 + 0.035, 0.05);
    topGroup.add(bowl);

    this.topGroup = topGroup;
    this.root.add(this.topGroup);

    // 2. ASYMMETRIC SCULPTED FLUTED PEDESTAL (Offset to the left)
    const pedHeight = height - topThickness - 0.02;
    const pedGroup = new THREE.Group();
    pedGroup.position.set(-length * 0.16, (pedHeight) / 2 + 0.015, 0);

    // Fluted cylindrical column
    const pedGeom = new THREE.CylinderGeometry(0.24, 0.28, pedHeight, 36);
    this.pedMesh = new THREE.Mesh(pedGeom, this.mainMaterial);
    this.pedMesh.scale.set(1.15, 1.0, 0.88);
    this.pedMesh.castShadow = true;
    pedGroup.add(this.pedMesh);

    // Fluting ridges along the pedestal
    for (let r = 0; r < 20; r++) {
      const ang = (r / 20) * Math.PI * 2;
      const ridge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.012, pedHeight - 0.01, 8),
        this.mainMaterial
      );
      ridge.position.set(Math.cos(ang) * 0.25, 0, Math.sin(ang) * 0.21);
      pedGroup.add(ridge);
    }
    this.pedGroup = pedGroup;
    this.root.add(this.pedGroup);

    // 3. SECONDARY ASYMMETRIC BRASS FOOTING (Offset to the right with shadow gap)
    const footGroup = new THREE.Group();
    footGroup.position.set(length * 0.22, 0.04, 0.02);

    const brassDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 0.08, 28),
      this.brassMaterial
    );
    brassDisc.castShadow = true;
    footGroup.add(brassDisc);

    // Shadowline recessed footing ring
    const shadowPlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.015, 28),
      new THREE.MeshStandardMaterial({ color: 0x121110, roughness: 0.9 })
    );
    shadowPlinth.position.y = -0.035;
    footGroup.add(shadowPlinth);

    this.footGroup = footGroup;
    this.root.add(this.footGroup);
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    this.topGroup.position.y = 0.38 - 0.048 / 2 + p * 0.55;
    this.pedGroup.position.x = -1.35 * 0.16 - p * 0.45;
    this.footGroup.position.x = 1.35 * 0.22 + p * 0.4;
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.topMesh.material = mainMat;
      this.pedMesh.material = mainMat;
    }
    if (secondaryMat) {
      this.brassMaterial = secondaryMat;
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
