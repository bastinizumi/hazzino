import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WorldSection from './components/WorldSection';
import DetailsSection from './components/DetailsSection';
import KitchenSection from './components/KitchenSection';
import HomeInteriorsSection from './components/HomeInteriorsSection';
import ConfiguratorSection from './components/ConfiguratorSection';
import ProjectsSection from './components/ProjectsSection';
import MaterialLibrarySection from './components/MaterialLibrarySection';
import ServicesSection from './components/ServicesSection';
import StudioSection from './components/StudioSection';
import BrandRevealSection from './components/BrandRevealSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

import InteractiveShowroom from './components/showroom/InteractiveShowroom';
import { SHOWROOM_ROOMS } from './data/showroomData';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef(null);
  const [activeShowroomRoom, setActiveShowroomRoom] = useState(null);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scrolling for buttery 60fps cinematic camera inertia
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger ticker
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#showroom')) {
        const roomId = hash.replace('#showroom-', '').replace('#showroom', '') || 'living';
        const matched = SHOWROOM_ROOMS.find((r) => r.id === roomId) || SHOWROOM_ROOMS[0];
        setActiveShowroomRoom(matched);
        if (lenisRef.current) lenisRef.current.stop();
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleNavigate = (target) => {
    if (target.startsWith('#showroom')) {
      const roomId = target.replace('#showroom-', '').replace('#showroom', '') || 'living';
      const matched = SHOWROOM_ROOMS.find((r) => r.id === roomId) || SHOWROOM_ROOMS[0];
      setActiveShowroomRoom(matched);
      if (lenisRef.current) lenisRef.current.stop();
      return;
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.6 });
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hazzino-master-app" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Cinematic Film Grain & Ambient Lighting Vignette */}
      <div className="cinema-grain" aria-hidden="true" />
      <div className="cinema-vignette" aria-hidden="true" />

      {/* Floating Navigation System */}
      <Navbar onNavigate={handleNavigate} />

      {/* 01. HERO SECTION: Living Room Showroom Camera Push */}
      <HeroSection
        onExplore={() => handleNavigate('#showroom')}
        onStartProject={() => handleNavigate('#contact')}
      />

      {/* 02. SECOND SECTION: Enter the World of Hazzino */}
      <WorldSection />

      {/* 03. FURNITURE CLOSE-UP: Details Matter (Lounge Chair & 4 Hotspots) */}
      <DetailsSection />

      {/* 04. INTERACTIVE KITCHEN SHOWROOM: Deep Green Joinery & 5 Hotspots */}
      <KitchenSection />

      {/* 05. HOME INTERIORS: Cinematic Room Walkthrough (Living → Kitchen → Bedroom → Dining → Bath) */}
      <HomeInteriorsSection
        onSelectRoom={(room) => {
          // Find matching showroom room configuration or fallback to first
          const matched =
            SHOWROOM_ROOMS.find((r) => r.id === room.id) || SHOWROOM_ROOMS[0];
          setActiveShowroomRoom(matched);
          if (lenisRef.current) {
            lenisRef.current.stop();
          }
        }}
      />

      {/* 06. PREMIUM CONFIGURATOR: 360° 3D Interactive Chair & Ivory Sliding Panel */}
      <ConfiguratorSection />

      {/* 07. SELECTED SPACES: Layered Project Panels with Stacked Tilt */}
      <ProjectsSection />

      {/* 08. INTERACTIVE MATERIAL LIBRARY: Wood, Stone, Fabric, Metal, Glass */}
      <MaterialLibrarySection />

      {/* 09. SERVICES SECTION: What We Create (Interactive List with Inertia Previews) */}
      <ServicesSection />

      {/* 10. THE STUDIO / ABOUT: Architectural Magazine Spread */}
      <StudioSection />

      {/* 11. FINAL BRAND REVEAL: Sunlit Living Vista & Master Serif Reveal */}
      <BrandRevealSection onStartProject={() => handleNavigate('#contact')} />

      {/* 12. CONTACT SECTION: Minimal Architectural Enquiry & MongoDB Persistence */}
      <ContactSection />

      {/* FOOTER: Studio Coordinates & Back to Top */}
      <Footer onScrollTop={() => handleNavigate('#hero')} />

      {/* UPGRADED 3D INTERACTIVE SHOWROOM EXPERIENCE */}
      <InteractiveShowroom
        isOpen={Boolean(activeShowroomRoom)}
        initialRoom={activeShowroomRoom}
        onClose={() => {
          setActiveShowroomRoom(null);
          if (lenisRef.current) {
            lenisRef.current.start();
          }
        }}
        onStartProject={() => {
          setActiveShowroomRoom(null);
          if (lenisRef.current) {
            lenisRef.current.start();
          }
          handleNavigate('#contact');
        }}
      />
    </div>
  );
}
