/**
 * HAZZINO INTERIORS — PROCEDURAL 3D KITCHEN MODEL
 * Full modular kitchen: upper cabinets, lower cabinets, island, countertop,
 * oven, sink, faucet, handles — each as separate interactive mesh groups.
 * Supports: hinge-pivot doors, sliding drawers, explode/assemble, material swap.
 */
import * as THREE from 'three';

// ─── Material Factories ───────────────────────────────────────────────────────
export function createKitchenMaterial(color = 0x2d4a35, roughness = 0.55, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness });
}
export function createCountertopMaterial(color = 0xf0ece4, roughness = 0.22, metalness = 0.06) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness });
}
export function createHardwareMaterial(color = 0xc9a84c, roughness = 0.28, metalness = 0.82) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness });
}
export function createInteriorMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.85, metalness: 0.0 });
}
export function createStoneMaterial(color = 0xe8e0d5) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.38, metalness: 0.04 });
}
export function createSteelMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.22, metalness: 0.88 });
}

// ─── Kitchen Color Presets ────────────────────────────────────────────────────
export const KITCHEN_CABINET_COLORS = [
  { id: 'warm_white',     name: 'Warm White',      hex: '#F8F5F0', color: 0xF8F5F0 },
  { id: 'sand_beige',     name: 'Sand Beige',       hex: '#D4B896', color: 0xD4B896 },
  { id: 'natural_oak',    name: 'Natural Oak',       hex: '#C8956C', color: 0xC8956C },
  { id: 'honey_walnut',   name: 'Honey Walnut',      hex: '#9B6B47', color: 0x9B6B47 },
  { id: 'dark_walnut',    name: 'Dark Walnut',       hex: '#4A3020', color: 0x4A3020 },
  { id: 'forest_green',   name: 'Forest Green',      hex: '#2D4A35', color: 0x2D4A35 },
  { id: 'charcoal_grey',  name: 'Charcoal Grey',     hex: '#3A3A3A', color: 0x3A3A3A },
];
export const KITCHEN_COUNTERTOP_COLORS = [
  { id: 'ivory_marble',   name: 'Ivory Marble',      hex: '#F2EDE6', color: 0xF2EDE6 },
  { id: 'white_quartz',   name: 'White Quartz',      hex: '#F9F7F4', color: 0xF9F7F4 },
  { id: 'beige_travertine', name: 'Beige Travertine', hex: '#D8CAB8', color: 0xD8CAB8 },
  { id: 'grey_granite',   name: 'Grey Granite',       hex: '#888888', color: 0x888888 },
];
export const KITCHEN_HARDWARE_COLORS = [
  { id: 'brushed_gold',   name: 'Brushed Gold',      hex: '#C9A84C', color: 0xC9A84C },
  { id: 'matte_black',    name: 'Matte Black',        hex: '#1A1A1A', color: 0x1A1A1A },
  { id: 'stainless',      name: 'Stainless Steel',    hex: '#B8B8B8', color: 0xB8B8B8 },
];

// ─── KitchenModel Class ───────────────────────────────────────────────────────
export class KitchenModel {
  constructor(options = {}) {
    this.root = new THREE.Group();
    this.root.name = 'KitchenModel';

    // Materials
    const cabinetColor = options.cabinetColor ?? 0x2d4a35;
    const counterColor = options.counterColor ?? 0xf2ede6;
    const hardwareColor = options.hardwareColor ?? 0xc9a84c;

    this.cabinetMat   = createKitchenMaterial(cabinetColor);
    this.counterMat   = createCountertopMaterial(counterColor);
    this.hardwareMat  = createHardwareMaterial(hardwareColor);
    this.interiorMat  = createInteriorMaterial();
    this.stoneMat     = createStoneMaterial(counterColor);
    this.steelMat     = createSteelMaterial();

    // Animation handles
    this.hingePivots   = [];   // { pivot, maxAngle, isOpen }
    this.drawerSliders = [];   // { slider, maxSlide, isOpen }
    this.explodeParts  = [];   // { group, origPos, dir }
    this.ledLights     = [];   // THREE.PointLight under-cabinet

    this._doorOpenProgress   = 0;
    this._drawerOpenProgress = 0;
    this._explodeProgress    = 0;

    this._buildKitchen();
  }

  // ── Geometry helpers ────────────────────────────────────────────────────────
  _box(w, h, d, mat) {
    const g = new THREE.BoxGeometry(w, h, d);
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }
  _cyl(rTop, rBot, h, segs, mat) {
    const g = new THREE.CylinderGeometry(rTop, rBot, h, segs);
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    return m;
  }

  _registerExplodePart(group, dir) {
    this.explodeParts.push({
      group,
      origPos: group.position.clone(),
      dir: new THREE.Vector3(...dir),
    });
  }

  // ── Handle strip helper ─────────────────────────────────────────────────────
  _addHandle(parent, posX, posY, posZ, horizontal = true) {
    const hg = new THREE.BoxGeometry(horizontal ? 0.14 : 0.012, horizontal ? 0.012 : 0.14, 0.022);
    const hm = new THREE.Mesh(hg, this.hardwareMat);
    hm.position.set(posX, posY, posZ);
    hm.castShadow = true;
    parent.add(hm);
    return hm;
  }

  // ── Upper cabinet row ───────────────────────────────────────────────────────
  _buildUpperCabinets() {
    const wallY   = 1.65;  // bottom of upper cabinets
    const cabH    = 0.72;
    const cabD    = 0.38;
    const thick   = 0.018;
    const unitW   = 0.60;
    const units   = 5;
    const totalW  = unitW * units;
    const startX  = -totalW / 2 + unitW / 2;

    const upperGroup = new THREE.Group();
    upperGroup.name = 'upper_cabinets';

    for (let i = 0; i < units; i++) {
      const cx = startX + i * unitW;
      const unit = new THREE.Group();
      unit.position.set(cx, wallY + cabH / 2, -0.72);

      // Carcass
      const body = this._box(unitW - 0.004, cabH, cabD, this.cabinetMat);
      unit.add(body);

      // Door (hinge on left edge)
      const doorW = unitW - 0.012;
      const doorH = cabH - 0.024;
      const doorMesh = this._box(doorW, doorH, thick * 2, this.cabinetMat);
      doorMesh.position.set(doorW / 2, 0, 0); // offset so pivot is at left edge

      const hingePivot = new THREE.Group();
      hingePivot.position.set(-doorW / 2, 0, cabD / 2 + thick);
      hingePivot.add(doorMesh);
      unit.add(hingePivot);

      this._addHandle(doorMesh, doorW * 0.5 - 0.1, -doorH * 0.45, 0.012);

      this.hingePivots.push({ pivot: hingePivot, maxAngle: -Math.PI * 0.54, axis: 'y' });

      // Under-cabinet LED strip
      const led = new THREE.PointLight(0xffebb4, 0.6, 1.0);
      led.position.set(0, -cabH / 2 - 0.04, cabD / 2 - 0.05);
      unit.add(led);
      this.ledLights.push(led);

      upperGroup.add(unit);
      this._registerExplodePart(unit, [0, (i % 2 === 0 ? 1 : 0.6), -0.4]);
    }

    this.root.add(upperGroup);
    return upperGroup;
  }

  // ── Lower cabinet row ───────────────────────────────────────────────────────
  _buildLowerCabinets() {
    const baseY   = 0.0;
    const cabH    = 0.82;
    const cabD    = 0.60;
    const thick   = 0.018;
    const unitW   = 0.60;
    const units   = 5;
    const totalW  = unitW * units;
    const startX  = -totalW / 2 + unitW / 2;

    const lowerGroup = new THREE.Group();
    lowerGroup.name = 'lower_cabinets';

    for (let i = 0; i < units; i++) {
      const cx = startX + i * unitW;
      const unit = new THREE.Group();
      unit.position.set(cx, baseY + cabH / 2, -0.54);

      // Carcass body
      const body = this._box(unitW - 0.004, cabH, cabD, this.cabinetMat);
      body.position.y = 0;
      unit.add(body);

      if (i % 2 === 0) {
        // Double drawers
        for (let d = 0; d < 2; d++) {
          const dH    = (cabH - 0.12) / 2 - 0.01;
          const dY    = cabH / 2 - 0.06 - dH / 2 - d * (dH + 0.01);
          const slider = this._buildDrawer(unitW - 0.012, dH, cabD - 0.04, this.cabinetMat);
          slider.position.set(0, dY, 0);
          unit.add(slider);
          this._addHandle(slider, 0, dH / 2 - 0.015, cabD / 2 + 0.024);
          this.drawerSliders.push({ slider, maxSlide: 0.42 });
        }
      } else {
        // Door
        const doorW  = unitW - 0.012;
        const doorH  = cabH - 0.024;
        const dMesh  = this._box(doorW, doorH, thick * 2, this.cabinetMat);
        dMesh.position.set(doorW / 2, 0, 0);
        const hingePivot = new THREE.Group();
        hingePivot.position.set(-doorW / 2, 0, cabD / 2 + thick);
        hingePivot.add(dMesh);
        unit.add(hingePivot);
        this._addHandle(dMesh, doorW * 0.5 - 0.08, -doorH * 0.44, 0.012);
        this.hingePivots.push({ pivot: hingePivot, maxAngle: -Math.PI * 0.54, axis: 'y' });
      }

      // Plinth
      const plinth = this._box(unitW - 0.02, 0.08, cabD - 0.1, this.cabinetMat);
      plinth.position.y = -cabH / 2 + 0.04;
      unit.add(plinth);

      lowerGroup.add(unit);
      this._registerExplodePart(unit, [0, -0.55, 0.5]);
    }

    this.root.add(lowerGroup);
    return lowerGroup;
  }

  // ── Drawer interior box ─────────────────────────────────────────────────────
  _buildDrawer(w, h, d, mat) {
    const g = new THREE.Group();

    // front face
    const front = this._box(w, h, 0.022, mat);
    front.position.z = d / 2 + 0.01;
    g.add(front);

    // interior box
    const bot  = this._box(w - 0.04, 0.014, d - 0.04, this.interiorMat);
    bot.position.set(0, -h / 2 + 0.018, 0);
    g.add(bot);

    const sideGeom = new THREE.BoxGeometry(0.014, h - 0.04, d - 0.04);
    [-1, 1].forEach(side => {
      const sm = new THREE.Mesh(sideGeom, this.interiorMat);
      sm.position.set(side * (w / 2 - 0.02), 0, 0);
      sm.castShadow = true;
      g.add(sm);
    });

    const back = this._box(w - 0.04, h - 0.04, 0.014, this.interiorMat);
    back.position.z = -d / 2 + 0.02;
    g.add(back);

    return g;
  }

  // ── Countertop ──────────────────────────────────────────────────────────────
  _buildCountertop() {
    const totalW = 3.0;
    const ctGroup = new THREE.Group();
    ctGroup.name = 'countertop';

    // Main countertop slab
    const slab = this._box(totalW, 0.042, 0.66, this.counterMat);
    slab.position.set(0, 0.842, -0.54);
    ctGroup.add(slab);

    // Backsplash
    const splash = this._box(totalW, 0.55, 0.016, this.stoneMat);
    splash.position.set(0, 1.12, -0.86);
    ctGroup.add(splash);

    this.root.add(ctGroup);
    this._registerExplodePart(ctGroup, [0, 0.5, 0]);
    return ctGroup;
  }

  // ── Kitchen Island ──────────────────────────────────────────────────────────
  _buildIsland() {
    const islandGroup = new THREE.Group();
    islandGroup.name = 'island';
    islandGroup.position.set(0.6, 0, 0.5);

    const iW = 1.4, iH = 0.90, iD = 0.72;

    // Body
    const body = this._box(iW, iH, iD, this.cabinetMat);
    body.position.y = iH / 2;
    islandGroup.add(body);

    // Countertop
    const top = this._box(iW + 0.06, 0.042, iD + 0.06, this.counterMat);
    top.position.y = iH + 0.022;
    islandGroup.add(top);
    this._registerExplodePart(top, [0.8, 0.6, 0]);

    // 3 island drawers
    const dW = iW - 0.024;
    const dH = (iH - 0.12) / 3 - 0.01;
    for (let d = 0; d < 3; d++) {
      const dY  = iH - 0.06 - dH / 2 - d * (dH + 0.01);
      const dSlide = this._buildDrawer(dW, dH, iD - 0.04, this.cabinetMat);
      dSlide.position.set(0, dY, 0);
      islandGroup.add(dSlide);
      this._addHandle(dSlide, 0, dH / 2 - 0.015, iD / 2 + 0.024);
      this.drawerSliders.push({ slider: dSlide, maxSlide: 0.38 });
    }

    this.root.add(islandGroup);
    this._registerExplodePart(islandGroup, [1.0, 0, 0.7]);
    return islandGroup;
  }

  // ── Sink & Faucet ────────────────────────────────────────────────────────────
  _buildSink() {
    const sinkGroup = new THREE.Group();
    sinkGroup.name = 'sink';
    sinkGroup.position.set(-0.7, 0.84, -0.56);

    // Sink basin (open box)
    const basin = this._box(0.56, 0.18, 0.44, this.steelMat);
    basin.position.y = -0.09;
    sinkGroup.add(basin);

    // Faucet neck
    const neck = this._cyl(0.018, 0.018, 0.22, 16, this.steelMat);
    neck.rotation.z = Math.PI * 0.06;
    neck.position.set(0, 0.11, -0.08);
    sinkGroup.add(neck);

    // Spout
    const spout = this._cyl(0.012, 0.012, 0.18, 16, this.steelMat);
    spout.rotation.x = Math.PI / 2;
    spout.position.set(0, 0.22, 0.02);
    sinkGroup.add(spout);

    // Handle
    const handle = this._cyl(0.008, 0.008, 0.10, 12, this.steelMat);
    handle.position.set(0.06, 0.24, -0.08);
    sinkGroup.add(handle);

    this.root.add(sinkGroup);
    this._registerExplodePart(sinkGroup, [-0.8, 0.4, 0.2]);
    return sinkGroup;
  }

  // ── Built-in Oven ───────────────────────────────────────────────────────────
  _buildOven() {
    const ovenGroup = new THREE.Group();
    ovenGroup.name = 'oven';
    ovenGroup.position.set(1.1, 0.42, -0.54);

    // Body
    const body = this._box(0.58, 0.54, 0.56, this.cabinetMat);
    ovenGroup.add(body);

    // Glass door panel
    const glass = this._box(0.52, 0.38, 0.014, new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.08, metalness: 0.5 }));
    glass.position.set(0, -0.04, 0.29);
    ovenGroup.add(glass);

    // Handle
    const oHandle = this._box(0.38, 0.018, 0.028, this.hardwareMat);
    oHandle.position.set(0, 0.16, 0.30);
    ovenGroup.add(oHandle);

    // Oven door hinge pivot
    const doorMesh = this._box(0.52, 0.38, 0.018, this.cabinetMat);
    doorMesh.position.set(0, 0.19, 0);
    const ovenDoor = new THREE.Group();
    ovenDoor.position.set(0, -0.19, 0.29);
    ovenDoor.add(doorMesh);
    ovenGroup.add(ovenDoor);

    this.root.add(ovenGroup);
    this._registerExplodePart(ovenGroup, [1.0, -0.2, 0.4]);
    return ovenGroup;
  }

  // ── Microwave ───────────────────────────────────────────────────────────────
  _buildMicrowave() {
    const mwGroup = new THREE.Group();
    mwGroup.name = 'microwave';
    mwGroup.position.set(1.15, 1.48, -0.72);

    const body = this._box(0.54, 0.30, 0.40, this.cabinetMat);
    mwGroup.add(body);

    const panel = this._box(0.46, 0.24, 0.014, new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.15, metalness: 0.3 }));
    panel.position.set(0, 0, 0.22);
    mwGroup.add(panel);

    this.root.add(mwGroup);
    this._registerExplodePart(mwGroup, [1.0, 0.4, -0.6]);
    return mwGroup;
  }

  // ── Decorative items on counter ─────────────────────────────────────────────
  _buildDecoratives() {
    const decGroup = new THREE.Group();
    decGroup.name = 'decoratives';

    // Pendant lights (3x)
    for (let i = 0; i < 3; i++) {
      const cord = this._cyl(0.004, 0.004, 0.55, 8, this.hardwareMat);
      cord.position.set(0.3 + i * 0.25, 2.1, 0.45);
      const shade = this._cyl(0.10, 0.06, 0.16, 32, this.hardwareMat);
      shade.position.set(0.3 + i * 0.25, 1.81, 0.45);
      decGroup.add(cord);
      decGroup.add(shade);
      const bulb = new THREE.PointLight(0xffdf90, 0.7, 1.8);
      bulb.position.set(0.3 + i * 0.25, 1.76, 0.45);
      decGroup.add(bulb);
    }

    this.root.add(decGroup);
    return decGroup;
  }

  // ── Assemble all modules ────────────────────────────────────────────────────
  _buildKitchen() {
    this._buildUpperCabinets();
    this._buildLowerCabinets();
    this._buildCountertop();
    this._buildIsland();
    this._buildSink();
    this._buildOven();
    this._buildMicrowave();
    this._buildDecoratives();

    // Position whole kitchen so floor is at y=0
    this.root.position.y = 0;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /** progress 0→1 : open all doors */
  setDoorOpen(progress) {
    this._doorOpenProgress = progress;
    this.hingePivots.forEach(({ pivot, maxAngle }, i) => {
      const delay = (i * 0.06);
      const p = Math.max(0, Math.min(1, (progress - delay) / (1 - delay * 0.5)));
      pivot.rotation.y = maxAngle * p;
    });
  }

  /** progress 0→1 : slide all drawers out */
  setDrawerOpen(progress) {
    this._drawerOpenProgress = progress;
    this.drawerSliders.forEach(({ slider, maxSlide }, i) => {
      const delay = i * 0.04;
      const p = Math.max(0, Math.min(1, (progress - delay) / (1 - delay * 0.5)));
      slider.position.z = maxSlide * p;
    });
  }

  /** progress 0→1 : explode all parts */
  setExplode(progress) {
    this._explodeProgress = progress;
    this.explodeParts.forEach(({ group, origPos, dir }) => {
      const target = origPos.clone().add(dir.clone().multiplyScalar(progress * 0.75));
      group.position.copy(target);
    });
  }

  /** Toggle under-cabinet LEDs */
  setLEDs(on) {
    this.ledLights.forEach(l => {
      l.intensity = on ? 0.65 : 0.0;
    });
  }

  /** Update cabinet face color */
  updateCabinetColor(hexColor) {
    const c = new THREE.Color(hexColor);
    this.cabinetMat.color.set(c);
  }

  /** Update countertop color */
  updateCountertopColor(hexColor) {
    const c = new THREE.Color(hexColor);
    this.counterMat.color.set(c);
    this.stoneMat.color.set(c);
  }

  /** Update hardware finish color */
  updateHardwareColor(hexColor) {
    const c = new THREE.Color(hexColor);
    this.hardwareMat.color.set(c);
  }

  dispose() {
    this.root.traverse(child => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material?.dispose();
        }
      }
    });
  }
}
