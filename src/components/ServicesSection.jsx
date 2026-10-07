import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    num: '01',
    title: 'RESIDENTIAL INTERIORS',
    desc: 'High-end villas, penthouses, and private estates curated with bespoke furnishings and architectural finishes.',
    image: '/assets/hero_showroom.jpg',
  },
  {
    num: '02',
    title: 'OFFICE INTERIORS',
    desc: 'Forward-thinking corporate environments, executive suites, and collaborative workspaces balancing prestige and productivity.',
    image: '/assets/office_interior.jpg',
  },
  {
    num: '03',
    title: 'INSTITUTIONAL INTERIORS',
    desc: 'Galleries, luxury hospitality lobbies, and cultural centers designed for monumental spatial impact.',
    image: '/assets/world_interior.jpg',
  },
  {
    num: '04',
    title: 'CUSTOM FURNITURE',
    desc: 'One-of-a-kind monolithic tables, sculpted seating, and artisan cabinetry manufactured in our dedicated atelier.',
    image: '/assets/chair_closeup.jpg',
  },
  {
    num: '05',
    title: 'SPACE PLANNING',
    desc: 'Comprehensive architectural circulation analysis, spatial optimization, and 3D volumetric design.',
    image: '/assets/studio_main.jpg',
  },
  {
    num: '06',
    title: 'MATERIAL & LIGHTING',
    desc: 'Curated natural stone palettes, custom architectural luminaire design, and circadian lighting integration.',
    image: '/assets/kitchen_showroom.jpg',
  },
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(null);
  const containerRef = useRef(null);
  const floatImgRef = useRef(null);

  // Mouse inertia tracking for floating preview image
  const mousePos = useRef({ x: 0, y: 0 });
  const imgPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Smooth inertia loop via requestAnimationFrame
    let animId;
    const updateInertia = () => {
      animId = requestAnimationFrame(updateInertia);
      // Linear interpolation (lerp)
      imgPos.current.x += (mousePos.current.x - imgPos.current.x) * 0.12;
      imgPos.current.y += (mousePos.current.y - imgPos.current.y) * 0.12;

      if (floatImgRef.current) {
        floatImgRef.current.style.transform = `translate3d(${imgPos.current.x + 25}px, ${imgPos.current.y - 140}px, 0)`;
      }
    };
    updateInertia();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#0a0a09',
        color: '#f8f6f0',
        padding: '12vh 6vw',
        overflow: 'hidden',
      }}
    >
      {/* Floating Image Following Mouse with Smooth Inertia */}
      <div
        ref={floatImgRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '380px',
          height: '240px',
          borderRadius: '2px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 80,
          opacity: activeService ? 1 : 0,
          transform: 'translate3d(-500px, -500px, 0)',
          transition: 'opacity 0.4s var(--ease-expo), transform 0.08s linear',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {activeService && (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${activeService.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
      </div>

      {/* Section Header */}
      <div style={{ marginBottom: '60px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            display: 'block',
            marginBottom: '10px',
          }}
        >
          CORE DISCIPLINES • 05
        </span>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(40px, 6vw, 84px)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          WHAT WE CREATE
        </h2>
      </div>

      {/* Editorial Interactive List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {SERVICES.map((service) => {
          const isHovered = activeService?.num === service.num;

          return (
            <div
              key={service.num}
              onMouseEnter={() => setActiveService(service)}
              onMouseLeave={() => setActiveService(null)}
              onClick={() => {
                const el = document.querySelector('#contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="service-row-item"
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '80px 1fr 60px',
                alignItems: 'center',
                padding: '36px 0',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'background-color 0.3s ease',
              }}
            >
              {/* Expanding Thin Line */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  width: isHovered ? '100%' : '0%',
                  height: '1px',
                  backgroundColor: 'var(--color-accent-gold)',
                  transition: 'width 0.45s var(--ease-expo)',
                  zIndex: 2,
                }}
              />

              {/* LEFT: Service Number */}
              <span
                style={{
                  fontSize: '14px',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.2em',
                  color: isHovered ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'color 0.3s ease',
                }}
              >
                {service.num}
              </span>

              {/* CENTER: Title & Short Detail */}
              <div
                style={{
                  transform: isHovered ? 'translateX(10px)' : 'translateX(0px)',
                  transition: 'transform 0.4s var(--ease-expo)',
                }}
              >
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(24px, 3.8vw, 48px)',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    color: isHovered ? '#ffffff' : 'rgba(244, 241, 234, 0.88)',
                    margin: '0 0 6px 0',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-text-muted)',
                    margin: 0,
                    maxWidth: '560px',
                    lineHeight: 1.5,
                  }}
                >
                  {service.desc}
                </p>
              </div>

              {/* RIGHT: Arrow */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  transform: isHovered ? 'translateX(15px)' : 'translateX(0px)',
                  transition: 'transform 0.4s var(--ease-expo), color 0.3s ease',
                  color: isHovered ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.4)',
                }}
              >
                <ArrowRight size={22} strokeWidth={1.5} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
