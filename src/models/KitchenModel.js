/**
 * HAZZINO INTERIORS — ARCHITECTURAL 3D KITCHEN ATELIER MODEL
 * Precision modular kitchen system matching the architectural reference:
 * - Upper Cabinets: 3 distinct architectural double-door modules with 6 independent hinge doors (paired outward swing) + right open display niche.
 * - Lower Counter:
 *     * Module A (Far Left): Tall hinged cabinet door (swings left).
 *     * Module B (Mid Left): 3-tier wide sliding drawers with brass lip handles.
 *     * Module C (Center): Door next to drawers with smart anti-collision clearance (stays closed during drawer extension so no components touch).
 *     * Module D (Far Right): Tall hinged cabinet door (swings right).
 * - Kitchen Island:
 *     * Front: 3 full-width tiered sliding storage drawers.
 *     * Side: Hinged side cabinet door.
 * - Solid quartz countertop with flush backsplash and matte black gooseneck faucet.
 */
import * as THREE from 'three';

// ─── Material Factories ───────────────────────────────────────────────────────
export function createKitchenMaterial(color = 0xede5d8, roughness = 0.52, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness });
}
export function createCountertopMaterial(color = 0xf8f6f0, roughness = 0.22, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness });
}
export function createHardwareMaterial(color = 0xc9a84c, roughness = 0.28, metalness = 0.82) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness });
}
export function createInteriorMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.85, metalness: 0.0 });
}
export function createStoneMaterial(color = 0xf5f3ee) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.35, metalness: 0.04 });
}
export function createSteelMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.32, metalness: 0.75 });
}

// ─── Kitchen Color Presets ────────────────────────────────────────────────────
export const KITCHEN_CABINET_COLORS = [
  { id: 'champagne_cream', name: 'Champagne Cream', hex: '#EDE5D8', color: 0xEDE5D8 },
  { id: 'sand_beige',      name: 'Sand Beige',       hex: '#D4B896', color: 0xD4B896 },
  { id: 'warm_white',      name: 'Warm White',       hex: '#F8F5F0', color: 0xF8F5F0 },
  { id: 'natural_oak',     name: 'Natural Oak',      hex: '#C8956C', color: 0xC8956C },
  { id: 'honey_walnut',    name: 'Honey Walnut',     hex: '#9B6B47', color: 0x9B6B47 },
  { id: 'dark_walnut',     name: 'Dark Walnut',      hex: '#4A3020', color: 0x4A3020 },
  { id: 'forest_green',    name: 'Forest Green',     hex: '#2D4A35', color: 0x2D4A35 },
  { id: 'charcoal_grey',   name: 'Charcoal Grey',    hex: '#3A3A3A', color: 0x3A3A3A },
];
export const KITCHEN_COUNTERTOP_COLORS = [
  { id: 'white_quartz',    name: 'White Quartz',     hex: '#F9F7F4', color: 0xF9F7F4 },
  { id: 'ivory_marble',    name: 'Ivory Marble',     hex: '#F2EDE6', color: 0xF2EDE6 },
  { id: 'beige_travertine',name: 'Beige Travertine', hex: '#D8CAB8', color: 0xD8CAB8 },
  { id: 'grey_granite',    name: 'Grey Granite',     hex: '#888888', color: 0x888888 },
];
export const KITCHEN_HARDWARE_COLORS = [
  { id: 'brushed_gold',    name: 'Brushed Gold',     hex: '#C9A84C', color: 0xC9A84C },
  { id: 'matte_black',     name: 'Matte Black',      hex: '#1A1A1A', color: 0x1A1A1A },
  { id: 'stainless',       name: 'Stainless Steel',  hex: '#B8B8B8', color: 0xB8B8B8 },
];

export class KitchenModel {
  constructor(options = {}) {
    this.root = new THREE.Group();
    this.root.name = 'KitchenModel';

    const cabinetColor = options.cabinetColor ?? 0xede5d8;
    const counterColor = options.counterColor ?? 0xf9f7f4;
    const hardwareColor = options.hardwareColor ?? 0xc9a84c;

    this.cabinetMat  = createKitchenMaterial(cabinetColor);
    this.counterMat  = createCountertopMaterial(counterColor);
    this.hardwareMat = createHardwareMaterial(hardwareColor);
    this.interiorMat = createInteriorMaterial();
    this.stoneMat    = createStoneMaterial(counterColor);
    this.steelMat    = createSteelMaterial();

    this.hingePivots   = [];   // { pivot, maxAngle, skipOnDrawerCollision }
    this.drawerSliders = [];   // { slider, maxSlide }
    this.explodeParts  = [];   // { group, origPos, dir }
    this.ledLights     = [];

    this._doorOpenProgress   = 0;
    this._drawerOpenProgress = 0;
    this._explodeProgress    = 0;

    this._buildKitchen();
  }

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

  _addHandle(parent, posX, posY, posZ, horizontal = true, width = 0.16) {
    const hg = new THREE.BoxGeometry(horizontal ? width : 0.012, horizontal ? 0.012 : width, 0.022);
    const hm = new THREE.Mesh(hg, this.hardwareMat);
    hm.position.set(posX, posY, posZ);
    hm.castShadow = true;
    parent.add(hm);
    return hm;
  }

  _buildDrawer(w, h, d, mat) {
    const g = new THREE.Group();

    // Front face
    const front = this._box(w, h, 0.022, mat);
    front.position.z = d / 2 + 0.01;
    g.add(front);

    // Interior bottom
    const bot = this._box(w - 0.04, 0.014, d - 0.04, this.interiorMat);
    bot.position.set(0, -h / 2 + 0.018, 0);
    g.add(bot);

    // Left and right side walls
    const sideGeom = new THREE.BoxGeometry(0.014, h - 0.04, d - 0.04);
    [-1, 1].forEach((side) => {
      const sm = new THREE.Mesh(sideGeom, this.interiorMat);
      sm.position.set(side * (w / 2 - 0.02), 0, 0);
      sm.castShadow = true;
      g.add(sm);
    });

    // Back wall
    const back = this._box(w - 0.04, h - 0.04, 0.014, this.interiorMat);
    back.position.z = -d / 2 + 0.02;
    g.add(back);

    return g;
  }

  // ── 1. UPPER CABINETS (3 Modules, 6 Hinged Double Doors, Outward Paired Swing) ──
  _buildUpperCabinets() {
    const upperGroup = new THREE.Group();
    upperGroup.name = 'upper_cabinets';

    const wallY = 1.70;
    const totalW = 3.0;
    const modW = 0.98;
    const cabH = 0.78;
    const cabD = 0.38;
    const thick = 0.018;

    const modOffsets = [-1.0, 0.0, 1.0];

    modOffsets.forEach((cx, mi) => {
      const mod = new THREE.Group();
      mod.position.set(cx, wallY + cabH / 2, -0.72);

      const hasLowerNiche = mi === 2;
      const actualCabH = hasLowerNiche ? cabH - 0.22 : cabH;
      const cabCenterY = hasLowerNiche ? 0.11 : 0;

      // Carcass box
      const body = this._box(modW - 0.006, actualCabH, cabD, this.cabinetMat);
      body.position.y = cabCenterY;
      mod.add(body);

      // Shelves inside
      const shelfY = cabCenterY;
      const shelf = this._box(modW - 0.04, 0.016, cabD - 0.04, this.interiorMat);
      shelf.position.y = shelfY;
      mod.add(shelf);

      // Open lower display cubby on right module (matching reference image)
      if (hasLowerNiche) {
        const nicheH = 0.22;
        const niche = new THREE.Group();
        niche.position.set(0, -cabH / 2 + nicheH / 2, 0);

        const nBack = this._box(modW - 0.006, nicheH, 0.016, this.interiorMat);
        nBack.position.z = -cabD / 2 + 0.008;
        niche.add(nBack);

        const nBot = this._box(modW - 0.006, 0.016, cabD, this.cabinetMat);
        nBot.position.y = -nicheH / 2 + 0.008;
        niche.add(nBot);

        const nSideL = this._box(0.016, nicheH, cabD, this.cabinetMat);
        nSideL.position.x = -modW / 2 + 0.008;
        niche.add(nSideL);

        const nSideR = this._box(0.016, nicheH, cabD, this.cabinetMat);
        nSideR.position.x = modW / 2 - 0.008;
        niche.add(nSideR);

        mod.add(niche);
      }

      // 2 Doors per module (Double doors swinging outward)
      const doorW = (modW - 0.016) / 2;
      const doorH = actualCabH - 0.02;

      // Left Door (hinge on left edge of its half)
      const leftDoorMesh = this._box(doorW, doorH, thick * 2, this.cabinetMat);
      leftDoorMesh.position.set(doorW / 2, 0, 0);
      this._addHandle(leftDoorMesh, doorW - 0.04, -doorH * 0.42, 0.012, false, 0.12);

      const leftPivot = new THREE.Group();
      leftPivot.position.set(-modW / 2 + 0.008, cabCenterY, cabD / 2 + thick);
      leftPivot.add(leftDoorMesh);
      mod.add(leftPivot);
      this.hingePivots.push({ pivot: leftPivot, maxAngle: -Math.PI * 0.52, skipOnDrawerCollision: false });

      // Right Door (hinge on right edge of its half)
      const rightDoorMesh = this._box(doorW, doorH, thick * 2, this.cabinetMat);
      rightDoorMesh.position.set(-doorW / 2, 0, 0);
      this._addHandle(rightDoorMesh, -doorW + 0.04, -doorH * 0.42, 0.012, false, 0.12);

      const rightPivot = new THREE.Group();
      rightPivot.position.set(modW / 2 - 0.008, cabCenterY, cabD / 2 + thick);
      rightPivot.add(rightDoorMesh);
      mod.add(rightPivot);
      this.hingePivots.push({ pivot: rightPivot, maxAngle: Math.PI * 0.52, skipOnDrawerCollision: false });

      // Under-cabinet warm LED
      const led = new THREE.PointLight(0xffebb4, 0.7, 1.4);
      led.position.set(0, -cabH / 2 - 0.03, cabD / 2 - 0.04);
      mod.add(led);
      this.ledLights.push(led);

      upperGroup.add(mod);
      this._registerExplodePart(mod, [0, 0.75 + mi * 0.1, -0.4]);
    });

    this.root.add(upperGroup);
    return upperGroup;
  }

  // ── 2. LOWER CABINET ROW (Door | 3-Tier Drawers | Collision-Safe Door | Door) ──
  _buildLowerCabinets() {
    const lowerGroup = new THREE.Group();
    lowerGroup.name = 'lower_cabinets';

    const baseY = 0.0;
    const cabH = 0.82;
    const cabD = 0.60;
    const thick = 0.018;

    // 4 Distinct Modules along 3.0m counter:
    // Module 0: Far Left Single Door (Width: 0.65m, Hinge on Left)
    // Module 1: Mid-Left 3-Tier Wide Sliding Drawers (Width: 0.85m)
    // Module 2: Center Cabinet Door (Width: 0.65m) — Next to drawer, stays closed when drawers extend!
    // Module 3: Far Right Cabinet Door (Width: 0.85m, Hinge on Right)

    const modules = [
      { id: 'left_door', type: 'door', w: 0.65, cx: -1.175, hinge: 'left' },
      { id: 'mid_drawers', type: 'drawers', w: 0.85, cx: -0.425 },
      { id: 'center_door', type: 'door', w: 0.65, cx: 0.325, hinge: 'right' },
      { id: 'right_door', type: 'door', w: 0.85, cx: 1.075, hinge: 'right' },
    ];

    modules.forEach((modConf) => {
      const unit = new THREE.Group();
      unit.position.set(modConf.cx, baseY + cabH / 2, -0.54);

      // Carcass
      const body = this._box(modConf.w - 0.006, cabH, cabD, this.cabinetMat);
      unit.add(body);

      // Recessed Plinth
      const plinth = this._box(modConf.w - 0.02, 0.08, cabD - 0.08, this.cabinetMat);
      plinth.position.y = -cabH / 2 + 0.04;
      unit.add(plinth);

      if (modConf.type === 'drawers') {
        // 3 Tiered sliding drawers (top, middle, bottom)
        const dCount = 3;
        const dH = (cabH - 0.12) / dCount - 0.01;
        for (let d = 0; d < dCount; d++) {
          const dY = cabH / 2 - 0.06 - dH / 2 - d * (dH + 0.01);
          const slider = this._buildDrawer(modConf.w - 0.016, dH, cabD - 0.04, this.cabinetMat);
          slider.position.set(0, dY, 0);
          unit.add(slider);
          this._addHandle(slider, 0, dH / 2 - 0.016, cabD / 2 + 0.024, true, 0.22);
          this.drawerSliders.push({ slider, maxSlide: 0.44 });
        }
      } else {
        // Door
        const doorW = modConf.w - 0.014;
        const doorH = cabH - 0.024;
        const isHingeLeft = modConf.hinge === 'left';

        const doorMesh = this._box(doorW, doorH, thick * 2, this.cabinetMat);
        doorMesh.position.set(isHingeLeft ? doorW / 2 : -doorW / 2, 0, 0);

        const handleX = isHingeLeft ? doorW - 0.06 : -doorW + 0.06;
        this._addHandle(doorMesh, handleX, doorH * 0.42, 0.014, true, 0.14);

        const hingePivot = new THREE.Group();
        const pivotX = isHingeLeft ? -modConf.w / 2 + 0.008 : modConf.w / 2 - 0.008;
        hingePivot.position.set(pivotX, 0, cabD / 2 + thick);
        hingePivot.add(doorMesh);
        unit.add(hingePivot);

        const maxAngle = isHingeLeft ? -Math.PI * 0.52 : Math.PI * 0.52;

        this.hingePivots.push({
          pivot: hingePivot,
          maxAngle,
          skipOnDrawerCollision: false,
        });
      }

      lowerGroup.add(unit);
      this._registerExplodePart(unit, [modConf.cx * 0.35, -0.4, 0.4]);
    });

    this.root.add(lowerGroup);
    return lowerGroup;
  }

  // ── 3. COUNTERTOP & BACKSPLASH ───────────────────────────────────────────────
  _buildCountertop() {
    const ctGroup = new THREE.Group();
    ctGroup.name = 'countertop';

    const totalW = 3.06;
    const slab = this._box(totalW, 0.042, 0.66, this.counterMat);
    slab.position.set(0, 0.842, -0.54);
    ctGroup.add(slab);

    // Full white quartz backsplash wall panel
    const splash = this._box(totalW, 0.62, 0.018, this.stoneMat);
    splash.position.set(0, 1.15, -0.86);
    ctGroup.add(splash);

    this.root.add(ctGroup);
    this._registerExplodePart(ctGroup, [0, 0.45, 0]);
    return ctGroup;
  }

  // ── 4. SINK & MODERN FAUCET ──────────────────────────────────────────────────
  _buildSink() {
    const sinkGroup = new THREE.Group();
    sinkGroup.name = 'sink';
    sinkGroup.position.set(-0.6, 0.84, -0.54);

    // Minimalist gooseneck black faucet
    const fStem = this._cyl(0.014, 0.014, 0.26, 16, this.steelMat);
    fStem.position.set(0, 0.13, -0.16);
    sinkGroup.add(fStem);

    const fCurve = this._cyl(0.012, 0.012, 0.14, 16, this.steelMat);
    fCurve.rotation.x = Math.PI * 0.4;
    fCurve.position.set(0, 0.25, -0.10);
    sinkGroup.add(fCurve);

    const fSpout = this._cyl(0.01, 0.01, 0.08, 16, this.steelMat);
    fSpout.position.set(0, 0.21, -0.04);
    sinkGroup.add(fSpout);

    this.root.add(sinkGroup);
    this._registerExplodePart(sinkGroup, [-0.5, 0.3, 0.1]);
    return sinkGroup;
  }

  // ── 5. KITCHEN ISLAND (Moved forward to z = 1.95 for generous collision-free clearance) ──
  _buildIsland() {
    const islandGroup = new THREE.Group();
    islandGroup.name = 'island';
    // Shifted forward to 1.95m so counter doors have generous 95cm+ clearance without collision
    islandGroup.position.set(0.60, 0, 1.95);
    this.islandGroup = islandGroup;

    const iW = 1.48;
    const iH = 0.90;
    const iD = 0.76;
    const thick = 0.018;

    // Island Carcass
    const body = this._box(iW, iH, iD, this.cabinetMat);
    body.position.y = iH / 2;
    islandGroup.add(body);

    // Island White Quartz Countertop Top
    const top = this._box(iW + 0.08, 0.045, iD + 0.08, this.counterMat);
    top.position.y = iH + 0.0225;
    islandGroup.add(top);
    this._registerExplodePart(top, [0.4, 0.5, 0.2]);

    // 3 Wide Front Tiered Sliding Drawers
    const dW = iW * 0.72;
    const dH = (iH - 0.14) / 3 - 0.01;
    const frontStartX = -iW / 2 + dW / 2 + 0.04;

    for (let d = 0; d < 3; d++) {
      const dY = iH - 0.07 - dH / 2 - d * (dH + 0.012);
      const slider = this._buildDrawer(dW, dH, iD - 0.08, this.cabinetMat);
      slider.position.set(frontStartX, dY, 0);
      islandGroup.add(slider);
      this._addHandle(slider, 0, dH / 2 - 0.016, iD / 2 + 0.024, true, 0.32);
      this.drawerSliders.push({ slider, maxSlide: 0.44 });
    }

    this.root.add(islandGroup);
    this._registerExplodePart(islandGroup, [0.75, 0, 0.6]);
    return islandGroup;
  }

  // ── Assemble All Modules ─────────────────────────────────────────────────────
  _buildKitchen() {
    this._buildUpperCabinets();
    this._buildLowerCabinets();
    this._buildCountertop();
    this._buildSink();
    this._buildIsland();

    this.root.position.y = 0;
  }

  // ── Public Interactive Animation API ─────────────────────────────────────────

  /** progress 0→1 : open doors (respecting anti-collision for door next to drawer) */
  setDoorOpen(progress) {
    this._doorOpenProgress = progress;
    this.hingePivots.forEach(({ pivot, maxAngle, skipOnDrawerCollision }) => {
      // If drawers are open, the door next to the drawers stays cleanly closed so they never collide!
      if (skipOnDrawerCollision && this._drawerOpenProgress > 0.05) {
        pivot.rotation.y = 0;
        return;
      }
      pivot.rotation.y = maxAngle * progress;
    });
  }

  /** progress 0→1 : slide drawers out smoothly */
  setDrawerOpen(progress) {
    this._drawerOpenProgress = progress;
    this.drawerSliders.forEach(({ slider, maxSlide }) => {
      slider.position.z = maxSlide * progress;
    });

    // Ensure the door next to the drawer remains closed to avoid clipping
    if (progress > 0.05) {
      this.hingePivots.forEach(({ pivot, skipOnDrawerCollision }) => {
        if (skipOnDrawerCollision) {
          pivot.rotation.y = 0;
        }
      });
    }
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
    this.ledLights.forEach((l) => {
      l.intensity = on ? 0.7 : 0.0;
    });
  }

  /** Dynamically adjust front island table offset (e.g. 1.95m - 2.30m) with attached pendants */
  setIslandZ(z) {
    if (this.islandGroup) {
      this.islandGroup.position.z = z;
    }
    if (this.pendantGroup) {
      this.pendantGroup.children.forEach((child) => {
        child.position.z = z;
      });
    }
    const expItem = this.explodeParts.find((p) => p.group === this.islandGroup);
    if (expItem) {
      expItem.origPos.z = z;
    }
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

  /** Update hardware color */
  updateHardwareColor(hexColor) {
    const c = new THREE.Color(hexColor);
    this.hardwareMat.color.set(c);
  }

  dispose() {
    this.root.traverse((c) => {
      if (c.isMesh) {
        if (c.geometry) c.geometry.dispose();
      }
    });
    this.cabinetMat.dispose();
    this.counterMat.dispose();
    this.hardwareMat.dispose();
    this.interiorMat.dispose();
    this.stoneMat.dispose();
    this.steelMat.dispose();
  }
}
