import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail, ArrowDown, MapPin, Code2 } from 'lucide-react';

const TITLES = [
  'Full Stack Developer',
  'MERN Stack Developer',
  'JavaScript Developer',
  'Web Application Developer',
];

const Hero = ({ setActiveSection }) => {
  const [text, setText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const currentTitle = TITLES[titleIndex];
    let timer;
    if (isDeleting) {
      timer = setTimeout(() => setText(currentTitle.substring(0, text.length - 1)), 45);
    } else {
      timer = setTimeout(() => setText(currentTitle.substring(0, text.length + 1)), 95);
    }
    if (!isDeleting && text === currentTitle) timer = setTimeout(() => setIsDeleting(true), 2400);
    else if (isDeleting && text === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % TITLES.length);
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, titleIndex]);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-inner container">

        {/* Left Content */}
        <div className={`hero-content ${mounted ? 'hero-content--visible' : ''}`}>
          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>
            <span className="eyebrow-text">Open to Work — Actively Seeking Opportunities</span>
          </div>

          <h1 className="hero-name">
            Devadharsan <span className="gradient-text hero-initials">J E</span>
          </h1>

          <div className="hero-role-line">
            <span className="role-prefix">I&apos;m a </span>
            <span className="typewriter-text">{text}</span>
            <span className="typewriter-cursor">|</span>
          </div>

          <p className="hero-description">
            Aspiring Junior Full Stack Developer with a strong foundation in the{' '}
            <span className="inline-badge">MERN Stack</span>. Passionate about building
            clean, responsive web applications and eager to contribute to a dynamic team from day one.
          </p>

          <div className="hero-location">
            <MapPin size={14} />
            <span>India &nbsp;·&nbsp; Remote / On-Site</span>
            <span className="hero-edu">
              <Code2 size={14} />
              B.E. Computer Science &amp; Engineering (2026)
            </span>
          </div>

          <div className="hero-cta">
            <button onClick={() => scrollTo('about')} className="btn btn-primary hero-btn-primary">
              View My Skills
              <ArrowRight size={17} />
            </button>
            <button onClick={() => scrollTo('contact')} className="btn btn-secondary hero-btn-secondary">
              Hire Me
              <Mail size={17} />
            </button>
          </div>

          <div className="hero-social">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-chip" title="GitHub">
              <Github size={17} />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/deva-dharsan/" target="_blank" rel="noopener noreferrer" className="social-chip" title="LinkedIn">
              <Linkedin size={17} />
              <span>LinkedIn</span>
            </a>
            <a href="mailto:devadharshan.pro@gmail.com" className="social-chip" title="Email">
              <Mail size={17} />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Right Visual */}
        <div className={`hero-visual ${mounted ? 'hero-visual--visible' : ''}`}>
          <div className="hero-card glass-panel">
            <div className="hc-header">
              <div className="hc-dots">
                <span style={{ background: '#f43f5e' }}></span>
                <span style={{ background: '#f59e0b' }}></span>
                <span style={{ background: '#10b981' }}></span>
              </div>
              <span className="hc-filename">devadharsan.js</span>
            </div>
            <pre className="hc-code">
              <code>
{`const developer = {
  name: "Devadharsan J E",
  role: "Full Stack Developer",
  stack: ["React", "Node.js",
          "Express", "MongoDB"],
  degree: "B.E. CSE (2026)",
  status: "Open to Work 🚀",
  passions: [
    "Clean Code",
    "Problem Solving",
    "New Technologies"
  ],
  available: true,
};`}
              </code>
            </pre>

            <div className="hc-footer">
              <div className="hc-stat">
                <span className="hcs-val">MERN</span>
                <span className="hcs-label">Core Stack</span>
              </div>
              <div className="hc-divider"></div>
              <div className="hc-stat">
                <span className="hcs-val">2026</span>
                <span className="hcs-label">Graduating</span>
              </div>
              <div className="hc-divider"></div>
              <div className="hc-stat">
                <span className="hcs-val" style={{ color: 'var(--color-success)' }}>●&nbsp;Open</span>
                <span className="hcs-label">to Work</span>
              </div>
            </div>
          </div>

          {/* Floating Tech Badges */}
          <div className="float-badge float-badge--tl">React.js</div>
          <div className="float-badge float-badge--tr">Node.js</div>
          <div className="float-badge float-badge--bl">MongoDB</div>
          <div className="float-badge float-badge--br">Express</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button className="scroll-indicator" onClick={() => scrollTo('about')}>
        <ArrowDown size={14} />
        <span>Scroll</span>
      </button>

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          position: relative;
          padding-top: var(--navbar-height);
        }
        .hero-inner {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 5rem;
          padding-top: 4rem;
          padding-bottom: 5rem;
        }

        /* ---- Left Content ---- */
        .hero-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hero-content--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-accent);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .eyebrow-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 10px var(--color-accent);
          animation: pulseGlow 2s infinite;
        }
        .eyebrow-text { color: var(--text-secondary); }

        .hero-name {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        .hero-initials {
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
        }

        .hero-role-line {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 2vw, 1.35rem);
          font-weight: 500;
          color: var(--text-secondary);
          min-height: 2rem;
        }
        .role-prefix { color: var(--text-muted); }
        .typewriter-text { color: var(--color-primary); }
        .typewriter-cursor {
          color: var(--color-accent);
          font-weight: 300;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        .hero-description {
          font-family: 'Inter', sans-serif;
          font-size: 0.97rem;
          line-height: 1.78;
          color: var(--text-secondary);
          max-width: 500px;
        }
        .inline-badge {
          display: inline-block;
          padding: 0.1rem 0.55rem;
          background: rgba(14, 165, 233, 0.12);
          border: 1px solid rgba(14, 165, 233, 0.25);
          border-radius: 4px;
          color: var(--color-primary);
          font-family: var(--font-mono);
          font-size: 0.88em;
          font-weight: 600;
        }

        .hero-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .hero-edu {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-left: 0.75rem;
          padding-left: 0.75rem;
          border-left: 1px solid rgba(255,255,255,0.1);
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero-btn-primary {
          padding: 0.85rem 2rem;
          font-size: 0.95rem;
        }
        .hero-btn-secondary {
          padding: 0.85rem 1.75rem;
          font-size: 0.95rem;
        }

        .hero-social {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .social-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-normal);
          font-family: var(--font-display);
        }
        .social-chip:hover {
          color: var(--text-primary);
          background: rgba(14, 165, 233, 0.1);
          border-color: rgba(14, 165, 233, 0.3);
          transform: translateY(-2px);
        }

        /* ---- Right Visual ---- */
        .hero-visual {
          flex: 0.9;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s;
        }
        .hero-visual--visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Code Card */
        .hero-card {
          width: 100%;
          max-width: 400px;
          border-radius: var(--border-radius-md) !important;
          overflow: hidden;
          border: 1px solid rgba(14, 165, 233, 0.15) !important;
          box-shadow: var(--shadow-lg), 0 0 40px rgba(14, 165, 233, 0.08);
          animation: float 7s ease-in-out infinite;
        }
        .hc-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hc-dots {
          display: flex;
          gap: 6px;
        }
        .hc-dots span {
          width: 11px; height: 11px;
          border-radius: 50%;
          display: block;
        }
        .hc-filename {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 0.25rem;
        }
        .hc-code {
          padding: 1.5rem 1.5rem;
          background: rgba(5, 13, 26, 0.6);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          line-height: 1.7;
          color: var(--text-secondary);
          white-space: pre-wrap;
          overflow: hidden;
        }
        .hc-code code {
          color: var(--text-secondary);
        }
        .hc-footer {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1rem 1.25rem;
          background: rgba(0, 0, 0, 0.15);
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .hc-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
        }
        .hcs-val {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .hcs-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .hc-divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.06);
        }

        /* Floating badges */
        .float-badge {
          position: absolute;
          padding: 0.4rem 0.9rem;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: 50px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-accent);
          backdrop-filter: blur(10px);
          white-space: nowrap;
        }
        .float-badge--tl {
          top: -10px; left: -20px;
          animation: float 5s ease-in-out infinite;
        }
        .float-badge--tr {
          top: 20px; right: -25px;
          animation: float 6.5s ease-in-out infinite reverse;
        }
        .float-badge--bl {
          bottom: 30px; left: -30px;
          animation: float 7.5s ease-in-out infinite 1s;
        }
        .float-badge--br {
          bottom: -5px; right: -10px;
          animation: float 5.5s ease-in-out infinite reverse 0.5s;
        }

        /* Scroll Indicator */
        .scroll-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color var(--transition-fast);
          animation: bounce 2.5s ease-in-out infinite;
        }
        .scroll-indicator:hover { color: var(--color-primary); }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }

        @media (max-width: 1024px) {
          .hero-inner {
            flex-direction: column;
            gap: 3.5rem;
            padding-top: 5rem;
            text-align: center;
          }
          .hero-content { align-items: center; }
          .hero-description { text-align: center; }
          .hero-location { justify-content: center; }
          .hero-edu { margin-left: 0.5rem; padding-left: 0.5rem; }
          .hero-cta { justify-content: center; }
          .hero-social { justify-content: center; }
          .hero-visual { width: 100%; max-width: 420px; }
          .float-badge--tl, .float-badge--tr,
          .float-badge--bl, .float-badge--br { display: none; }
        }
        @media (max-width: 480px) {
          .hero-cta { flex-direction: column; }
          .hero-btn-primary, .hero-btn-secondary { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
