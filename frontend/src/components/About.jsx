import React, { useState } from 'react';
import {
  Code2,
  Server,
  Database,
  GitBranch,
  Globe,
  Lightbulb,
  Users,
  Zap,
  Target,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

const SKILL_DOMAINS = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: <Globe size={18} />,
    color: '#0ea5e9',
    rgb: '14, 165, 233',
    description: 'Responsive, component-driven user interfaces & modern SPAs',
    skills: [
      { name: 'React.js', core: true },
      { name: 'Angular', core: true },
      { name: 'JavaScript (ES6+)', core: true },
      { name: 'HTML5 & Modern CSS3', core: false },
      { name: 'Responsive Web Design', core: false },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Architecture',
    icon: <Server size={18} />,
    color: '#10b981',
    rgb: '16, 185, 129',
    description: 'Server logic, RESTful APIs, routing & middleware',
    skills: [
      { name: 'Node.js', core: true },
      { name: 'Express.js', core: true },
      { name: 'RESTful API Design', core: true },
      { name: 'JWT & Authentication', core: false },
      { name: 'Middleware & Security', core: false },
    ],
  },
  {
    id: 'database',
    title: 'Databases & Storage',
    icon: <Database size={18} />,
    color: '#06d6a0',
    rgb: '6, 214, 160',
    description: 'Schema modeling, validations & query pipelines',
    skills: [
      { name: 'MongoDB', core: true },
      { name: 'Mongoose ODM', core: true },
      { name: 'Schema Validation', core: false },
      { name: 'CRUD Pipelines', core: false },
    ],
  },
  {
    id: 'tools',
    title: 'Dev Tools & Ecosystem',
    icon: <GitBranch size={18} />,
    color: '#f59e0b',
    rgb: '245, 158, 11',
    description: 'Version control, build tooling & API testing environments',
    skills: [
      { name: 'Git & GitHub', core: true },
      { name: 'Postman', core: false },
      { name: 'Vite & npm', core: false },
      { name: 'VS Code', core: false },
      { name: 'Docker', core: false },
      { name: 'Source Tree', core: false },
    ],
  },
];

const SOFT_SKILLS = [
  {
    title: 'Problem Solving & Logic',
    desc: 'Analyzing complex requirements to deliver clean, efficient, and well-structured code solutions.',
    icon: <Lightbulb size={20} />,
    color: '#0ea5e9',
    rgb: '14, 165, 233',
  },
  {
    title: 'Rapid Adaptability',
    desc: 'Quick to learn and implement modern frameworks, evolving libraries, and engineering tools.',
    icon: <Zap size={20} />,
    color: '#10b981',
    rgb: '16, 185, 129',
  },
  {
    title: 'Collaborative Engineering',
    desc: 'Clear communication in team settings with Git workflows, code reviews, and shared ownership.',
    icon: <Users size={20} />,
    color: '#06d6a0',
    rgb: '6, 214, 160',
  },
  {
    title: 'Code Quality & Maintainability',
    desc: 'Committed to writing readable, DRY, and modular code that is built for longevity and scale.',
    icon: <Target size={20} />,
    color: '#818cf8',
    rgb: '129, 140, 248',
  },
];

const About = () => {
  const [activeTab, setActiveTab] = useState('technical');

  const tabs = [
    { id: 'technical', label: 'Technical Arsenal', icon: <Code2 size={16} /> },
    { id: 'principles', label: 'Engineering Principles', icon: <Lightbulb size={16} /> },
  ];

  return (
    <section id="about" className="about-section">
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
                <p className="bio-role">Full Stack Developer · MERN &amp; MEAN</p>
                <div className="bio-badge">
                  <span className="bio-badge-dot"></span>
                  Open to Opportunities
                </div>
              </div>
            </div>

            <p className="bio-text">
              Passionate and detail-oriented Full Stack Developer with hands-on expertise across both <strong>MERN</strong> and <strong>MEAN</strong> stacks. I build scalable web applications, robust RESTful APIs, and responsive, interactive user experiences from design to deployment.
            </p>
            <p className="bio-text">
              Completed <strong>B.E. in Computer Science &amp; Engineering (2026)</strong>. Dedicated to writing clean, maintainable code, adopting modern engineering practices, and collaborating in fast-paced software teams.
            </p>

            {/* Quick Credentials / Profile Highlights */}
            <div className="bio-highlights">
              <div className="bio-highlight-item">
                <span className="bh-label">Education</span>
                <span className="bh-value">B.E. Computer Science (2026)</span>
              </div>
              <div className="bio-highlight-item">
                <span className="bh-label">Primary Stack</span>
                <span className="bh-value">MERN &amp; MEAN Stacks</span>
              </div>
              <div className="bio-highlight-item">
                <span className="bh-label">Availability</span>
                <span className="bh-value">Immediate · Full-time</span>
              </div>
            </div>

            <div className="bio-facts">
              <div className="bio-fact">
                <span className="bf-icon"><Code2 size={15} /></span>
                <span className="bf-text">React &amp; Angular</span>
              </div>
              <div className="bio-fact">
                <span className="bf-icon"><Server size={15} /></span>
                <span className="bf-text">Node &amp; Express</span>
              </div>
              <div className="bio-fact">
                <span className="bf-icon"><Database size={15} /></span>
                <span className="bf-text">MongoDB</span>
              </div>
              <div className="bio-fact">
                <span className="bf-icon"><Wrench size={15} /></span>
                <span className="bf-text">REST APIs &amp; Git</span>
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
                  type="button"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === 'technical' ? (
              <div className="tech-categories-grid">
                {SKILL_DOMAINS.map((domain) => (
                  <div
                    key={domain.id}
                    className="tech-cat-card"
                    style={{
                      '--cat-color': domain.color,
                      '--cat-rgb': domain.rgb,
                    }}
                  >
                    <div className="tech-cat-header">
                      <div className="tech-cat-icon">{domain.icon}</div>
                      <div>
                        <h4 className="tech-cat-title">{domain.title}</h4>
                        <p className="tech-cat-desc">{domain.description}</p>
                      </div>
                    </div>

                    <div className="tech-chips">
                      {domain.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className={`tech-chip ${skill.core ? 'tech-chip--core' : ''}`}
                        >
                          <span className="tech-chip-name">{skill.name}</span>
                          {skill.core && <span className="tech-chip-tag">Core</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="soft-grid">
                {SOFT_SKILLS.map((item, idx) => (
                  <div
                    key={idx}
                    className="soft-card"
                    style={{
                      '--soft-color': item.color,
                      '--soft-rgb': item.rgb,
                    }}
                  >
                    <div className="soft-icon" style={{ color: item.color }}>
                      {item.icon}
                    </div>
                    <h4 className="soft-title">{item.title}</h4>
                    <p className="soft-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          background-color: var(--bg-secondary);
          position: relative;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 4fr 6fr;
          gap: 2rem;
          align-items: stretch;
        }

        /* Bio Panel */
        .about-bio {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }
        .bio-intro {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .bio-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--grad-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2), var(--shadow-glow);
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
          font-size: 0.82rem;
          color: var(--color-primary);
          font-family: var(--font-mono);
          margin-bottom: 0.45rem;
        }
        .bio-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.65rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-success);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .bio-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-success);
          animation: pulseGlow 2s infinite;
        }
        .bio-text {
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--text-secondary);
        }
        .bio-text strong {
          color: var(--color-primary);
          font-weight: 600;
        }

        /* Bio Highlights Table */
        .bio-highlights {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 1rem 1.15rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--border-radius-sm);
        }
        .bio-highlight-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          gap: 0.5rem;
        }
        .bh-label {
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .bh-value {
          color: var(--text-primary);
          font-weight: 600;
          font-family: var(--font-body);
        }

        .bio-facts {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }
        .bio-fact {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.8rem;
          background: rgba(14, 165, 233, 0.07);
          border: 1px solid rgba(14, 165, 233, 0.15);
          border-radius: 50px;
          font-size: 0.76rem;
          font-weight: 600;
          font-family: var(--font-mono);
          color: var(--color-primary);
        }
        .bf-icon {
          display: flex;
          align-items: center;
        }

        /* Skills Panel */
        .about-skills {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .skills-tabs {
          display: flex;
          gap: 0.6rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .skill-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border: 1.5px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-secondary);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          transition: all var(--transition-normal);
        }
        .skill-tab:hover {
          color: var(--text-primary);
          border-color: rgba(14, 165, 233, 0.25);
        }
        .skill-tab--active {
          color: var(--color-primary);
          background: rgba(14, 165, 233, 0.1);
          border-color: rgba(14, 165, 233, 0.35);
        }

        /* Technical Categories Grid */
        .tech-categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.15rem;
          animation: tabFadeIn 0.35s ease-out;
        }
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tech-cat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--border-radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .tech-cat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--cat-color);
          opacity: 0.4;
          transition: opacity 0.25s ease;
        }
        .tech-cat-card:hover {
          transform: translateY(-3px);
          border-color: rgba(var(--cat-rgb), 0.35);
          box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.5), 0 0 16px -4px rgba(var(--cat-rgb), 0.15);
          background: rgba(255, 255, 255, 0.035);
        }
        .tech-cat-card:hover::before {
          opacity: 1;
        }

        .tech-cat-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .tech-cat-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cat-color);
          border: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }
        .tech-cat-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
          letter-spacing: -0.01em;
        }
        .tech-cat-desc {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .tech-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: auto;
          padding-top: 0.35rem;
        }
        .tech-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.6rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }
        .tech-chip:hover {
          color: var(--text-primary);
          border-color: rgba(var(--cat-rgb), 0.4);
          background: rgba(var(--cat-rgb), 0.08);
        }
        .tech-chip--core {
          background: rgba(14, 165, 233, 0.06);
          border-color: rgba(14, 165, 233, 0.22);
          color: var(--text-primary);
          font-weight: 600;
        }
        .tech-chip-tag {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.05rem 0.3rem;
          background: rgba(14, 165, 233, 0.18);
          color: var(--color-primary);
          border-radius: 3px;
          font-weight: 700;
        }

        /* Soft Skills / Principles Grid */
        .soft-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.15rem;
          animation: tabFadeIn 0.35s ease-out;
        }
        .soft-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.35rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--border-radius-md);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .soft-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--soft-color);
          opacity: 0.35;
          transition: opacity 0.25s ease;
        }
        .soft-card:hover {
          transform: translateY(-3px);
          border-color: rgba(var(--soft-rgb), 0.35);
          box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.5), 0 0 16px -4px rgba(var(--soft-rgb), 0.15);
          background: rgba(255, 255, 255, 0.035);
        }
        .soft-card:hover::before {
          opacity: 1;
        }
        .soft-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .soft-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .soft-desc {
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        /* Responsive Breakpoints */
        @media (max-width: 992px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .tech-categories-grid,
          .soft-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 680px) {
          .tech-categories-grid,
          .soft-grid {
            grid-template-columns: 1fr;
          }
          .skills-tabs {
            flex-wrap: wrap;
          }
        }
        @media (max-width: 480px) {
          .about-bio,
          .about-skills {
            padding: 1.75rem 1.25rem;
          }
          .bio-intro {
            gap: 1rem;
          }
          .bio-avatar {
            width: 54px;
            height: 54px;
          }
          .bio-initials {
            font-size: 1.2rem;
          }
          .bio-name {
            font-size: 1.15rem;
          }
          .bio-highlight-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }
          .skill-tab {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
