import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Download,
  Sparkles,
  Terminal,
  GraduationCap,
  Zap,
} from 'lucide-react';

const TITLES = [
  'Full Stack Developer',
  'MERN Stack Developer',
  'MEAN Stack Developer',
];

const Hero = ({ setActiveSection }) => {
  const [text, setText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Smooth typewriter effect
  useEffect(() => {
    const currentTitle = TITLES[titleIndex];
    let timer;
    if (isDeleting) {
      timer = setTimeout(() => setText(currentTitle.substring(0, text.length - 1)), 40);
    } else {
      timer = setTimeout(() => setText(currentTitle.substring(0, text.length + 1)), 85);
    }
    if (!isDeleting && text === currentTitle) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % TITLES.length);
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, titleIndex]);

  // Ambient mouse spotlight on hero section
  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const scrollTo = (id) => {
    if (setActiveSection) setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="hero-section"
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      }}
    >
      {/* Ambient background glows & tech grid */}
      <div className="hero-ambient-spotlight" />
      <div className="hero-mesh-grid" />
      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />
      <div className="hero-orb hero-orb--3" />

      <div className="hero-inner container">
        {/* Left Content */}
        <div className={`hero-content ${mounted ? 'hero-content--visible' : ''}`}>
          {/* Eyebrow Status Pill */}
          <div className="hero-eyebrow">
            <div className="eyebrow-beacon">
              <span className="eyebrow-ping" />
              <span className="eyebrow-dot" />
            </div>
            <span className="eyebrow-text">AVAILABLE FOR FULL-TIME ROLES</span>
            <Sparkles size={12} className="eyebrow-sparkle" />
          </div>

          {/* Headline Stack */}
          <div className="hero-headline-group">
            <span className="hero-greeting">// Hello World, I&apos;m</span>
            <h1 className="hero-name">
              Devadharsan <span className="gradient-text hero-initials">J E</span>
            </h1>
          </div>

          {/* Terminal-Styled Role Line */}
          <div className="hero-role-terminal">
            <div className="role-terminal-head">
              <Terminal size={14} className="role-terminal-icon" />
              {/* <span className="role-terminal-prompt">engineer:~$</span> */}
            </div>
            <div className="role-terminal-body">
              <span className="role-prefix">I am a </span>
              <span className="typewriter-text">{text}</span>
              <span className="typewriter-cursor">_</span>
            </div>
          </div>

          {/* Description */}
          <p className="hero-description">
            Passionate Junior Full Stack Developer with strong architectural fundamentals in the{' '}
            <span className="inline-badge mern">MERN Stack</span> and{' '}
            <span className="inline-badge mean">MEAN Stack</span>. Eager to engineer clean,
            responsive user interfaces, scalable REST APIs, and contribute to production workflows from day one.
          </p>

          {/* Highlights & Metadata Chips */}
          <div className="hero-meta-row">
            <div className="hero-meta-item">
              <MapPin size={13} className="meta-icon" />
              <span>India &middot; Remote / Hybrid</span>
            </div>
            <div className="hero-meta-divider" />
            <div className="hero-meta-item">
              <GraduationCap size={13} className="meta-icon" />
              <span>B.E. Computer Science (2026)</span>
            </div>
            <div className="hero-meta-divider" />
            <div className="hero-meta-item">
              <Zap size={13} className="meta-icon" />
              <span>Immediate Joiner</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta">
            <button
              onClick={() => scrollTo('projects')}
              className="btn hero-btn-primary"
              type="button"
            >
              <span>Explore My Work</span>
              <ArrowRight size={17} className="btn-arrow" />
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="btn hero-btn-secondary"
              type="button"
            >
              <Mail size={16} />
              <span>Hire Me</span>
            </button>
            <a
              href="/Devadharsan_Resume.pdf"
              download="Devadharsan_Resume.pdf"
              className="btn hero-btn-cv"
              title="Download official CV"
            >
              <Download size={16} />
              <span>Resume</span>
            </a>
          </div>

          {/* Social Presence & Copy Email */}
          <div className="hero-social">
            <a
              href="https://github.com/Deva-Dharsan"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
              title="GitHub Profile"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/deva-dharsan/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
              title="LinkedIn Profile"
            >
              <Linkedin size={16} />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&to=devadharsan.pro@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip social-chip--copy"
              title="Send email via Gmail"
            >
              <Mail size={15} />
              <span>devadharsan.pro@gmail.com</span>
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
              <span className="hc-filename">devadharsan.je</span>
            </div>
            <pre className="hc-code">
              <code>
{`const developer = {
  name: "Devadharsan J E",
  role: "Full Stack Developer",
  stacks: {
    MERN: ["MongoDB", "Express",
           "React", "Node.js"],
    MEAN: ["MongoDB", "Express",
           "Angular", "Node.js"],
  },
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
                <span className="hcs-label">Stack</span>
              </div>
              <div className="hc-divider"></div>
              <div className="hc-stat">
                <span className="hcs-val">MEAN</span>
                <span className="hcs-label">Stack</span>
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

      {/* Modern Mouse Scroll Indicator */}
      <button
        className="scroll-indicator"
        onClick={() => scrollTo('about')}
        type="button"
        aria-label="Scroll down to about section"
      >
        <div className="scroll-mouse-pill">
          <div className="scroll-mouse-wheel" />
        </div>
        <span className="scroll-text">EXPLORE WORK</span>
      </button>

      <style>{`
        /* ==========================================
           HERO SECTION & AMBIENT CANVAS
           ========================================== */
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          position: relative;
          padding-top: var(--navbar-height, 80px);
          overflow: hidden;
          background: #050d1a;
        }

        /* Ambient Cursor Spotlight */
        .hero-ambient-spotlight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(
            650px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(14, 165, 233, 0.08),
            rgba(6, 214, 160, 0.03) 40%,
            transparent 70%
          );
          transition: opacity 0.3s ease;
        }

        /* Subtle Cyber Tech Mesh Grid */
        .hero-mesh-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: 
            linear-gradient(to right, rgba(14, 165, 233, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at 50% 45%, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at 50% 45%, black 40%, transparent 80%);
        }

        /* Glowing Orbs */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
          animation: floatOrb 12s ease-in-out infinite alternate;
        }

        .hero-orb--1 {
          width: 380px;
          height: 380px;
          top: 15%;
          left: -5%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, transparent 70%);
        }

        .hero-orb--2 {
          width: 440px;
          height: 440px;
          top: 25%;
          right: -8%;
          background: radial-gradient(circle, rgba(129, 140, 248, 0.18) 0%, transparent 70%);
          animation-duration: 15s;
          animation-delay: -3s;
        }

        .hero-orb--3 {
          width: 320px;
          height: 320px;
          bottom: 10%;
          left: 40%;
          background: radial-gradient(circle, rgba(6, 214, 160, 0.14) 0%, transparent 70%);
          animation-duration: 10s;
          animation-delay: -5s;
        }

        @keyframes floatOrb {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
          100% { transform: translateY(20px) scale(0.95); }
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 4.5rem;
          padding-top: 3.5rem;
          padding-bottom: 5.5rem;
        }

        /* ==========================================
           LEFT CONTENT
           ========================================== */
        .hero-content {
          flex: 1.1;
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-content--visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Eyebrow Pill */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          align-self: flex-start;
          padding: 0.35rem 0.95rem;
          background: rgba(14, 165, 233, 0.08);
          border: 1px solid rgba(14, 165, 233, 0.25);
          border-radius: 50px;
          backdrop-filter: blur(8px);
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.1);
        }

        .eyebrow-beacon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 8px;
          height: 8px;
        }

        .eyebrow-ping {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          opacity: 0.75;
          animation: pingAnim 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        @keyframes pingAnim {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        .eyebrow-text {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #38bdf8;
          text-transform: uppercase;
        }

        .eyebrow-sparkle {
          color: #f59e0b;
          animation: spinSparkle 4s linear infinite;
        }

        @keyframes spinSparkle {
          0% { transform: rotate(0deg) scale(0.9); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(0.9); }
        }

        /* Headline */
        .hero-headline-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .hero-greeting {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.95rem;
          color: #64748b;
          letter-spacing: 0.05em;
        }

        .hero-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.3rem, 4.4vw, 3.6rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #f8fafc;
        }

        .hero-initials {
          font-family: 'Playfair Display', serif;
          background: linear-gradient(135deg, #0ea5e9 0%, #06d6a0 50%, #818cf8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 16px rgba(14, 165, 233, 0.35));
        }

        /* Terminal Role Line */
        .hero-role-terminal {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: rgba(10, 20, 35, 0.75);
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          max-width: fit-content;
        }

        .role-terminal-head {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #0ea5e9;
        }

        .role-terminal-prompt {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: #38bdf8;
          font-weight: 600;
        }

        .role-terminal-body {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(0.9rem, 1.6vw, 1.05rem);
          color: #94a3b8;
        }

        .role-prefix {
          color: #64748b;
        }

        .typewriter-text {
          color: #06d6a0;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(6, 214, 160, 0.3);
        }

        .typewriter-cursor {
          color: #0ea5e9;
          font-weight: 700;
          animation: cursorBlink 0.9s infinite;
          margin-left: 2px;
        }

        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Bio */
        .hero-description {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          line-height: 1.75;
          color: #94a3b8;
          max-width: 530px;
        }

        .inline-badge {
          display: inline-block;
          padding: 0.12rem 0.55rem;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.84em;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .inline-badge.mern {
          background: rgba(14, 165, 233, 0.12);
          border: 1px solid rgba(14, 165, 233, 0.3);
          color: #38bdf8;
        }

        .inline-badge.mean {
          background: rgba(129, 140, 248, 0.12);
          border: 1px solid rgba(129, 140, 248, 0.3);
          color: #a5b4fc;
        }

        /* Metadata chips */
        .hero-meta-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-wrap: wrap;
          padding: 0.5rem 0;
        }

        .hero-meta-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          color: #64748b;
        }

        .meta-icon {
          color: #38bdf8;
        }

        .hero-meta-divider {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
        }

        /* CTA Buttons */
        .hero-cta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 0.35rem;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.85rem;
          background: linear-gradient(135deg, #0ea5e9, #06d6a0);
          color: #04101e;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(14, 165, 233, 0.45);
        }

        .btn-arrow {
          transition: transform 0.25s ease;
        }

        .hero-btn-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.85rem 1.65rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
        }

        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .hero-btn-cv {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          background: rgba(14, 165, 233, 0.06);
          border: 1px solid rgba(14, 165, 233, 0.3);
          color: #38bdf8;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
        }

        .hero-btn-cv:hover {
          background: rgba(14, 165, 233, 0.18);
          border-color: #0ea5e9;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(14, 165, 233, 0.25);
        }

        /* Social Chips */
        .hero-social {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
          margin-top: 0.25rem;
        }

        .social-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.95rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50px;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .social-chip:hover {
          background: rgba(14, 165, 233, 0.1);
          border-color: rgba(14, 165, 233, 0.35);
          color: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.15);
        }

        .social-chip--copy.is-copied {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #34d399;
        }

        /* ==========================================
           RIGHT VISUAL
           ========================================== */
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hc-dots {
          display: flex;
          gap: 6px;
        }

        .hc-dots span {
          width: 11px;
          height: 11px;
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
          margin: 0;
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
          border-top: 1px solid rgba(255, 255, 255, 0.04);
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
          background: rgba(255, 255, 255, 0.06);
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
          top: -10px;
          left: -20px;
          animation: float 5s ease-in-out infinite;
        }

        .float-badge--tr {
          top: 20px;
          right: -25px;
          animation: float 6.5s ease-in-out infinite reverse;
        }

        .float-badge--bl {
          bottom: 30px;
          left: -30px;
          animation: float 7.5s ease-in-out infinite 1s;
        }

        .float-badge--br {
          bottom: -5px;
          right: -10px;
          animation: float 5.5s ease-in-out infinite reverse 0.5s;
        }

        /* ==========================================
           SCROLL INDICATOR
           ========================================== */
        .scroll-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: absolute;
          bottom: 1.8rem;
          left: 50%;
          transform: translateX(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.25s ease;
          z-index: 2;
        }

        .scroll-indicator:hover {
          color: #38bdf8;
        }

        .scroll-mouse-pill {
          width: 20px;
          height: 32px;
          border: 1.5px solid rgba(14, 165, 233, 0.4);
          border-radius: 12px;
          display: flex;
          justify-content: center;
          padding-top: 5px;
          background: rgba(14, 165, 233, 0.04);
        }

        .scroll-mouse-wheel {
          width: 3px;
          height: 6px;
          border-radius: 2px;
          background: #38bdf8;
          animation: mouseWheelSlide 1.8s infinite;
        }

        @keyframes mouseWheelSlide {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }

        .scroll-text {
          font-weight: 600;
        }

        /* ==========================================
           RESPONSIVE BREAKPOINTS
           ========================================== */
        @media (max-width: 1024px) {
          .hero-inner {
            flex-direction: column;
            gap: 3.5rem;
            padding-top: 3rem;
            text-align: center;
          }

          .hero-content {
            align-items: center;
          }

          .hero-eyebrow {
            align-self: center;
          }

          .hero-description {
            text-align: center;
          }

          .hero-meta-row {
            justify-content: center;
          }

          .hero-cta {
            justify-content: center;
          }

          .hero-social {
            justify-content: center;
          }

          .hero-visual {
            width: 100%;
            max-width: 420px;
          }

          .float-badge--tl,
          .float-badge--tr,
          .float-badge--bl,
          .float-badge--br {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero-name {
            font-size: 2.1rem;
          }

          .hero-role-terminal {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
          }

          .hero-cta {
            flex-direction: column;
            width: 100%;
          }

          .hero-btn-primary,
          .hero-btn-secondary,
          .hero-btn-cv {
            width: 100%;
            justify-content: center;
          }

          .hero-meta-divider {
            display: none;
          }

          .hero-meta-row {
            flex-direction: column;
            gap: 0.4rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
