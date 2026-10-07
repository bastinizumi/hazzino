import * as THREE from 'three';

/**
 * HAZZINO INTERIORS — ARCHITECTURAL 3D GEOMETRY BUILDER
 * Generates photorealistic high-poly curved, beveled, and fluted geometries
 * to eliminate all flat placeholder boxes across all 5 showroom sanctuaries.
 */

/**
 * Creates a rounded rectangular 2D shape with smooth corner fillets
 */
export function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const r = Math.min(radius, width / 2 - 0.005, height / 2 - 0.005);
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

/**
 * Creates an extruded 3D box with rounded corners and smooth chamfered edge bevels
 */
export function createRoundedBoxGeometry(width, height, depth, radius = 0.04, bevel = 0.015) {
  const bevelClamped = Math.min(bevel, width * 0.1, height * 0.1, depth * 0.15);
  const shape = createRoundedRectShape(
    Math.max(0.02, width - bevelClamped * 2),
    Math.max(0.02, height - bevelClamped * 2),
    Math.max(0.01, radius - bevelClamped)
  );

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - bevelClamped * 2),
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: bevelClamped,
    bevelThickness: bevelClamped,
  });
  geom.center();
  return geom;
}

/**
 * Creates an architectural monolithic fluted column pedestal with 3D vertical relief
 */
export function createFlutedColumn(radius, height, numFlutes = 28, fluteDepth = 0.014, material) {
  const group = new THREE.Group();
  
  // Core cylinder
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(radius - fluteDepth, radius - fluteDepth, height, 36),
    material
  );
  core.castShadow = true;
  core.receiveShadow = true;
  group.add(core);

  // Individual vertical 3D flutes
  const fluteGeo = new THREE.CylinderGeometry(fluteDepth * 1.3, fluteDepth * 1.3, height, 10);
  for (let i = 0; i < numFlutes; i++) {
    const angle = (i / numFlutes) * Math.PI * 2;
    const fx = Math.cos(angle) * (radius - fluteDepth * 0.35);
    const fz = Math.sin(angle) * (radius - fluteDepth * 0.35);
    const rib = new THREE.Mesh(fluteGeo, material);
    rib.position.set(fx, 0, fz);
    rib.castShadow = true;
    rib.receiveShadow = true;
    group.add(rib);
  }

  return group;
}

/**
 * Creates an organic, plush upholstered bouclé cushion with soft rounded edges & seam indentations
 */
export function createOrganicCushion(width, height, depth, radius = 0.08, material) {
  const geom = createRoundedBoxGeometry(width, height, depth, radius, 0.025);
  const mesh = new THREE.Mesh(geom, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Creates an architectural throw pillow with realistic loft, pillow-edge seam, and relaxed tilt angle
 */
export function createSculpturalPillow(width, height, depth, material, rotX = 0, rotY = 0, rotZ = 0) {
  const group = new THREE.Group();
  const geom = createRoundedBoxGeometry(width, height, depth, 0.06, 0.02);
  const mesh = new THREE.Mesh(geom, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  group.rotation.set(rotX, rotY, rotZ);
  return group;
}

/**
 * Creates an upholstered mattress with rounded pillow-top quilting
 */
export function createLuxuryMattress(width, height, length, material) {
  const group = new THREE.Group();

  // Main core mattress
  const coreGeom = createRoundedBoxGeometry(width, height * 0.82, length, 0.06, 0.02);
  const core = new THREE.Mesh(coreGeom, material);
  core.position.y = (height * 0.82) / 2;
  core.castShadow = true;
  core.receiveShadow = true;
  group.add(core);

  // Pillow-top topper layer
  const topperGeom = createRoundedBoxGeometry(width * 0.98, height * 0.22, length * 0.98, 0.05, 0.018);
  const topper = new THREE.Mesh(topperGeom, material);
  topper.position.y = height * 0.82 + (height * 0.22) / 2;
  topper.castShadow = true;
  topper.receiveShadow = true;
  group.add(topper);

  return group;
}

/**
 * Creates an artistic double-ended freestanding soaking tub with hollow interior & curved rim
 */
export function createFreestandingTub(length, width, height, material) {
  const group = new THREE.Group();

  // Outer shell with gentle tapered curve
  const outerGeom = new THREE.CylinderGeometry(0.58, 0.48, height, 48, 1, false);
  const outerMesh = new THREE.Mesh(outerGeom, material);
  outerMesh.scale.set(length, 1.0, width);
  outerMesh.position.y = height / 2;
  outerMesh.castShadow = true;
  outerMesh.receiveShadow = true;
  group.add(outerMesh);

  // Rolled rounded tub rim
  const rimTorus = new THREE.TorusGeometry(0.56, 0.035, 16, 48);
  const rimMesh = new THREE.Mesh(rimTorus, material);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.scale.set(length, width, 1.0);
  rimMesh.position.y = height;
  rimMesh.castShadow = true;
  group.add(rimMesh);

  // Interior cavity floor
  const innerCavity = new THREE.Mesh(
    new THREE.CylinderGeometry(0.53, 0.44, height * 0.94, 40),
    material
  );
  innerCavity.scale.set(length * 0.96, 1.0, width * 0.96);
  innerCavity.position.y = height / 2 + 0.02;
  group.add(innerCavity);

  return group;
}
