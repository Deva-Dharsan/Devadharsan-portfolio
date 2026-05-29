import React, { useState, useEffect, useContext } from 'react';
import { Github, ExternalLink, Layers, Eye, FolderGit2, X, Rocket } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const { API_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        // silently fail — show empty state
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [API_URL]);

  const allTags = ['All', ...new Set(projects.flatMap((p) => p.tags || []))];
  const filteredProjects = selectedTag === 'All'
    ? projects
    : projects.filter((p) => p.tags && p.tags.includes(selectedTag));

  if (loading) {
    return (
      <section id="projects" className="projects-section">
        <div className="container">
          <h2 className="section-title">Projects</h2>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <h2 className="section-title">Projects</h2>

        {projects.length > 0 && (
          <div className="projects-filters">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`filter-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="coming-soon-panel glass-panel">
            <div className="cs-icon-wrapper">
              <Rocket size={48} className="cs-icon" />
            </div>
            <h3 className="cs-heading">Projects Coming Soon</h3>
            <p className="cs-text">
              I am actively working on exciting projects using the MERN stack.<br />
              Check back soon — great things are in progress!
            </p>
            <div className="cs-badges">
              <span className="cs-badge">React.js</span>
              <span className="cs-badge">Node.js</span>
              <span className="cs-badge">Express.js</span>
              <span className="cs-badge">MongoDB</span>
            </div>
            <a
              href="https://github.com/Deva-Dharsan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary cs-github-btn"
            >
              <Github size={18} />
              Follow on GitHub
            </a>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project._id} className="project-card glass-panel">
                <div className="project-image-wrapper">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="project-image" />
                  ) : (
                    <div className="project-placeholder-image">
                      <Layers size={32} className="placeholder-icon" />
                    </div>
                  )}
                  <div className="project-hover-overlay">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="btn btn-primary overlay-btn"
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="project-card-content">
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-description">{project.description}</p>
                  <div className="project-card-tags">
                    {project.tags && project.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="project-card-footer">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="card-link">
                      <Github size={18} /> Code
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="card-link live">
                      <ExternalLink size={18} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {activeModalProject && (
        <div className="modal-overlay" onClick={() => setActiveModalProject(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModalProject(null)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <h3 className="modal-title">{activeModalProject.title}</h3>
              <div className="modal-tags">
                {activeModalProject.tags && activeModalProject.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="modal-body">
              {activeModalProject.imageUrl && (
                <img src={activeModalProject.imageUrl} alt={activeModalProject.title} className="modal-image" />
              )}
              <div className="modal-description-wrapper">
                <h4>About Project</h4>
                <p className="modal-detailed-desc">
                  {activeModalProject.detailedDescription || activeModalProject.description}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              {activeModalProject.githubLink && (
                <a href={activeModalProject.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <Github size={18} /> View GitHub Source
                </a>
              )}
              {activeModalProject.liveLink && (
                <a href={activeModalProject.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <ExternalLink size={18} /> Visit Live Application
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .projects-section { position: relative; }
        .loading-container {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 4rem 0; color: var(--text-secondary);
        }
        .spinner {
          width: 50px; height: 50px;
          border: 3px solid rgba(79, 70, 229, 0.1);
          border-radius: 50%; border-top-color: var(--color-primary);
          animation: spin 1s ease-in-out infinite; margin-bottom: 1.5rem;
        }
        .projects-filters {
          display: flex; justify-content: center; flex-wrap: wrap;
          gap: 0.75rem; margin-bottom: 3rem;
        }
        .filter-btn {
          padding: 0.5rem 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-secondary); border-radius: 50px; cursor: pointer;
          font-family: var(--font-display); font-weight: 600;
          transition: all var(--transition-normal);
        }
        .filter-btn:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
        .filter-btn.active {
          background: var(--color-primary); color: white;
          border-color: var(--color-primary); box-shadow: var(--shadow-glow);
        }
        /* Coming Soon Panel */
        .coming-soon-panel {
          max-width: 600px; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 4rem 3rem;
          border: 1px solid rgba(79, 70, 229, 0.2);
        }
        .cs-icon-wrapper {
          width: 90px; height: 90px; border-radius: 50%;
          background: rgba(79, 70, 229, 0.12);
          border: 2px solid rgba(79, 70, 229, 0.25);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.75rem;
          box-shadow: 0 0 30px rgba(79, 70, 229, 0.15);
          animation: floatOrb 6s ease-in-out infinite;
        }
        .cs-icon { color: var(--color-primary); }
        .cs-heading {
          font-size: 1.8rem; font-weight: 800;
          color: var(--text-primary); margin-bottom: 1rem;
        }
        .cs-text {
          font-size: 1.05rem; line-height: 1.7;
          color: var(--text-secondary); margin-bottom: 2rem;
        }
        .cs-badges {
          display: flex; flex-wrap: wrap; gap: 0.6rem;
          justify-content: center; margin-bottom: 2rem;
        }
        .cs-badge {
          padding: 0.3rem 0.9rem; font-size: 0.8rem; font-weight: 600;
          border-radius: 50px; background: rgba(6, 182, 212, 0.1);
          color: var(--color-accent); border: 1px solid rgba(6, 182, 212, 0.2);
        }
        .cs-github-btn { min-width: 200px; justify-content: center; }
        /* Project Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
        }
        .project-card {
          display: flex; flex-direction: column; overflow: hidden;
          transition: all var(--transition-normal); height: 100%;
        }
        .project-card:hover {
          transform: translateY(-5px); box-shadow: var(--shadow-lg);
          border-color: rgba(79, 70, 229, 0.3);
        }
        .project-image-wrapper {
          position: relative; height: 200px; width: 100%;
          background: rgba(0,0,0,0.2); overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .project-image { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
        .project-card:hover .project-image { transform: scale(1.05); }
        .project-placeholder-image {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(79,70,229,0.1), rgba(6,182,212,0.1));
          color: var(--color-primary);
        }
        .project-hover-overlay {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10,12,16,0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity var(--transition-normal);
        }
        .project-image-wrapper:hover .project-hover-overlay { opacity: 1; }
        .overlay-btn { font-size: 0.85rem; padding: 0.6rem 1.2rem; }
        .project-card-content { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }
        .project-card-title { font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--text-primary); }
        .project-card-description {
          font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.25rem; flex-grow: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .project-card-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .project-card-footer {
          padding: 1.25rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.04);
          display: flex; gap: 1.5rem; background: rgba(0,0,0,0.08);
        }
        .card-link { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
        .card-link:hover { color: var(--color-primary); }
        .card-link.live:hover { color: var(--color-accent); }
        /* Modal */
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          padding: 2rem; animation: fadeIn 0.3s ease-out;
        }
        .modal-content {
          width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto;
          position: relative; padding: 2.5rem !important;
          animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .modal-close {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-secondary); width: 38px; height: 38px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all var(--transition-fast);
        }
        .modal-close:hover { color: var(--text-primary); background: rgba(255,255,255,0.08); transform: rotate(90deg); }
        .modal-header { margin-bottom: 1.5rem; padding-right: 2.5rem; }
        .modal-title { font-size: 2rem; color: var(--text-primary); margin-bottom: 0.75rem; }
        .modal-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .modal-body { display: flex; flex-direction: column; gap: 2rem; }
        .modal-image { width: 100%; max-height: 350px; object-fit: cover; border-radius: var(--border-radius-sm); border: 1px solid rgba(255,255,255,0.08); }
        .modal-description-wrapper h4 { font-size: 1.2rem; margin-bottom: 0.75rem; color: var(--text-primary); }
        .modal-detailed-desc { font-size: 1.05rem; line-height: 1.7; white-space: pre-wrap; }
        .modal-footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: flex-end; gap: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes floatOrb {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @media (max-width: 768px) {
          .modal-content { padding: 1.5rem !important; }
          .modal-footer { flex-direction: column-reverse; }
          .modal-footer .btn { width: 100%; }
          .coming-soon-panel { padding: 3rem 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default Projects;
