import React, { useState, useEffect, useContext } from 'react';
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

  // ─── Scroll Spy ────────────────────────────────────────────────
  useEffect(() => {
    if (currentView !== 'portfolio') return;

    const observers = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          // Fire when section occupies a comfortable region at eye level (upper 50% of screen)
          rootMargin: '-80px 0px -50% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [currentView]);
  // ───────────────────────────────────────────────────────────────

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
              <p className="footer-stack">Built with MERN Stack &amp; Vanilla CSS</p>
            </div>
          </footer>
        </main>
      ) : (
        <main>
          {user ? <AdminDashboard /> : <AdminLogin />}
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
    </AuthProvider>
  );
}

export default App;
