/**
 * HAZZINO INTERIORS — BESPOKE DINING SET (TABLE & SCULPTED CHAIRS) 3D MODEL
 * Monolithic architectural dining table complete with 6 Italian sculpted dining chairs:
 * - Fully tailored upholstery shell (reacts to user Fabric/Leather/Color) with French welt piping
 * - 5-channel vertical fluted lumbar cushioning with contoured arm wings
 * - Central satin champagne brass architectural spine and crest medallion
 * - Solid American walnut apron chassis, integral stiles & H-stretcher joinery
 * - Tapered legs with iconic 10° raked rear stance and turned champagne brass ferrules
 * - Monolithic fluted twin-pedestal table with honed stone slab, centerpiece bowl & 6 place settings
 */
import * as THREE from 'three';
import { createReferenceArmchair } from './ReferenceArmchair';
import {
  createFurnitureMaterial,
  createBrassAccentMaterial,
  createGlassMaterial,
} from './modelMaterials';

export class DiningChairModel {
  constructor(materialConfig, colorHex) {
    this.root = new THREE.Group();
    this.root.name = 'DiningChairModel';

    // Chair upholstery material (reacts dynamically to user fabric/leather/color choices)
    this.mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex || 0xede8dd),
      roughness: 0.85,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Wood & Table Materials
    this.woodMaterial = createFurnitureMaterial('warm_walnut');
    this.woodMaterial.side = THREE.DoubleSide;

    this.tableMaterial = createFurnitureMaterial('travertine');
    this.brassMaterial = createBrassAccentMaterial();

    this.explodeProgress = 0;
    this.upholsteryMeshes = [];
    this.woodMeshes = [];
    this.tableMeshes = [];
    this.chairGroups = [];

    this.buildModel();
  }

  buildModel() {
    const tableLength = 2.55;
    const tableWidth = 1.15;
    const tableHeight = 0.76;
    const slabThickness = 0.055;

    // =========================================================================
    // 1. MONOLITHIC ARCHITECTURAL DINING TABLE
    // =========================================================================
    this.tableGroup = new THREE.Group();
    this.tableGroup.position.set(0, 0, 0);

    // 1.1 Tabletop Slab
    this.topGroup = new THREE.Group();
    this.topGroup.position.set(0, tableHeight - slabThickness / 2, 0);

    const topGeom = new THREE.BoxGeometry(tableLength, slabThickness, tableWidth);
    this.topMesh = new THREE.Mesh(topGeom, this.tableMaterial);
    this.topMesh.castShadow = true;
    this.topMesh.receiveShadow = true;
    this.topGroup.add(this.topMesh);
    this.tableMeshes.push(this.topMesh);

    // Decorative Centerpiece: Carved stone trough bowl with dried botanicals
    const bowlMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.12, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0x221f1d, roughness: 0.75 })
    );
    bowlMesh.scale.set(1.5, 1.0, 0.7);
    bowlMesh.position.set(0, slabThickness / 2 + 0.04, 0);
    bowlMesh.castShadow = true;
    this.topGroup.add(bowlMesh);

    // Tableware Place Settings (6 places: 3 south, 3 north)
    const plateGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.015, 24);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.45 });
    const glassGeo = new THREE.CylinderGeometry(0.03, 0.018, 0.11, 16);
    const glassMat = createGlassMaterial(0.35);

    [-0.74, 0, 0.74].forEach((px) => {
      // South side settings
      const plateS = new THREE.Mesh(plateGeo, plateMat);
      plateS.position.set(px, slabThickness / 2 + 0.008, 0.36);
      this.topGroup.add(plateS);

      const glassS = new THREE.Mesh(glassGeo, glassMat);
      glassS.position.set(px + 0.14, slabThickness / 2 + 0.055, 0.44);
      this.topGroup.add(glassS);

      // North side settings
      const plateN = new THREE.Mesh(plateGeo, plateMat);
      plateN.position.set(px, slabThickness / 2 + 0.008, -0.36);
      this.topGroup.add(plateN);

      const glassN = new THREE.Mesh(glassGeo, glassMat);
      glassN.position.set(px + 0.14, slabThickness / 2 + 0.055, -0.44);
      this.topGroup.add(glassN);
    });

    this.tableGroup.add(this.topGroup);

    // 1.2 Twin Fluted Architectural Pedestals
    const pedHeight = tableHeight - slabThickness - 0.04;
    const pedDist = tableLength * 0.28;

    this.pedLeftGroup = new THREE.Group();
    this.pedLeftGroup.position.set(-pedDist, pedHeight / 2 + 0.02, 0);
    this.buildFlutedColumn(this.pedLeftGroup, pedHeight);
    this.tableGroup.add(this.pedLeftGroup);

    this.pedRightGroup = new THREE.Group();
    this.pedRightGroup.position.set(pedDist, pedHeight / 2 + 0.02, 0);
    this.buildFlutedColumn(this.pedRightGroup, pedHeight);
    this.tableGroup.add(this.pedRightGroup);

    // 1.3 Tie Stretcher Bar
    this.tieBar = new THREE.Mesh(
      new THREE.BoxGeometry(pedDist * 2 - 0.35, 0.038, 0.05),
      this.woodMaterial
    );
    this.tieBar.position.set(0, 0.18, 0);
    this.woodMeshes.push(this.tieBar);
    this.tableGroup.add(this.tieBar);

    // 1.4 Brass Plinth Base Plates
    this.plinthLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.34, 0.02, 32),
      this.brassMaterial
    );
    this.plinthLeft.scale.set(1.2, 1.0, 0.85);
    this.plinthLeft.position.set(-pedDist, 0.01, 0);
    this.tableGroup.add(this.plinthLeft);

    this.plinthRight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.34, 0.02, 32),
      this.brassMaterial
    );
    this.plinthRight.scale.set(1.2, 1.0, 0.85);
    this.plinthRight.position.set(pedDist, 0.01, 0);
    this.tableGroup.add(this.plinthRight);

    this.root.add(this.tableGroup);

    // =========================================================================
    // 2. SET OF 6 SCULPTURAL BESPOKE DINING CHAIRS
    // =========================================================================
    const chairConfigs = [
      // South Side (Hero center chair gently angled to showcase inner tailoring & raked legs)
      { id: 'chair_s_center', x: 0, z: 0.94, rotY: Math.PI - 0.42, isHero: true },
      { id: 'chair_s_left', x: -0.76, z: 0.82, rotY: Math.PI - 0.08, isHero: false },
      { id: 'chair_s_right', x: 0.76, z: 0.82, rotY: Math.PI + 0.08, isHero: false },
      // North Side (Facing south toward camera, showing front fluting & stance)
      { id: 'chair_n_center', x: 0, z: -0.80, rotY: 0, isHero: false },
      { id: 'chair_n_left', x: -0.76, z: -0.80, rotY: 0.08, isHero: false },
      { id: 'chair_n_right', x: 0.76, z: -0.80, rotY: -0.08, isHero: false },
    ];

    chairConfigs.forEach((cfg) => {
      this.buildChairInstance(cfg);
    });
  }

  buildFlutedColumn(group, h) {
    const coreGeom = new THREE.CylinderGeometry(0.28, 0.3, h, 32);
    const coreMesh = new THREE.Mesh(coreGeom, this.tableMaterial);
    coreMesh.scale.set(1.15, 1.0, 0.82);
    coreMesh.castShadow = true;
    group.add(coreMesh);
    this.tableMeshes.push(coreMesh);

    // Vertical architectural fluted ribs
    const numRibs = 20;
    for (let i = 0; i < numRibs; i++) {
      const ang = (i / numRibs) * Math.PI * 2;
      const rib = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.014, h - 0.01, 8),
        this.tableMaterial
      );
      rib.position.set(Math.cos(ang) * 0.29 * 1.15, 0, Math.sin(ang) * 0.29 * 0.82);
      group.add(rib);
      this.tableMeshes.push(rib);
    }

    // Top brass collar ring
    const collarTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.31, 0.025, 32),
      this.brassMaterial
    );
    collarTop.scale.set(1.15, 1.0, 0.82);
    collarTop.position.set(0, h / 2 - 0.012, 0);
    group.add(collarTop);
  }

  buildChairInstance({ id, x, z, rotY, isHero }) {
    const chairRoot = new THREE.Group();
    chairRoot.name = 'Chair_' + id;
    chairRoot.position.set(x, 0, z);
    chairRoot.rotation.y = rotY;

    // Exact reference armchair with curved continuous wooden armrests and tailored cushions
    const chairInst = createReferenceArmchair(this.mainMaterial, this.woodMaterial);

    // Scale armchair to dining suite proportions (0.76x scale)
    const diningScale = 0.76;
    chairInst.group.scale.set(diningScale, diningScale, diningScale);

    // Position vertically so chair feet rest firmly on floor at y = 0
    chairInst.group.position.set(0, 0.32, 0);

    chairRoot.add(chairInst.group);
    this.root.add(chairRoot);

    // Track meshes for real-time configurator material updates
    if (chairInst.cushionMeshes) {
      chairInst.cushionMeshes.forEach((m) => this.upholsteryMeshes.push(m));
    }
    if (chairInst.woodMeshes) {
      chairInst.woodMeshes.forEach((m) => this.woodMeshes.push(m));
    }

    this.chairGroups.push({
      id,
      baseX: x,
      baseZ: z,
      group: chairRoot,
      chairInst,
      isHero,
    });
  }

  setExplode(progress) {
    this.explodeProgress = progress;
    const p = progress;
    const pedDist = 2.55 * 0.28;

    // Tabletop rises smoothly
    this.topGroup.position.y = 0.76 - 0.055 / 2 + p * 0.75;

    // Pedestals glide outward
    this.pedLeftGroup.position.x = -pedDist - p * 0.55;
    this.pedRightGroup.position.x = pedDist + p * 0.55;
    this.plinthLeft.position.x = -pedDist - p * 0.55;
    this.plinthRight.position.x = pedDist + p * 0.55;
    this.tieBar.position.y = 0.18 - p * 0.12;

    // Chairs glide outward and articulate
    this.chairGroups.forEach((cg) => {
      const isSouth = cg.baseZ > 0;
      const slideDir = isSouth ? 1 : -1;

      cg.group.position.z = cg.baseZ + slideDir * p * 0.65;

      if (cg.isHero && cg.chairInst) {
        cg.chairInst.backGroup.position.z = -0.28 - p * 0.35;
        cg.chairInst.seatGroup.position.y = 0.08 + p * 0.25;
      }
    });
  }

  updateMaterials(mainMat, secondaryMat) {
    // 1. Update Chair Upholstery (Seat cushions, fluted channels, welt piping, back shell & crest)
    if (mainMat) {
      this.upholsteryMeshes.forEach((mesh) => {
        mesh.material = mainMat;
      });
    }

    // 2. Update Wood & Frame Elements (Legs, apron, integral stiles, stretchers)
    if (secondaryMat) {
      this.woodMeshes.forEach((mesh) => {
        mesh.material = secondaryMat;
      });
    }
  }

  reset() {
    this.setExplode(0);
    this.root.rotation.y = 0;
  }

  dispose() {
    this.root.traverse((c) => {
      if (c.isMesh && c.geometry) {
        c.geometry.dispose();
      }
    });
  }
}
