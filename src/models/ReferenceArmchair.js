/**
 * HAZZINO INTERIORS — REFERENCE MID-CENTURY SCULPTED WALNUT ARMCHAIR
 * Faithfully matches the exact reference chair:
 * - Curved continuous organic wooden armrests
 * - Angled plush backrest cushion with horizontal channel tuft
 * - Thick tailored seat cushion with backward rake
 * - Sculpted walnut side rails, crossbars, and tapered raked legs
 * - Handcrafted architectural joinery aesthetic
 */
import * as THREE from 'three';

export function createReferenceArmchair(cushionMaterial, woodMaterial) {
  const chair = new THREE.Group();
  chair.name = 'ReferenceArmchair';

  const armThickness = 0.024;
  const legTopRadius = 0.026;
  const legBottomRadius = 0.017;
  const halfWidth = 0.44; // Half-width between left and right armrests

  const cushionMeshes = [];
  const woodMeshes = [];

  // =========================================================================
  // 1. SEAT CUSHION (Thick tailored cushion angled back ~6.5 degrees)
  // =========================================================================
  const seatWidth = 0.74;
  const seatDepth = 0.70;
  const seatHeight = 0.18;

  const seatCushionGroup = new THREE.Group();
  seatCushionGroup.position.set(0, 0.08, 0.02);
  seatCushionGroup.rotation.x = -0.11; // subtle backward rake

  // Main cushion body with rounded contour
  const seatCoreGeo = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth, 16, 8, 16);
  // Deform slightly to give organic cushion crown
  const seatPos = seatCoreGeo.attributes.position;
  for (let i = 0; i < seatPos.count; i++) {
    const y = seatPos.getY(i);
    const x = seatPos.getX(i);
    const z = seatPos.getZ(i);
    // Add crown dome to top of cushion
    if (y > 0) {
      const distFromCenter = 1.0 - (Math.abs(x) / (seatWidth / 2)) * 0.2 - (Math.abs(z) / (seatDepth / 2)) * 0.2;
      seatPos.setY(i, y + Math.max(0, distFromCenter * 0.035));
    }
  }
  seatCoreGeo.computeVertexNormals();

  const seatMesh = new THREE.Mesh(seatCoreGeo, cushionMaterial);
  seatMesh.castShadow = true;
  seatMesh.receiveShadow = true;
  seatCushionGroup.add(seatMesh);

  // Welt edge piping around seat perimeter
  const weltPoints = [
    new THREE.Vector3(-seatWidth / 2, 0, -seatDepth / 2),
    new THREE.Vector3(seatWidth / 2, 0, -seatDepth / 2),
    new THREE.Vector3(seatWidth / 2, 0, seatDepth / 2),
    new THREE.Vector3(-seatWidth / 2, 0, seatDepth / 2),
    new THREE.Vector3(-seatWidth / 2, 0, -seatDepth / 2),
  ];
  const weltCurve = new THREE.CatmullRomCurve3(weltPoints, true, 'catmullrom', 0.1);
  const weltGeo = new THREE.TubeGeometry(weltCurve, 64, 0.009, 8, true);
  const weltMesh = new THREE.Mesh(weltGeo, cushionMaterial);
  seatCushionGroup.add(weltMesh);
  cushionMeshes.push(seatMesh, weltMesh);

  chair.add(seatCushionGroup);

  // =========================================================================
  // 2. BACKREST CUSHION (Ergonomic cushion angled ~20 degrees with channel seam)
  // =========================================================================
  const backWidth = 0.70;
  const backHeight = 0.68;
  const backDepth = 0.16;

  const backCushionGroup = new THREE.Group();
  backCushionGroup.position.set(0, 0.44, -0.28);
  backCushionGroup.rotation.x = -0.32; // ~18.5 degrees rake

  // Lower lumbar cushion section
  const lowerBackHeight = backHeight * 0.42;
  const lowerBackGeo = new THREE.BoxGeometry(backWidth, lowerBackHeight, backDepth, 16, 8, 12);
  const lowerBackMesh = new THREE.Mesh(lowerBackGeo, cushionMaterial);
  lowerBackMesh.position.set(0, -backHeight * 0.24, 0);
  lowerBackMesh.castShadow = true;
  lowerBackMesh.receiveShadow = true;
  backCushionGroup.add(lowerBackMesh);

  // Upper back/shoulder cushion section
  const upperBackHeight = backHeight * 0.54;
  const upperBackGeo = new THREE.BoxGeometry(backWidth * 0.96, upperBackHeight, backDepth * 0.94, 16, 8, 12);
  const upperBackMesh = new THREE.Mesh(upperBackGeo, cushionMaterial);
  upperBackMesh.position.set(0, backHeight * 0.24, -0.01);
  upperBackMesh.castShadow = true;
  upperBackMesh.receiveShadow = true;
  backCushionGroup.add(upperBackMesh);

  // Distinctive Horizontal Channel Indent Seam
  const channelCurve = new THREE.LineCurve3(
    new THREE.Vector3(-backWidth / 2 + 0.02, 0, backDepth / 2 + 0.005),
    new THREE.Vector3(backWidth / 2 - 0.02, 0, backDepth / 2 + 0.005)
  );
  const channelGeo = new THREE.TubeGeometry(channelCurve, 16, 0.008, 8, false);
  const channelMesh = new THREE.Mesh(channelGeo, cushionMaterial);
  backCushionGroup.add(channelMesh);
  cushionMeshes.push(lowerBackMesh, upperBackMesh, channelMesh);

  chair.add(backCushionGroup);

  // =========================================================================
  // 3. CURVED SCULPTED WOODEN ARMRESTS (Left & Right)
  // =========================================================================
  const sides = [-halfWidth, halfWidth];

  sides.forEach((sideX) => {
    // Continuous curved spline for the signature sculpted armrest
    const armPoints = [
      new THREE.Vector3(sideX, 0.32, -0.36), // Rear anchor at back upright
      new THREE.Vector3(sideX, 0.44, -0.22), // Rising curve
      new THREE.Vector3(sideX, 0.43, -0.05), // Gentle ergonomic elbow rest
      new THREE.Vector3(sideX, 0.44, 0.12),  // Forearm level
      new THREE.Vector3(sideX, 0.41, 0.26),  // Front dip rounding forward
      new THREE.Vector3(sideX, 0.30, 0.30),  // Front curve downward
      new THREE.Vector3(sideX, 0.15, 0.28),  // Front post top joint
    ];

    const armCurve = new THREE.CatmullRomCurve3(armPoints, false, 'catmullrom', 0.2);
    const armGeo = new THREE.TubeGeometry(armCurve, 48, armThickness, 16, false);
    const armMesh = new THREE.Mesh(armGeo, woodMaterial);
    armMesh.castShadow = true;
    chair.add(armMesh);

    // Sculpted Side Rail (connecting rear and front leg beneath seat)
    const railPoints = [
      new THREE.Vector3(sideX, 0.05, -0.32),
      new THREE.Vector3(sideX, -0.01, -0.04), // Organic dip under seat
      new THREE.Vector3(sideX, 0.08, 0.24),
    ];
    const railCurve = new THREE.CatmullRomCurve3(railPoints, false, 'catmullrom', 0.2);
    const railGeo = new THREE.TubeGeometry(railCurve, 24, armThickness * 0.95, 14, false);
    const railMesh = new THREE.Mesh(railGeo, woodMaterial);
    railMesh.castShadow = true;
    chair.add(railMesh);

    // Front Leg (Tapered, subtly splayed forward and outward)
    const frontLegH = 0.56;
    const frontLegGeo = new THREE.CylinderGeometry(legTopRadius, legBottomRadius, frontLegH, 16);
    const frontLeg = new THREE.Mesh(frontLegGeo, woodMaterial);
    frontLeg.position.set(sideX, -0.14, 0.27);
    frontLeg.rotation.x = 0.07;
    frontLeg.rotation.z = sideX > 0 ? -0.04 : 0.04;
    frontLeg.castShadow = true;
    chair.add(frontLeg);

    // Rear Leg & Backrest Upright Stile (Continuous raked timber member)
    const rearLegH = 0.54;
    const rearLegGeo = new THREE.CylinderGeometry(legTopRadius * 1.1, legBottomRadius, rearLegH, 16);
    const rearLeg = new THREE.Mesh(rearLegGeo, woodMaterial);
    rearLeg.position.set(sideX, -0.15, -0.36);
    rearLeg.rotation.x = -0.22; // Raked backwards
    rearLeg.rotation.z = sideX > 0 ? -0.04 : 0.04;
    rearLeg.castShadow = true;
    chair.add(rearLeg);

    // Rear Stile reaching up behind backrest
    const backStileH = 0.58;
    const backStileGeo = new THREE.CylinderGeometry(legTopRadius * 0.9, legTopRadius * 1.05, backStileH, 16);
    const backStile = new THREE.Mesh(backStileGeo, woodMaterial);
    backStile.position.set(sideX * 0.92, 0.44, -0.34);
    backStile.rotation.x = -0.32;
    backStile.castShadow = true;
    chair.add(backStile);
    woodMeshes.push(armMesh, railMesh, frontLeg, rearLeg, backStile);
  });

  // =========================================================================
  // 4. CROSS STRETCHERS & CRADLE (Connecting left and right frames)
  // =========================================================================
  // Front crossbar under seat
  const frontCrossGeo = new THREE.CylinderGeometry(0.016, 0.016, halfWidth * 2 - 0.04, 16);
  const frontCross = new THREE.Mesh(frontCrossGeo, woodMaterial);
  frontCross.rotation.z = Math.PI / 2;
  frontCross.position.set(0, 0.04, 0.22);
  frontCross.castShadow = true;
  chair.add(frontCross);
  woodMeshes.push(frontCross);

  // Rear crossbar under seat
  const rearCrossGeo = new THREE.CylinderGeometry(0.016, 0.016, halfWidth * 2 - 0.04, 16);
  const rearCross = new THREE.Mesh(rearCrossGeo, woodMaterial);
  rearCross.rotation.z = Math.PI / 2;
  rearCross.position.set(0, 0.02, -0.30);
  rearCross.castShadow = true;
  chair.add(rearCross);
  woodMeshes.push(rearCross);

  // Top rear crossbar behind backrest
  const topBackCrossGeo = new THREE.CylinderGeometry(0.018, 0.018, halfWidth * 1.76, 16);
  const topBackCross = new THREE.Mesh(topBackCrossGeo, woodMaterial);
  topBackCross.rotation.z = Math.PI / 2;
  topBackCross.position.set(0, 0.68, -0.42);
  topBackCross.castShadow = true;
  chair.add(topBackCross);
  woodMeshes.push(topBackCross);

  return {
    group: chair,
    seatGroup: seatCushionGroup,
    backGroup: backCushionGroup,
    cushionMeshes,
    woodMeshes,
  };
}
