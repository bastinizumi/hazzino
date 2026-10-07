/**
 * HAZZINO INTERIORS — STORAGE BED 3D MODEL
 * King architectural platform bed with channel-tufted wing headboard,
 * deep Belgian linen mattress, and 3 FUNCTIONAL SLIDING STORAGE DRAWERS:
 * Left Storage Drawer, Right Storage Drawer, and Front Foot Drawer.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial, createInteriorLiningMaterial } from './modelMaterials';

export class StorageBedModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'StorageBedModel';

    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xede8dd),
      roughness: 0.9,
      metalness: 0.0,
    });
    this.woodMaterial = createFurnitureMaterial('warm_walnut');
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();

    this.storageOpenProgress = 0;
    this.explodeProgress = 0;
    this.buildModel();
  }

  buildModel() {
    const bedW = 2.15;
    const bedL = 2.25;
    const frameH = 0.38;

    // 1. ARCHITECTURAL WING HEADBOARD WITH HORIZONTAL CHANNELS
    const hbGroup = new THREE.Group();
    hbGroup.position.set(0, 0.72, -bedL / 2 + 0.05);

    const hbGeom = new THREE.BoxGeometry(bedW + 0.35, 0.95, 0.16);
    this.headboardMesh = new THREE.Mesh(hbGeom, this.mainMaterial);
    this.headboardMesh.castShadow = true;
    this.headboardMesh.receiveShadow = true;
    hbGroup.add(this.headboardMesh);

    // Horizontal acoustic channel lines
    [-0.22, 0.0, 0.22].forEach((cy) => {
      const groove = new THREE.Mesh(
        new THREE.BoxGeometry(bedW + 0.36, 0.015, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x222120, roughness: 0.8 })
      );
      groove.position.set(0, cy, 0.08);
      hbGroup.add(groove);
    });

    // Integrated walnut floating ledge
    const ledge = new THREE.Mesh(
      new THREE.BoxGeometry(bedW + 0.38, 0.032, 0.18),
      this.woodMaterial
    );
    ledge.position.set(0, 0.48, 0.01);
    hbGroup.add(ledge);

    this.hbGroup = hbGroup;
    this.root.add(this.hbGroup);

    // 2. TIMBER BED BASE PLATFORM CHASSIS
    const chassisGroup = new THREE.Group();
    chassisGroup.position.set(0, frameH / 2, 0);

    const chassisGeom = new THREE.BoxGeometry(bedW, frameH, bedL);
    this.chassisMesh = new THREE.Mesh(chassisGeom, this.woodMaterial);
    this.chassisMesh.castShadow = true;
    this.chassisMesh.receiveShadow = true;
    chassisGroup.add(this.chassisMesh);

    // Recessed shadow base plinth
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(bedW - 0.25, 0.08, bedL - 0.25),
      new THREE.MeshStandardMaterial({ color: 0x121110, roughness: 0.9 })
    );
    plinth.position.y = -frameH / 2 + 0.04;
    chassisGroup.add(plinth);

    this.chassisGroup = chassisGroup;
    this.root.add(this.chassisGroup);

    // 3. DEEP MATTRESS WITH LAYERED QUILT & 4 PILLOWS
    const mattressGroup = new THREE.Group();
    mattressGroup.position.set(0, frameH + 0.15, 0.06);

    const matGeom = new THREE.BoxGeometry(bedW - 0.12, 0.3, bedL - 0.16, 16, 8, 16);
    this.mattressMesh = new THREE.Mesh(matGeom, this.mainMaterial);
    this.mattressMesh.castShadow = true;
    this.mattressMesh.receiveShadow = true;
    mattressGroup.add(this.mattressMesh);

    // Folded coverlet runner across foot of bed
    const throwMesh = new THREE.Mesh(
      new THREE.BoxGeometry(bedW - 0.1, 0.03, 0.72),
      createFurnitureMaterial('linen')
    );
    throwMesh.position.set(0, 0.165, 0.58);
    mattressGroup.add(throwMesh);

    // 4 Luxury layered pillows
    [[-0.52, -0.65], [0.52, -0.65], [-0.52, -0.42], [0.52, -0.42]].forEach(([px, pz], idx) => {
      const pillow = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 0.16, 0.38),
        this.mainMaterial
      );
      pillow.position.set(px, 0.22 + (idx < 2 ? 0.06 : 0), pz);
      pillow.rotation.x = idx < 2 ? -0.25 : -0.12;
      mattressGroup.add(pillow);
    });

    this.mattressGroup = mattressGroup;
    this.root.add(this.mattressGroup);

    // 4. FUNCTIONAL STORAGE: 3 UNDER-BED SLIDING STORAGE DRAWERS
    // Drawer A: Left Storage Drawer (slides out left on X)
    this.leftDrawer = new THREE.Group();
    this.leftDrawer.position.set(-bedW / 2 + 0.02, frameH / 2 - 0.02, 0);
    this.buildUnderbedDrawer(this.leftDrawer, 0.85, frameH - 0.08, 0.95, 'left');
    this.root.add(this.leftDrawer);

    // Drawer B: Right Storage Drawer (slides out right on X)
    this.rightDrawer = new THREE.Group();
    this.rightDrawer.position.set(bedW / 2 - 0.02, frameH / 2 - 0.02, 0);
    this.buildUnderbedDrawer(this.rightDrawer, 0.85, frameH - 0.08, 0.95, 'right');
    this.root.add(this.rightDrawer);

    // Drawer C: Front Foot Storage Drawer (slides out front on Z)
    this.frontDrawer = new THREE.Group();
    this.frontDrawer.position.set(0, frameH / 2 - 0.02, bedL / 2 - 0.02);
    this.buildUnderbedDrawer(this.frontDrawer, 1.25, frameH - 0.08, 0.65, 'front');
    this.root.add(this.frontDrawer);
  }

  buildUnderbedDrawer(group, w, h, d, side) {
    const isFront = side === 'front';
    const frontW = isFront ? w : d;
    const frontGeom = new THREE.BoxGeometry(isFront ? w : 0.024, h, isFront ? 0.024 : d);

    const dFront = new THREE.Mesh(frontGeom, this.woodMaterial);
    dFront.castShadow = true;
    group.add(dFront);

    // Interior storage box with cedar lining
    const boxW = isFront ? w - 0.06 : d - 0.06;
    const boxBox = new THREE.Mesh(
      new THREE.BoxGeometry(isFront ? boxW : 0.55, h - 0.04, isFront ? 0.55 : boxW),
      this.interiorMaterial
    );
    boxBox.position.set(
      isFront ? 0 : side === 'left' ? 0.3 : -0.3,
      0,
      isFront ? -0.3 : 0
    );
    group.add(boxBox);

    // Brass pull handle
    const pull = new THREE.Mesh(
      new THREE.BoxGeometry(isFront ? 0.16 : 0.016, 0.018, isFront ? 0.016 : 0.16),
      this.brassMaterial
    );
    pull.position.set(
      isFront ? 0 : side === 'left' ? -0.018 : 0.018,
      0,
      isFront ? 0.018 : 0
    );
    group.add(pull);
  }

  setStorageOpen(progress) {
    this.storageOpenProgress = progress;
    // Left drawer slides outward to the left
    this.leftDrawer.position.x = -2.15 / 2 + 0.02 - progress * 0.65;
    // Right drawer slides outward to the right
    this.rightDrawer.position.x = 2.15 / 2 - 0.02 + progress * 0.65;
    // Front drawer slides outward to the front
    this.frontDrawer.position.z = 2.25 / 2 - 0.02 + progress * 0.55;
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    this.hbGroup.position.z = -2.25 / 2 + 0.05 - p * 0.75;
    this.mattressGroup.position.y = 0.38 + 0.15 + p * 0.75;
    this.chassisGroup.position.y = 0.38 / 2 - p * 0.2;

    this.leftDrawer.position.x = -2.15 / 2 + 0.02 - p * 0.85;
    this.rightDrawer.position.x = 2.15 / 2 - 0.02 + p * 0.85;
    this.frontDrawer.position.z = 2.25 / 2 - 0.02 + p * 0.75;
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.headboardMesh.material = mainMat;
      this.mattressMesh.material = mainMat;
    }
    if (secondaryMat) {
      this.woodMaterial = secondaryMat;
      this.chassisMesh.material = secondaryMat;
    }
  }

  reset() {
    this.setStorageOpen(0);
    this.setExplode(0);
    this.root.rotation.y = 0;
  }

  dispose() {
    this.root.traverse((c) => {
      if (c.isMesh && c.geometry) c.geometry.dispose();
    });
  }
}
