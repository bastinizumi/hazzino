import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, MapPin, Mail, Phone, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const submitBtnRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential Interiors',
    location: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Heading moves upward
      tl.fromTo(
        leftColRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
        0
      );

      // Form appears from right
      tl.fromTo(
        rightColRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
        0.2
      );

      // Draw input underlines from left to right
      tl.fromTo(
        '.input-draw-line',
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.8, stagger: 0.08, ease: 'power2.inOut' },
        0.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic button hover effect
  const handleBtnMouseMove = (e) => {
    if (!submitBtnRef.current) return;
    const rect = submitBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    submitBtnRef.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleBtnMouseLeave = () => {
    if (!submitBtnRef.current) return;
    submitBtnRef.current.style.transform = 'translate(0px, 0px)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save to localStorage
      const existing = JSON.parse(localStorage.getItem('hazzino_enquiries') || '[]');
      const newEnquiry = { ...formData, timestamp: new Date().toISOString() };
      existing.push(newEnquiry);
      localStorage.setItem('hazzino_enquiries', JSON.stringify(existing));

      // 2. Mock MongoDB API call
      try {
        await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEnquiry),
        });
      } catch (err) {
        // Fallback gracefully if backend API is offline
      }

      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 700);
    } catch (err) {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#121110',
        padding: '14vh 6vw',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(40px, 8vw, 100px)',
          alignItems: 'flex-start',
        }}
      >
        {/* LEFT COLUMN: Large Typography & Studio Details */}
        <div ref={leftColRef}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-bronze)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            START YOUR JOURNEY • 08
          </span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(44px, 7vw, 92px)',
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: '0.04em',
              margin: '0 0 32px 0',
              color: '#121110',
            }}
          >
            LET'S CREATE<br />
            YOUR SPACE.
          </h2>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#656056',
              maxWidth: '460px',
              fontFamily: 'var(--font-sans)',
              marginBottom: '48px',
            }}
          >
            Whether an architectural ground-up villa, an executive commercial suite, or bespoke handcrafted furniture, we would love to hear your vision.
          </p>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <MapPin size={18} color="var(--color-accent-bronze)" />
              <div style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
                Hazzino Design Studio, Main Road, Theni, Tamil Nadu 625531
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Mail size={18} color="var(--color-accent-bronze)" />
              <div style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
                atelier@hazzinointeriors.com
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Phone size={18} color="var(--color-accent-bronze)" />
              <div style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
                +91 98420 12345 / +91 94432 67890
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={18} color="var(--color-accent-bronze)" />
              <div style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
                Mon – Sat: 09:30 AM – 07:30 PM (By Appointment)
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Minimal Architectural Form */}
        <div ref={rightColRef}>
          {submitted ? (
            <div
              style={{
                padding: '60px 40px',
                border: '1px solid rgba(20, 20, 20, 0.1)',
                backgroundColor: '#f8f6f0',
                textAlign: 'center',
                animation: 'fadeInUp 0.6s var(--ease-expo)',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#121110',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                }}
              >
                <Check size={24} />
              </div>
              <h3
                className="font-serif"
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  letterSpacing: '0.12em',
                  margin: '0 0 12px 0',
                }}
              >
                THANK YOU.
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.18em',
                  color: '#555148',
                  textTransform: 'uppercase',
                  marginBottom: '28px',
                }}
              >
                YOUR PROJECT JOURNEY STARTS HERE.
              </p>
              <p style={{ fontSize: '13px', color: '#7a756c', maxWidth: '380px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
                Our principal interior architects have received your consultation enquiry. We will reach out within 24 business hours with an initial project brief.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    projectType: 'Residential Interiors',
                    location: '',
                    message: '',
                  });
                }}
                className="btn-magnetic"
                style={{
                  backgroundColor: '#121110',
                  color: '#ffffff',
                  borderColor: '#121110',
                }}
              >
                <span>SEND ANOTHER ENQUIRY</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Field 1: NAME */}
              <div style={{ position: 'relative' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#8c877d',
                    marginBottom: '8px',
                  }}
                >
                  NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ar. Rajesh Anand"
                  className="contact-field"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                    padding: '10px 0',
                    fontSize: '15px',
                    fontFamily: 'var(--font-sans)',
                    color: '#121110',
                    outline: 'none',
                  }}
                />
                <div className="input-draw-line input-focus-underline" />
              </div>

              {/* Field 2 & 3: EMAIL & PHONE in 2 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                <div style={{ position: 'relative' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#8c877d',
                      marginBottom: '8px',
                    }}
                  >
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rajesh@domain.com"
                    className="contact-field"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                      padding: '10px 0',
                      fontSize: '15px',
                      fontFamily: 'var(--font-sans)',
                      color: '#121110',
                      outline: 'none',
                    }}
                  />
                  <div className="input-draw-line input-focus-underline" />
                </div>

                <div style={{ position: 'relative' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#8c877d',
                      marginBottom: '8px',
                    }}
                  >
                    PHONE *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="contact-field"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                      padding: '10px 0',
                      fontSize: '15px',
                      fontFamily: 'var(--font-sans)',
                      color: '#121110',
                      outline: 'none',
                    }}
                  />
                  <div className="input-draw-line input-focus-underline" />
                </div>
              </div>

              {/* Field 4 & 5: PROJECT TYPE & LOCATION */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                <div style={{ position: 'relative' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#8c877d',
                      marginBottom: '8px',
                    }}
                  >
                    PROJECT TYPE
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="contact-field"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                      padding: '10px 0',
                      fontSize: '14px',
                      fontFamily: 'var(--font-sans)',
                      color: '#121110',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Residential Interiors">Residential Interiors</option>
                    <option value="Luxury Villa Renovation">Luxury Villa Renovation</option>
                    <option value="Executive Office">Executive Office</option>
                    <option value="Custom Furniture Craft">Custom Furniture Craft</option>
                    <option value="Hospitality & Institutional">Hospitality & Institutional</option>
                  </select>
                  <div className="input-draw-line input-focus-underline" />
                </div>

                <div style={{ position: 'relative' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#8c877d',
                      marginBottom: '8px',
                    }}
                  >
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Theni / Madurai / Chennai"
                    className="contact-field"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                      padding: '10px 0',
                      fontSize: '15px',
                      fontFamily: 'var(--font-sans)',
                      color: '#121110',
                      outline: 'none',
                    }}
                  />
                  <div className="input-draw-line input-focus-underline" />
                </div>
              </div>

              {/* Field 6: MESSAGE */}
              <div style={{ position: 'relative' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#8c877d',
                    marginBottom: '8px',
                  }}
                >
                  MESSAGE & SCOPE
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your spaces, approximate square footage, timeline..."
                  className="contact-field"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                    padding: '10px 0',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    color: '#121110',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
                <div className="input-draw-line input-focus-underline" />
              </div>

              {/* Submit Button with Magnetic Motion */}
              <div style={{ paddingTop: '16px' }}>
                <button
                  ref={submitBtnRef}
                  type="submit"
                  disabled={loading}
                  onMouseMove={handleBtnMouseMove}
                  onMouseLeave={handleBtnMouseLeave}
                  className="btn-magnetic"
                  style={{
                    backgroundColor: '#121110',
                    color: '#ffffff',
                    borderColor: '#121110',
                    padding: '18px 42px',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <span>{loading ? 'TRANSMITTING...' : 'START A CONVERSATION'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .input-focus-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: rgba(20, 20, 20, 0.25);
          pointer-events: none;
        }
        .contact-field:focus + .input-focus-underline {
          background-color: var(--color-accent-bronze);
          height: 2px;
        }
      `}</style>
    </section>
  );
}
