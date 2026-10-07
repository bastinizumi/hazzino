/**
 * HAZZINO INTERIORS — THE CULINARY ATELIER
 * Section 04 — Full-viewport live 3D interactive kitchen showroom.
 * Scroll-pinned, with Three.js canvas filling the entire section.
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KitchenViewer from './kitchen/KitchenViewer';

gsap.registerPlugin(ScrollTrigger);

export default function KitchenSection() {
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section while user scrolls through 200vh of content
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        scrub: false,
        pin: true,
        anticipatePin: 1,
      });

      // Fade the gradient overlay out as user "enters" the section
      gsap.fromTo(
        overlayRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=10%',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="kitchen"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0c0f0d',
      }}
    >
      {/* Full-viewport 3D Kitchen Viewer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        <KitchenViewer />
      </div>

      {/* Cinematic entry vignette — fades out on scroll */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 55%, transparent 45%, rgba(12,15,13,0.55) 80%, rgba(12,15,13,0.9) 100%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
