import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Rocket, Heart, BookOpen } from 'lucide-react';

const Experience = () => {
  const { } = useContext(AuthContext);

  const highlights = [
    {
      icon: <GraduationCap size={24} />,
      title: 'Computer Science Background',
      description:
        'Solid academic foundation in software engineering, data structures, algorithms, and web technologies.',
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Self-Driven Learner',
      description:
        'Continuously learning through hands-on projects, online courses, and building full-stack applications using the MERN stack.',
    },
    {
      icon: <Rocket size={24} />,
      title: 'Ready to Contribute',
      description:
        'Eager to join a professional team, collaborate on real-world challenges, and grow as a software developer from day one.',
    },
    {
      icon: <Heart size={24} />,
      title: 'Passionate About Development',
      description:
        'Genuinely passionate about writing clean code, building user-friendly interfaces, and solving problems through technology.',
    },
  ];

  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <h2 className="section-title">Experience</h2>

        <div className="exp-intro glass-panel">
          <div className="exp-intro-content">
            <span className="exp-intro-badge">Fresher & Motivated</span>
            <h3 className="exp-intro-heading">
              Starting My Professional Journey
            </h3>
            <p className="exp-intro-text">
              I am a passionate Junior Full Stack Developer at the beginning of my professional career. While I may be new to the industry, I bring strong technical foundations in the MERN stack, a genuine love for problem solving, and an unwavering drive to learn and contribute to impactful projects.
            </p>
            <p className="exp-intro-text">
              I am actively seeking my first professional role where I can apply my skills, grow under experienced mentorship, and make a real difference in a collaborative team environment.
            </p>
          </div>
        </div>

        <div className="highlights-grid">
          {highlights.map((item, index) => (
            <div key={index} className="highlight-card glass-panel">
              <div className="highlight-icon">{item.icon}</div>
              <h4 className="highlight-title">{item.title}</h4>
              <p className="highlight-desc">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="open-to-work glass-panel">
          <div className="otw-left">
            <span className="otw-dot"></span>
            <div>
              <p className="otw-label">Current Status</p>
              <p className="otw-status">Open to Work — Actively Seeking Opportunities</p>
            </div>
          </div>
          <div className="otw-tags">
            <span className="otw-tag">Full-Time</span>
            <span className="otw-tag">Internship</span>
            <span className="otw-tag">Remote / On-Site</span>
          </div>
        </div>
      </div>

      <style>{`
        .experience-section {
          background-color: var(--bg-secondary);
        }
        .exp-intro {
          padding: 3rem;
          margin-bottom: 2.5rem;
          border-left: 3px solid var(--color-primary);
        }
        .exp-intro-content {
          max-width: 800px;
        }
        .exp-intro-badge {
          display: inline-block;
          padding: 0.3rem 0.9rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 50px;
          background: rgba(79, 70, 229, 0.12);
          color: #a5b4fc;
          border: 1px solid rgba(79, 70, 229, 0.25);
          margin-bottom: 1rem;
        }
        .exp-intro-heading {
          font-size: 1.9rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }
        .exp-intro-text {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        .exp-intro-text:last-child { margin-bottom: 0; }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .highlight-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all var(--transition-normal);
        }
        .highlight-card:hover {
          transform: translateY(-4px);
          border-color: rgba(79, 70, 229, 0.25);
        }
        .highlight-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(79, 70, 229, 0.1);
          border: 1px solid rgba(79, 70, 229, 0.2);
          color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .highlight-title {
          font-size: 1.1rem; font-weight: 700; color: var(--text-primary);
        }
        .highlight-desc {
          font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);
        }

        .open-to-work {
          padding: 1.75rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          border-color: rgba(16, 185, 129, 0.2);
          background: rgba(16, 185, 129, 0.04);
        }
        .otw-left {
          display: flex; align-items: center; gap: 1.25rem;
        }
        .otw-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--color-success);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        .otw-label {
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 0.2rem;
        }
        .otw-status {
          font-size: 1rem; font-weight: 600; color: var(--color-success);
        }
        .otw-tags {
          display: flex; flex-wrap: wrap; gap: 0.6rem;
        }
        .otw-tag {
          padding: 0.3rem 0.85rem; font-size: 0.8rem; font-weight: 600;
          border-radius: 50px;
          background: rgba(16, 185, 129, 0.1);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.7); }
          70% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }

        @media (max-width: 768px) {
          .highlights-grid { grid-template-columns: 1fr; }
          .exp-intro { padding: 2rem 1.5rem; }
          .open-to-work { padding: 1.5rem; flex-direction: column; align-items: flex-start; }
          .exp-intro-heading { font-size: 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default Experience;
