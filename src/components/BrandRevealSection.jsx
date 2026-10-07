import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function BrandRevealSection({ onStartProject }) {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const overlayRef = useRef(null);
  const titleHazzinoRef = useRef(null);
  const titleInteriorsRef = useRef(null);
  const taglineRef = useRef(null);
  const bottomMetaRef = useRef(null);
  const ctaBtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned cinematic grand finale reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Room begins slightly blurred, camera dollies forward, sharpens
      tl.fromTo(
        bgRef.current,
        { scale: 1.0, filter: 'blur(12px) brightness(0.9)' },
        { scale: 1.14, filter: 'blur(0px) brightness(1.04)', ease: 'none', duration: 2 },
        0
      );

      // 2. Soft white overlay covers approximately 30% initially, then slowly fades
      tl.fromTo(
        overlayRef.current,
        { opacity: 0.38 },
        { opacity: 0.12, duration: 1.6, ease: 'power2.inOut' },
        0.2
      );

      // 3. HAZZINO text appears
      tl.fromTo(
        titleHazzinoRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.3
      );

      // 4. INTERIORS appears with slight letter spacing expansion
      tl.fromTo(
        titleInteriorsRef.current,
        { opacity: 0, y: 24, letterSpacing: '0.15em' },
        { opacity: 0.95, y: 0, letterSpacing: '0.35em', duration: 0.8, ease: 'power3.out' },
        0.5
      );

      // 5. Tagline appears underneath
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.7
      );

      // 6. Bottom location and Final CTA appear last
      tl.fromTo(
        bottomMetaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        1.0
      );

      tl.fromTo(
        ctaBtnRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
        1.2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="reveal"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Bright Sunlit Living Room Pavilion */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: '-6%',
          width: '112%',
          height: '112%',
          backgroundImage: 'url(/assets/final_reveal.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          willChange: 'transform, filter',
        }}
      />

      {/* Soft White Ambient Architectural Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#ffffff',
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      />

      {/* Subtle radial focus vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(248, 246, 240, 0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Centered Large Typography Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '1000px',
          width: '90vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          ref={titleHazzinoRef}
          className="font-serif"
          style={{
            fontSize: 'clamp(54px, 11vw, 136px)',
            fontWeight: 400,
            letterSpacing: '0.12em',
            color: '#121110',
            lineHeight: 0.95,
            textShadow: '0 2px 20px rgba(255, 255, 255, 0.8)',
          }}
        >
          HAZZINO
        </div>

        <div
          ref={titleInteriorsRef}
          className="font-serif"
          style={{
            fontSize: 'clamp(28px, 5.5vw, 68px)',
            fontWeight: 300,
            color: '#262422',
            textTransform: 'uppercase',
            margin: '8px 0 24px 0',
            textShadow: '0 2px 20px rgba(255, 255, 255, 0.8)',
          }}
        >
          INTERIORS
        </div>

        <div
          ref={taglineRef}
          style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(17px, 2.2vw, 26px)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: '#444038',
            maxWidth: '520px',
            marginBottom: '40px',
          }}
        >
          <div>Transforming Spaces.</div>
          <div>Creating Better Living.</div>
        </div>
      </div>

      {/* Bottom Architectural Location & CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: '8vh',
          left: '6vw',
          right: '6vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div
          ref={bottomMetaRef}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#121110',
          }}
        >
          THENI • TAMIL NADU
        </div>

        <button
          ref={ctaBtnRef}
          onClick={() => {
            if (onStartProject) onStartProject();
            else {
              const el = document.querySelector('#contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="btn-magnetic"
          style={{
            backgroundColor: '#121110',
            color: '#ffffff',
            borderColor: '#121110',
            padding: '16px 36px',
          }}
        >
          <span>START YOUR PROJECT</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
