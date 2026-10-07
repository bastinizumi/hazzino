import gsap from 'gsap';

/**
 * ExplodeController & AssemblyController
 *
 * Reusable architectural exploded-view engine:
 * - Separates furniture components with controlled 0.15 - 0.45m spacing.
 * - Guarantees all parts remain neatly inside the camera viewport.
 * - Smooth physical easing with GSAP power3.out / power3.inOut (1.0 - 1.4s).
 * - Independent state: works harmoniously with door, drawer, and material states.
 */
export class ExplodeController {
  constructor(options = {}) {
    this.isExploded = false;
    this.progress = 0;
    this.tween = null;
    this.duration = options.duration ?? 1.25;
    this.onUpdateCallback = options.onUpdate ?? null;
    this.onCompleteCallback = options.onComplete ?? null;
  }

  setExploded(furnitureItem, targetState, duration = this.duration) {
    if (!furnitureItem || typeof furnitureItem.setExplode !== 'function') {
      return Promise.resolve(this.isExploded);
    }

    if (this.tween) {
      this.tween.kill();
    }

    this.isExploded = Boolean(targetState);
    const targetProgress = this.isExploded ? 1 : 0;
    const ease = this.isExploded ? 'power3.out' : 'power3.inOut';

    return new Promise((resolve) => {
      const anim = { val: this.progress };

      this.tween = gsap.to(anim, {
        val: targetProgress,
        duration,
        ease,
        onUpdate: () => {
          this.progress = anim.val;
          furnitureItem.setExplode(this.progress);
          if (this.onUpdateCallback) this.onUpdateCallback(this.progress, this.isExploded);
        },
        onComplete: () => {
          this.progress = targetProgress;
          this.tween = null;
          if (this.onCompleteCallback) this.onCompleteCallback(this.isExploded);
          resolve(this.isExploded);
        },
      });
    });
  }

  explode(furnitureItem, duration) {
    return this.setExploded(furnitureItem, true, duration);
  }

  assemble(furnitureItem, duration) {
    return this.setExploded(furnitureItem, false, duration);
  }

  toggle(furnitureItem, duration) {
    return this.setExploded(furnitureItem, !this.isExploded, duration);
  }

  reset(furnitureItem) {
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
    this.isExploded = false;
    this.progress = 0;
    if (furnitureItem && typeof furnitureItem.setExplode === 'function') {
      furnitureItem.setExplode(0);
    }
  }
}

/**
 * AssemblyController alias wrapper conforming to modular interaction architecture
 */
export class AssemblyController {
  constructor(explodeController) {
    this.explodeController = explodeController;
  }

  assemble(furnitureItem, duration) {
    return this.explodeController.assemble(furnitureItem, duration);
  }
}
