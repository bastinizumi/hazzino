import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorldSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const numberRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin section for a smooth cinematic camera journey through the ivory archway
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=160%',
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. ENTER ANIMATION:
      // Image slowly scales from 1.05 to 1.0, filter sharpens
      // Small number appears
      // Heading enters physically from the left
      // Architectural line draws horizontally
      // Paragraph enters from below
      // Set initial state immediately so image is visible before scroll
      gsap.set(bgRef.current, { scale: 1.08, filter: 'blur(3px) brightness(0.9)' });

      tl.fromTo(
        bgRef.current,
        { scale: 1.08, filter: 'blur(3px) brightness(0.9)' },
        { scale: 1.0, filter: 'blur(0px) brightness(1.0)', ease: 'none', duration: 1 },
        0
      )
        .fromTo(
          numberRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
          0.15
        )
        .fromTo(
          headingRef.current,
          { x: '-80%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 1.0, ease: 'power3.out' },
          0.1
        )
        .fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
          0.4
        )
        .fromTo(
          paragraphRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0.45
        );

      // 2. ACTIVE EXPERIENCE PAUSE IN SCRUB (Hold moment)
      tl.to({}, { duration: 0.5 });

      // 3. EXIT ANIMATION:
      // Scale the room slightly, move camera forward into the next room without hard boundary
      tl.to(bgRef.current, {
        scale: 1.15,
        y: -40,
        filter: 'brightness(0.9)',
        ease: 'none',
        duration: 1,
      })
        .to(
          contentRef.current,
          {
            y: -80,
            opacity: 0,
            ease: 'power2.in',
            duration: 0.8,
          },
          '<0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="world"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0a0a09',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Cinematic Ivory Architectural Background */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: '-6%',
          width: '112%',
          height: '112%',
          backgroundImage: 'url(/assets/world_interior.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          willChange: 'transform, filter',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Warm Ambient Architectural Vignette — left-heavy so text stays readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(10, 10, 9, 0.75) 0%, rgba(10, 10, 9, 0.35) 55%, rgba(10, 10, 9, 0.10) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom gradient fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,9,0.55) 0%, transparent 40%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Content Layout */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          paddingLeft: 'max(6vw, 40px)',
          paddingRight: 'max(6vw, 40px)',
          maxWidth: '820px',
        }}
      >
        {/* Small Tag */}
        <div
          ref={numberRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            marginBottom: '28px',
          }}
        >
          <span style={{ width: '28px', height: '1px', backgroundColor: 'var(--color-accent-gold)' }} />
          <span>HAZZINO INTERIORS / 01</span>
        </div>

        {/* Large Editorial Heading */}
        <h2
          ref={headingRef}
          className="font-serif"
          style={{
            fontSize: 'clamp(46px, 7.5vw, 96px)',
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: '0.04em',
            color: '#ffffff',
            margin: '0 0 28px 0',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          SPACES<br />
          DESIGNED<br />
          TO BE LIVED.
        </h2>

        {/* Thin Architectural Drawing Line */}
        <div
          ref={lineRef}
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.35)',
            marginBottom: '28px',
          }}
        />

        {/* Paragraph */}
        <p
          ref={paragraphRef}
          style={{
            fontSize: 'clamp(15px, 1.4vw, 19px)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            lineHeight: 1.8,
            letterSpacing: '0.02em',
            color: 'rgba(244, 241, 234, 0.88)',
            maxWidth: '540px',
          }}
        >
          We create thoughtful interiors where architecture, furniture, material and light work together to create spaces that feel personal, functional and timeless.
        </p>
      </div>
    </section>
  );
}
