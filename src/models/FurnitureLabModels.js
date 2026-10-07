/**
 * HAZZINO INTERACTIVE FURNITURE LAB — 3D PROCEDURAL ARCHITECTURAL MODELS
 * High-fidelity, physically proportioned models for the complete 10-piece collection:
 *
 * SEATING:
 * 01 — THE HAZZINO LOUNGE CHAIR (createReferenceArmchair)
 * 07 — THE HAZZINO DINING CHAIR (DiningChairModel)
 *
 * STORAGE:
 * 02 — THE HAZZINO ARCHIVE CABINET (CabinetModel)
 * 03 — THE HAZZINO GRAND WARDROBE (GrandWardrobeModel)
 * 04 — THE HAZZINO MODULAR CUPBOARD (ModularCupboardModel)
 *
 * DINING:
 * 05 — THE HAZZINO TEA TABLE (TeaTableModel)
 * 06 — THE HAZZINO SIGNATURE DINING TABLE (SignatureDiningTableModel)
 *
 * BEDROOM:
 * 08 — THE HAZZINO STORAGE BED (StorageBedModel)
 * 10 — THE HAZZINO NIGHT CONSOLE (NightConsoleModel)
 *
 * WORKSPACE:
 * 09 — THE HAZZINO ARCHITECT WRITING DESK (ArchitectWritingDeskModel)
 */
import * as THREE from 'three';
import { createReferenceArmchair } from './ReferenceArmchair';
import { CabinetModel } from './CabinetModel';
import { GrandWardrobeModel } from './GrandWardrobeModel';
import { ModularCupboardModel } from './ModularCupboardModel';
import { TeaTableModel } from './TeaTableModel';
import { SignatureDiningTableModel } from './SignatureDiningTableModel';
import { DiningChairModel } from './DiningChairModel';
import { StorageBedModel } from './StorageBedModel';
import { ArchitectWritingDeskModel } from './ArchitectWritingDeskModel';
import { NightConsoleModel } from './NightConsoleModel';
import { createFurnitureMaterial, createBrassAccentMaterial } from './modelMaterials';

// Helper to create a standard PBR material from lab color and material config
export function createLabPBRMaterial(materialConfig, colorHex) {
  const threeColor = new THREE.Color(colorHex || 0xede8dd);
  const isMetal = materialConfig?.id === 'metal';
  const isMarble = materialConfig?.id === 'marble';
  const isLeather = materialConfig?.id === 'leather';

  let roughness = materialConfig?.roughness ?? 0.65;
  let metalness = isMetal ? 0.85 : (materialConfig?.metalness ?? 0.04);

  if (isMarble) {
    roughness = 0.28;
    metalness = 0.04;
  } else if (isLeather) {
    roughness = 0.38;
    metalness = 0.05;
  }

  return new THREE.MeshStandardMaterial({
    color: threeColor,
    roughness,
    metalness,
  });
}

// ---------------------------------------------------------------------------
// 01 — LOUNGE CHAIR (APPROVED EXISTING DESIGN)
// ---------------------------------------------------------------------------
export function createChairLabModel(mainMat, secondaryMat) {
  const result = createReferenceArmchair(mainMat, secondaryMat);
  const group = result.group;
  group.scale.set(1.42, 1.42, 1.42);
  group.position.set(0, 0.04, 0);

  return {
    root: group,
    type: 'chair',
    parts: result.parts || [],
    setExplode: (progress) => {
      group.children.forEach((child) => {
        if (child.name === 'Backrest' || child.position.z < -0.1) {
          child.position.z = -0.15 - progress * 0.45;
          child.position.y = 0.55 + progress * 0.25;
        } else if (child.name === 'Seat' || child.position.y < 0.4) {
          child.position.y = 0.08 + progress * 0.45;
        }
      });
    },
    updateMaterials: (mMat, sMat) => {
      if (result.cushionMesh && mMat) result.cushionMesh.material = mMat;
      if (result.frameMesh && sMat) result.frameMesh.material = sMat;
    },
    dispose: () => {
      group.traverse((c) => {
        if (c.isMesh && c.geometry) c.geometry.dispose();
      });
    },
  };
}

// ---------------------------------------------------------------------------
// 02 — ARCHIVE CABINET (APPROVED EXISTING DESIGN)
// ---------------------------------------------------------------------------
export function createCabinetLabModel(mainMat, secondaryMat, colorHex) {
  const cabinet = new CabinetModel('natural_oak');
  if (mainMat && cabinet.updateMaterials) {
    cabinet.updateMaterials(mainMat, secondaryMat);
  }
  cabinet.root.scale.set(1.05, 1.05, 1.05);
  cabinet.root.position.set(0, 0.4, 0);

  return {
    root: cabinet.root,
    type: 'cabinet',
    rawModel: cabinet,
    setDoorOpen: (progress) => cabinet.setDoorOpen(progress),
    setDrawerOpen: (progress) => cabinet.setDrawerOpen(progress),
    setExplode: (progress) => cabinet.setExplode(progress),
    updateMaterials: (mMat, sMat) => cabinet.updateMaterials && cabinet.updateMaterials(mMat, sMat),
    dispose: () => cabinet.dispose(),
  };
}

// ---------------------------------------------------------------------------
// 03 — GRAND WARDROBE (NEW)
// ---------------------------------------------------------------------------
export function createGrandWardrobeLabModel(mainMat, secondaryMat, colorHex) {
  const wardrobe = new GrandWardrobeModel({ id: 'natural_wood' }, colorHex);
  wardrobe.root.scale.set(0.95, 0.95, 0.95);
  wardrobe.root.position.set(0, 0, 0);

  return {
    root: wardrobe.root,
    type: 'wardrobe',
    rawModel: wardrobe,
    setDoorOpen: (progress) => wardrobe.setDoorOpen(progress),
    setDrawerOpen: (progress) => wardrobe.setDoorOpen(progress),
    setExplode: (progress) => wardrobe.setExplode(progress),
    updateMaterials: (mMat, sMat) => wardrobe.updateMaterials(mMat, sMat),
    dispose: () => wardrobe.dispose(),
  };
}

// ---------------------------------------------------------------------------
// 04 — MODULAR CUPBOARD (NEW)
// ---------------------------------------------------------------------------
export function createModularCupboardLabModel(mainMat, secondaryMat, colorHex) {
  const cupboard = new ModularCupboardModel({ id: 'natural_wood' }, colorHex);
  cupboard.root.scale.set(1.02, 1.02, 1.02);
  cupboard.root.position.set(0, 0.05, 0);

  return {
    root: cupboard.root,
    type: 'cupboard',
    rawModel: cupboard,
    setDoorOpen: (progress) => cupboard.setDoorOpen(progress),
    setDrawerOpen: (progress) => cupboard.setDrawerOpen(progress),
    setExplode: (progress) => cupboard.setExplode(progress),
    updateMaterials: (mMat, sMat) => cupboard.updateMaterials(mMat, sMat),
    dispose: () => cupboard.dispose(),
  };
}

// ---------------------------------------------------------------------------
// 05 — TEA TABLE (NEW)
// ---------------------------------------------------------------------------
export function createTeaTableLabModel(mainMat, secondaryMat, colorHex) {
  const teaTable = new TeaTableModel({ id: 'beige_stone' }, colorHex);
  teaTable.root.scale.set(1.15, 1.15, 1.15);
  teaTable.root.position.set(0, 0.05, 0);

  return {
    root: teaTable.root,
    type: 'tea_table',
    rawModel: teaTable,
    setExplode: (progress) => teaTable.setExplode(progress),
    updateMaterials: (mMat, sMat) => teaTable.updateMaterials(mMat, sMat),
    dispose: () => teaTable.dispose(),
  };
}

// ---------------------------------------------------------------------------
// 06 — SIGNATURE DINING TABLE (NEW)
// ---------------------------------------------------------------------------
export function createSignatureDiningTableLabModel(mainMat, secondaryMat, colorHex) {
  const diningTable = new SignatureDiningTableModel({ id: 'beige_stone' }, colorHex);
  diningTable.root.scale.set(0.96, 0.96, 0.96);
  diningTable.root.position.set(0, 0, 0);

  return {
    root: diningTable.root,
    type: 'dining_table',
    rawModel: diningTable,
    setExplode: (progress) => diningTable.setExplode(progress),
    updateMaterials: (mMat, sMat) => diningTable.updateMaterials(mMat, sMat),
    dispose: () => diningTable.dispose(),
  };
}

// ---------------------------------------------------------------------------
// 07 — DINING CHAIR (NEW)
// ---------------------------------------------------------------------------
export function createDiningChairLabModel(mainMat, secondaryMat, colorHex) {
  const chair = new DiningChairModel({ id: 'fabric' }, colorHex);
  chair.root.scale.set(1.35, 1.35, 1.35);
  chair.root.position.set(0, 0.02, 0);

  return {
    root: chair.root,
    type: 'dining_chair',
    rawModel: chair,
    setExplode: (progress) => chair.setExplode(progress),
    updateMaterials: (mMat, sMat) => chair.updateMaterials(mMat, sMat),
    dispose: () => chair.dispose(),
  };
}

// ---------------------------------------------------------------------------
// 08 — STORAGE BED (NEW)
// ---------------------------------------------------------------------------
export function createStorageBedLabModel(mainMat, secondaryMat, colorHex) {
  const bed = new StorageBedModel({ id: 'fabric' }, colorHex);
  bed.root.scale.set(0.92, 0.92, 0.92);
  bed.root.position.set(0, 0, 0);

  return {
    root: bed.root,
    type: 'storage_bed',
    rawModel: bed,
    setDrawerOpen: (progress) => bed.setStorageOpen(progress),
    setStorageOpen: (progress) => bed.setStorageOpen(progress),
    setExplode: (progress) => bed.setExplode(progress),
    updateMaterials: (mMat, sMat) => bed.updateMaterials(mMat, sMat),
    dispose: () => bed.dispose(),
  };
}

// ---------------------------------------------------------------------------
// 09 — ARCHITECT WRITING DESK (NEW)
// ---------------------------------------------------------------------------
export function createArchitectWritingDeskLabModel(mainMat, secondaryMat, colorHex) {
  const desk = new ArchitectWritingDeskModel({ id: 'natural_wood' }, colorHex);
  desk.root.scale.set(1.05, 1.05, 1.05);
  desk.root.position.set(0, 0.02, 0);

  return {
    root: desk.root,
    type: 'writing_desk',
    rawModel: desk,
    setDrawerOpen: (progress) => desk.setDrawerOpen(progress),
    setExplode: (progress) => desk.setExplode(progress),
    updateMaterials: (mMat, sMat) => desk.updateMaterials(mMat, sMat),
    dispose: () => desk.dispose(),
  };
}

// ---------------------------------------------------------------------------
// 10 — NIGHT CONSOLE (NEW)
// ---------------------------------------------------------------------------
export function createNightConsoleLabModel(mainMat, secondaryMat, colorHex) {
  const consoleItem = new NightConsoleModel({ id: 'walnut_wood' }, colorHex);
  consoleItem.root.scale.set(1.3, 1.3, 1.3);
  consoleItem.root.position.set(0, 0.05, 0);

  return {
    root: consoleItem.root,
    type: 'night_console',
    rawModel: consoleItem,
    setDrawerOpen: (progress) => consoleItem.setDrawerOpen(progress),
    setExplode: (progress) => consoleItem.setExplode(progress),
    updateMaterials: (mMat, sMat) => consoleItem.updateMaterials(mMat, sMat),
    dispose: () => consoleItem.dispose(),
  };
}

// Factory Registry for all 10 Objects
export const LAB_MODEL_FACTORIES = {
  chair: createChairLabModel,
  cabinet: createCabinetLabModel,
  wardrobe: createGrandWardrobeLabModel,
  cupboard: createModularCupboardLabModel,
  tea_table: createTeaTableLabModel,
  dining_table: createSignatureDiningTableLabModel,
  dining_chair: createDiningChairLabModel,
  storage_bed: createStorageBedLabModel,
  writing_desk: createArchitectWritingDeskLabModel,
  night_console: createNightConsoleLabModel,
};
