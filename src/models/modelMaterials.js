/**
 * HAZZINO INTERIORS — PROCEDURAL PBR MATERIAL & TEXTURE GENERATOR
 * Generates photorealistic procedural wood grain, travertine pores,
 * Calacatta marble veins, woven bouclé, Belgian linen, saddle leather,
 * floor tiles, fluted glass, and aged brushed brass.
 */
import * as THREE from 'three';
import { SHOWROOM_MATERIALS } from '../data/showroomData';

const textureCache = {};

export function createWoodTexture(isDark = false) {
  const key = isDark ? 'wood_dark' : 'wood_light';
  if (textureCache[key]) return textureCache[key];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isDark ? '#3d2e23' : '#c8ad88';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle linear grain lines
  for (let y = 0; y < 512; y += 2) {
    const alpha = 0.08 + Math.random() * 0.14;
    const tone = isDark ? 22 + Math.random() * 32 : 155 + Math.random() * 45;
    ctx.strokeStyle = `rgba(${tone}, ${tone * 0.78}, ${tone * 0.58}, ${alpha})`;
    ctx.lineWidth = 1 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      140,
      y + Math.sin(y * 0.04) * 10,
      360,
      y + Math.cos(y * 0.035) * 10,
      512,
      y
    );
    ctx.stroke();
  }

  // Medullary rays / grain pores
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = isDark ? 'rgba(18, 12, 8, 0.28)' : 'rgba(110, 88, 58, 0.22)';
    ctx.fillRect(x, y, 1.2 + Math.random() * 2, 6 + Math.random() * 20);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache[key] = texture;
  return texture;
}

export function createPlankFloorTexture(isDark = false) {
  const key = isDark ? 'floor_wood_dark' : 'floor_wood_light';
  if (textureCache[key]) return textureCache[key];

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isDark ? '#2e2219' : '#bfa37e';
  ctx.fillRect(0, 0, 1024, 1024);

  // Plank rows with chamfered joints
  const plankHeight = 128;
  for (let y = 0; y < 1024; y += plankHeight) {
    // Joint shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, y, 1024, 3);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, y + 3, 1024, 1);

    // Subtle plank grain variation
    const plankToneShift = (Math.random() - 0.5) * 16;
    ctx.fillStyle = isDark
      ? `rgba(${35 + plankToneShift}, ${26 + plankToneShift}, ${18 + plankToneShift}, 0.2)`
      : `rgba(${175 + plankToneShift}, ${145 + plankToneShift}, ${110 + plankToneShift}, 0.2)`;
    ctx.fillRect(0, y + 4, 1024, plankHeight - 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache[key] = texture;
  return texture;
}

export function createStoneTexture() {
  if (textureCache.stone) return textureCache.stone;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e5ddd0';
  ctx.fillRect(0, 0, 512, 512);

  // Travertine micro-veins and open pores
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const w = 2 + Math.random() * 9;
    const h = 1 + Math.random() * 3;
    ctx.fillStyle =
      Math.random() > 0.45 ? 'rgba(165, 148, 128, 0.28)' : 'rgba(255, 252, 245, 0.38)';
    ctx.fillRect(x, y, w, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.stone = texture;
  return texture;
}

export function createWallPlasterTexture() {
  if (textureCache.plaster) return textureCache.plaster;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f2eee7';
  ctx.fillRect(0, 0, 512, 512);

  // Soft Venetian plaster trowel swirls
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = 60 + Math.random() * 120;
    const grad = ctx.createRadialGradient(x, y, 10, x, y, radius);
    const alpha = 0.04 + Math.random() * 0.06;
    grad.addColorStop(0, `rgba(215, 205, 192, ${alpha * 1.5})`);
    grad.addColorStop(0.7, `rgba(235, 230, 222, ${alpha})`);
    grad.addColorStop(1, 'rgba(242, 238, 231, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Micro-stucco mineral flecks
  for (let j = 0; j < 3500; j++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(180, 170, 155, 0.12)' : 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(px, py, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  textureCache.plaster = texture;
  return texture;
}

export function createLeatherTexture() {
  if (textureCache.leather) return textureCache.leather;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#8f6848';
  ctx.fillRect(0, 0, 512, 512);

  // Fine pebbled grain cell structure
  for (let y = 0; y < 512; y += 5) {
    for (let x = 0; x < 512; x += 5) {
      const offsetX = (Math.random() - 0.5) * 2;
      const offsetY = (Math.random() - 0.5) * 2;
      const shade = (Math.random() - 0.5) * 24;
      ctx.fillStyle = `rgba(${120 + shade}, ${85 + shade}, ${55 + shade}, 0.28)`;
      ctx.beginPath();
      ctx.arc(x + 2.5 + offsetX, y + 2.5 + offsetY, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.leather = texture;
  return texture;
}

export function createTileFloorTexture() {
  if (textureCache.tile_stone) return textureCache.tile_stone;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ded6c8';
  ctx.fillRect(0, 0, 1024, 1024);

  // Large-format stone tiles with crisp chamfered joints
  const tileSize = 256;
  ctx.strokeStyle = 'rgba(90, 80, 70, 0.45)';
  ctx.lineWidth = 3.0;

  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }

  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Stone mottling per tile
  for (let tx = 0; tx < 1024; tx += tileSize) {
    for (let ty = 0; ty < 1024; ty += tileSize) {
      const tint = (Math.random() - 0.5) * 16;
      ctx.fillStyle = `rgba(${200 + tint}, ${190 + tint}, ${175 + tint}, 0.18)`;
      ctx.fillRect(tx + 2, ty + 2, tileSize - 4, tileSize - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  textureCache.tile_stone = texture;
  return texture;
}

export function createMarbleTexture() {
  if (textureCache.marble) return textureCache.marble;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Calacatta white base
  ctx.fillStyle = '#f8f7f4';
  ctx.fillRect(0, 0, 1024, 1024);

  // Flowing organic grey and gold veining
  const veins = [
    { start: [0, 200], ctrl1: [320, 450], ctrl2: [700, 180], end: [1024, 600], w: 6, color: 'rgba(110, 102, 92, 0.45)' },
    { start: [0, 215], ctrl1: [310, 470], ctrl2: [680, 200], end: [1024, 620], w: 3.5, color: 'rgba(195, 160, 105, 0.55)' },
    { start: [150, 0], ctrl1: [400, 500], ctrl2: [600, 750], end: [850, 1024], w: 5, color: 'rgba(125, 118, 108, 0.38)' },
    { start: [500, 0], ctrl1: [620, 320], ctrl2: [820, 600], end: [1024, 900], w: 4, color: 'rgba(185, 148, 92, 0.45)' },
    { start: [0, 800], ctrl1: [250, 680], ctrl2: [550, 880], end: [800, 1024], w: 4.5, color: 'rgba(115, 108, 98, 0.35)' },
  ];

  veins.forEach((v) => {
    ctx.strokeStyle = v.color;
    ctx.lineWidth = v.w;
    ctx.beginPath();
    ctx.moveTo(v.start[0], v.start[1]);
    ctx.bezierCurveTo(v.ctrl1[0], v.ctrl1[1], v.ctrl2[0], v.ctrl2[1], v.end[0], v.end[1]);
    ctx.stroke();

    // Soft feathered edges
    ctx.lineWidth = v.w * 2.8;
    ctx.strokeStyle = v.color.replace(/0\.\d+\)/, '0.12)');
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  textureCache.marble = texture;
  return texture;
}

export function createBoucleBump() {
  if (textureCache.boucle) return textureCache.boucle;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Tactile wool yarn loops with shadow depth
  for (let y = 0; y < 256; y += 4) {
    for (let x = 0; x < 256; x += 4) {
      const shade = 100 + Math.floor(Math.random() * 110);
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Shadow crescent on loop
      ctx.fillStyle = 'rgba(40, 40, 40, 0.35)';
      ctx.beginPath();
      ctx.arc(x + 2.8, y + 2.8, 1.2, 0, Math.PI);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  textureCache.boucle = texture;
  return texture;
}

export function createLinenBump() {
  if (textureCache.linen) return textureCache.linen;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Cross-hatch linen threads
  ctx.strokeStyle = 'rgba(175, 175, 175, 0.45)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 256; i += 3) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  textureCache.linen = texture;
  return texture;
}

export function createFurnitureMaterial(materialKey) {
  const effectiveKey = (materialKey === 'warm_walnut' || materialKey === 'walnut') ? 'smoked_walnut' : materialKey;
  const matConfig = SHOWROOM_MATERIALS[effectiveKey] || SHOWROOM_MATERIALS[materialKey] || SHOWROOM_MATERIALS.natural_oak;

  if (effectiveKey === 'natural_oak') {
    const map = createWoodTexture(false);
    return new THREE.MeshStandardMaterial({
      map,
      color: new THREE.Color(matConfig.color),
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
    });
  }

  if (effectiveKey === 'smoked_walnut') {
    const map = createWoodTexture(true);
    return new THREE.MeshStandardMaterial({
      map,
      color: new THREE.Color(matConfig.color || '#513d30'),
      roughness: matConfig.roughness || 0.7,
      metalness: matConfig.metalness || 0.05,
    });
  }

  if (materialKey === 'travertine') {
    const map = createStoneTexture();
    return new THREE.MeshStandardMaterial({
      map,
      color: new THREE.Color(matConfig.color),
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
    });
  }

  if (materialKey === 'calacatta') {
    const map = createMarbleTexture();
    return new THREE.MeshStandardMaterial({
      map,
      color: new THREE.Color(matConfig.color),
      roughness: 0.18,
      metalness: 0.04,
    });
  }

  if (materialKey === 'boucle') {
    const bumpMap = createBoucleBump();
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(matConfig.color),
      bumpMap,
      bumpScale: 0.06,
      roughness: 0.94,
      metalness: 0.0,
    });
  }

  if (materialKey === 'linen') {
    const bumpMap = createLinenBump();
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(matConfig.color),
      bumpMap,
      bumpScale: 0.035,
      roughness: 0.88,
      metalness: 0.0,
    });
  }

  if (materialKey === 'leather') {
    const map = createLeatherTexture();
    return new THREE.MeshStandardMaterial({
      map,
      color: new THREE.Color(matConfig.color),
      roughness: 0.46,
      metalness: 0.06,
    });
  }

  if (materialKey === 'brushed_brass') {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4b26f),
      roughness: 0.24,
      metalness: 0.92,
    });
  }

  if (materialKey === 'matte_black') {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(matConfig.color),
      roughness: 0.45,
      metalness: 0.55,
    });
  }

  if (materialKey === 'forest_lacquer') {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(matConfig.color),
      roughness: 0.42,
      metalness: 0.06,
    });
  }

  if (materialKey === 'walnut') {
    const map = createWoodTexture(true);
    return new THREE.MeshStandardMaterial({
      map,
      color: new THREE.Color(matConfig.color),
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
    });
  }

  if (materialKey === 'dark_walnut') {
    const map = createWoodTexture(true);
    return new THREE.MeshStandardMaterial({
      map,
      color: new THREE.Color(matConfig.color),
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
    });
  }

  if (materialKey === 'warm_beige') {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(matConfig.color),
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
    });
  }

  if (materialKey === 'charcoal') {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(matConfig.color),
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
    });
  }

  if (materialKey === 'ivory') {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(matConfig.color),
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
    });
  }

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(matConfig.color),
    roughness: 0.6,
    metalness: 0.08,
  });
}

export function createBrassAccentMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xc4a059,
    metalness: 0.9,
    roughness: 0.28,
  });
}

export function createInteriorLiningMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x4a3a2d,
    roughness: 0.8,
    metalness: 0.05,
  });
}

export function createGlassMaterial(opacity = 0.3) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity,
    roughness: 0.08,
    transmission: 0.9,
    ior: 1.5,
  });
}

export function createEmissiveWarmGlowMaterial(intensity = 1.8) {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffe6c2),
  });
}
