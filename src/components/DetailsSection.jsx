import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HOTSPOTS_DATA = [
  {
    id: 1,
    tag: '01',
    label: 'FRAME',
    title: 'SOLID WOOD FRAME',
    desc: 'Crafted from sustainably sourced American Black Walnut for exceptional structural rigidity, organic warmth, and heirloom longevity.',
    x: 28, // % from left
    y: 72, // % from top
  },
  {
    id: 2,
    tag: '02',
    label: 'FABRIC',
    title: 'TACTILE BOUCLÉ WEAVE',
    desc: 'High-density natural wool and Italian cotton yarn weave with soft-touch textured surface, stain-resistant backing, and gentle breathability.',
    x: 44,
    y: 32,
  },
  {
    id: 3,
    tag: '03',
    label: 'ARMREST',
    title: 'SCULPTED WALNUT ARMREST',
    desc: 'Hand-shaped continuous organic curvature with seamless concealed mortise-and-tenon joinery, finished in zero-VOC matte Danish oil.',
    x: 64,
    y: 44,
  },
  {
    id: 4,
    tag: '04',
    label: 'CUSHION',
    title: 'MULTI-DENSITY CORE',
    desc: 'Multi-layer ergonomic cushion combining high-resilience latex core with a channel-quilted down-alternative wrap for tailored ergonomic support.',
    x: 58,
    y: 65,
  },
];

export default function DetailsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const chairStageRef = useRef(null);
  const chairImgRef = useRef(null);
  const hotspotRefs = useRef([]);
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin section for scrubbed camera zoom-in inspection
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Camera starts with full chair, zooms in closer to inspect details
      tl.fromTo(
        chairImgRef.current,
        { scale: 0.95, y: 30, rotationX: 2, transformOrigin: '48% 55%' },
        { scale: 1.28, y: -20, rotationX: 0, ease: 'none', duration: 2 }
      );

      // Title moves subtly
      tl.to(titleRef.current, { y: -60, opacity: 0.8, ease: 'none', duration: 2 }, 0);

      // 2. Sequential reveal of the 4 hotspots as camera zooms
      hotspotRefs.current.forEach((el, index) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
          0.3 + index * 0.35
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="furniture"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#141311',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1200px',
      }}
    >
      {/* Soft warm ambient background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(35, 32, 28, 0.9) 0%, rgba(14, 13, 11, 0.98) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Editorial Title */}
      <div
        ref={titleRef}
        style={{
          position: 'absolute',
          top: '10vh',
          left: '6vw',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          FURNITURE CRAFT • 02
        </span>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(38px, 6vw, 76px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            color: '#f8f6f0',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          DETAILS MATTER.
        </h2>
        <p
          style={{
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.05em',
            marginTop: '8px',
          }}
        >
          Click points to inspect bespoke material joinery
        </p>
      </div>

      {/* Chair Display Stage (~60% of viewport) */}
      <div
        ref={chairStageRef}
        style={{
          position: 'relative',
          width: 'min(86vw, 1000px)',
          height: 'min(72vh, 660px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {/* Chair Image with subtle 3D depth */}
        <div
          ref={chairImgRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/assets/chair_closeup.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '4px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            willChange: 'transform',
          }}
        >
          {/* Subtle warm architectural sheen */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, transparent 60%, rgba(0, 0, 0, 0.4) 100%)',
              pointerEvents: 'none',
              borderRadius: '4px',
            }}
          />

          {/* 4 Sequential Pulsing Hotspots */}
          {HOTSPOTS_DATA.map((spot, index) => (
            <div
              key={spot.id}
              ref={(el) => (hotspotRefs.current[index] = el)}
              style={{
                position: 'absolute',
                top: `${spot.y}%`,
                left: `${spot.x}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 30,
              }}
            >
              {/* Pulse Marker */}
              <button
                onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
                aria-label={`Inspect ${spot.title}`}
                className="hotspot-pulse"
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: activeHotspot?.id === spot.id ? 'var(--color-accent-gold)' : '#ffffff',
                }}
              />

              {/* Minimal floating tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '-24px',
                  left: '18px',
                  whiteSpace: 'nowrap',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.85)',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
                  pointerEvents: 'none',
                }}
              >
                {spot.tag} {spot.label}
              </div>

              {/* Floating Specification Card next to Hotspot */}
              {activeHotspot?.id === spot.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: spot.y > 60 ? 'auto' : '26px',
                    bottom: spot.y > 60 ? '26px' : 'auto',
                    left: spot.x > 60 ? 'auto' : '26px',
                    right: spot.x > 60 ? '26px' : 'auto',
                    width: '260px',
                    backgroundColor: 'rgba(248, 246, 240, 0.96)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    color: '#121110',
                    padding: '20px',
                    borderRadius: '2px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 20, 20, 0.08)',
                    zIndex: 50,
                    animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', color: 'var(--color-accent-bronze)' }}>
                      {spot.tag} SPECIFICATION
                    </span>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#121110' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 500, letterSpacing: '0.04em', margin: '0 0 8px 0' }}>
                    {spot.title}
                  </h4>
                  <p style={{ fontSize: '11px', lineHeight: 1.6, color: '#555148', margin: 0, fontFamily: 'var(--font-sans)' }}>
                    {spot.desc}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
