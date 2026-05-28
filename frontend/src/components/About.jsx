import React, { useState, useRef, useEffect } from 'react';
import { Code2, Server, Wrench, Lightbulb, Users, Zap, Target } from 'lucide-react';

const SKILLS = {
  technical: [
    { name: 'JavaScript (ES6+)', level: 85, color: '#f59e0b' },
    { name: 'React.js', level: 88, color: '#0ea5e9' },
    { name: 'Node.js', level: 82, color: '#10b981' },
    { name: 'Express.js', level: 80, color: '#818cf8' },
    { name: 'MongoDB', level: 78, color: '#06d6a0' },
    { name: 'HTML5', level: 95, color: '#f43f5e' },
    { name: 'CSS3', level: 90, color: '#0ea5e9' },
    { name: 'Git & GitHub', level: 85, color: '#f59e0b' },
  ],
  soft: [
    { label: 'Problem Solving', icon: <Lightbulb size={20} />, color: 'var(--color-secondary)' },
    { label: 'Quick Learner', icon: <Zap size={20} />, color: 'var(--color-primary)' },
    { label: 'Team Collaboration', icon: <Users size={20} />, color: 'var(--color-accent)' },
    { label: 'Attention to Detail', icon: <Target size={20} />, color: 'var(--color-violet)' },
  ],
};

const SkillBar = ({ skill, visible }) => (
  <div className="skill-item">
    <div className="skill-meta">
      <span className="skill-name">{skill.name}</span>
      <span className="skill-pct" style={{ color: skill.color }}>{skill.level}%</span>
    </div>
    <div className="skill-track">
      <div
        className="skill-fill"
        style={{
          width: visible ? `${skill.level}%` : '0%',
          background: `linear-gradient(90deg, ${skill.color}99, ${skill.color})`,
        }}
      ></div>
    </div>
  </div>
);

const About = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const [barsVisible, setBarsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarsVisible(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: 'technical', label: 'Technical Skills', icon: <Code2 size={16} /> },
    { id: 'soft', label: 'Soft Skills', icon: <Lightbulb size={16} /> },
  ];

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="container">
        <span className="section-label">Who I Am</span>
        <h2 className="section-titlee">About Me</h2>

        <div className="about-grid">
          {/* Bio Panel */}
          <div className="about-bio glass-panel">
            <div className="bio-intro">
              <div className="bio-avatar">
                <span className="bio-initials">DJ</span>
              </div>
              <div>
                <h3 className="bio-name">Devadharsan J E</h3>
                <p className="bio-role">Aspiring Full Stack Developer</p>
                <div className="bio-badge">
                  <span className="bio-badge-dot"></span>
                  Open to Work
                </div>
              </div>
            </div>

            <p className="bio-text">
              Creative and highly motivated developer with a solid foundation in the MERN stack.
              I enjoy turning complex problems into clean, elegant solutions and building applications
              that feel great to use.
            </p>
            <p className="bio-text">
              Recently Completed <strong>B.E. in Computer Science &amp; Engineering (2026)</strong>,
              I am actively seeking my first professional role where I can contribute, grow, and
              make a real impact alongside experienced developers.
            </p>

            <div className="bio-facts">
              <div className="bio-fact">
                <span className="bf-icon"><Code2 size={16} /></span>
                <span className="bf-text">MERN Stack</span>
              </div>
              <div className="bio-fact">
                <span className="bf-icon"><Server size={16} /></span>
                <span className="bf-text">REST APIs</span>
              </div>
              <div className="bio-fact">
                <span className="bf-icon"><Wrench size={16} /></span>
                <span className="bf-text">Git &amp; VS Code</span>
              </div>
            </div>
          </div>

          {/* Skills Panel */}
          <div className="about-skills glass-panel">
            <div className="skills-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`skill-tab ${activeTab === tab.id ? 'skill-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'technical' ? (
              <div className="skill-bars">
                {SKILLS.technical.map((s, i) => (
                  <SkillBar key={i} skill={s} visible={barsVisible} />
                ))}
              </div>
            ) : (
              <div className="soft-grid">
                {SKILLS.soft.map((s, i) => (
                  <div key={i} className="soft-card" style={{ '--card-color': s.color }}>
                    <div className="soft-icon" style={{ color: s.color }}>{s.icon}</div>
                    <span className="soft-label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .about-section { background-color: var(--bg-secondary); }

        .about-grid {
          display: grid;
          grid-template-columns: 4fr 6fr;
          gap: 2rem;
          align-items: start;
        }

        /* Bio Panel */
        .about-bio {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .bio-intro {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .bio-avatar {
          width: 64px; height: 64px; border-radius: 50%;
          background: var(--grad-primary);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.2), var(--shadow-glow);
        }
        .bio-initials {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          color: #050d1a;
        }
        .bio-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
        }
        .bio-role {
          font-size: 0.8rem;
          color: var(--color-primary);
          font-family: var(--font-mono);
          margin-bottom: 0.5rem;
        }
        .bio-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.65rem;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-success);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .bio-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-success);
          animation: pulseGlow 2s infinite;
        }
        .bio-text {
          font-size: 0.97rem;
          line-height: 1.75;
          color: var(--text-secondary);
        }
        .bio-text strong { color: var(--color-primary); font-weight: 600; }

        .bio-facts {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .bio-fact {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.85rem;
          background: rgba(14,165,233,0.07);
          border: 1px solid rgba(14,165,233,0.15);
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: var(--font-mono);
          color: var(--color-primary);
        }
        .bf-icon { display: flex; align-items: center; }

        /* Skills Panel */
        .about-skills {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .skills-tabs {
          display: flex;
          gap: 0.6rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .skill-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border: 1.5px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          color: var(--text-secondary);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          transition: all var(--transition-normal);
        }
        .skill-tab:hover { color: var(--text-primary); border-color: rgba(14,165,233,0.2); }
        .skill-tab--active {
          color: var(--color-primary);
          background: rgba(14,165,233,0.1);
          border-color: rgba(14,165,233,0.3);
        }

        /* Technical Skill Bars */
        .skill-bars { display: flex; flex-direction: column; gap: 1.25rem; }
        .skill-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .skill-meta { display: flex; justify-content: space-between; }
        .skill-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
        }
        .skill-pct {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
        }
        .skill-track {
          height: 5px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          overflow: hidden;
        }
        .skill-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Soft Skills */
        .soft-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .soft-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1.5px solid rgba(255,255,255,0.05);
          border-radius: var(--border-radius-md);
          transition: all var(--transition-normal);
          cursor: default;
        }
        .soft-card:hover {
          background: rgba(var(--card-color), 0.05);
          border-color: var(--card-color);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .soft-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
        }
        .soft-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        @media (max-width: 992px) {
          .about-grid { grid-template-columns: 1fr; }
          .soft-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .soft-grid { grid-template-columns: 1fr; }
          .about-bio, .about-skills { padding: 2rem 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default About;
