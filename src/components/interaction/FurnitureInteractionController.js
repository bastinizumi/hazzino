import * as THREE from 'three';
import { ProductCameraController } from './ProductCameraController';
import { DoorController } from './DoorController';
import { DrawerController } from './DrawerController';
import { ExplodeController, AssemblyController } from './ExplodeController';
import { RotationController } from './RotationController';
import { MaterialController } from './MaterialController';

/**
 * FurnitureInteractionController
 *
 * Master orchestrator connecting:
 * - ProductCameraController (adaptive non-extreme framing)
 * - DoorController (hinge pivot rotation)
 * - DrawerController (local axis sliding)
 * - ExplodeController & AssemblyController (controlled component separation)
 * - RotationController (360° turntable)
 * - MaterialController (PBR transitions)
 * - Component Raycasting & Golden Glow Selection
 */
export class FurnitureInteractionController {
  constructor(camera, options = {}) {
    this.camera = camera;
    this.furnitureMap = {};
    this.activeFurnitureId = null;
    this.activeFurniture = null;
    this.activeComponent = null;
    this.hoveredComponent = null;

    // Sub-controllers
    this.cameraController = new ProductCameraController(camera, options.cameraOptions);
    this.doorController = new DoorController();
    this.drawerController = new DrawerController();
    this.explodeController = new ExplodeController();
    this.assemblyController = new AssemblyController(this.explodeController);
    this.rotationController = new RotationController();
    this.materialController = new MaterialController();

    // Raycaster for individual component hover/click
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredMesh = null;
    this.originalMeshEmissive = new Map();

    // Callbacks for UI sync
    this.onStateChange = options.onStateChange || null;
  }

  setFurnitureMap(map) {
    this.furnitureMap = map;
  }

  notifyState() {
    if (this.onStateChange) {
      this.onStateChange({
        activeFurnitureId: this.activeFurnitureId,
        activeFurniture: this.activeFurniture,
        activeComponent: this.activeComponent,
        hoveredComponent: this.hoveredComponent,
        isDoorOpen: this.doorController.isOpen,
        isDrawerOpen: this.drawerController.isOpen,
        isExploded: this.explodeController.isExploded,
        selectedMaterial: this.materialController.currentMaterialKey,
        supportedControls: this.getSupportedControls(),
      });
    }
  }

  getSupportedControls() {
    if (!this.activeFurniture) {
      return {
        hasDoors: false,
        hasDrawers: false,
        canExplode: false,
        canRotate: false,
        canMaterial: false,
      };
    }

    const feats = this.activeFurniture.features || {};
    return {
      hasDoors: feats.hasDoors === true,
      hasDrawers: feats.hasDrawers === true,
      canExplode: feats.canExplode !== false,
      canRotate: feats.canRotate !== false,
      canMaterial: Boolean(this.activeFurniture.materialsSupported?.length),
    };
  }

  selectFurniture(furnitureId, onComplete = null) {
    const item = this.furnitureMap[furnitureId];
    if (!item) return;

    // Reset previous object transforms
    if (this.activeFurniture && this.activeFurniture !== item) {
      this.rotationController.reset(this.activeFurniture.group);
      this.doorController.reset(this.activeFurniture);
      this.drawerController.reset(this.activeFurniture);
      this.explodeController.reset(this.activeFurniture);
    }

    this.activeFurnitureId = furnitureId;
    this.activeFurniture = item;
    this.activeComponent = null;
    this.hoveredComponent = null;

    // Set material
    if (item.defaultMaterial) {
      this.materialController.currentMaterialKey = item.defaultMaterial;
    }

    // Adaptive camera focus with STRICT NO-EXTREME-ZOOM guarantees
    this.cameraController.focusOnObject(
      item.group,
      item.features || {},
      0.95,
      onComplete
    );

    this.notifyState();
  }

  returnToRoomView(onComplete = null) {
    if (this.activeFurniture) {
      this.rotationController.reset(this.activeFurniture.group);
    }

    this.cameraController.returnToRoom(1.0, onComplete);
    this.activeComponent = null;
    this.hoveredComponent = null;
    this.notifyState();
  }

  toggleDoors() {
    if (!this.activeFurniture) return;
    this.doorController.toggle(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  openDoors() {
    if (!this.activeFurniture) return;
    this.doorController.open(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  closeDoors() {
    if (!this.activeFurniture) return;
    this.doorController.close(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  toggleDrawers() {
    if (!this.activeFurniture) return;
    this.drawerController.toggle(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  openDrawers() {
    if (!this.activeFurniture) return;
    this.drawerController.open(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  closeDrawers() {
    if (!this.activeFurniture) return;
    this.drawerController.close(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  toggleExplode() {
    if (!this.activeFurniture) return;
    this.explodeController.toggle(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  explode() {
    if (!this.activeFurniture) return;
    this.explodeController.explode(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  assemble() {
    if (!this.activeFurniture) return;
    this.assemblyController.assemble(this.activeFurniture).then(() => {
      this.notifyState();
    });
  }

  setMaterial(matKey) {
    if (!this.activeFurniture) return;
    this.materialController.applyMaterial(this.activeFurniture, matKey);
    this.notifyState();
  }

  resetAll() {
    if (this.activeFurniture) {
      this.doorController.reset(this.activeFurniture);
      this.drawerController.reset(this.activeFurniture);
      this.explodeController.reset(this.activeFurniture);
      this.rotationController.reset(this.activeFurniture.group);
      this.materialController.reset(this.activeFurniture);
      if (typeof this.activeFurniture.reset === 'function') {
        this.activeFurniture.reset();
      }
    }
    this.returnToRoomView();
  }

  /**
   * Raycast for individual component hover & selection
   */
  handlePointerMove(screenX, screenY, containerWidth, containerHeight) {
    if (!this.activeFurniture?.group) {
      this.clearHover();
      return null;
    }

    this.mouse.x = (screenX / containerWidth) * 2 - 1;
    this.mouse.y = -(screenY / containerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.activeFurniture.group.children,
      true
    );

    let foundComponent = null;

    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;
      while (obj && obj !== this.activeFurniture.group) {
        if (obj.userData?.componentName || obj.userData?.componentId) {
          foundComponent = {
            id: obj.userData.componentId || obj.name,
            name: obj.userData.componentName || obj.name,
            mesh: intersects[i].object,
            point: intersects[i].point,
          };
          break;
        }
        obj = obj.parent;
      }
      if (foundComponent) break;
    }

    if (foundComponent) {
      this.applyHoverHighlight(foundComponent.mesh);
      this.hoveredComponent = foundComponent;
    } else {
      this.clearHover();
    }

    return this.hoveredComponent;
  }

  applyHoverHighlight(mesh) {
    if (this.hoveredMesh === mesh) return;
    this.clearHover();

    if (mesh?.material && !Array.isArray(mesh.material)) {
      this.hoveredMesh = mesh;
      if (!this.originalMeshEmissive.has(mesh)) {
        this.originalMeshEmissive.set(mesh, {
          color: mesh.material.emissive ? mesh.material.emissive.clone() : new THREE.Color(0x000000),
          intensity: mesh.material.emissiveIntensity ?? 0,
        });
      }
      if (mesh.material.emissive) {
        mesh.material.emissive.setHex(0xc5a059);
        mesh.material.emissiveIntensity = 0.28;
      }
    }
  }

  clearHover() {
    if (this.hoveredMesh) {
      const orig = this.originalMeshEmissive.get(this.hoveredMesh);
      if (orig && this.hoveredMesh.material?.emissive) {
        this.hoveredMesh.material.emissive.copy(orig.color);
        this.hoveredMesh.material.emissiveIntensity = orig.intensity;
      }
      this.hoveredMesh = null;
    }
    this.hoveredComponent = null;
  }

  selectComponent(component) {
    this.activeComponent = component;
    this.notifyState();
  }

  update() {
    this.cameraController.update();
    if (this.activeFurniture?.group) {
      this.rotationController.update(this.activeFurniture.group);
    }
  }
}
