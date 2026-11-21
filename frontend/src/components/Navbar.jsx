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
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setIsOpen(false);
    setCurrentView('portfolio');
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 70,
        behavior: 'smooth',
      });
    }
  };

  const handleAdminToggle = () => {
    setIsOpen(false);
    setCurrentView(currentView === 'portfolio' ? 'admin' : 'portfolio');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('portfolio');
  };

  const isAdmin = currentView === 'admin';

  // Hide navbar completely on the login page (admin view + not logged in)
  if (currentView === 'admin' && !user) return null;

  return (
    <nav className={`nav-wrapper ${scrolled ? 'nav-wrapper--scrolled' : ''} ${isAdmin ? 'nav-wrapper--admin' : ''}`}>
      <div className="nav-capsule">
        {/* Brand */}
        <div className="nav-brand-container">
          <button className="nav-logo" onClick={() => handleNavClick('home')}>
            {isAdmin ? (
              <Shield size={19} className="nav-logo-icon" />
            ) : (
              <Terminal size={19} className="nav-logo-icon" />
            )}
            <span className="nav-logo-text">
              {isAdmin ? (
                <span className="hk-brand">&gt; DEVA</span>
              ) : (
                <>Deva<span className="gradient-text">dharsan</span></>
              )}
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          {currentView === 'portfolio' ? (
            NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="nav-link-dot" />}
                  </button>
                </li>
              );
            })
          ) : (
            <li>
              <button
                className="nav-link nav-link--back"
                onClick={() => setCurrentView('portfolio')}
              >
                ← Back to Portfolio
              </button>
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          {currentView === 'portfolio' && (
            <a
              href="/Devadharsan_Resume.pdf"
              download="Devadharsan_Resume.pdf"
              className="nav-cv-btn"
              title="Download CV"
            >
              <Download size={13} />
              <span>Resume</span>
            </a>
          )}

          {user ? (
            <div className="nav-admin-group">
              <button
                onClick={handleAdminToggle}
                className={`nav-admin-btn ${currentView === 'admin' ? 'nav-admin-btn--active' : ''}`}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={handleLogout}
                className="nav-logout-btn"
                title="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdminToggle}
              className={`nav-admin-ghost ${currentView === 'admin' ? 'nav-admin-ghost--active' : ''}`}
              title="Admin Access"
            >
              <Lock size={14} />
            </button>
          )}

          {/* Hamburger toggle */}
          <button
            className="nav-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`nav-drawer ${isOpen ? 'nav-drawer--open' : ''}`}>
        <ul className="nav-drawer-links">
          {currentView === 'portfolio' ? (
            NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-drawer-link ${activeSection === item.id ? 'nav-drawer-link--active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))
          ) : (
            <li>
              <button
                className="nav-drawer-link"
                onClick={() => {
                  setIsOpen(false);
                  setCurrentView('portfolio');
                }}
              >
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
                <Download size={14} style={{ marginRight: 6 }} /> Download CV
              </a>
            </li>
          )}

          {user ? (
            <>
              <li>
                <button onClick={handleAdminToggle} className="nav-drawer-link">
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="nav-drawer-link"
                  style={{ color: 'var(--color-error)' }}
                >
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleAdminToggle}
                className="nav-drawer-link"
                style={{ color: 'var(--text-muted)' }}
              >
                Admin Login
              </button>
            </li>
          )}
        </ul>
      </div>

      <style>{`
        /* ==========================================
           NAVBAR CONTAINER & FLUID MORPHING
           ========================================== */
        .nav-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 16px 1.5rem;
          pointer-events: none;
          transition: padding 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-wrapper--scrolled {
          padding: 10px 1.5rem;
        }

        /* The floating capsule */
        .nav-capsule {
          pointer-events: auto;
          width: 100%;
          max-width: 1160px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem 0 1.5rem;
          border-radius: 100px;
          background: rgba(5, 13, 26, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(14, 165, 233, 0.12);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          transition: 
            max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease,
            backdrop-filter 0.35s ease;
        }

        .nav-wrapper--scrolled .nav-capsule {
          max-width: 1060px;
          background: rgba(5, 13, 26, 0.82);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border-color: rgba(14, 165, 233, 0.22);
          box-shadow: 
            0 12px 36px rgba(0, 0, 0, 0.5),
            0 0 25px rgba(14, 165, 233, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* Brand / Logo */
        .nav-brand-container {
          display: flex;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-display), 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          padding: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .nav-logo:hover {
          opacity: 0.9;
          transform: translateY(-0.5px);
        }

        .nav-logo-icon {
          color: var(--color-primary);
          filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.4));
          transition: transform 0.25s ease;
        }

        .nav-logo:hover .nav-logo-icon {
          transform: rotate(-6deg) scale(1.08);
        }

        .nav-logo-text {
          font-family: var(--font-body), 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: -0.02em;
        }

        /* Nav Links */
        .nav-links {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 0.25rem;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body), 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 0.45rem 0.95rem;
          border-radius: 50px;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          letter-spacing: 0.01em;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(14, 165, 233, 0.07);
        }

        .nav-link--active {
          color: var(--color-primary) !important;
          background: rgba(14, 165, 233, 0.12) !important;
          font-weight: 600;
        }

        .nav-link-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-accent);
          margin-left: 0.4rem;
          box-shadow: 0 0 8px var(--color-accent);
          animation: dotGlow 1.8s infinite alternate ease-in-out;
        }

        @keyframes dotGlow {
          from { opacity: 0.6; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1.2); }
        }

        .nav-link--back {
          color: var(--color-accent) !important;
          font-family: var(--font-mono);
          font-size: 0.78rem;
        }

        /* Actions group */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .nav-admin-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        /* Resume download button */
        .nav-cv-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.24);
          border-radius: 50px;
          color: var(--color-accent);
          font-family: var(--font-body), sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .nav-cv-btn:hover {
          background: rgba(56, 189, 248, 0.18);
          border-color: rgba(56, 189, 248, 0.45);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(56, 189, 248, 0.18);
        }

        /* Admin button */
        .nav-admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          background: rgba(14, 165, 233, 0.08);
          border: 1px solid rgba(14, 165, 233, 0.22);
          border-radius: 50px;
          color: var(--color-primary);
          font-family: var(--font-body), sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .nav-admin-btn:hover,
        .nav-admin-btn--active {
          background: var(--color-primary);
          color: #050d1a;
          border-color: var(--color-primary);
          box-shadow: 0 0 16px rgba(14, 165, 233, 0.4);
        }

        .nav-logout-btn {
          padding: 0.4rem 0.5rem;
          background: rgba(244, 63, 94, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.2);
          border-radius: 50px;
          color: var(--color-error);
          cursor: pointer;
          transition: all 0.22s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-logout-btn:hover {
          background: var(--color-error);
          color: #fff;
          transform: translateY(-1px);
        }

        .nav-admin-ghost {
          background: none;
          border: none;
          padding: 0.45rem;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .nav-admin-ghost:hover,
        .nav-admin-ghost--active {
          color: var(--color-accent);
          background: rgba(255, 255, 255, 0.06);
          transform: scale(1.08);
        }

        .nav-hamburger {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          display: none;
          padding: 0.3rem;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .nav-hamburger:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        /* Mobile Drawer */
        .nav-drawer {
          position: fixed;
          top: 76px;
          left: 1.25rem;
          right: 1.25rem;
          border-radius: 20px;
          padding: 1.25rem;
          background: rgba(7, 18, 33, 0.94);
          border: 1px solid rgba(14, 165, 233, 0.18);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
          display: none;
          opacity: 0;
          transform: translateY(-12px);
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 999;
        }

        .nav-drawer--open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .nav-drawer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin: 0;
          padding: 0;
        }

        .nav-drawer-link {
          display: flex;
          align-items: center;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body), sans-serif;
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 0.7rem 0.85rem;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .nav-drawer-link:hover {
          color: var(--text-primary);
          background: rgba(14, 165, 233, 0.08);
          padding-left: 1.1rem;
        }

        .nav-drawer-link--active {
          color: var(--color-primary);
          background: rgba(14, 165, 233, 0.12);
          font-weight: 600;
        }

        .nav-drawer-cv {
          color: var(--color-accent) !important;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .nav-wrapper {
            padding: 10px 1rem;
          }
          .nav-capsule {
            height: 50px;
            padding: 0 0.9rem 0 1.1rem;
          }
          .nav-links { display: none; }
          .nav-cv-btn { display: none; }
          .nav-hamburger { display: flex; }
          .nav-drawer { display: block; }
        }

        /* ==========================================
           ADMIN VIEW (GREEN TERMINAL THEME)
           ========================================== */
        .nav-wrapper--admin .nav-capsule {
          background: rgba(10, 10, 10, 0.92) !important;
          border-color: rgba(0, 255, 65, 0.22) !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 255, 65, 0.08) !important;
        }

        .nav-wrapper--admin .nav-logo-icon {
          color: #00ff41 !important;
          filter: drop-shadow(0 0 6px rgba(0, 255, 65, 0.5));
        }

        .hk-brand {
          font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
          color: #00ff41;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          text-shadow: 0 0 8px rgba(0, 255, 65, 0.4);
        }

        .nav-wrapper--admin .nav-link {
          font-family: 'JetBrains Mono', monospace;
          color: #4a7a4a;
          font-size: 0.78rem;
        }

        .nav-wrapper--admin .nav-link:hover {
          color: #00ff41;
          background: rgba(0, 255, 65, 0.08);
        }

        .nav-wrapper--admin .nav-link--back {
          color: #00ff41 !important;
        }

        .nav-wrapper--admin .nav-admin-btn {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(0, 255, 65, 0.08);
          border-color: rgba(0, 255, 65, 0.25);
          color: #00ff41;
          font-size: 0.74rem;
          letter-spacing: 0.06em;
        }

        .nav-wrapper--admin .nav-admin-btn:hover,
        .nav-wrapper--admin .nav-admin-btn--active {
          background: rgba(0, 255, 65, 0.18) !important;
          border-color: rgba(0, 255, 65, 0.5) !important;
          color: #00ff41 !important;
          box-shadow: 0 0 16px rgba(0, 255, 65, 0.2) !important;
        }

        .nav-wrapper--admin .nav-logout-btn {
          background: rgba(255, 68, 68, 0.08);
          border-color: rgba(255, 68, 68, 0.25);
          color: #ff4444;
        }

        .nav-wrapper--admin .nav-logout-btn:hover {
          background: #ff4444;
          color: #fff;
        }

        .nav-wrapper--admin .nav-hamburger {
          color: #00ff41;
        }

        .nav-wrapper--admin .nav-drawer {
          background: rgba(10, 10, 10, 0.96) !important;
          border-color: rgba(0, 255, 65, 0.2) !important;
        }

        .nav-wrapper--admin .nav-drawer-link {
          font-family: 'JetBrains Mono', monospace;
          color: #4a7a4a;
        }

        .nav-wrapper--admin .nav-drawer-link:hover {
          color: #00ff41;
          background: rgba(0, 255, 65, 0.08);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
