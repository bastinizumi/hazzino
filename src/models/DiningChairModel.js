/**
 * HAZZINO INTERIORS — SIGNATURE DINING CHAIR 3D MODEL
 * Steam-bent upholstered curved backrest, contoured seat cushion with welt piping,
 * and tapered solid walnut legs with brushed brass footer ferrules.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial } from './modelMaterials';

export class DiningChairModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'DiningChairModel';

    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xede8dd),
      roughness: 0.9,
      metalness: 0.0,
    });
    this.woodMaterial = createFurnitureMaterial('warm_walnut');
    this.brassMaterial = createBrassAccentMaterial();

    this.explodeProgress = 0;
    this.buildModel();
  }

  buildModel() {
    // 1. SEAT CUSHION (Contoured ergonomic foam with welt piping)
    const seatGroup = new THREE.Group();
    seatGroup.position.set(0, 0.46, 0.02);

    const seatGeom = new THREE.CylinderGeometry(0.24, 0.23, 0.07, 36);
    this.seatMesh = new THREE.Mesh(seatGeom, this.mainMaterial);
    this.seatMesh.scale.set(1.08, 1.0, 1.0);
    this.seatMesh.castShadow = true;
    this.seatMesh.receiveShadow = true;
    seatGroup.add(this.seatMesh);

    // Welt piping around cushion perimeter
    const pipeGeom = new THREE.TorusGeometry(0.245, 0.007, 8, 36);
    const pipeMesh = new THREE.Mesh(pipeGeom, this.mainMaterial);
    pipeMesh.rotation.x = Math.PI / 2;
    seatGroup.add(pipeMesh);

    this.seatGroup = seatGroup;
    this.root.add(this.seatGroup);

    // 2. STEAM-BENT CURVED UPHOLSTERED BACKREST
    const backGroup = new THREE.Group();
    backGroup.position.set(0, 0.68, -0.18);

    // Curved capsule arc backrest
    const backGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 32, 1, true, -Math.PI * 0.42, Math.PI * 0.84);
    this.backMesh = new THREE.Mesh(backGeom, this.mainMaterial);
    this.backMesh.scale.set(1.0, 1.0, 0.75);
    this.backMesh.castShadow = true;
    backGroup.add(this.backMesh);

    // Timber outer curved frame spine
    const spineGeom = new THREE.CylinderGeometry(0.29, 0.29, 0.23, 32, 1, true, -Math.PI * 0.43, Math.PI * 0.86);
    const spineMesh = new THREE.Mesh(spineGeom, this.woodMaterial);
    spineMesh.scale.set(1.0, 1.0, 0.75);
    spineMesh.castShadow = true;
    backGroup.add(spineMesh);

    this.backGroup = backGroup;
    this.root.add(this.backGroup);

    // 3. SUB-SEAT TIMBER APRON & TAPERED LEGS WITH BRASS FERRULES
    const legsGroup = new THREE.Group();
    legsGroup.position.set(0, 0, 0);

    // Seat subframe ring
    const apron = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.21, 0.035, 24),
      this.woodMaterial
    );
    apron.position.set(0, 0.41, 0.02);
    legsGroup.add(apron);

    // 4 Tapered solid wood legs
    const legGeo = new THREE.CylinderGeometry(0.014, 0.01, 0.43, 16);
    const ferruleGeo = new THREE.CylinderGeometry(0.0105, 0.0095, 0.06, 16);

    const legPositions = [
      { x: -0.18, z: 0.18, angleX: 0.04, angleZ: -0.04 }, // Front Left
      { x: 0.18, z: 0.18, angleX: 0.04, angleZ: 0.04 },  // Front Right
      { x: -0.16, z: -0.16, angleX: -0.07, angleZ: -0.04 }, // Rear Left
      { x: 0.16, z: -0.16, angleX: -0.07, angleZ: 0.04 },  // Rear Right
    ];

    legPositions.forEach((lp) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(lp.x, 0.215, lp.z + 0.02);
      legPivot.rotation.x = lp.angleX;
      legPivot.rotation.z = lp.angleZ;

      const leg = new THREE.Mesh(legGeo, this.woodMaterial);
      leg.castShadow = true;
      legPivot.add(leg);

      // Brass footer ferrule
      const ferrule = new THREE.Mesh(ferruleGeo, this.brassMaterial);
      ferrule.position.y = -0.185;
      legPivot.add(ferrule);

      legsGroup.add(legPivot);
    });

    // Vertical back support uprights
    [-0.14, 0.14].forEach((ux) => {
      const upright = new THREE.Mesh(
        new THREE.CylinderGeometry(0.013, 0.013, 0.28, 12),
        this.woodMaterial
      );
      upright.position.set(ux, 0.54, -0.12);
      upright.rotation.x = -0.15;
      legsGroup.add(upright);
    });

    this.legsGroup = legsGroup;
    this.root.add(this.legsGroup);

    // Whole chair scale for prominent presentation
    this.root.scale.set(1.4, 1.4, 1.4);
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    this.backGroup.position.z = -0.18 - p * 0.55;
    this.backGroup.position.y = 0.68 + p * 0.35;
    this.seatGroup.position.y = 0.46 + p * 0.45;
    this.legsGroup.position.y = -p * 0.3;
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.seatMesh.material = mainMat;
      this.backMesh.material = mainMat;
    }
    if (secondaryMat) {
      this.woodMaterial = secondaryMat;
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
