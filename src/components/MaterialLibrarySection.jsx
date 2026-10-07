import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const CATEGORIES = [
  {
    id: 'wood',
    name: 'WOOD',
    image: '/assets/chair_closeup.jpg',
    subMaterials: [
      { name: 'Natural Oak', origin: 'Sustainable French White Oak', finish: 'Zero-VOC Raw Matte Seal' },
      { name: 'Walnut', origin: 'American Black Walnut', finish: 'Hand-Rubbed Organic Danish Oil' },
      { name: 'Teak', origin: 'Burmese Plantation Teak', finish: 'Deep Weathered Natural Wax' },
    ],
  },
  {
    id: 'stone',
    name: 'STONE',
    image: '/assets/room_bathroom.jpg',
    subMaterials: [
      { name: 'Calacatta Marble', origin: 'Carrara Basin, Italy', finish: 'Honed Matte Silk Touch' },
      { name: 'Roman Travertine', origin: 'Tivoli Quarries, Italy', finish: 'Cross-Cut Open Pore Patina' },
      { name: 'Quartzite', origin: 'Brazilian Natural Monolith', finish: 'Diamond Water-Jet Precision' },
    ],
  },
  {
    id: 'fabric',
    name: 'FABRIC',
    image: '/assets/room_bedroom.jpg',
    subMaterials: [
      { name: 'Bouclé Weave', origin: 'Prato Textile Mills, Italy', finish: 'Heavy Wool & Cotton Blend' },
      { name: 'Belgian Linen', origin: 'Flanders Flax Fields', finish: 'Stone-Washed Soft Drape' },
      { name: 'Cotton Velvet', origin: 'Como Velvet Atelier', finish: 'Deep Matte Pile Luster' },
    ],
  },
  {
    id: 'metal',
    name: 'METAL',
    image: '/assets/kitchen_showroom.jpg',
    subMaterials: [
      { name: 'Brushed Brass', origin: 'Architectural Extrusion', finish: 'Living Micro-Satin Patina' },
      { name: 'Smoked Bronze', origin: 'Hand-Cast Alloy', finish: 'Dark Chemical Oxidation' },
      { name: 'Matte Black Steel', origin: 'Precision Cold-Rolled', finish: 'Electrostatically Powdered' },
    ],
  },
  {
    id: 'glass',
    name: 'GLASS',
    image: '/assets/world_interior.jpg',
    subMaterials: [
      { name: 'Fluted Reeded Glass', origin: 'Architectural Float Glass', finish: '12mm Acoustic Ribbing' },
      { name: 'Smoked Bronze Glass', origin: 'Body-Tinted Float', finish: 'Anti-Glare Low-E Coating' },
      { name: 'Ultra-Clear Optiwhite', origin: 'Low-Iron Monolithic', finish: '99% Pure Color Fidelity' },
    ],
  },
];

export default function MaterialLibrarySection() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const imageRef = useRef(null);
  const textGroupRef = useRef(null);
  const stageRef = useRef(null);

  // Subtle mouse movement shifts the texture by a few pixels
  const handleMouseMove = (e) => {
    if (!stageRef.current || !imageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(imageRef.current, {
      x: x * 18,
      y: y * 18,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
  };

  const selectCategory = (cat) => {
    if (cat.id === activeCategory.id) return;

    // Slide current image toward left, zoom slightly, then bring new image in from right
    gsap.timeline()
      .to(imageRef.current, {
        x: -60,
        opacity: 0.2,
        scale: 1.08,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          setActiveCategory(cat);
          setActiveSubIndex(0);
        },
      })
      .fromTo(
        imageRef.current,
        { x: 60, opacity: 0.2, scale: 1.1 },
        { x: 0, opacity: 1, scale: 1.0, duration: 0.65, ease: 'power2.out' }
      )
      .fromTo(
        textGroupRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
      );
  };

  return (
    <section
      id="materials"
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#0e0d0c',
        color: '#f8f6f0',
        padding: '12vh 6vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            marginBottom: '12px',
          }}
        >
          TACTILE MATERIAL LIBRARY • 04
        </div>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(36px, 6vw, 78px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '0.04em',
            margin: '0 0 40px 0',
          }}
        >
          MATERIALS<br />
          THAT DEFINE<br />
          THE SPACE.
        </h2>

        {/* Horizontal Material Taxonomy */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(20px, 4vw, 56px)',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            paddingBottom: '16px',
            overflowX: 'auto',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '8px 0',
                  transition: 'color 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{cat.name}</span>
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-17px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: 'var(--color-accent-gold)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Material Stage: Large Image Sample & Editorial Spec Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          marginTop: '40px',
          marginBottom: '40px',
        }}
      >
        {/* Large Tactile Sample Image with Subtle Zoom & Movement */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(300px, 48vh, 520px)',
            borderRadius: '2px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            ref={imageRef}
            style={{
              position: 'absolute',
              inset: '-5%',
              width: '110%',
              height: '110%',
              backgroundImage: `url(${activeCategory.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              willChange: 'transform',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: 'rgba(14, 13, 12, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '8px 16px',
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
            }}
          >
            HAZZINO ATELIER SAMPLE • {activeCategory.name}
          </div>
        </div>

        {/* Sub-Material Selection & Specifications */}
        <div ref={textGroupRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)' }}>
            SELECT FINISH SPECIFICATION
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeCategory.subMaterials.map((sub, index) => {
              const isSelected = activeSubIndex === index;
              return (
                <div
                  key={sub.name}
                  onClick={() => setActiveSubIndex(index)}
                  style={{
                    padding: '18px 24px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                    borderLeft: isSelected ? '2px solid var(--color-accent-gold)' : '2px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="font-serif" style={{ fontSize: '20px', letterSpacing: '0.04em' }}>
                      {sub.name}
                    </span>
                    <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-accent-gold)' }}>
                      0{index + 1}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(244, 241, 234, 0.75)', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>
                    {sub.origin} — {sub.finish}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.15em' }}>
        ALL MATERIALS SOURCED WITH PROVENANCE AND ARCHITECTURAL GRADE INTEGRITY
      </div>
    </section>
  );
}
