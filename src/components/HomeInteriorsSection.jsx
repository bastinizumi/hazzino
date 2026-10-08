import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROOMS = [
  {
    id: 'living',
    num: '01',
    category: 'HOME INTERIORS',
    name: 'LIVING ROOM',
    subtitle: 'Curved Bouclé Lounge & Architectural Oak Fluting',
    image: '/assets/hero_showroom.jpg',
  },
  {
    id: 'kitchen',
    num: '02',
    category: 'HOME INTERIORS',
    name: 'KITCHEN',
    subtitle: 'Forest Green Matte Lacquer & Waterfall Smoked Oak Island',
    image: '/assets/kitchen_showroom.jpg',
  },
  {
    id: 'bedroom',
    num: '03',
    category: 'HOME INTERIORS',
    name: 'BEDROOM',
    subtitle: 'Floating Platform Suite & Concealed Acoustic Timber Slats',
    image: '/assets/room_bedroom.jpg',
  },
  {
    id: 'dining',
    num: '04',
    category: 'HOME INTERIORS',
    name: 'DINING',
    subtitle: 'Monolithic Travertine Slab & Ethereal Brass Lighting',
    image: '/assets/room_dining.jpg',
  },
  {
    id: 'bathroom',
    num: '05',
    category: 'HOME INTERIORS',
    name: 'BATHROOM',
    subtitle: 'Honed Limestone Sanctuary & Freestanding Oval Bath',
    image: '/assets/room_bathroom.jpg',
  },
];

export default function HomeInteriorsSection() {
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = slideRefs.current;
      const numTransitions = ROOMS.length - 1;

      // Master pinned timeline for continuous walk-through of the home
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${numTransitions * 150}%`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * ROOMS.length),
              ROOMS.length - 1
            );
            setActiveRoomIndex(index);
          },
        },
      });

      // Chain sequential transitions between rooms:
      // Current room scales 1 -> 1.08, slides left
      // Next room enters from right with clipPath wipe and becomes full screen
      for (let i = 0; i < numTransitions; i++) {
        const currentSlide = slides[i];
        const nextSlide = slides[i + 1];

        const subTl = gsap.timeline();

        // Current slide zooms toward camera and translates left
        subTl
          .to(
            currentSlide.querySelector('.room-bg'),
            {
              scale: 1.12,
              ease: 'power1.inOut',
              duration: 1.2,
            },
            0
          )
          .to(
            currentSlide,
            {
              x: '-35%',
              opacity: 0.3,
              ease: 'power2.inOut',
              duration: 1.2,
            },
            0
          )
          // Next slide enters from right with architectural clip-path wipe
          .fromTo(
            nextSlide,
            {
              x: '100%',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              zIndex: i + 2,
            },
            {
              x: '0%',
              ease: 'power2.inOut',
              duration: 1.2,
            },
            0
          )
          .fromTo(
            nextSlide.querySelector('.room-bg'),
            {
              scale: 1.18,
            },
            {
              scale: 1.0,
              ease: 'power1.out',
              duration: 1.2,
            },
            0.1
          )
          .fromTo(
            nextSlide.querySelector('.room-info'),
            {
              y: 40,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              ease: 'power3.out',
              duration: 0.8,
            },
            0.4
          );

        tl.add(subTl);
      }
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
      {/* Slides Container */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {ROOMS.map((room, index) => (
          <div
            key={room.id}
            ref={(el) => (slideRefs.current[index] = el)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: index === 0 ? 1 : index + 1,
              transform: index === 0 ? 'translateX(0%)' : 'translateX(100%)',
              overflow: 'hidden',
              backgroundColor: '#0a0a09',
              willChange: 'transform, clip-path',
            }}
          >
            {/* Background Fullscreen Image */}
            <div
              className="room-bg"
              style={{
                position: 'absolute',
                inset: '-4%',
                width: '108%',
                height: '108%',
                backgroundImage: `url(${room.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform',
              }}
            />

            {/* Cinematic Gradient Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at center, rgba(10, 10, 9, 0.2) 0%, rgba(10, 10, 9, 0.7) 85%, rgba(10, 10, 9, 0.95) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Top-Left Counter & Category */}
            <div
              style={{
                position: 'absolute',
                top: '11vh',
                left: '6vw',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.4em',
                  color: 'var(--color-accent-gold)',
                  marginBottom: '4px',
                }}
              >
                {room.num}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.75)',
                }}
              >
                {room.category}
              </div>
            </div>

            {/* Center Room Title & Information */}
            <div
              className="room-info"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 20,
                width: '90vw',
                maxWidth: '900px',
              }}
            >
              <h3
                className="font-serif"
                style={{
                  fontSize: 'clamp(56px, 10vw, 130px)',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  color: '#ffffff',
                  margin: '0 0 16px 0',
                  lineHeight: 0.95,
                  textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
                }}
              >
                {room.name}
              </h3>
              <p
                style={{
                  fontSize: 'clamp(13px, 1.4vw, 17px)',
                  letterSpacing: '0.08em',
                  color: 'rgba(244, 241, 234, 0.85)',
                  maxWidth: '520px',
                  margin: '0 auto',
                  fontFamily: 'var(--font-editorial)',
                  fontStyle: 'italic',
                }}
              >
                {room.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots on the Right */}
      <div
        style={{
          position: 'absolute',
          right: '4vw',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {ROOMS.map((r, i) => (
          <div
            key={r.id}
            style={{
              width: activeRoomIndex === i ? '28px' : '6px',
              height: '2px',
              backgroundColor: activeRoomIndex === i ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.25)',
              transition: 'all 0.4s var(--ease-expo)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
