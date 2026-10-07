import gsap from 'gsap';

/**
 * DrawerController
 *
 * Reusable physical drawer sliding animation controller:
 * - Slides drawer boxes along their real local Z axis.
 * - Smooth deceleration with GSAP power2.inOut (0.85 - 1.0s).
 * - Independent 3D component motion (revealing drawer front, interior, and carcass).
 * - Camera remains at medium product distance without disturbance.
 */
export class DrawerController {
  constructor(options = {}) {
    this.isOpen = false;
    this.progress = 0;
    this.tween = null;
    this.duration = options.duration ?? 0.9;
    this.onUpdateCallback = options.onUpdate ?? null;
    this.onCompleteCallback = options.onComplete ?? null;
  }

  setOpen(furnitureItem, targetState, duration = this.duration) {
    if (!furnitureItem || typeof furnitureItem.setDrawerOpen !== 'function') {
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
          furnitureItem.setDrawerOpen(this.progress);
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
    if (furnitureItem && typeof furnitureItem.setDrawerOpen === 'function') {
      furnitureItem.setDrawerOpen(0);
    }
  }
}
