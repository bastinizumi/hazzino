import { SHOWROOM_MATERIALS } from '../../data/showroomData';
import { createFurnitureMaterial } from '../../models/modelMaterials';

/**
 * MaterialController
 *
 * Reusable material selection and transition controller:
 * - Manages object-specific material configurations.
 * - Smoothly updates PBR material properties without replacing geometries.
 * - Guarantees zero conflict with door, drawer, explode, or rotation states.
 */
export class MaterialController {
  constructor(options = {}) {
    this.currentMaterialKey = options.defaultMaterial ?? 'natural_oak';
    this.onMaterialChangeCallback = options.onMaterialChange ?? null;
  }

  getMaterialConfig(matKey) {
    return SHOWROOM_MATERIALS[matKey] || SHOWROOM_MATERIALS.natural_oak;
  }

  getSupportedMaterials(furnitureItem) {
    if (furnitureItem?.materialsSupported && Array.isArray(furnitureItem.materialsSupported)) {
      return furnitureItem.materialsSupported;
    }
    return ['natural_oak', 'walnut', 'dark_walnut', 'warm_beige', 'charcoal', 'matte_black', 'ivory'];
  }

  applyMaterial(furnitureItem, matKey) {
    if (!furnitureItem) return;

    this.currentMaterialKey = matKey;

    if (typeof furnitureItem.setMaterial === 'function') {
      furnitureItem.setMaterial(matKey);
    }

    if (this.onMaterialChangeCallback) {
      this.onMaterialChangeCallback(matKey, this.getMaterialConfig(matKey));
    }
  }

  reset(furnitureItem, defaultKey = null) {
    const key = defaultKey || furnitureItem?.defaultMaterial || 'natural_oak';
    this.applyMaterial(furnitureItem, key);
  }
}
