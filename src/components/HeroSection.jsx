import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({ onExplore, onStartProject }) {
  const sectionRef = useRef(null);
  const bgLayerRef = useRef(null);
  const midLayerRef = useRef(null);
  const textWrapRef = useRef(null);
  const labelRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Page Load Camera Movement Timeline
      // Camera starts slightly far and glides forward into the room (scale 1 -> 1.12)
      // Background architecture moves slightly slower, foreground elements move slightly faster
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Ambient camera dolly push
      loadTl.fromTo(
        bgLayerRef.current,
        { scale: 1.0, transformOrigin: '50% 62%' },
        { scale: 1.12, duration: 3.4, ease: 'sine.out' }
      );

      // Multiplane subtle parallax push
      if (midLayerRef.current) {
        loadTl.fromTo(
          midLayerRef.current,
          { scale: 1.02, y: 15 },
          { scale: 1.14, y: 0, duration: 3.4, ease: 'sine.out' },
          0
        );
      }

      // 2. Sequential Text Entrance:
      // Sequence:
      // 1. Room appears (done above)
      // 2. Small label fades upward
      // 3. HAZZINO reveals using masked text
      // 4. INTERIORS follows
      // 5. tagline appears
      // 6. CTA appears last
      // Use 0.08–0.12 stagger
      loadTl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' },
        0.8
      );

      loadTl.fromTo(
        title1Ref.current,
        { y: '115%' },
        { y: '0%', duration: 1.3, ease: 'power4.out' },
        0.92
      );

      loadTl.fromTo(
        title2Ref.current,
        { y: '115%' },
        { y: '0%', duration: 1.3, ease: 'power4.out' },
        1.04
      );

      loadTl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' },
        1.35
      );

      loadTl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
        1.55
      );

      loadTl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0, ease: 'power2.out' },
        1.8
      );

      // 3. Scroll-Controlled Scrub Animation:
      // On user scroll:
      // Hero image scales slightly larger (1.12 -> 1.25)
      // Text moves upward
      // Hero content fades
      // Camera travels forward continuously
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(bgLayerRef.current, {
          scale: 1.24,
          y: -60,
          ease: 'none',
        })
        .to(
          textWrapRef.current,
          {
            y: -140,
            opacity: 0,
            ease: 'power2.in',
          },
          0
        )
        .to(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            y: -30,
            ease: 'power1.in',
          },
          0
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0a0a09',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Architectural Layer */}
      <div
        ref={bgLayerRef}
        style={{
          position: 'absolute',
          inset: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: 'url(/assets/hero_showroom.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 62%',
          willChange: 'transform',
        }}
      />

      {/* Cinematic Depth & Lighting Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(10, 10, 9, 0.25) 0%, rgba(10, 10, 9, 0.65) 75%, rgba(10, 10, 9, 0.88) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero Typography Content */}
      <div
        ref={textWrapRef}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          width: '90vw',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '-3vh',
        }}
      >
        {/* Small Top Label */}
        <div
          ref={labelRef}
          style={{
            fontSize: 'clamp(10px, 1.2vw, 12px)',
            fontWeight: 500,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            marginBottom: '20px',
            opacity: 0,
          }}
        >
          EST. 2026 • THENI
        </div>

        {/* Main Brand Heading with Masked Reveal */}
        <h1
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 0 24px 0',
            lineHeight: 0.95,
          }}
        >
          <span className="mask-wrap" style={{ overflow: 'hidden', paddingBottom: '4px' }}>
            <span
              ref={title1Ref}
              className="mask-inner font-serif"
              style={{
                fontSize: 'clamp(52px, 11vw, 140px)',
                letterSpacing: '0.12em',
                fontWeight: 400,
                color: '#ffffff',
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              HAZZINO
            </span>
          </span>
          <span className="mask-wrap" style={{ overflow: 'hidden', paddingBottom: '4px' }}>
            <span
              ref={title2Ref}
              className="mask-inner font-serif"
              style={{
                fontSize: 'clamp(44px, 9.5vw, 120px)',
                letterSpacing: '0.22em',
                fontWeight: 300,
                color: 'var(--color-text-cream)',
                opacity: 0.92,
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              INTERIORS
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(14px, 1.8vw, 19px)',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.08em',
            lineHeight: 1.6,
            color: 'rgba(244, 241, 234, 0.85)',
            marginBottom: '40px',
            opacity: 0,
            maxWidth: '560px',
          }}
        >
          <div>Transforming Spaces.</div>
          <div>Creating Better Living.</div>
        </div>

        {/* Call to Actions */}
        <div
          ref={ctaRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '18px',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0,
          }}
        >
          <button
            onClick={() => {
              if (onExplore) onExplore();
              else {
                const el = document.querySelector('#world');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-magnetic solid-white"
          >
            <span>EXPLORE OUR SPACES</span>
            <ArrowUpRight size={14} />
          </button>

          <button
            onClick={() => {
              if (onStartProject) onStartProject();
              else {
                const el = document.querySelector('#contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-magnetic"
          >
            <span>START YOUR PROJECT</span>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Indicator with Continuous Downward Flowing Line */}
      <div
        ref={scrollIndicatorRef}
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          SCROLL TO EXPLORE
        </span>
        <div
          style={{
            width: '1px',
            height: '48px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            className="anim-scroll-line"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--color-accent-gold)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
