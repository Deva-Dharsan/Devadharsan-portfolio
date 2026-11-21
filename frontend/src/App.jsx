import React, { useState, useEffect, useContext } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';

const SECTION_IDS = ['home', 'about', 'projects', 'experience', 'contact'];

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentView, setCurrentView] = useState('portfolio');
  const { user, loading } = useContext(AuthContext);

  // ─── Robust Scroll Spy (Works reliably in both Local & Live) ───
  useEffect(() => {
    if (loading || currentView !== 'portfolio') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 140; // Offset for navbar height
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;

          // 1. If at bottom of page, highlight the last section ('contact')
          if (window.scrollY + windowHeight >= docHeight - 40) {
            setActiveSection('contact');
            ticking = false;
            return;
          }

          // 2. If at the top of page, highlight 'home'
          if (window.scrollY < 120) {
            setActiveSection('home');
            ticking = false;
            return;
          }

          // 3. Scan sections in reverse order to find the active section
          for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
            const id = SECTION_IDS[i];
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              const top = rect.top + window.scrollY;
              if (scrollPos >= top) {
                setActiveSection(id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize immediately once loading is complete and sections are mounted
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView, loading]);
  // ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        gap: '1rem',
      }}>
        <div className="spinner" style={{
          width: 44, height: 44,
          border: '2.5px solid rgba(14,165,233,0.1)',
          borderRadius: '50%',
          borderTopColor: 'var(--color-primary)',
          borderRightColor: 'var(--color-accent)',
          animation: 'spin 0.9s linear infinite',
        }} />
        <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {currentView === 'portfolio' ? (
        <main>
          <Hero setActiveSection={setActiveSection} />
          <About />
          <Projects />
          <Experience />
          <Contact />
          <footer className="site-footer">
            <div className="container site-footer-inner">
              <p className="footer-copy">
                &copy; {new Date().getFullYear()} <strong>Devadharsan J E</strong> &mdash; All rights reserved.
              </p>
              <p className="footer-stack">Built with MERN Stack · React · Node.js · Express · MongoDB </p>
            </div>
          </footer>
        </main>
      ) : (
        <main>
          {user ? <AdminDashboard setCurrentView={setCurrentView} /> : <AdminLogin setCurrentView={setCurrentView} />}
        </main>
      )}

      <style>{`
        .site-footer {
          padding: 2rem 0;
          border-top: 1px solid rgba(14, 165, 233, 0.08);
          background: rgba(5, 13, 26, 0.6);
          backdrop-filter: blur(12px);
        }
        .site-footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .footer-copy {
          font-size: 0.83rem;
          color: var(--text-muted);
        }
        .footer-copy strong { color: var(--text-secondary); font-weight: 600; }
        .footer-stack {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        @media (max-width: 576px) {
          .site-footer-inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Analytics />
    </AuthProvider>
  );
}

export default App;
