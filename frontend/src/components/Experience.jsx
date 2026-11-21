import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  GraduationCap,
  Rocket,
  Heart,
  BookOpen,
  Briefcase,
  MapPin,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const Experience = () => {
  const { API_URL } = useContext(AuthContext);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/experiences`);
      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setExperiences(data);
      } else {
        throw new Error('Unexpected data format received from server');
      }
    } catch (err) {
      console.error('Failed to fetch experiences from backend:', err);
      setError('Unable to load experience milestones from the database. The backend server may be offline or undergoing maintenance.');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [API_URL]);

  const highlights = [
    {
      icon: <GraduationCap size={22} />,
      title: 'Computer Science Foundation',
      description: 'Strong academic grounding in software engineering, data structures, algorithms, and web technologies.',
      color: '#0ea5e9',
    },
    {
      icon: <BookOpen size={22} />,
      title: 'Self-Driven Learner',
      description: 'Continuously expanding expertise through hands-on projects and building full-stack applications using MERN & MEAN stacks.',
      color: '#06d6a0',
    },
    {
      icon: <Rocket size={22} />,
      title: 'Ready to Contribute',
      description: 'Eager to join a professional team, collaborate on real-world challenges, and grow as a software developer from day one.',
      color: '#818cf8',
    },
    {
      icon: <Heart size={22} />,
      title: 'Passionate About Development',
      description: 'Genuinely passionate about writing clean code, building intuitive interfaces, and solving problems through technology.',
      color: '#f59e0b',
    },
  ];

  return (
    <section id="experience" className="experience-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          {/* <span className="section-label">My Journey</span> */}
          <h2 className="section-title">Experience</h2>
        </div>

        {/* Backend-driven experience entries */}
        {loading ? (
          <div className="exp-loading">
            <div className="exp-spinner" />
            <p>Loading experience from database...</p>
          </div>
        ) : error ? (
          <div className="exp-status-card glass-panel exp-status-card--error">
            <div className="status-icon-wrapper status-icon-wrapper--error">
              <AlertTriangle size={32} />
            </div>
            <div className="status-content">
              <div className="status-badge status-badge--error">
                <span className="status-dot red" />
                <span>Service Unavailable</span>
              </div>
              <h3 className="status-title">Unable to Load Experience</h3>
              <p className="status-description">
                We are experiencing difficulty connecting to the database server.
                The backend service may be offline or undergoing maintenance.
              </p>
              <div className="status-actions">
                <button
                  type="button"
                  className="status-btn status-btn--retry"
                  onClick={fetchExperiences}
                >
                  <RefreshCw size={14} />
                  <span>Retry Connection</span>
                </button>
              </div>
            </div>
          </div>
        ) : experiences.length > 0 ? (
          <div className={`exp-timeline ${visible ? 'exp-timeline--visible' : ''}`}>
            {experiences.map((exp, idx) => (
              <div
                key={exp._id}
                className="exp-timeline-item"
                style={{ animationDelay: `${idx * 0.12}s` }}
              >
                <div className="exp-timeline-dot" />
                <div className="exp-card glass-panel">
                  <div className="exp-card-header">
                    <div className="exp-card-left">
                      <div className="exp-icon-wrap">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <h3 className="exp-role">{exp.role}</h3>
                        <p className="exp-company">
                          <MapPin size={13} />
                          {exp.company}
                        </p>
                      </div>
                    </div>
                    <div className="exp-card-right">
                      <span className="exp-duration">
                        <Calendar size={12} />
                        {exp.duration}
                      </span>
                    </div>
                  </div>

                  <div className="exp-card-body">
                    <p className="exp-desc">{exp.description}</p>
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="exp-skills">
                        {exp.skills.map((skill, i) => (
                          <span key={i} className="exp-skill-tag">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Fresher intro panel */}
        <div className={`exp-intro glass-panel ${visible ? 'exp-intro--visible' : ''}`}>
          <div className="exp-intro-top">
            <span className="exp-intro-badge">
              {experiences.length > 0 ? 'Professional Growth' : 'Fresher & Motivated'}
            </span>
            <div className="exp-status-pill">
              <span className="exp-status-dot" />
              Open to Work
            </div>
          </div>
          <h3 className="exp-intro-heading">
            {experiences.length > 0
              ? 'Building My Professional Story'
              : 'Starting My Professional Journey'}
          </h3>
          <p className="exp-intro-text">
            I am a passionate Junior Full Stack Developer{experiences.length > 0 ? ' actively growing my career' : ' at the beginning of my professional career'}. I bring strong technical foundations in both the <strong>MERN</strong> and <strong>MEAN</strong> stacks, a genuine love for problem solving, and an unwavering drive to learn and contribute to impactful projects.
          </p>
          <p className="exp-intro-text">
            I am actively seeking opportunities where I can apply my skills, grow under experienced mentorship, and make a real difference in a collaborative team environment.
          </p>
        </div>

        {/* Highlights grid */}
        <div className={`highlights-grid ${visible ? 'highlights-grid--visible' : ''}`}>
          {highlights.map((item, index) => (
            <div
              key={index}
              className="highlight-card glass-panel"
              style={{ '--card-accent': item.color, animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="highlight-icon"
                style={{
                  color: item.color,
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}30`
                }}
              >
                {item.icon}
              </div>
              <h4 className="highlight-title">{item.title}</h4>
              <p className="highlight-desc">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Open to work banner */}
        <div className="open-to-work glass-panel">
          <div className="otw-left">
            <span className="otw-dot" />
            <div>
              <p className="otw-label">Current Status</p>
              <p className="otw-status">Open to Work — Actively Seeking Opportunities</p>
            </div>
          </div>
          <div className="otw-tags">
            <span className="otw-tag">Full-Time</span>
            <span className="otw-tag">Remote / On-Site</span>
          </div>
        </div>
      </div>

      <style>{`
        .experience-section {
          background-color: var(--bg-secondary);
        }
        .exp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 3rem 0;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.85rem;
        }
        .exp-spinner {
          width: 36px; height: 36px;
          border: 2px solid rgba(14,165,233,0.1);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        /* Professional Error State */
        .exp-status-card {
          max-width: 600px;
          margin: 1rem auto 3rem;
          padding: 2.75rem 2rem;
          border-radius: var(--border-radius-lg, 16px);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
          position: relative;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          animation: expStatusFadeIn 0.35s ease;
        }

        .exp-status-card--error {
          border-color: rgba(239, 68, 68, 0.25);
          box-shadow: 0 20px 40px -15px rgba(239, 68, 68, 0.12);
        }

        @keyframes expStatusFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .status-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(14, 165, 233, 0.1);
          color: var(--color-primary, #0ea5e9);
          border: 1px solid rgba(14, 165, 233, 0.25);
        }

        .status-icon-wrapper--error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);
        }

        .status-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.65rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .status-badge--error {
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.22);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .status-dot.red {
          background: #ef4444;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.7);
        }

        .status-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 0.2rem;
          letter-spacing: -0.01em;
        }

        .status-description {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 480px;
        }

        .status-actions {
          margin-top: 0.8rem;
        }

        .status-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.12);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .status-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-1px);
        }

        .status-btn--retry {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.35);
          color: #fca5a5;
        }

        .status-btn--retry:hover {
          background: rgba(239, 68, 68, 0.22);
          border-color: rgba(239, 68, 68, 0.5);
          color: #fff;
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.25);
        }

        /* Timeline */
        .exp-timeline {
          position: relative;
          margin-bottom: 2.5rem;
          padding-left: 2.25rem;
        }
        .exp-timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 2px;
          background: linear-gradient(to bottom, var(--color-primary), var(--color-accent));
          border-radius: 2px;
          opacity: 0.3;
        }
        .exp-timeline--visible .exp-timeline-item {
          animation: fadeInUp 0.5s ease both;
        }
        .exp-timeline-item {
          position: relative;
          margin-bottom: 1.5rem;
          opacity: 0;
        }
        .exp-timeline--visible .exp-timeline-item {
          opacity: 1;
        }
        .exp-timeline-dot {
          position: absolute;
          left: -2.6rem;
          top: 1.4rem;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: var(--grad-primary);
          box-shadow: 0 0 10px rgba(14,165,233,0.4);
          border: 2px solid var(--bg-secondary);
        }
        .exp-card {
          padding: 1.5rem 1.75rem;
          transition: all var(--transition-normal);
        }
        .exp-card:hover {
          border-color: rgba(14,165,233,0.2);
          transform: translateX(4px);
        }
        .exp-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .exp-card-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }
        .exp-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(14,165,233,0.1);
          border: 1px solid rgba(14,165,233,0.2);
          color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .exp-role {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-display);
          margin-bottom: 0.25rem;
        }
        .exp-company {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.82rem;
          color: var(--color-primary);
          font-family: var(--font-mono);
        }
        .exp-card-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .exp-duration {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .exp-card-body {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .exp-desc {
          font-size: 0.93rem;
          line-height: 1.72;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        .exp-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .exp-skill-tag {
          display: inline-block;
          padding: 0.2rem 0.7rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          border-radius: 50px;
          background: rgba(6,214,160,0.08);
          color: var(--color-accent);
          border: 1px solid rgba(6,214,160,0.2);
        }

        /* Intro panel */
        .exp-intro {
          padding: 2.5rem 3rem;
          margin-bottom: 2.5rem;
          border-left: 3px solid var(--color-primary);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .exp-intro--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .exp-intro-top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.1rem;
          flex-wrap: wrap;
        }
        .exp-intro-badge {
          display: inline-block;
          padding: 0.3rem 0.9rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 50px;
          background: rgba(14,165,233,0.1);
          color: var(--color-primary);
          border: 1px solid rgba(14,165,233,0.25);
          font-family: var(--font-mono);
        }
        .exp-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.9rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 50px;
          background: rgba(16,185,129,0.08);
          color: var(--color-success);
          border: 1px solid rgba(16,185,129,0.2);
          font-family: var(--font-mono);
        }
        .exp-status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--color-success);
          animation: expPulse 2s infinite;
        }
        .exp-intro-heading {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-family: var(--font-display);
        }
        .exp-intro-text {
          font-size: 0.98rem;
          line-height: 1.78;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }
        .exp-intro-text:last-child { margin-bottom: 0; }
        .exp-intro-text strong { color: var(--color-primary); font-weight: 600; }

        /* Highlights */
        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .highlights-grid--visible .highlight-card {
          animation: fadeInUp 0.5s ease both;
        }
        .highlight-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all var(--transition-normal);
          opacity: 0;
          cursor: default;
        }
        .highlights-grid--visible .highlight-card { opacity: 1; }
        .highlight-card:nth-child(1) { animation-delay: 0.05s; }
        .highlight-card:nth-child(2) { animation-delay: 0.1s; }
        .highlight-card:nth-child(3) { animation-delay: 0.15s; }
        .highlight-card:nth-child(4) { animation-delay: 0.2s; }
        .highlight-card:hover {
          transform: translateY(-5px);
          border-color: rgba(14,165,233,0.2);
          box-shadow: var(--shadow-lg), 0 0 30px rgba(14,165,233,0.06);
        }
        .highlight-icon {
          width: 50px; height: 50px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .highlight-title {
          font-size: 1rem; font-weight: 700; color: var(--text-primary);
          font-family: var(--font-display);
        }
        .highlight-desc {
          font-size: 0.9rem; line-height: 1.65; color: var(--text-secondary);
        }

        /* Open to Work */
        .open-to-work {
          padding: 1.75rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          border-color: rgba(16,185,129,0.15) !important;
          background: rgba(16,185,129,0.03) !important;
        }
        .otw-left {
          display: flex; align-items: center; gap: 1.25rem;
        }
        .otw-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--color-success);
          box-shadow: 0 0 0 4px rgba(16,185,129,0.2);
          animation: expPulse 2s infinite;
          flex-shrink: 0;
        }
        .otw-label {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--text-muted);
          margin-bottom: 0.2rem; font-family: var(--font-mono);
        }
        .otw-status {
          font-size: 0.98rem; font-weight: 600; color: var(--color-success);
        }
        .otw-tags {
          display: flex; flex-wrap: wrap; gap: 0.6rem;
        }
        .otw-tag {
          padding: 0.3rem 0.85rem; font-size: 0.78rem; font-weight: 600;
          border-radius: 50px;
          background: rgba(16,185,129,0.08);
          color: #6ee7b7;
          border: 1px solid rgba(16,185,129,0.18);
          font-family: var(--font-mono);
        }
        @keyframes expPulse {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @media (max-width: 768px) {
          .highlights-grid { grid-template-columns: 1fr; }
          .exp-intro { padding: 2rem 1.5rem; }
          .open-to-work { padding: 1.5rem; flex-direction: column; align-items: flex-start; }
          .exp-intro-heading { font-size: 1.45rem; }
          .exp-timeline { padding-left: 1.25rem; }
          .exp-card-header { flex-direction: column; align-items: flex-start; }
          .exp-card-right { align-self: flex-start; }
        }
      `}</style>
    </section>
  );
};

export default Experience;
