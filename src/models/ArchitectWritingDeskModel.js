/**
 * HAZZINO INTERIORS — ARCHITECT WRITING DESK 3D MODEL
 * Modern executive writing desk with solid walnut tabletop, inlaid leather desk pad,
 * integrated full-width sliding drawer with organizer dividers, side pedestal storage,
 * brass cable management channel, and architectural tapered trestle legs.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial, createInteriorLiningMaterial } from './modelMaterials';

export class ArchitectWritingDeskModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'ArchitectWritingDeskModel';

    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0x5a3826),
      roughness: 0.65,
      metalness: 0.02,
    });
    this.leatherMaterial = createFurnitureMaterial('leather');
    this.brassMaterial = createBrassAccentMaterial();
    this.interiorMaterial = createInteriorLiningMaterial();

    this.drawerOpenProgress = 0;
    this.explodeProgress = 0;
    this.buildModel();
  }

  buildModel() {
    const deskW = 1.65;
    const deskD = 0.78;
    const deskH = 0.75;
    const topThick = 0.045;

    // 1. TABLETOP WITH INLAID SADDLE LEATHER DESK BLOTTER & REAR CABLE FLAP
    const topGroup = new THREE.Group();
    topGroup.position.set(0, deskH - topThick / 2, 0);

    const topGeom = new THREE.BoxGeometry(deskW, topThick, deskD);
    this.topMesh = new THREE.Mesh(topGeom, this.mainMaterial);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    topGroup.add(this.topMesh);

    // Inset saddle leather desk blotter pad
    const blotterGeom = new THREE.BoxGeometry(0.88, 0.006, 0.52);
    this.blotterMesh = new THREE.Mesh(blotterGeom, this.leatherMaterial);
    this.blotterMesh.position.set(-0.12, topThick / 2 + 0.003, 0.04);
    topGroup.add(this.blotterMesh);

    // Rear brushed brass cable management raceway with flush flip lid
    const cableGeom = new THREE.BoxGeometry(0.36, 0.008, 0.08);
    this.cableLid = new THREE.Mesh(cableGeom, this.brassMaterial);
    this.cableLid.position.set(0.35, topThick / 2 + 0.004, -deskD / 2 + 0.1);
    topGroup.add(this.cableLid);

    // Architectural brass desk accessory: sculptural pen tray
    const penTray = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.015, 0.06),
      this.brassMaterial
    );
    penTray.position.set(-0.12, topThick / 2 + 0.01, -0.26);
    topGroup.add(penTray);

    this.topGroup = topGroup;
    this.root.add(this.topGroup);

    // 2. INTEGRATED SLIDING ORGANIZER DRAWER
    const drawerW = 0.88;
    const drawerH = 0.075;
    const drawerD = 0.52;

    this.drawerGroup = new THREE.Group();
    this.drawerGroup.position.set(-0.12, deskH - topThick - drawerH / 2, 0);

    // Drawer front
    const dFront = new THREE.Mesh(
      new THREE.BoxGeometry(drawerW, drawerH, 0.02),
      this.mainMaterial
    );
    dFront.castShadow = true;
    this.drawerGroup.add(dFront);

    // Drawer interior box
    const dBox = new THREE.Mesh(
      new THREE.BoxGeometry(drawerW - 0.04, drawerH - 0.02, drawerD),
      this.interiorMaterial
    );
    dBox.position.set(0, 0, -drawerD / 2);
    this.drawerGroup.add(dBox);

    // Interior divider compartments for sketches, pens, ruler
    [-0.18, 0.18].forEach((divX) => {
      const divider = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, drawerH - 0.03, drawerD - 0.04),
        this.mainMaterial
      );
      divider.position.set(divX, 0, -drawerD / 2);
      this.drawerGroup.add(divider);
    });

    // Concealed solid brass knife edge pull
    const knifePull = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.012, 0.018),
      this.brassMaterial
    );
    knifePull.position.set(0, 0, 0.015);
    this.drawerGroup.add(knifePull);

    this.root.add(this.drawerGroup);

    // 3. RIGHT FLOATING SIDE STORAGE MODULE
    const sideModW = 0.38;
    const sideModH = 0.42;
    const sideModD = 0.65;

    this.sideModuleGroup = new THREE.Group();
    this.sideModuleGroup.position.set(deskW / 2 - sideModW / 2 - 0.08, deskH - topThick - sideModH / 2, 0);

    const sideModCase = new THREE.Mesh(
      new THREE.BoxGeometry(sideModW, sideModH, sideModD),
      this.mainMaterial
    );
    sideModCase.castShadow = true;
    this.sideModuleGroup.add(sideModCase);

    // Modesty reveal line
    const reveal = new THREE.Mesh(
      new THREE.BoxGeometry(sideModW + 0.005, 0.012, sideModD + 0.005),
      this.brassMaterial
    );
    reveal.position.set(0, 0, 0);
    this.sideModuleGroup.add(reveal);

    this.root.add(this.sideModuleGroup);

    // 4. ARCHITECTURAL TAPERED TRESTLE LEGS WITH HORIZONTAL TIE ROD
    this.legsGroup = new THREE.Group();
    const legThick = 0.04;
    const legGeo = new THREE.BoxGeometry(legThick, deskH - topThick, legThick);

    const trestleOffsets = [-deskW / 2 + 0.12, deskW / 2 - 0.12];
    trestleOffsets.forEach((tx) => {
      const trestle = new THREE.Group();
      trestle.position.set(tx, (deskH - topThick) / 2, 0);

      // Angled front & rear uprights
      const legFront = new THREE.Mesh(legGeo, this.mainMaterial);
      legFront.position.set(0, 0, deskD * 0.32);
      legFront.rotation.x = 0.08;
      legFront.castShadow = true;
      trestle.add(legFront);

      const legRear = new THREE.Mesh(legGeo, this.mainMaterial);
      legRear.position.set(0, 0, -deskD * 0.32);
      legRear.rotation.x = -0.08;
      legRear.castShadow = true;
      trestle.add(legRear);

      // Horizontal bottom stretcher foot
      const foot = new THREE.Mesh(new THREE.BoxGeometry(legThick + 0.015, 0.035, deskD * 0.78), this.mainMaterial);
      foot.position.set(0, -(deskH - topThick) / 2 + 0.018, 0);
      trestle.add(foot);

      // Brass footer ferrules
      [-deskD * 0.35, deskD * 0.35].forEach((fz) => {
        const ferrule = new THREE.Mesh(new THREE.BoxGeometry(legThick + 0.018, 0.025, 0.05), this.brassMaterial);
        ferrule.position.set(0, -(deskH - topThick) / 2 + 0.012, fz);
        trestle.add(ferrule);
      });

      this.legsGroup.add(trestle);
    });

    // Center horizontal tie stretcher
    this.tieRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, deskW - 0.28, 16),
      this.brassMaterial
    );
    this.tieRod.rotation.z = Math.PI / 2;
    this.tieRod.position.set(0, 0.16, 0);
    this.legsGroup.add(this.tieRod);

    this.root.add(this.legsGroup);
  }

  setDrawerOpen(progress) {
    this.drawerOpenProgress = progress;
    this.drawerGroup.position.z = progress * 0.38;
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;

    this.topGroup.position.y = 0.75 - 0.045 / 2 + p * 0.65;
    this.drawerGroup.position.z = p * 0.55;
    this.drawerGroup.position.y = 0.75 - 0.045 - 0.075 / 2 + p * 0.2;
    this.cableLid.position.y = 0.045 / 2 + 0.004 + p * 0.4;
    this.sideModuleGroup.position.x = 1.65 / 2 - 0.38 / 2 - 0.08 + p * 0.5;
    this.legsGroup.position.y = -p * 0.25;
  }

  updateMaterials(mainMat, secondaryMat) {
    if (mainMat) {
      this.topMesh.material = mainMat;
      this.drawerGroup.children[0].material = mainMat;
      this.sideModuleGroup.children[0].material = mainMat;
    }
    if (secondaryMat) {
      this.blotterMesh.material = secondaryMat;
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
