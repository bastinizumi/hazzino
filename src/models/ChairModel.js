/**
 * HAZZINO INTERIORS — PROCEDURAL ARCHITECTURAL LOUNGE CHAIR MODEL
 * Faithfully matches the exact reference mid-century sculpted walnut armchair:
 * - Curved continuous organic wooden armrests
 * - Angled plush backrest cushion with horizontal channel tuft
 * - Thick tailored seat cushion with backward rake
 * - Sculpted walnut side rails, crossbars, and tapered raked legs
 * - Exploded technical separation and live PBR material switching.
 */
import * as THREE from 'three';
import { createFurnitureMaterial, createBrassAccentMaterial } from './modelMaterials';

export class ChairModel {
  constructor(materialKey = 'boucle') {
    this.root = new THREE.Group();
    this.root.name = 'ChairModel';
    this.materialKey = materialKey;

    this.mainMaterial = createFurnitureMaterial(materialKey);
    this.frameMaterial = createFurnitureMaterial('smoked_walnut');
    this.brassMaterial = createBrassAccentMaterial();

    this.parts = [];
    this.explodeProgress = 0;

    this.buildModel();
  }

  buildModel() {
    const halfWidth = 0.44;
    const armThickness = 0.024;
    const legTopRadius = 0.026;
    const legBottomRadius = 0.017;

    // 1. SEAT CUSHION (Thick tailored cushion with backward rake)
    const seatWidth = 0.74;
    const seatDepth = 0.70;
    const seatHeight = 0.18;

    const seatGroup = new THREE.Group();
    seatGroup.position.set(0, 0.08, 0.02);
    seatGroup.rotation.x = -0.11;

    const seatCoreGeo = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth, 16, 8, 16);
    const seatPos = seatCoreGeo.attributes.position;
    for (let i = 0; i < seatPos.count; i++) {
      const y = seatPos.getY(i);
      const x = seatPos.getX(i);
      const z = seatPos.getZ(i);
      if (y > 0) {
        const distFromCenter = 1.0 - (Math.abs(x) / (seatWidth / 2)) * 0.2 - (Math.abs(z) / (seatDepth / 2)) * 0.2;
        seatPos.setY(i, y + Math.max(0, distFromCenter * 0.035));
      }
    }
    seatCoreGeo.computeVertexNormals();

    const seatMesh = new THREE.Mesh(seatCoreGeo, this.mainMaterial);
    seatMesh.castShadow = true;
    seatMesh.receiveShadow = true;
    seatGroup.add(seatMesh);

    // Welt edge piping
    const weltPoints = [
      new THREE.Vector3(-seatWidth / 2, 0, -seatDepth / 2),
      new THREE.Vector3(seatWidth / 2, 0, -seatDepth / 2),
      new THREE.Vector3(seatWidth / 2, 0, seatDepth / 2),
      new THREE.Vector3(-seatWidth / 2, 0, seatDepth / 2),
      new THREE.Vector3(-seatWidth / 2, 0, -seatDepth / 2),
    ];
    const weltCurve = new THREE.CatmullRomCurve3(weltPoints, true, 'catmullrom', 0.1);
    const weltGeo = new THREE.TubeGeometry(weltCurve, 64, 0.009, 8, true);
    const weltMesh = new THREE.Mesh(weltGeo, this.mainMaterial);
    seatGroup.add(weltMesh);

    this.root.add(seatGroup);
    this.registerPart('seat_cushion', 'BOUCLÉ SEAT CUSHION', seatGroup, [0, 0.7, 0.3]);

    // 2. BACKREST CUSHION (Ergonomic cushion angled ~20° with horizontal channel tuft)
    const backWidth = 0.70;
    const backHeight = 0.68;
    const backDepth = 0.16;

    const backGroup = new THREE.Group();
    backGroup.position.set(0, 0.44, -0.28);
    backGroup.rotation.x = -0.32;

    const lowerBackHeight = backHeight * 0.42;
    const lowerBackGeo = new THREE.BoxGeometry(backWidth, lowerBackHeight, backDepth, 16, 8, 12);
    const lowerBackMesh = new THREE.Mesh(lowerBackGeo, this.mainMaterial);
    lowerBackMesh.position.set(0, -backHeight * 0.24, 0);
    lowerBackMesh.castShadow = true;
    lowerBackMesh.receiveShadow = true;
    backGroup.add(lowerBackMesh);

    const upperBackHeight = backHeight * 0.54;
    const upperBackGeo = new THREE.BoxGeometry(backWidth * 0.96, upperBackHeight, backDepth * 0.94, 16, 8, 12);
    const upperBackMesh = new THREE.Mesh(upperBackGeo, this.mainMaterial);
    upperBackMesh.position.set(0, backHeight * 0.24, -0.01);
    upperBackMesh.castShadow = true;
    upperBackMesh.receiveShadow = true;
    backGroup.add(upperBackMesh);

    // Horizontal channel seam
    const channelCurve = new THREE.LineCurve3(
      new THREE.Vector3(-backWidth / 2 + 0.02, 0, backDepth / 2 + 0.005),
      new THREE.Vector3(backWidth / 2 - 0.02, 0, backDepth / 2 + 0.005)
    );
    const channelGeo = new THREE.TubeGeometry(channelCurve, 16, 0.008, 8, false);
    const channelMesh = new THREE.Mesh(channelGeo, this.mainMaterial);
    backGroup.add(channelMesh);

    this.root.add(backGroup);
    this.registerPart('backrest', 'ANGLED CHANNEL-TUFT BACKREST', backGroup, [0, 0.6, -0.7]);

    // 3. CURVED SCULPTED WOODEN ARMRESTS (Left & Right)
    const armrestsGroup = new THREE.Group();
    [-halfWidth, halfWidth].forEach((sideX) => {
      const armPoints = [
        new THREE.Vector3(sideX, 0.32, -0.36),
        new THREE.Vector3(sideX, 0.44, -0.22),
        new THREE.Vector3(sideX, 0.43, -0.05),
        new THREE.Vector3(sideX, 0.44, 0.12),
        new THREE.Vector3(sideX, 0.41, 0.26),
        new THREE.Vector3(sideX, 0.30, 0.30),
        new THREE.Vector3(sideX, 0.15, 0.28),
      ];
      const armCurve = new THREE.CatmullRomCurve3(armPoints, false, 'catmullrom', 0.2);
      const armGeo = new THREE.TubeGeometry(armCurve, 48, armThickness, 16, false);
      const armMesh = new THREE.Mesh(armGeo, this.frameMaterial);
      armMesh.castShadow = true;
      armrestsGroup.add(armMesh);
    });
    this.root.add(armrestsGroup);
    this.registerPart('armrests', 'SCULPTED WALNUT ARMRESTS', armrestsGroup, [0, 0.3, 0]);

    // 4. WOODEN CHASSIS, SIDE RAILS, LEGS & CROSSBARS
    const chassisGroup = new THREE.Group();
    [-halfWidth, halfWidth].forEach((sideX) => {
      // Side Rail
      const railPoints = [
        new THREE.Vector3(sideX, 0.05, -0.32),
        new THREE.Vector3(sideX, -0.01, -0.04),
        new THREE.Vector3(sideX, 0.08, 0.24),
      ];
      const railCurve = new THREE.CatmullRomCurve3(railPoints, false, 'catmullrom', 0.2);
      const railGeo = new THREE.TubeGeometry(railCurve, 24, armThickness * 0.95, 14, false);
      const railMesh = new THREE.Mesh(railGeo, this.frameMaterial);
      railMesh.castShadow = true;
      chassisGroup.add(railMesh);

      // Front Leg
      const frontLegH = 0.56;
      const frontLegGeo = new THREE.CylinderGeometry(legTopRadius, legBottomRadius, frontLegH, 16);
      const frontLeg = new THREE.Mesh(frontLegGeo, this.frameMaterial);
      frontLeg.position.set(sideX, -0.14, 0.27);
      frontLeg.rotation.x = 0.07;
      frontLeg.rotation.z = sideX > 0 ? -0.04 : 0.04;
      frontLeg.castShadow = true;
      chassisGroup.add(frontLeg);

      // Rear Leg
      const rearLegH = 0.54;
      const rearLegGeo = new THREE.CylinderGeometry(legTopRadius * 1.1, legBottomRadius, rearLegH, 16);
      const rearLeg = new THREE.Mesh(rearLegGeo, this.frameMaterial);
      rearLeg.position.set(sideX, -0.15, -0.36);
      rearLeg.rotation.x = -0.22;
      rearLeg.rotation.z = sideX > 0 ? -0.04 : 0.04;
      rearLeg.castShadow = true;
      chassisGroup.add(rearLeg);

      // Rear Back Stile
      const backStileH = 0.58;
      const backStileGeo = new THREE.CylinderGeometry(legTopRadius * 0.9, legTopRadius * 1.05, backStileH, 16);
      const backStile = new THREE.Mesh(backStileGeo, this.frameMaterial);
      backStile.position.set(sideX * 0.92, 0.44, -0.34);
      backStile.rotation.x = -0.32;
      backStile.castShadow = true;
      chassisGroup.add(backStile);
    });

    // Crossbars
    const frontCrossGeo = new THREE.CylinderGeometry(0.016, 0.016, halfWidth * 2 - 0.04, 16);
    const frontCross = new THREE.Mesh(frontCrossGeo, this.frameMaterial);
    frontCross.rotation.z = Math.PI / 2;
    frontCross.position.set(0, 0.04, 0.22);
    frontCross.castShadow = true;
    chassisGroup.add(frontCross);

    const rearCrossGeo = new THREE.CylinderGeometry(0.016, 0.016, halfWidth * 2 - 0.04, 16);
    const rearCross = new THREE.Mesh(rearCrossGeo, this.frameMaterial);
    rearCross.rotation.z = Math.PI / 2;
    rearCross.position.set(0, 0.02, -0.30);
    rearCross.castShadow = true;
    chassisGroup.add(rearCross);

    this.root.add(chassisGroup);
    this.registerPart('legs', 'WALNUT JOINERY FRAME & LEGS', chassisGroup, [0, -0.8, 0]);
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
        child.material !== this.frameMaterial &&
        child.material !== this.brassMaterial
      ) {
        child.material = this.mainMaterial;
      }
    });
  }

  setDoorOpen(progress) {}
  setDrawerOpen(progress) {}

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
    this.frameMaterial.dispose();
    this.brassMaterial.dispose();
    this.root.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
      }
    });
  }
}
