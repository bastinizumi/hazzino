import gsap from 'gsap';

/**
 * DoorController
 *
 * Reusable physical door hinge animation controller:
 * - Operates real 3D hinge pivots (rotation around physical hinge axis).
 * - Smooth easing with GSAP power2.inOut (0.85 - 1.1s).
 * - Guarantees NO camera jump or zoom during door motion.
 * - Supports arbitrary furniture models implementing `setDoorOpen(progress)`.
 */
export class DoorController {
  constructor(options = {}) {
    this.isOpen = false;
    this.progress = 0;
    this.tween = null;
    this.duration = options.duration ?? 0.95;
    this.onUpdateCallback = options.onUpdate ?? null;
    this.onCompleteCallback = options.onComplete ?? null;
  }

  setOpen(furnitureItem, targetState, duration = this.duration) {
    if (!furnitureItem || typeof furnitureItem.setDoorOpen !== 'function') {
      return Promise.resolve(this.isOpen);
    }

    if (this.tween) {
      this.tween.kill();
    }

    this.isOpen = Boolean(targetState);
    const targetProgress = this.isOpen ? 1 : 0;

    return new Promise((resolve) => {
      const anim = { val: this.progress };

      this.tween = gsap.to(anim, {
        val: targetProgress,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.progress = anim.val;
          furnitureItem.setDoorOpen(this.progress);
          if (this.onUpdateCallback) this.onUpdateCallback(this.progress, this.isOpen);
        },
        onComplete: () => {
          this.progress = targetProgress;
          this.tween = null;
          if (this.onCompleteCallback) this.onCompleteCallback(this.isOpen);
          resolve(this.isOpen);
        },
      });
    });
  }

  open(furnitureItem, duration) {
    return this.setOpen(furnitureItem, true, duration);
  }

  close(furnitureItem, duration) {
    return this.setOpen(furnitureItem, false, duration);
  }

  toggle(furnitureItem, duration) {
    return this.setOpen(furnitureItem, !this.isOpen, duration);
  }

  reset(furnitureItem) {
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
    this.isOpen = false;
    this.progress = 0;
    if (furnitureItem && typeof furnitureItem.setDoorOpen === 'function') {
      furnitureItem.setDoorOpen(0);
    }
  }
}
