/**
 * HAZZINO INTERIORS — GRAND WARDROBE 3D MODEL
 * Floor-to-ceiling 2.55m architectural 4-door bespoke wardrobe.
 * Features 4 hinged doors with recessed vertical finger pulls,
 * interior bronze hanging rail with tailored hangers, adjustable shelves,
 * 4 pull-out interior suede drawers, lower shoe storage, and warm 2700K internal LEDs.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial, createInteriorLiningMaterial } from './modelMaterials';

export class GrandWardrobeModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'GrandWardrobeModel';

    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xede8dd),
      roughness: 0.65,
      metalness: 0.05,
    });
    this.woodMaterial = createFurnitureMaterial('natural_oak');
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();
    this.leatherMaterial = createFurnitureMaterial('leather');

    this.ledMaterial = new THREE.MeshBasicMaterial({
      color: 0xffeed4,
      transparent: true,
      opacity: 0.1,
    });

    this.doorOpenProgress = 0;
    this.explodeProgress = 0;
    this.doors = [];
    this.interiorDrawers = [];

    this.buildModel();
  }

  buildModel() {
    const width = 2.2;
    const height = 2.55;
    const depth = 0.64;
    const thickness = 0.038;

    // 1. CARCASS: Top Architectural Cornice
    const topGeom = new THREE.BoxGeometry(width, thickness, depth);
    this.topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    this.topMesh.position.set(0, height - thickness / 2, 0);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    this.root.add(this.topMesh);

    // 2. CARCASS: Recessed Base Plinth
    const plinthH = 0.1;
    const plinthGeom = new THREE.BoxGeometry(width - 0.06, plinthH, depth - 0.06);
    this.plinthMesh = new THREE.Mesh(plinthGeom, this.woodMaterial);
    this.plinthMesh.position.set(0, plinthH / 2, 0);
    this.plinthMesh.castShadow = true;
    this.root.add(this.plinthMesh);

    // Carcass bottom floor
    const bottomGeom = new THREE.BoxGeometry(width, thickness, depth);
    this.bottomMesh = new THREE.Mesh(bottomGeom, this.mainMaterial);
    this.bottomMesh.position.set(0, plinthH + thickness / 2, 0);
    this.bottomMesh.receiveShadow = true;
    this.root.add(this.bottomMesh);

    // 3. CARCASS: Outer Left & Right Side Panels
    const sideH = height - plinthH - thickness * 2;
    const sideY = plinthH + thickness + sideH / 2;
    const sideGeom = new THREE.BoxGeometry(thickness, sideH, depth);

    this.sideLeftMesh = new THREE.Mesh(sideGeom, this.mainMaterial);
    this.sideLeftMesh.position.set(-width / 2 + thickness / 2, sideY, 0);
    this.sideLeftMesh.castShadow = true;
    this.sideLeftMesh.receiveShadow = true;
    this.root.add(this.sideLeftMesh);

    this.sideRightMesh = new THREE.Mesh(sideGeom, this.mainMaterial);
    this.sideRightMesh.position.set(width / 2 - thickness / 2, sideY, 0);
    this.sideRightMesh.castShadow = true;
    this.sideRightMesh.receiveShadow = true;
    this.root.add(this.sideRightMesh);

    // 4. CARCASS: Back Lining Wall
    const backGeom = new THREE.BoxGeometry(width - thickness * 2, sideH, 0.02);
    this.backMesh = new THREE.Mesh(backGeom, this.woodMaterial);
    this.backMesh.position.set(0, sideY, -depth / 2 + 0.015);
    this.backMesh.receiveShadow = true;
    this.root.add(this.backMesh);

    // 5. INTERIOR: Center Vertical Partition
    const centerPartGeom = new THREE.BoxGeometry(thickness, sideH, depth - 0.08);
    this.centerPart = new THREE.Mesh(centerPartGeom, this.woodMaterial);
    this.centerPart.position.set(0, sideY, -0.02);
    this.root.add(this.centerPart);

    // 6. INTERIOR: Vertical Diffuse Warm LED Strip
    const ledGeom = new THREE.BoxGeometry(0.012, sideH - 0.1, 0.012);
    this.ledStrip = new THREE.Mesh(ledGeom, this.ledMaterial);
    this.ledStrip.position.set(0.025, sideY, depth / 2 - 0.08);
    this.root.add(this.ledStrip);

    this.internalLight = new THREE.PointLight(0xffeed4, 0, 3.5);
    this.internalLight.position.set(0, sideY + 0.4, 0);
    this.root.add(this.internalLight);

    // 7. INTERIOR LEFT: Upper Hat Shelf & Bronze Clothes Rail
    const upperShelfGeom = new THREE.BoxGeometry(width / 2 - thickness, 0.025, depth - 0.08);
    this.shelfHat = new THREE.Mesh(upperShelfGeom, this.woodMaterial);
    this.shelfHat.position.set(-width / 4, height - 0.45, -0.02);
    this.root.add(this.shelfHat);

    // Bronze Hanger Rail
    const railGeom = new THREE.CylinderGeometry(0.012, 0.012, width / 2 - thickness - 0.04, 16);
    this.hangerRail = new THREE.Mesh(railGeom, this.brassMaterial);
    this.hangerRail.rotation.z = Math.PI / 2;
    this.hangerRail.position.set(-width / 4, height - 0.55, -0.02);
    this.root.add(this.hangerRail);

    // Hanging garments (tailored coats on hangers)
    this.garmentsGroup = new THREE.Group();
    [-0.32, -0.16, 0.0, 0.16, 0.32].forEach((gx, idx) => {
      const coat = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.95, 0.38),
        idx % 2 === 0
          ? new THREE.MeshStandardMaterial({ color: 0x242322, roughness: 0.9 })
          : new THREE.MeshStandardMaterial({ color: 0x5a544c, roughness: 0.9 })
      );
      coat.position.set(-width / 4 + gx, height - 1.15, -0.02);
      this.garmentsGroup.add(coat);
    });
    this.root.add(this.garmentsGroup);

    // 8. INTERIOR RIGHT: 4 Adjustable Shelves & 4 Suede Drawers
    this.shelvesGroup = new THREE.Group();
    [0.72, 1.15, 1.58, 2.02].forEach((sy) => {
      const shelf = new THREE.Mesh(upperShelfGeom, this.woodMaterial);
      shelf.position.set(width / 4, sy, -0.02);
      this.shelvesGroup.add(shelf);
    });
    this.root.add(this.shelvesGroup);

    // 4 Pull-out Interior Drawers at bottom right
    this.drawerSliderGroup = new THREE.Group();
    const dWidth = width / 2 - thickness - 0.04;
    const dHeight = 0.13;
    const dDepth = depth - 0.12;

    [0, 1, 2, 3].forEach((di) => {
      const drawer = new THREE.Group();
      drawer.position.set(width / 4, plinthH + thickness + 0.08 + di * (dHeight + 0.02), 0);

      const dFront = new THREE.Mesh(
        new THREE.BoxGeometry(dWidth, dHeight, 0.02),
        this.woodMaterial
      );
      drawer.add(dFront);

      const dBox = new THREE.Mesh(
        new THREE.BoxGeometry(dWidth - 0.04, dHeight - 0.02, dDepth),
        this.interiorMaterial
      );
      dBox.position.set(0, 0, -dDepth / 2);
      drawer.add(dBox);

      // Leather pull tab
      const tab = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.015), this.leatherMaterial);
      tab.position.set(0, 0, 0.012);
      drawer.add(tab);

      this.drawerSliderGroup.add(drawer);
      this.interiorDrawers.push(drawer);
    });
    this.root.add(this.drawerSliderGroup);

    // 9. FOUR EXTERIOR FULL-HEIGHT DOORS WITH PIVOT AXES
    const doorW = (width - 0.01) / 4;
    const doorH = height - plinthH - 0.04;
    const doorY = plinthH + doorH / 2;
    const doorZ = depth / 2 + 0.018;

    // Door 1 (Far Left): Hinge at x = -width/2 + 0.01
    const p1 = new THREE.Group();
    p1.position.set(-width / 2 + 0.01, doorY, doorZ);
    const m1 = this.createDoorMesh(doorW, doorH, 1);
    m1.position.set(doorW / 2, 0, 0);
    p1.add(m1);
    this.root.add(p1);
    this.doors.push({ pivot: p1, mesh: m1, openAngle: -Math.PI * 0.58, basePos: p1.position.clone() });

    // Door 2 (Mid Left): Hinge at x = -0.01
    const p2 = new THREE.Group();
    p2.position.set(-0.01, doorY, doorZ);
    const m2 = this.createDoorMesh(doorW, doorH, -1);
    m2.position.set(-doorW / 2, 0, 0);
    p2.add(m2);
    this.root.add(p2);
    this.doors.push({ pivot: p2, mesh: m2, openAngle: Math.PI * 0.58, basePos: p2.position.clone() });

    // Door 3 (Mid Right): Hinge at x = 0.01
    const p3 = new THREE.Group();
    p3.position.set(0.01, doorY, doorZ);
    const m3 = this.createDoorMesh(doorW, doorH, 1);
    m3.position.set(doorW / 2, 0, 0);
    p3.add(m3);
    this.root.add(p3);
    this.doors.push({ pivot: p3, mesh: m3, openAngle: -Math.PI * 0.58, basePos: p3.position.clone() });

    // Door 4 (Far Right): Hinge at x = width/2 - 0.01
    const p4 = new THREE.Group();
    p4.position.set(width / 2 - 0.01, doorY, doorZ);
    const m4 = this.createDoorMesh(doorW, doorH, -1);
    m4.position.set(-doorW / 2, 0, 0);
    p4.add(m4);
    this.root.add(p4);
    this.doors.push({ pivot: p4, mesh: m4, openAngle: Math.PI * 0.58, basePos: p4.position.clone() });
  }

  createDoorMesh(w, h, handleSide) {
    const door = new THREE.Group();
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w - 0.005, h, 0.024), this.mainMaterial);
    slab.castShadow = true;
    door.add(slab);

    // Recessed vertical bronze J-pull handle
    const handleH = 0.32;
    const hx = (handleSide * (w - 0.005)) / 2 - handleSide * 0.035;
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.016, handleH, 0.014), this.brassMaterial);
    handle.position.set(hx, 0, 0.014);
    door.add(handle);

    return door;
  }

  setDoorOpen(progress) {
    this.doorOpenProgress = progress;
    this.doors.forEach((d) => {
      d.pivot.rotation.y = d.openAngle * progress;
    });

    // When opened, interior drawers slightly slide out and internal lights glow
    this.interiorDrawers.forEach((dr, idx) => {
      dr.position.z = progress * (0.08 + idx * 0.06);
    });

    this.ledMaterial.opacity = 0.1 + progress * 0.9;
    this.internalLight.intensity = progress * 1.8;
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    // Header cornice separates up
    this.topMesh.position.y = 2.55 - 0.038 / 2 + p * 0.65;

    // Side panels separate out
    this.sideLeftMesh.position.x = -1.1 + 0.038 / 2 - p * 0.6;
    this.sideRightMesh.position.x = 1.1 - 0.038 / 2 + p * 0.6;

    // Plinth descends
    this.plinthMesh.position.y = 0.05 - p * 0.3;

    // Back wall recedes
    this.backMesh.position.z = -0.32 + 0.015 - p * 0.5;

    // Doors fly forward and outward
    this.doors.forEach((d, idx) => {
      const dirX = idx < 2 ? -0.4 * (2 - idx) : 0.4 * (idx - 1);
      d.pivot.position.x = d.basePos.x + dirX * p;
      d.pivot.position.z = d.basePos.z + p * 0.7;
    });

    // Interior drawers pull forward
    this.interiorDrawers.forEach((dr, idx) => {
      dr.position.z = p * (0.35 + idx * 0.1);
    });

    // Hanging section moves forward
    this.garmentsGroup.position.z = p * 0.35;
    this.shelvesGroup.position.z = p * 0.25;
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.topMesh.material = mainMat;
      this.sideLeftMesh.material = mainMat;
      this.sideRightMesh.material = mainMat;
      this.doors.forEach((d) => {
        d.mesh.children[0].material = mainMat;
      });
    }
    if (secondaryMat) {
      this.plinthMesh.material = secondaryMat;
      this.centerPart.material = secondaryMat;
      this.shelfHat.material = secondaryMat;
      this.backMesh.material = secondaryMat;
    }
  }

  reset() {
    this.setDoorOpen(0);
    this.setExplode(0);
    this.root.rotation.y = 0;
  }

  dispose() {
    this.root.traverse((c) => {
      if (c.isMesh) {
        if (c.geometry) c.geometry.dispose();
      }
    });
  }
}
