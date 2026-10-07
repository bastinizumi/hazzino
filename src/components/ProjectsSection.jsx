import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    num: '01',
    title: 'MODERN RESIDENCE',
    location: 'THENI',
    year: '2026',
    image: '/assets/hero_showroom.jpg',
    scope: 'Architectural Renovation & Bespoke Furnishing',
    area: '6,400 SQ.FT',
  },
  {
    num: '02',
    title: 'CONTEMPORARY VILLA',
    location: 'MADURAI',
    year: '2026',
    image: '/assets/world_interior.jpg',
    scope: 'Turnkey Luxury Interior & Lighting Design',
    area: '8,200 SQ.FT',
  },
  {
    num: '03',
    title: 'EXECUTIVE OFFICE',
    location: 'COIMBATORE',
    year: '2026',
    image: '/assets/office_interior.jpg',
    scope: 'Commercial Headquarters & Executive Lounges',
    area: '12,500 SQ.FT',
  },
  {
    num: '04',
    title: 'LUXURY APARTMENT',
    location: 'CHENNAI',
    year: '2026',
    image: '/assets/room_bedroom.jpg',
    scope: 'Penthouse Joinery & Material Selection',
    area: '4,800 SQ.FT',
  },
  {
    num: '05',
    title: 'MINIMAL LIVING',
    location: 'THENI',
    year: '2026',
    image: '/assets/final_reveal.jpg',
    scope: 'Open-Plan Courtyard Villa Interior',
    area: '5,100 SQ.FT',
  },
];

export default function ProjectsSection() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardRefs.current;

      // Pinned stacking showcase
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${(PROJECTS.length - 1) * 140}%`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Layered image stacking animation:
      // Each card enters from bottom, covers previous one,
      // with subtle rotation (0deg -> -1deg -> 0deg) and slow camera zoom
      cards.forEach((card, index) => {
        if (index === 0) return; // First card is already full screen

        const prevCard = cards[index - 1];

        const cardTl = gsap.timeline();

        // Previous card scales and dims slightly
        cardTl.to(
          prevCard.querySelector('.project-bg'),
          {
            scale: 1.1,
            filter: 'brightness(0.65)',
            duration: 1.2,
            ease: 'none',
          },
          0
        );

        // Next card enters from bottom with slight rotation 0deg -> -1deg -> 0deg
        cardTl.fromTo(
          card,
          {
            yPercent: 100,
            rotation: 0,
          },
          {
            yPercent: 0,
            rotation: -0.8,
            duration: 1.2,
            ease: 'power2.inOut',
          },
          0
        ).to(
          card,
          {
            rotation: 0,
            duration: 0.4,
            ease: 'power1.out',
          },
          0.8
        );

        // Slow camera zoom for current card
        cardTl.fromTo(
          card.querySelector('.project-bg'),
          { scale: 1.15 },
          { scale: 1.0, duration: 1.2, ease: 'none' },
          0.1
        );

        // Title moves smoothly upward
        cardTl.fromTo(
          card.querySelector('.project-meta'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0.3
        );

        tl.add(cardTl);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0a0a09',
      }}
    >
      {/* Top Floating Indicator */}
      <div
        style={{
          position: 'absolute',
          top: '8vh',
          left: '6vw',
          zIndex: 40,
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
            marginBottom: '6px',
          }}
        >
          CURATED PORTFOLIO
        </span>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            color: '#ffffff',
            margin: 0,
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          SELECTED SPACES
        </h2>
      </div>

      {/* Layered Project Cards */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {PROJECTS.map((proj, index) => (
          <div
            key={proj.num}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: index + 5,
              overflow: 'hidden',
              backgroundColor: '#0a0a09',
              willChange: 'transform',
            }}
          >
            {/* Background Project Photograph */}
            <div
              className="project-bg"
              style={{
                position: 'absolute',
                inset: '-4%',
                width: '108%',
                height: '108%',
                backgroundImage: `url(${proj.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform, filter',
              }}
            />

            {/* Cinematic Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(10, 10, 9, 0.4) 0%, rgba(10, 10, 9, 0.2) 40%, rgba(10, 10, 9, 0.88) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Bottom Meta & Typography */}
            <div
              className="project-meta"
              style={{
                position: 'absolute',
                bottom: '10vh',
                left: '6vw',
                right: '6vw',
                zIndex: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '24px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.35em',
                    color: 'var(--color-accent-gold)',
                    marginBottom: '10px',
                  }}
                >
                  PROJECT {proj.num} • {proj.location} • {proj.year}
                </div>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(40px, 7vw, 88px)',
                    fontWeight: 400,
                    letterSpacing: '0.06em',
                    color: '#ffffff',
                    margin: '0 0 10px 0',
                    lineHeight: 1.0,
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {proj.title}
                </h3>
                <div style={{ fontSize: '13px', color: 'rgba(244, 241, 234, 0.8)', letterSpacing: '0.08em' }}>
                  {proj.scope} • {proj.area}
                </div>
              </div>

              <button
                onClick={() => {
                  const el = document.querySelector('#contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-magnetic"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px 32px',
                }}
              >
                <span>VIEW CASE STUDY</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
