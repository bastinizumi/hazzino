/**
 * HAZZINO INTERIORS — INTERACTIVE 3D KITCHEN VIEWER
 * Full Three.js kitchen: orbit camera, explode/assemble, drawer/door controls,
 * hotspots, material picker, and premium UI.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { X, RotateCcw, ZoomIn, ZoomOut, Layers, Maximize2, RefreshCw } from 'lucide-react';
import {
  KitchenModel,
  KITCHEN_CABINET_COLORS,
  KITCHEN_COUNTERTOP_COLORS,
  KITCHEN_HARDWARE_COLORS,
} from '../../models/KitchenModel';

// ─── Assembly status labels ───────────────────────────────────────────────────
const STATUS = {
  idle:         '',
  exploring:    'EXPLORING COMPONENTS',
  assembling:   'ASSEMBLY IN PROGRESS',
  assembled:    'ASSEMBLY COMPLETE',
  opening_doors:'OPENING DOORS',
  opening_draw: 'OPENING DRAWERS',
};

// ─── Kitchen hotspot definitions (3-D positions) ──────────────────────────────
const KITCHEN_HOTSPOTS = [
  { id: 'upper_cabs',  label: 'UPPER CABINETS',  pos: [-0.8,  2.0, -0.55], action: 'door' },
  { id: 'lower_draw',  label: 'DRAWERS',          pos: [-0.6,  0.55, -0.20], action: 'drawer' },
  { id: 'countertop',  label: 'COUNTERTOP',        pos: [ 0.0,  0.90, -0.40], action: 'material' },
  { id: 'island',      label: 'ISLAND STORAGE',   pos: [ 0.6,  0.94,  0.50], action: 'island_draw' },
  { id: 'lighting',    label: 'UNDER-CABINET LED', pos: [-1.1,  1.30, -0.38], action: 'led' },
];

export default function KitchenViewer() {
  const mountRef     = useRef(null);
  const sceneRef     = useRef(null);
  const cameraRef    = useRef(null);
  const rendererRef  = useRef(null);
  const kitchenRef   = useRef(null);
  const rafRef       = useRef(null);

  // Camera orbit
  const azimRef    = useRef(-0.25);
  const elevRef    = useRef(0.28);
  const radiusRef  = useRef(4.8);
  const tAzimRef   = useRef(-0.25);
  const tElevRef   = useRef(0.28);
  const tRadRef    = useRef(4.8);
  const targetRef  = useRef(new THREE.Vector3(0, 0.9, 0));
  const velRef     = useRef(0);
  const draggingRef= useRef(false);
  const prevPosRef = useRef({ x: 0, y: 0 });
  const frameCount = useRef(0);

  // Refs that mirror UI state so callbacks don't capture stale closures
  const doorsOpenRef   = useRef(false);
  const drawersOpenRef = useRef(false);
  const isExplodedRef  = useRef(false);

  // UI state
  const [isExploded,    setIsExploded]    = useState(false);
  const [doorsOpen,     setDoorsOpen]     = useState(false);
  const [drawersOpen,   setDrawersOpen]   = useState(false);
  const [ledsOn,        setLedsOn]        = useState(true);
  const [status,        setStatus]        = useState('');
  const [animating,     setAnimating]     = useState(false);
  const animatingRef   = useRef(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [projHotspots,  setProjHotspots]  = useState([]);
  const [showPanel,     setShowPanel]     = useState(false);
  const [cabinetColor,  setCabinetColor]  = useState(KITCHEN_CABINET_COLORS[5]);  // Forest Green
  const [counterColor,  setCounterColor]  = useState(KITCHEN_COUNTERTOP_COLORS[0]);
  const [hardwareColor, setHardwareColor] = useState(KITCHEN_HARDWARE_COLORS[0]);
  const [showColorPanel, setShowColorPanel] = useState(false);

  // Keep animatingRef in sync so callbacks can read it without stale closure
  const setAnimatingSync = (v) => { animatingRef.current = v; setAnimating(v); };

  // ── Scene Init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0f0d);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 60);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting rig
    scene.add(new THREE.AmbientLight(0xfff5e4, 1.4));

    const key = new THREE.DirectionalLight(0xffeedd, 2.4);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far  = 20;
    key.shadow.camera.left = key.shadow.camera.bottom = -5;
    key.shadow.camera.right = key.shadow.camera.top   =  5;
    key.shadow.bias = -0.0004;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xd5e8f8, 0.7);
    fill.position.set(-5, 3, -2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xfff8ee, 1.1);
    rim.position.set(0, 5, -5);
    scene.add(rim);

    // Floor plane
    const floorGeom = new THREE.PlaneGeometry(18, 18);
    const floorMat  = new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.85, metalness: 0.0 });
    const floor      = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Wall
    const wallGeom = new THREE.PlaneGeometry(10, 4);
    const wallMat  = new THREE.MeshStandardMaterial({ color: 0x1e2420, roughness: 0.9, metalness: 0.0 });
    const wall     = new THREE.Mesh(wallGeom, wallMat);
    wall.position.set(0, 2, -1.1);
    wall.receiveShadow = true;
    scene.add(wall);

    // Build kitchen model
    const kitchen = new KitchenModel({
      cabinetColor:  cabinetColor.color,
      counterColor:  counterColor.color,
      hardwareColor: hardwareColor.color,
    });
    kitchen.setLEDs(true);
    scene.add(kitchen.root);
    kitchenRef.current = kitchen;

    // Render loop
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      // Auto-inertia
      if (!draggingRef.current) {
        tAzimRef.current += velRef.current;
        velRef.current   *= 0.88;
      }
      azimRef.current   += (tAzimRef.current   - azimRef.current)   * 0.10;
      elevRef.current   += (tElevRef.current   - elevRef.current)   * 0.10;
      radiusRef.current += (tRadRef.current    - radiusRef.current)  * 0.10;

      const t = targetRef.current;
      const r = radiusRef.current;
      const el = elevRef.current;
      const az = azimRef.current;

      camera.position.set(
        t.x + r * Math.cos(el) * Math.sin(az),
        t.y + r * Math.sin(el),
        t.z + r * Math.cos(el) * Math.cos(az)
      );
      camera.lookAt(t);
      renderer.render(scene, camera);

      // Project hotspots — throttled to every 6 frames (~10fps) to avoid React perf hit
      frameCount.current++;
      if (frameCount.current % 6 === 0 && renderer.domElement) {
        const proj = KITCHEN_HOTSPOTS.map(hs => {
          const v = new THREE.Vector3(...hs.pos);
          v.project(camera);
          return {
            ...hs,
            sx: ((v.x + 1) / 2) * 100,
            sy: ((-v.y + 1) / 2) * 100,
            visible: v.z < 1,
          };
        });
        setProjHotspots(proj);
      }
    };
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      kitchenRef.current?.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // ── Material updates ──────────────────────────────────────────────────────
  useEffect(() => {
    kitchenRef.current?.updateCabinetColor(cabinetColor.hex);
  }, [cabinetColor]);
  useEffect(() => {
    kitchenRef.current?.updateCountertopColor(counterColor.hex);
  }, [counterColor]);
  useEffect(() => {
    kitchenRef.current?.updateHardwareColor(hardwareColor.hex);
  }, [hardwareColor]);

  // ── Pointer drag ──────────────────────────────────────────────────────────
  const onPointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.no-drag')) return;
    draggingRef.current = true;
    prevPosRef.current  = { x: e.clientX, y: e.clientY };
    velRef.current = 0;
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - prevPosRef.current.x;
    const dy = e.clientY - prevPosRef.current.y;
    prevPosRef.current = { x: e.clientX, y: e.clientY };
    const speed = 0.0048;
    tAzimRef.current -= dx * speed;
    velRef.current    = -dx * speed * 0.4;
    tElevRef.current  = Math.max(-0.15, Math.min(0.7, tElevRef.current + dy * 0.003));
  };
  const onPointerUp = () => { draggingRef.current = false; };
  const onWheel = (e) => {
    e.preventDefault();
    tRadRef.current = Math.max(2.2, Math.min(8.0, tRadRef.current + e.deltaY * 0.004));
  };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── Animation helpers ─────────────────────────────────────────────────────
  const animateKitchen = useCallback((fn, statusKey, durationEstimate, onDone) => {
    if (animatingRef.current) return;
    setAnimatingSync(true);
    setStatus(STATUS[statusKey]);
    const obj = { t: 0 };
    gsap.to(obj, {
      t: 1, duration: durationEstimate, ease: 'power3.inOut',
      onUpdate: () => fn(obj.t),
      onComplete: () => {
        setAnimatingSync(false);
        if (onDone) onDone();
      },
    });
  }, []);

  // Explode / Assemble
  const handleExplode = useCallback(() => {
    if (animatingRef.current) return;
    const next = !isExplodedRef.current;
    isExplodedRef.current = next;
    setIsExploded(next);
    setStatus(next ? STATUS.exploring : STATUS.assembling);
    setAnimatingSync(true);

    // Close doors and drawers first if open
    if (doorsOpenRef.current)   { kitchenRef.current?.setDoorOpen(0);   doorsOpenRef.current = false; setDoorsOpen(false); }
    if (drawersOpenRef.current) { kitchenRef.current?.setDrawerOpen(0); drawersOpenRef.current = false; setDrawersOpen(false); }

    const obj = { p: next ? 0 : 1 };
    gsap.to(obj, {
      p: next ? 1 : 0,
      duration: 2.2,
      ease: 'power3.inOut',
      onUpdate: () => kitchenRef.current?.setExplode(obj.p),
      onComplete: () => {
        setAnimatingSync(false);
        setStatus(next ? '' : STATUS.assembled);
        if (!next) setTimeout(() => setStatus(''), 2500);
        tRadRef.current = next ? 7.5 : 4.8;
      },
    });
  }, []);

  // Doors
  const handleToggleDoors = useCallback(() => {
    if (animatingRef.current) return;
    const next = !doorsOpenRef.current;
    doorsOpenRef.current = next;
    setDoorsOpen(next);
    animateKitchen(
      p => kitchenRef.current?.setDoorOpen(next ? p : 1 - p),
      'opening_doors', 1.6,
      () => setStatus('')
    );
  }, [animateKitchen]);

  const handleToggleDrawers = useCallback(() => {
    if (animatingRef.current) return;
    const next = !drawersOpenRef.current;
    drawersOpenRef.current = next;
    setDrawersOpen(next);
    animateKitchen(
      p => kitchenRef.current?.setDrawerOpen(next ? p : 1 - p),
      'opening_draw', 1.6,
      () => setStatus('')
    );
  }, [animateKitchen]);

  // Open All
  const handleOpenAll = useCallback(() => {
    if (animatingRef.current) return;
    doorsOpenRef.current = true; drawersOpenRef.current = true;
    setDoorsOpen(true); setDrawersOpen(true);
    setStatus('OPENING ALL STORAGE'); setAnimatingSync(true);
    const obj = { p: 0 };
    gsap.to(obj, {
      p: 1, duration: 2.0, ease: 'power2.inOut',
      onUpdate: () => {
        kitchenRef.current?.setDoorOpen(obj.p);
        kitchenRef.current?.setDrawerOpen(obj.p);
      },
      onComplete: () => { setAnimatingSync(false); setStatus(''); },
    });
  }, []);

  const handleCloseAll = useCallback(() => {
    if (animatingRef.current) return;
    doorsOpenRef.current = false; drawersOpenRef.current = false;
    setDoorsOpen(false); setDrawersOpen(false);
    setAnimatingSync(true); setStatus('CLOSING ALL STORAGE');
    const obj = { p: 1 };
    gsap.to(obj, {
      p: 0, duration: 1.8, ease: 'power2.inOut',
      onUpdate: () => {
        kitchenRef.current?.setDoorOpen(obj.p);
        kitchenRef.current?.setDrawerOpen(obj.p);
      },
      onComplete: () => { setAnimatingSync(false); setStatus(''); },
    });
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    if (animatingRef.current) return;
    // Force-close everything via direct model calls
    kitchenRef.current?.setDoorOpen(0);
    kitchenRef.current?.setDrawerOpen(0);
    kitchenRef.current?.setExplode(0);
    doorsOpenRef.current = false; drawersOpenRef.current = false; isExplodedRef.current = false;
    setDoorsOpen(false); setDrawersOpen(false); setIsExploded(false);
    tAzimRef.current  = -0.25;
    tElevRef.current  =  0.28;
    tRadRef.current   =  4.8;
    targetRef.current.set(0, 0.9, 0);
    setSelectedHotspot(null);
    setShowColorPanel(false);
    setStatus('');
  }, []);

  // Hotspot click
  const handleHotspot = (hs) => {
    setSelectedHotspot(hs);
    setShowPanel(true);
    if (hs.action === 'door')        handleToggleDoors();
    else if (hs.action === 'drawer' || hs.action === 'island_draw') handleToggleDrawers();
    else if (hs.action === 'led')    {
      const nextLed = !ledsOn;
      setLedsOn(nextLed);
      kitchenRef.current?.setLEDs(nextLed);
    }
    else if (hs.action === 'material') setShowColorPanel(true);
  };

  // Zoom
  const zoom = (dir) => { tRadRef.current = Math.max(2.2, Math.min(8.0, tRadRef.current + dir * 0.6)); };

  // ── Styles ────────────────────────────────────────────────────────────────
  const btnBase = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', border: 'none', cursor: animating ? 'not-allowed' : 'pointer',
    fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
    borderRadius: '2px', transition: 'all 0.2s ease', opacity: animating ? 0.5 : 1,
  };
  const btnDark  = { ...btnBase, backgroundColor: 'rgba(20,20,18,0.88)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' };
  const btnLight = { ...btnBase, backgroundColor: 'rgba(248,245,240,0.92)', color: '#121110', border: '1px solid rgba(20,20,18,0.15)' };
  const btnGold  = { ...btnBase, backgroundColor: '#c9a84c', color: '#1a1108', border: 'none' };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0c0f0d' }}>

      {/* ── Three.js Canvas ─────────────────────────────────────────────────── */}
      <div
        ref={mountRef}
        className="no-select"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ width: '100%', height: '100%', cursor: draggingRef.current ? 'grabbing' : 'grab', touchAction: 'none' }}
      />

      {/* ── Section tag ────────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 22, left: 28, zIndex: 30, pointerEvents: 'none' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.38em', fontWeight: 600, color: '#a3be8c', textTransform: 'uppercase', marginBottom: 4 }}>
          SHOWROOM • KITCHEN ARCHITECTURE
        </div>
        <h2 className="font-serif" style={{ fontSize: 'clamp(22px, 2.8vw, 38px)', fontWeight: 400, letterSpacing: '0.04em', color: '#fff', margin: 0, lineHeight: 1.08, textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
          THE CULINARY ATELIER.
        </h2>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.16em', marginTop: 4 }}>
          LIVE 3D INTERACTIVE SHOWROOM
        </div>
      </div>

      {/* ── Status label ───────────────────────────────────────────────────── */}
      {status && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          backgroundColor: 'rgba(12,15,13,0.85)', backdropFilter: 'blur(12px)',
          color: '#a3be8c', padding: '10px 24px', borderRadius: '2px',
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase',
          border: '1px solid rgba(163,190,140,0.3)', zIndex: 60, pointerEvents: 'none',
          animation: 'kitchenFadeIn 0.3s ease-out',
        }}>
          {status}
        </div>
      )}

      {/* ── Hotspot overlays ────────────────────────────────────────────────── */}
      {projHotspots.map(hs => hs.visible && (
        <div key={hs.id} style={{ position: 'absolute', left: `${hs.sx}%`, top: `${hs.sy}%`, transform: 'translate(-50%,-50%)', zIndex: 40 }}>
          <button
            className="no-drag"
            onClick={() => handleHotspot(hs)}
            aria-label={`Inspect ${hs.label}`}
            style={{
              width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff',
              backgroundColor: selectedHotspot?.id === hs.id ? '#a3be8c' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', boxShadow: '0 0 12px rgba(255,255,255,0.6), 0 0 28px rgba(163,190,140,0.4)',
              animation: 'kitchenHotspotPulse 2s ease-in-out infinite',
              transition: 'all 0.2s ease',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'rgba(12,15,13,0.9)', backdropFilter: 'blur(8px)',
            color: '#fff', padding: '5px 10px', borderRadius: '2px',
            fontSize: '8px', fontWeight: 600, letterSpacing: '0.18em', whiteSpace: 'nowrap',
            border: '1px solid rgba(163,190,140,0.3)', pointerEvents: 'none',
          }}>
            {hs.label}
          </div>
        </div>
      ))}

      {/* ── Main Control Bar ────────────────────────────────────────────────── */}
      <div className="no-drag" style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center',
        zIndex: 50, padding: '0 12px',
      }}>
        <button style={drawersOpen ? { ...btnGold } : btnDark} onClick={handleToggleDrawers} disabled={animating}>
          {drawersOpen ? 'CLOSE DRAWERS' : 'OPEN DRAWERS'}
        </button>
        <button style={doorsOpen ? { ...btnGold } : btnDark} onClick={handleToggleDoors} disabled={animating}>
          {doorsOpen ? 'CLOSE DOORS' : 'OPEN DOORS'}
        </button>
        <button style={btnDark} onClick={handleOpenAll} disabled={animating}>OPEN ALL</button>
        <button style={btnDark} onClick={handleCloseAll} disabled={animating}>CLOSE ALL</button>
        <button
          style={isExploded ? { ...btnGold } : { ...btnDark, border: '1px solid rgba(163,190,140,0.5)' }}
          onClick={handleExplode} disabled={animating}
        >
          {isExploded ? '⬡ ASSEMBLE' : '⬡ EXPLODE'}
        </button>
        <button style={btnDark} onClick={() => setShowColorPanel(v => !v)}>
          MATERIALS
        </button>
        <button style={btnLight} onClick={handleReset} disabled={animating}>
          <RefreshCw size={10} /> RESET
        </button>
      </div>

      {/* ── Zoom controls ───────────────────────────────────────────────────── */}
      <div className="no-drag" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 6, zIndex: 50 }}>
        {[{ Icon: ZoomIn, d: -1 }, { Icon: ZoomOut, d: 1 }].map(({ Icon, d }) => (
          <button key={d} onClick={() => zoom(d)} style={{
            width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)',
            backgroundColor: 'rgba(12,15,13,0.85)', backdropFilter: 'blur(8px)', color: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* ── Drag hint ───────────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', bottom: 80, left: 28, fontSize: '9px', letterSpacing: '0.2em', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', pointerEvents: 'none' }}>
        ↻ DRAG TO ROTATE 360° • SCROLL TO ZOOM
      </div>

      {/* ── LED toggle ──────────────────────────────────────────────────────── */}
      <button
        className="no-drag"
        onClick={() => { setLedsOn(v => { kitchenRef.current?.setLEDs(!v); return !v; }); }}
        style={{ ...btnDark, position: 'absolute', top: 22, right: 20, zIndex: 50, border: `1px solid ${ledsOn ? 'rgba(163,190,140,0.5)' : 'rgba(255,255,255,0.12)'}`, color: ledsOn ? '#a3be8c' : '#fff' }}
      >
        {ledsOn ? '● LED ON' : '○ LED OFF'}
      </button>

      {/* ── Material / Color Panel ───────────────────────────────────────────── */}
      {showColorPanel && (
        <div className="no-drag" style={{
          position: 'absolute', right: 20, top: 70, width: 270,
          backgroundColor: 'rgba(248,246,240,0.97)', backdropFilter: 'blur(16px)',
          color: '#121110', padding: 24, borderRadius: 2,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)', zIndex: 60,
          animation: 'kitchenFadeIn 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#a3be8c' }}>
              MATERIAL SELECTION
            </span>
            <button onClick={() => setShowColorPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a756c' }}>
              <X size={15} />
            </button>
          </div>

          {/* Cabinet Colors */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7a756c', marginBottom: 8 }}>
              CABINET COLOUR
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {KITCHEN_CABINET_COLORS.map(c => (
                <button key={c.id} onClick={() => setCabinetColor(c)} title={c.name}
                  style={{
                    width: 26, height: 26, borderRadius: '50%', backgroundColor: c.hex, border: 'none',
                    boxShadow: cabinetColor.id === c.id ? '0 0 0 2px #121110, 0 0 0 4px ' + c.hex : '0 1px 4px rgba(0,0,0,0.25)',
                    cursor: 'pointer', transition: 'box-shadow 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '9px', color: '#7a756c', marginTop: 5 }}>{cabinetColor.name}</div>
          </div>

          {/* Countertop Colors */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7a756c', marginBottom: 8 }}>
              COUNTERTOP MATERIAL
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {KITCHEN_COUNTERTOP_COLORS.map(c => (
                <button key={c.id} onClick={() => setCounterColor(c)} title={c.name}
                  style={{
                    width: 26, height: 26, borderRadius: '50%', backgroundColor: c.hex, border: 'none',
                    boxShadow: counterColor.id === c.id ? '0 0 0 2px #121110, 0 0 0 4px ' + c.hex : '0 1px 4px rgba(0,0,0,0.25)',
                    cursor: 'pointer', transition: 'box-shadow 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '9px', color: '#7a756c', marginTop: 5 }}>{counterColor.name}</div>
          </div>

          {/* Hardware Finishes */}
          <div>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7a756c', marginBottom: 8 }}>
              HARDWARE FINISH
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {KITCHEN_HARDWARE_COLORS.map(c => (
                <button key={c.id} onClick={() => setHardwareColor(c)} title={c.name}
                  style={{
                    width: 26, height: 26, borderRadius: '50%', backgroundColor: c.hex, border: 'none',
                    boxShadow: hardwareColor.id === c.id ? '0 0 0 2px #121110, 0 0 0 4px ' + c.hex : '0 1px 4px rgba(0,0,0,0.25)',
                    cursor: 'pointer', transition: 'box-shadow 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '9px', color: '#7a756c', marginTop: 5 }}>{hardwareColor.name}</div>
          </div>
        </div>
      )}

      {/* ── Hotspot inspection panel ─────────────────────────────────────────── */}
      {showPanel && selectedHotspot && (
        <div className="no-drag" style={{
          position: 'absolute', bottom: 80, right: 20, width: 'min(90vw,300px)',
          backgroundColor: 'rgba(248,246,240,0.97)', backdropFilter: 'blur(16px)',
          color: '#121110', padding: 22, borderRadius: 2,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)', zIndex: 60,
          animation: 'kitchenFadeIn 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.28em', color: '#a3be8c', textTransform: 'uppercase' }}>
              {selectedHotspot.label}
            </span>
            <button onClick={() => { setShowPanel(false); setSelectedHotspot(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a756c' }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#7a756c', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
            {selectedHotspot.action === 'door'       && 'Upper cabinet doors rotate on architectural hinge pivots. Click OPEN DOORS or tap the hotspot.'}
            {selectedHotspot.action === 'drawer'     && 'Lower cabinet drawers slide along precision steel runners. Each drawer opens independently.'}
            {selectedHotspot.action === 'island_draw'&& 'Three full-extension island drawers with brass hardware. Click OPEN DRAWERS to reveal storage.'}
            {selectedHotspot.action === 'material'   && 'Calacatta quartzite countertop with honed finish. Use the MATERIALS panel to change finishes.'}
            {selectedHotspot.action === 'led'        && 'High-CRI 2700K under-cabinet LED strip lighting. Toggle with the LED button above.'}
          </div>
          <div style={{ marginTop: 12, fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: '#a3be8c', textTransform: 'uppercase' }}>
            STATE: {selectedHotspot.action === 'door' ? (doorsOpen ? 'OPEN' : 'CLOSED') : selectedHotspot.action === 'led' ? (ledsOn ? 'ON' : 'OFF') : (drawersOpen ? 'OPEN' : 'CLOSED')}
          </div>
        </div>
      )}

      {/* Explode label when active */}
      {isExploded && (
        <div style={{
          position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(12,15,13,0.78)', backdropFilter: 'blur(10px)',
          color: 'rgba(163,190,140,0.9)', padding: '6px 20px', borderRadius: '2px',
          fontSize: '8px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase',
          border: '1px solid rgba(163,190,140,0.25)', zIndex: 45, pointerEvents: 'none',
        }}>
          KITCHEN ASSEMBLY — COMPONENT VIEW
        </div>
      )}

      <style>{`
        @keyframes kitchenFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes kitchenHotspotPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 22px rgba(163,190,140,0.3); }
          50%       { box-shadow: 0 0 18px rgba(255,255,255,0.9), 0 0 40px rgba(163,190,140,0.6); }
        }
      `}</style>
    </div>
  );
}
