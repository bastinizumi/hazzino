import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onScrollTop }) {
  const scrollToTop = () => {
    if (onScrollTop) onScrollTop();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#0a0a09',
        color: '#f8f6f0',
        padding: '10vh 6vw 6vh 6vw',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
        }}
      >
        {/* Col 1: Brand */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            HAZZINO
          </div>
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
              marginBottom: '20px',
            }}
          >
            INTERIORS • THENI
          </div>
          <p
            style={{
              fontSize: '12px',
              lineHeight: 1.8,
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-sans)',
              maxWidth: '300px',
            }}
          >
            A high-end interior architecture practice designing timeless living spaces, executive commercial sanctuaries, and custom furniture.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '18px' }}>
            EXPLORE
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
            {['WORK', 'STUDIO', 'SERVICES', 'MATERIALS', 'FURNITURE', 'CONFIGURATOR'].map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  style={{
                    color: 'rgba(244, 241, 234, 0.8)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--color-accent-gold)')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(244, 241, 234, 0.8)')}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Studio Coordinates */}
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '18px' }}>
            HEADQUARTERS
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
            Hazzino Architecture Atelier<br />
            Main Commercial Corridor<br />
            Theni, Tamil Nadu 625531<br />
            India
          </div>
        </div>

        {/* Col 4: Scroll Top */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '18px' }}>
              DIRECT INQUIRIES
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              atelier@hazzinointeriors.com<br />
              +91 98420 12345
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-magnetic"
            style={{
              padding: '12px 20px',
              fontSize: '9px',
              marginTop: '20px',
            }}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '30px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.4)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span>© {new Date().getFullYear()} HAZZINO INTERIORS. ALL RIGHTS RESERVED.</span>
        <span>CINEMATIC ARCHITECTURAL SHOWROOM</span>
      </div>
    </footer>
  );
}
