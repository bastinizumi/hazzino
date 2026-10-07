/**
 * RotationController
 *
 * Reusable 360° object turntable rotation controller:
 * - Allows full 0° to 360° continuous horizontal rotation around object center.
 * - Inertial velocity and smooth friction damping for a luxury showroom feel.
 * - Supports mouse drag and mobile touch gestures.
 * - Synchronizes with render loop for buttery 60fps interpolation.
 */
export class RotationController {
  constructor(options = {}) {
    this.rotationY = 0;
    this.targetRotationY = 0;
    this.velocity = 0;
    this.isDragging = false;
    this.previousX = 0;
    this.speed = options.speed ?? 0.008;
    this.friction = options.friction ?? 0.88;
    this.damping = options.damping ?? 0.12;
  }

  startDrag(clientX) {
    this.isDragging = true;
    this.previousX = clientX;
    this.velocity = 0;
  }

  moveDrag(clientX) {
    if (!this.isDragging) return;
    const deltaX = clientX - this.previousX;
    this.previousX = clientX;

    this.targetRotationY -= deltaX * this.speed;
    this.velocity = -deltaX * this.speed * 0.45;
  }

  endDrag() {
    this.isDragging = false;
  }

  rotateTo(angle, immediate = false) {
    this.targetRotationY = angle;
    this.velocity = 0;
    if (immediate) {
      this.rotationY = angle;
    }
  }

  reset(furnitureGroup) {
    this.targetRotationY = 0;
    this.rotationY = 0;
    this.velocity = 0;
    this.isDragging = false;
    if (furnitureGroup) {
      furnitureGroup.rotation.y = 0;
    }
  }

  /**
   * Update method called each frame in the render loop
   */
  update(furnitureGroup) {
    if (!this.isDragging) {
      this.targetRotationY += this.velocity;
      this.velocity *= this.friction;
    }

    this.rotationY += (this.targetRotationY - this.rotationY) * this.damping;

    if (furnitureGroup) {
      furnitureGroup.rotation.y = this.rotationY;
    }

    return this.rotationY;
  }
}
