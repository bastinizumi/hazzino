/**
 * HAZZINO INTERIORS — NIGHT CONSOLE 3D MODEL
 * Compact pill-curved bedside console with upper felt-lined sliding drawer,
 * open lower monograph display shelf, and recessed brass plinth footing.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial, createInteriorLiningMaterial } from './modelMaterials';

export class NightConsoleModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'NightConsoleModel';

    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0x382417),
      roughness: 0.65,
      metalness: 0.02,
    });
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();

    this.drawerOpenProgress = 0;
    this.explodeProgress = 0;
    this.buildModel();
  }

  buildModel() {
    const consoleW = 0.58;
    const consoleD = 0.44;
    const consoleH = 0.54;
    const thickness = 0.028;

    // 1. CARCASS: Top Slab with subtle chamfer
    const topGroup = new THREE.Group();
    topGroup.position.set(0, consoleH - thickness / 2, 0);

    const topGeom = new THREE.BoxGeometry(consoleW, thickness, consoleD);
    this.topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    topGroup.add(this.topMesh);

    // Decorative bedside ceramic dish
    const dish = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.04, 0.02, 16),
      this.brassMaterial
    );
    dish.position.set(0.12, thickness / 2 + 0.01, -0.05);
    topGroup.add(dish);

    this.topGroup = topGroup;
    this.root.add(this.topGroup);

    // 2. CARCASS: Plinth Base with Shadowline
    const plinthH = 0.06;
    const plinthGeom = new THREE.BoxGeometry(consoleW - 0.08, plinthH, consoleD - 0.08);
    this.plinthMesh = new THREE.Mesh(plinthGeom, this.brassMaterial);
    this.plinthMesh.position.set(0, plinthH / 2, 0);
    this.root.add(this.plinthMesh);

    // Bottom floor
    const bottomGeom = new THREE.BoxGeometry(consoleW, thickness, consoleD);
    this.bottomMesh = new THREE.Mesh(bottomGeom, this.mainMaterial);
    this.bottomMesh.position.set(0, plinthH + thickness / 2, 0);
    this.root.add(this.bottomMesh);

    // 3. CARCASS: Outer Curved Side Panels & Back Wall
    const sideH = consoleH - plinthH - thickness * 2;
    const sideY = plinthH + thickness + sideH / 2;

    this.sideL = new THREE.Mesh(new THREE.BoxGeometry(thickness, sideH, consoleD), this.mainMaterial);
    this.sideL.position.set(-consoleW / 2 + thickness / 2, sideY, 0);
    this.sideL.castShadow = true;
    this.root.add(this.sideL);

    this.sideR = new THREE.Mesh(new THREE.BoxGeometry(thickness, sideH, consoleD), this.mainMaterial);
    this.sideR.position.set(consoleW / 2 - thickness / 2, sideY, 0);
    this.sideR.castShadow = true;
    this.root.add(this.sideR);

    this.backMesh = new THREE.Mesh(new THREE.BoxGeometry(consoleW - thickness * 2, sideH, 0.016), this.mainMaterial);
    this.backMesh.position.set(0, sideY, -consoleD / 2 + 0.01);
    this.root.add(this.backMesh);

    // Middle Horizontal Shelf (dividing upper drawer & lower open gallery)
    const midY = consoleH - thickness - 0.16;
    this.midShelf = new THREE.Mesh(new THREE.BoxGeometry(consoleW - thickness * 2, thickness, consoleD - 0.02), this.mainMaterial);
    this.midShelf.position.set(0, midY, -0.005);
    this.root.add(this.midShelf);

    // 4. UPPER SLIDING DRAWER
    const drawerW = consoleW - thickness * 2 - 0.01;
    const drawerH = 0.13;
    const drawerD = consoleD - 0.04;

    this.drawerGroup = new THREE.Group();
    this.drawerGroup.position.set(0, consoleH - thickness - drawerH / 2 - 0.015, 0);

    const dFront = new THREE.Mesh(new THREE.BoxGeometry(drawerW, drawerH, 0.02), this.mainMaterial);
    dFront.castShadow = true;
    this.drawerGroup.add(dFront);

    const dBox = new THREE.Mesh(new THREE.BoxGeometry(drawerW - 0.03, drawerH - 0.02, drawerD), this.interiorMaterial);
    dBox.position.set(0, 0, -drawerD / 2);
    this.drawerGroup.add(dBox);

    // Inset brushed brass pull handle
    const pull = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.014, 0.014), this.brassMaterial);
    pull.position.set(0, 0, 0.014);
    this.drawerGroup.add(pull);

    this.root.add(this.drawerGroup);

    // 5. LOWER OPEN DISPLAY SHELF: Hardcover Art Monographs
    this.bookGroup = new THREE.Group();
    this.bookGroup.position.set(0, plinthH + thickness + 0.02, 0);

    const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.3), new THREE.MeshStandardMaterial({ color: 0x1e1d1c, roughness: 0.6 }));
    const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.28), new THREE.MeshStandardMaterial({ color: 0x8a7a68, roughness: 0.8 }));
    book2.position.set(0.01, 0.035, 0);
    book2.rotation.y = 0.08;
    this.bookGroup.add(book1);
    this.bookGroup.add(book2);
    this.root.add(this.bookGroup);

    // Scale up for clear laboratory presentation
    this.root.scale.set(1.4, 1.4, 1.4);
  }

  setDrawerOpen(progress) {
    this.drawerOpenProgress = progress;
    this.drawerGroup.position.z = progress * 0.28;
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    this.topGroup.position.y = 0.54 - 0.028 / 2 + p * 0.55;
    this.drawerGroup.position.z = p * 0.45;
    this.drawerGroup.position.y = 0.54 - 0.028 - 0.13 / 2 - 0.015 + p * 0.2;
    this.sideL.position.x = -0.29 + 0.028 / 2 - p * 0.35;
    this.sideR.position.x = 0.29 - 0.028 / 2 + p * 0.35;
    this.plinthMesh.position.y = 0.03 - p * 0.2;
    this.bookGroup.position.z = p * 0.25;
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.topMesh.material = mainMat;
      this.sideL.material = mainMat;
      this.sideR.material = mainMat;
      this.drawerGroup.children[0].material = mainMat;
    }
    if (secondaryMat) {
      this.plinthMesh.material = secondaryMat;
    }
  }

  reset() {
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
