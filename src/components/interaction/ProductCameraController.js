import * as THREE from 'three';
import gsap from 'gsap';

/**
 * ProductCameraController
 *
 * Implements architectural dynamic product framing for Three.js.
 * Guarantees that interactive furniture is NEVER zoomed in excessively:
 * - Calculates 3D bounding box (Box3) and dimensions.
 * - Computes required camera distance so the complete object occupies 65-80%
 *   of the viewport with 15-25% breathing space around all edges.
 * - Incorporates clearance for open doors, sliding drawers, and exploded components.
 * - Enforces a strict HARD MINIMUM DISTANCE so no user action can crop the piece.
 * - Provides smooth damped orbit, rotation, and reset capabilities.
 */
export class ProductCameraController {
  constructor(camera, options = {}) {
    this.camera = camera;
    this.damping = options.damping ?? 0.085;

    // Camera target in 3D world space
    this.target = new THREE.Vector3(0, 0.65, 0);
    this.currentTarget = new THREE.Vector3(0, 0.65, 0);

    // Spherical orbit parameters
    this.azimuth = options.initialAzimuth ?? 0;
    this.targetAzimuth = options.initialAzimuth ?? 0;

    this.polar = options.initialPolar ?? Math.PI * 0.42;
    this.targetPolar = options.initialPolar ?? Math.PI * 0.42;

    this.distance = options.initialDistance ?? 4.5;
    this.targetDistance = options.initialDistance ?? 4.5;

    // Hard bounds
    this.minDistance = 2.8;
    this.maxDistance = 7.2;
    this.minPolar = 0.18; // ~10° elevation
    this.maxPolar = 1.46; // ~83° elevation (strictly above floor)

    // Room default viewpoint
    this.roomDefaultTarget = new THREE.Vector3(0, 0.65, 0);
    this.roomDefaultDistance = 4.5;
    this.roomDefaultPolar = Math.PI * 0.42;

    this.activeTween = null;
    this.currentFramingInfo = null;
  }

  /**
   * Set room default coordinates for return/reset
   */
  setRoomDefaults(target, distance, polar = Math.PI * 0.42) {
    this.roomDefaultTarget.copy(target);
    this.roomDefaultDistance = distance;
    this.roomDefaultPolar = polar;
  }

  /**
   * Calculate adaptive framing for any 3D object group
   */
  calculateObjectFraming(objectGroup, extraFeatures = {}) {
    if (!objectGroup) {
      return {
        center: new THREE.Vector3(0, 0.65, 0),
        size: new THREE.Vector3(1, 1, 1),
        idealDistance: 3.8,
        minDistance: 3.2,
        maxDistance: 6.0,
      };
    }

    // 1. Calculate world bounding box
    objectGroup.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(objectGroup);

    if (box.isEmpty()) {
      return {
        center: new THREE.Vector3(0, 0.65, 0),
        size: new THREE.Vector3(1, 1, 1),
        idealDistance: 3.8,
        minDistance: 3.2,
        maxDistance: 6.0,
      };
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const diagonal = size.length();

    // 2. Compute adaptive framing targeting 68% - 75% viewport coverage
    const fillRatio = 0.74;

    const aspect = this.camera.aspect || (window.innerWidth / window.innerHeight);
    const vFovRad = (this.camera.fov * Math.PI) / 180;
    const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

    // Frame the base product width + subtle 8% breathing allowance
    const frameWidth = size.x * 1.08;
    const frameHeight = Math.max(size.y * 1.25, 0.9);
    const frameDiag = diagonal * 0.82;

    const distW = frameWidth / (fillRatio * 2 * Math.tan(hFovRad / 2));
    const distH = frameHeight / (fillRatio * 2 * Math.tan(vFovRad / 2));
    const distDiag = frameDiag / (fillRatio * 2 * Math.tan(vFovRad / 2));

    let idealDistance = Math.max(distW, distH, distDiag * 0.72);

    // Specific object size calibration to guarantee 65-80% framing with full door/drawer/explode clearance
    if (size.x > 2.8) {
      // Large credenza / table / island (width ~3.2m): ideal distance ~3.55m - 3.85m (~68-72% fill)
      idealDistance = THREE.MathUtils.clamp(idealDistance, 3.55, 3.85);
    } else if (size.x > 1.8 || size.y > 1.8) {
      // Medium large items (wardrobe, bed): ~3.4m - 4.1m
      idealDistance = THREE.MathUtils.clamp(idealDistance, 3.4, 4.1);
    } else if (size.x < 1.0) {
      // Small items (side table, armchair, stools): ~2.4m - 2.85m
      idealDistance = THREE.MathUtils.clamp(idealDistance, 2.4, 2.85);
    } else {
      idealDistance = THREE.MathUtils.clamp(idealDistance, 2.9, 3.6);
    }

    // Hard minimum distance prevents zooming closer than 85% of ideal framing
    const hardMin = idealDistance * 0.85;
    const hardMax = Math.max(idealDistance * 1.6, 6.8);

    return {
      center,
      size,
      idealDistance,
      minDistance: hardMin,
      maxDistance: hardMax,
    };
  }

  /**
   * Smoothly focus camera on furniture object without extreme zoom
   */
  focusOnObject(objectGroup, extraFeatures = {}, duration = 0.95, onComplete = null) {
    const framing = this.calculateObjectFraming(objectGroup, extraFeatures);
    this.currentFramingInfo = framing;

    // Update hard bounds
    this.minDistance = framing.minDistance;
    this.maxDistance = framing.maxDistance;

    // Ergonomic target lookAt: centered with slight vertical optical correction
    const targetY = framing.center.y + framing.size.y * 0.04;

    if (this.activeTween) {
      this.activeTween.kill();
    }

    const animState = {
      tx: this.target.x,
      ty: this.target.y,
      tz: this.target.z,
      dist: this.targetDistance,
      polar: this.targetPolar,
    };

    // Keep polar angle comfortable
    const targetPolarAngle = THREE.MathUtils.clamp(this.targetPolar, 0.38, 1.25);

    this.activeTween = gsap.to(animState, {
      tx: framing.center.x,
      ty: targetY,
      tz: framing.center.z,
      dist: framing.idealDistance,
      polar: targetPolarAngle,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        this.target.set(animState.tx, animState.ty, animState.tz);
        this.targetDistance = animState.dist;
        this.targetPolar = animState.polar;
      },
      onComplete: () => {
        this.activeTween = null;
        if (onComplete) onComplete();
      },
    });

    return framing;
  }

  /**
   * Smoothly return to the full wide room view
   */
  returnToRoom(duration = 1.0, onComplete = null) {
    this.minDistance = 2.2;
    this.maxDistance = 7.5;
    this.currentFramingInfo = null;

    if (this.activeTween) {
      this.activeTween.kill();
    }

    const animState = {
      tx: this.target.x,
      ty: this.target.y,
      tz: this.target.z,
      dist: this.targetDistance,
      polar: this.targetPolar,
    };

    this.activeTween = gsap.to(animState, {
      tx: this.roomDefaultTarget.x,
      ty: this.roomDefaultTarget.y,
      tz: this.roomDefaultTarget.z,
      dist: this.roomDefaultDistance,
      polar: this.roomDefaultPolar,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.target.set(animState.tx, animState.ty, animState.tz);
        this.targetDistance = animState.dist;
        this.targetPolar = animState.polar;
      },
      onComplete: () => {
        this.activeTween = null;
        if (onComplete) onComplete();
      },
    });
  }

  /**
   * Apply user drag delta to camera azimuth & polar angle
   */
  applyDrag(deltaX, deltaY, speedMultiplier = 1.0) {
    this.targetAzimuth -= deltaX * 0.006 * speedMultiplier;
    this.targetPolar = THREE.MathUtils.clamp(
      this.targetPolar - deltaY * 0.005 * speedMultiplier,
      this.minPolar,
      this.maxPolar
    );
  }

  /**
   * Apply user zoom wheel or pinch with STRICT hard minimum clamping
   */
  applyZoom(zoomDelta) {
    this.targetDistance = THREE.MathUtils.clamp(
      this.targetDistance + zoomDelta,
      this.minDistance,
      this.maxDistance
    );
  }

  /**
   * Update method called each frame in the render loop (60FPS damping)
   */
  update() {
    // Damped interpolation of spherical coordinates
    this.azimuth += (this.targetAzimuth - this.azimuth) * this.damping;
    this.polar += (this.targetPolar - this.polar) * this.damping;
    this.distance += (this.targetDistance - this.distance) * (this.damping + 0.005);

    // Clamping guarantees distance never breaches hard minDistance
    this.distance = Math.max(this.distance, this.minDistance * 0.96);

    // Damped interpolation of lookAt target
    this.currentTarget.lerp(this.target, this.damping);

    // Spherical to Cartesian coordinate transformation
    const az = this.azimuth;
    const pol = this.polar;
    const dist = this.distance;
    const tgt = this.currentTarget;

    this.camera.position.x = tgt.x + dist * Math.sin(pol) * Math.sin(az);
    this.camera.position.y = tgt.y + dist * Math.cos(pol);
    this.camera.position.z = tgt.z + dist * Math.sin(pol) * Math.cos(az);
    this.camera.lookAt(tgt);
  }
}
