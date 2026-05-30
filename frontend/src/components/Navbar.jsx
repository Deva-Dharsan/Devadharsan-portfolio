import React, { useState, useEffect, useContext } from 'react';
import { Menu, X, Lock, LogOut, LayoutDashboard, Terminal, Shield, Download } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = ({ activeSection, setActiveSection, currentView, setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    let scrollTimeout;
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Set active scrolling animation state
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Scroll-position based active section tracker.
  // Picks whichever section's top is closest above the viewport midpoint.
  // This is robust for sections of ANY height (Projects, Experience, etc.)
  useEffect(() => {
    const getActiveSection = () => {
      const sections = Array.from(document.querySelectorAll('section[id]'));
      const midpoint = window.scrollY + window.innerHeight * 0.4;
      let current = sections[0]?.id || 'home';
      for (const section of sections) {
        if (section.offsetTop <= midpoint) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', getActiveSection, { passive: true });
    getActiveSection(); // run on mount
    return () => window.removeEventListener('scroll', getActiveSection);
  }, []);

  const handleNavClick = (id) => {
    setIsOpen(false);
    setCurrentView('portfolio');
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  const handleAdminToggle = () => {
    setIsOpen(false);
    setCurrentView(currentView === 'portfolio' ? 'admin' : 'portfolio');
  };

  const handleLogout = () => { logout(); setCurrentView('portfolio'); };

  const isAdmin = currentView === 'admin';

  return (
    <nav className={`nav-wrapper ${scrolled ? 'nav-wrapper--scrolled' : ''} ${scrolled && isScrolling ? 'nav-wrapper--active-scroll' : ''} ${isAdmin ? 'nav-wrapper--admin' : ''}`}>
      <div className="nav-container-pill">
        <div className="nav-inner container">
          {/* Brand container with Logo morphing */}
          <div className="nav-brand-container">
            <button className="nav-logo" onClick={() => handleNavClick('home')}>
              {isAdmin ? <Shield size={20} className="nav-logo-icon" /> : <Terminal size={20} className="nav-logo-icon" />}
              <span
                key={scrolled && activeSection !== 'home' ? (currentView === 'portfolio' ? activeSection : 'admin') : 'home'}
                className="nav-logo-text nav-location-text"
              >
                {isAdmin
                  ? <span className="hk-brand">&gt; DEVA </span>
                  : (scrolled && activeSection !== 'home'
                    ? (NAV_ITEMS.find(item => item.id === activeSection)?.label || 'Home')
                    : <>Deva<span className="gradient-text">dharsan</span></>)
                }
              </span>
            </button>
          </div>

          {/* Desktop Links */}
          <ul className="nav-links">
            {currentView === 'portfolio' ? (
              NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-link ${activeSection === item.id ? 'nav-link--active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.label}
                    <span className="nav-link-underline"></span>
                  </button>
                </li>
              ))
            ) : (
              <li>
                <button className="nav-link nav-link--back" onClick={() => setCurrentView('portfolio')}>
                  ← Back
                </button>
              </li>
            )}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {/* Download CV — always visible on desktop */}
            {currentView === 'portfolio' && (
              <a
                href="/Devadharsan_Resume.pdf"
                download="Devadharsan_Resume.pdf"
                className="nav-cv-btn"
                title="Download CV"
              >
                <Download size={14} />
                <span>Resume</span>
              </a>
            )}

            {user ? (
              <div className="nav-admin-group">
                <button
                  onClick={handleAdminToggle}
                  className={`nav-admin-btn ${currentView === 'admin' ? 'nav-admin-btn--active' : ''}`}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </button>
                <button onClick={handleLogout} className="nav-logout-btn" title="Log Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdminToggle}
                className={`nav-admin-ghost ${currentView === 'admin' ? 'nav-admin-ghost--active' : ''}`}
                title="Admin"
              >
                <Lock size={14} />
              </button>
            )}

            <button className="nav-hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>



      {/* Mobile Drawer */}
      <div className={`nav-drawer glass-panel ${isOpen ? 'nav-drawer--open' : ''}`}>
        <ul className="nav-drawer-links">
          {currentView === 'portfolio'
            ? NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-drawer-link ${activeSection === item.id ? 'nav-drawer-link--active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))
            : (
              <li>
                <button className="nav-drawer-link" onClick={() => { setIsOpen(false); setCurrentView('portfolio'); }}>
                  ← Back to Portfolio
                </button>
              </li>
            )}

          {currentView === 'portfolio' && (
              <li>
                <a
                  href="/Devadharsan_Resume.pdf"
                  download="Devadharsan_Resume.pdf"
                  className="nav-drawer-link nav-drawer-cv"
                  onClick={() => setIsOpen(false)}
                >
                  ⬇ Download CV
                </a>
              </li>
            )}

          {user ? (
            <>
              <li><button onClick={handleAdminToggle} className="nav-drawer-link">Dashboard</button></li>
              <li><button onClick={() => { setIsOpen(false); handleLogout(); }} className="nav-drawer-link" style={{ color: 'var(--color-error)' }}>Log Out</button></li>
            </>
          ) : (
            <li><button onClick={handleAdminToggle} className="nav-drawer-link" style={{ color: 'var(--text-muted)' }}>Admin</button></li>
          )}
        </ul>
      </div>

      <style>{`
        .nav-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 12px 0;
          padding-top: 18px;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          backdrop-filter: blur(6px) saturate(1.1);
          -webkit-backdrop-filter: blur(6px) saturate(1.1);
        }
        .nav-container-pill {
          width: 100%;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: auto;
        }
        .nav-wrapper--scrolled {
          width: 100%;
          left: 0;
          right: 0;
          padding: 8px 0;
          padding-top: 14px;
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          background: rgba(5, 13, 26, 0.55);
          border-bottom: 1px solid rgba(14, 165, 233, 0.1);
        }
        .nav-wrapper--scrolled .nav-container-pill {
          max-width: 85%;
          margin: 0 auto;
          border-radius: 100px;
          background: rgba(5, 13, 26, 0.7);
          backdrop-filter: blur(28px) saturate(1.5);
          -webkit-backdrop-filter: blur(28px) saturate(1.5);
          border: 1px solid rgba(14, 165, 233, 0.18);
          padding: 6px 1.5rem;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(14, 165, 233, 0.07);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Dynamic scroll animation styles */
        .nav-wrapper--active-scroll .nav-container-pill {
          border-color: rgba(14, 165, 233, 0.4) !important;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.5), 
            0 0 25px rgba(14, 165, 233, 0.22), 
            inset 0 0 10px rgba(14, 165, 233, 0.15);
          transform: scale(1.015);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        
        .nav-wrapper--active-scroll .nav-link--active .nav-link-dot {
          animation: activeDotScroll 0.8s infinite alternate;
        }
        @keyframes activeDotScroll {
          from { 
            transform: translateX(-50%) scale(1.2); 
            box-shadow: 0 0 6px var(--color-primary); 
          }
          to { 
            transform: translateX(-50%) scale(2.0); 
            box-shadow: 0 0 16px var(--color-primary), 0 0 6px #fff; 
          }
        }
        
        @keyframes navSlideIn {
          from {
            transform: translateY(-10px) scale(0.98);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 
            0 0 12px var(--color-accent), 
            0 0 6px var(--color-accent),
            0 0 20px #fff;
          animation: pulseSpark 0.8s infinite alternate;
        }
        @keyframes pulseSpark {
          from { transform: translateY(-50%) scale(0.8); opacity: 0.7; }
          to { transform: translateY(-50%) scale(1.4); opacity: 1; }
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
        }
        
        /* Location indicator & Brand container */
        .nav-brand-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-location-text {
          display: inline-block;
          animation: badgeTextChange 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes badgeTextChange {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Logo styling & scroll morphing */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          transition: opacity var(--transition-fast);
        }
        .nav-logo:hover { opacity: 0.85; }
        .nav-logo-icon { color: var(--color-primary); }
        .nav-logo-text {
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-wrapper--scrolled .nav-logo-text {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        /* Nav Links */
        .nav-links {
          display: flex;
          list-style: none;
          gap: 0.25rem;
        }
        .nav-link {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          padding: 0.5rem 0.85rem;
          border-radius: var(--border-radius-sm);
          transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          letter-spacing: 0.01em;
        }
        .nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
        .nav-link--active {
          color: var(--color-primary) !important;
          background: rgba(14, 165, 233, 0.06);
        }
        .nav-link-underline {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 0%;
            background: var(--color-primary);
            opacity: 0.6;
            transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
            border-radius: 1px;
          }
          .nav-link--active .nav-link-underline {
            width: 100%;
            animation: pulseLine 1.2s infinite alternate;
          }
          @keyframes pulseLine {
            from { opacity: 0.6; }
            to { opacity: 1; }
          }
        /* Actions */
        .nav-actions { display: flex; align-items: center; gap: 0.75rem; }
        .nav-admin-group { display: flex; align-items: center; gap: 0.5rem; }

        /* Download CV button in navbar */
        .nav-cv-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          background: rgba(56, 189, 248, 0.07);
          border: 1.5px solid rgba(56, 189, 248, 0.25);
          border-radius: var(--border-radius-sm);
          color: var(--color-accent);
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all var(--transition-normal);
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .nav-cv-btn:hover {
          background: rgba(56, 189, 248, 0.16);
          border-color: rgba(56, 189, 248, 0.5);
          color: #fff;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.2);
        }
        .nav-admin-btn {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.45rem 1rem;
          background: rgba(14,165,233,0.08);
          border: 1.5px solid rgba(14,165,233,0.2);
          border-radius: var(--border-radius-sm);
          color: var(--color-primary);
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-normal);
        }
        .nav-admin-btn:hover, .nav-admin-btn--active {
          background: var(--color-primary);
          color: var(--bg-primary);
          box-shadow: var(--shadow-glow);
        }
        .nav-logout-btn {
          padding: 0.45rem;
          background: rgba(244,63,94,0.08);
          border: 1.5px solid rgba(244,63,94,0.2);
          border-radius: var(--border-radius-sm);
          color: var(--color-error);
          cursor: pointer;
          transition: all var(--transition-normal);
          display: flex; align-items: center;
        }
        .nav-logout-btn:hover {
          background: var(--color-error);
          color: white;
        }
        .nav-admin-ghost {
          background: none;
          border: none;
          padding: 0.45rem;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 50%;
          display: flex; align-items: center;
          transition: all var(--transition-fast);
        }
        .nav-admin-ghost:hover, .nav-admin-ghost--active {
          color: var(--color-accent);
          background: rgba(255,255,255,0.05);
        }
        .nav-hamburger {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          display: none;
          padding: 0.25rem;
        }
        /* Mobile Drawer */
        .nav-drawer {
          position: absolute;
          top: calc(100% + 8px);
          left: 2rem;
          right: 2rem;
          border-radius: var(--border-radius-md) !important;
          padding: 1.5rem !important;
          display: none;
          transform: translateY(-10px);
          opacity: 0;
          transition: all var(--transition-normal);
          pointer-events: none;
        }
        .nav-drawer--open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .nav-drawer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .nav-drawer-link {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 0.75rem 0.5rem;
          border-radius: var(--border-radius-sm);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: all var(--transition-fast);
        }
        .nav-drawer-link:last-child { border-bottom: none; }
        .nav-drawer-link:hover { color: var(--text-primary); padding-left: 1rem; }
        .nav-drawer-link--active { color: var(--color-primary); }
 
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
          .nav-drawer { display: block; }
          .nav-cv-btn { display: none; }
        }

        .nav-drawer-cv {
          display: flex !important;
          align-items: center;
          color: var(--color-accent) !important;
          font-weight: 600;
        }
        .nav-drawer-cv:hover { color: #fff !important; }

        @media (max-width: 576px) {
          .nav-wrapper--scrolled .nav-logo-text { font-size: 0.85rem; }
        }

        /* ==========================================
           ADMIN / HACKER MODE OVERRIDES
           ========================================== */
        .nav-wrapper--admin {
          background: rgba(10, 10, 10, 0.95) !important;
          border-color: rgba(0, 255, 65, 0.2) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 65, 0.08) !important;
        }

        .nav-wrapper--admin.nav-wrapper--scrolled {
          background: rgba(10, 10, 10, 0.8) !important;
          border-bottom: 1px solid rgba(0, 255, 65, 0.1) !important;
          backdrop-filter: blur(14px) saturate(1.2) !important;
          -webkit-backdrop-filter: blur(14px) saturate(1.2) !important;
          box-shadow: none !important;
        }

        .nav-wrapper--admin.nav-wrapper--scrolled .nav-container-pill {
          background: rgba(10, 10, 10, 0.95) !important;
          border: 1px solid rgba(0, 255, 65, 0.25) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 65, 0.08) !important;
        }

        .nav-wrapper--admin.nav-wrapper--active-scroll .nav-container-pill {
          border-color: rgba(0, 255, 65, 0.5) !important;
          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.6),
            0 0 25px rgba(0, 255, 65, 0.15),
            inset 0 0 10px rgba(0, 255, 65, 0.08) !important;
          transform: scale(1.015) !important;
        }

        /* Brand in admin */
        .nav-wrapper--admin .nav-logo {
          font-family: 'JetBrains Mono', monospace;
        }

        .nav-wrapper--admin .nav-logo-icon {
          color: #00ff41 !important;
          filter: drop-shadow(0 0 6px rgba(0, 255, 65, 0.4));
        }

        .hk-brand {
          font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
          color: #00ff41;
          font-weight: 400;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          text-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
        }

        .nav-wrapper--admin .nav-wrapper--scrolled .nav-logo-text {
          color: #00ff41 !important;
        }

        /* Nav links in admin mode */
        .nav-wrapper--admin .nav-link {
          font-family: 'JetBrains Mono', monospace;
          color: #3a6a3a;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
        }

        .nav-wrapper--admin .nav-link:hover {
          color: #00ff41;
          background: rgba(0, 255, 65, 0.06);
        }

        .nav-wrapper--admin .nav-link--back {
          color: #00ff41 !important;
        }

        .nav-wrapper--admin .nav-link--back:hover {
          background: rgba(0, 255, 65, 0.08);
        }

        /* Admin action buttons in admin mode */
        .nav-wrapper--admin .nav-admin-btn {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(0, 255, 65, 0.08);
          border-color: rgba(0, 255, 65, 0.25);
          color: #00ff41;
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .nav-wrapper--admin .nav-admin-btn:hover,
        .nav-wrapper--admin .nav-admin-btn--active {
          background: rgba(0, 255, 65, 0.18) !important;
          color: #00ff41 !important;
          box-shadow: 0 0 18px rgba(0, 255, 65, 0.15) !important;
          border-color: rgba(0, 255, 65, 0.4);
        }

        .nav-wrapper--admin .nav-logout-btn {
          background: rgba(255, 68, 68, 0.06);
          border-color: rgba(255, 68, 68, 0.2);
          color: #ff4444;
        }

        .nav-wrapper--admin .nav-logout-btn:hover {
          background: rgba(255, 68, 68, 0.15);
          color: #ff4444;
          box-shadow: 0 0 12px rgba(255, 68, 68, 0.15);
        }

        /* Hamburger in admin mode */
        .nav-wrapper--admin .nav-hamburger {
          color: #00ff41;
        }

        /* Mobile drawer in admin mode */
        .nav-wrapper--admin .nav-drawer {
          background: rgba(10, 10, 10, 0.95) !important;
          border: 1px solid rgba(0, 255, 65, 0.15) !important;
          backdrop-filter: blur(20px);
        }

        .nav-wrapper--admin .nav-drawer::before {
          background: linear-gradient(135deg, rgba(0, 255, 65, 0.03) 0%, transparent 50%);
        }

        .nav-wrapper--admin .nav-drawer-link {
          font-family: 'JetBrains Mono', monospace;
          color: #4a6a4a;
          font-size: 0.85rem;
          border-bottom-color: rgba(0, 255, 65, 0.06);
        }

        .nav-wrapper--admin .nav-drawer-link:hover {
          color: #00ff41;
        }

        .nav-wrapper--admin .nav-drawer-link--active {
          color: #00ff41;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
