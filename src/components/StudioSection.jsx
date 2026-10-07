import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StudioSection() {
  const sectionRef = useRef(null);
  const largeImgRef = useRef(null);
  const smallImgRef = useRef(null);
  const textColRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.2,
        },
      });

      // Large image starts slightly zoomed and scales down
      tl.fromTo(
        largeImgRef.current,
        { scale: 1.15, y: -20 },
        { scale: 1.0, y: 30, ease: 'none' },
        0
      );

      // Text enters from left
      tl.fromTo(
        textColRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Small image enters from right with distinct parallax offset
      tl.fromTo(
        smallImgRef.current,
        { x: 60, y: 40, opacity: 0 },
        { x: 0, y: -40, opacity: 1, ease: 'none' },
        0.1
      );

      // Architectural line draws between them
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, ease: 'power2.inOut' },
        0.2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="studio"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '120vh',
        backgroundColor: '#f8f6f0',
        color: '#121110',
        padding: '14vh 6vw',
        overflow: 'hidden',
      }}
    >
      {/* Top Editorial Label */}
      <div style={{ marginBottom: '28px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-bronze)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          THE ATELIER • 06
        </span>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(28px, 4vw, 54px)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          THE STUDIO
        </h2>
      </div>

      {/* Thin Architectural Drawing Line */}
      <div
        ref={lineRef}
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(20, 20, 20, 0.15)',
          marginBottom: '50px',
        }}
      />

      {/* Architecture Magazine Composition */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '30px',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Left Editorial Statement (Columns 1-5) */}
        <div
          ref={textColRef}
          style={{
            gridColumn: '1 / span 5',
            zIndex: 10,
          }}
        >
          <h3
            className="font-serif"
            style={{
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              margin: '0 0 24px 0',
              color: '#121110',
            }}
          >
            WE DESIGN<br />
            SPACES THAT<br />
            FEEL LIKE HOME.
          </h3>
          <p
            style={{
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              lineHeight: 1.8,
              color: '#524e46',
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              maxWidth: '460px',
              margin: '0 0 32px 0',
            }}
          >
            Hazzino Interiors creates thoughtful environments through architecture, furniture, material, lighting and detail.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '40px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(20, 20, 20, 0.1)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#121110' }}>14+</div>
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a756c' }}>
                YEARS MASTERY
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#121110' }}>180+</div>
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a756c' }}>
                SPACES DELIVERED
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#121110' }}>100%</div>
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a756c' }}>
                BESPOKE CRAFT
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Large Studio Main Image (Columns 6-12) */}
        <div
          style={{
            gridColumn: '6 / span 7',
            height: 'clamp(380px, 60vh, 680px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div
            ref={largeImgRef}
            style={{
              position: 'absolute',
              inset: '-8%',
              width: '116%',
              height: '116%',
              backgroundImage: 'url(/assets/studio_main.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              willChange: 'transform',
            }}
          />
        </div>

        {/* Floating Small Architectural Image Overlapping with Parallax */}
        <div
          ref={smallImgRef}
          style={{
            position: 'absolute',
            bottom: '-40px',
            right: '4vw',
            width: 'clamp(200px, 24vw, 320px)',
            height: 'clamp(180px, 20vw, 260px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            border: '8px solid #f8f6f0',
            overflow: 'hidden',
            zIndex: 15,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/assets/chair_closeup.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>
    </section>
  );
}
