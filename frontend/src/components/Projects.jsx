import React, { useState, useEffect, useContext } from 'react';
import {
  Github,
  ExternalLink,
  Eye,
  FolderGit2,
  X,
  Code2,
  ArrowUpRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Images,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const { API_URL } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        throw new Error('Unexpected data format received from server');
      }
    } catch (err) {
      console.error('Failed to fetch projects from backend:', err);
      setError('Unable to load projects from the database. The backend server may be offline or undergoing maintenance.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [API_URL]);

  // Handle Escape key to close modal & lock scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalProject(null);
    };
    if (activeModalProject) {
      setModalImageIndex(0);
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [activeModalProject]);

  const allTags = ['All', ...new Set(projects.flatMap((p) => p.tags || []))];
  const filteredProjects =
    selectedTag === 'All'
      ? projects
      : projects.filter((p) => p.tags && p.tags.includes(selectedTag));

  // Helper to extract all images for a project
  const getProjectImages = (project) => {
    if (!project) return [];
    if (Array.isArray(project.images) && project.images.length > 0) {
      return project.images;
    }
    if (project.imageUrl) {
      return [project.imageUrl];
    }
    return [];
  };

  const modalImages = activeModalProject ? getProjectImages(activeModalProject) : [];

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (modalImages.length > 1) {
      setModalImageIndex((prev) => (prev + 1) % modalImages.length);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (modalImages.length > 1) {
      setModalImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
    }
  };

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="section-header-wrap">
          <h2 className="section-title">Projects</h2>
          <p className="section-desc">
            A showcase of full-stack web applications, REST APIs, and responsive frontend solutions.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="projects-loading-container">
            <div className="projects-spinner" />
            <p className="projects-loading-text">Loading projects from database...</p>
          </div>
        )}

        {/* Professional Error State */}
        {!loading && error && (
          <div className="projects-status-card glass-panel projects-status-card--error">
            <div className="status-icon-wrapper status-icon-wrapper--error">
              <AlertTriangle size={32} />
            </div>
            <div className="status-content">
              <div className="status-badge status-badge--error">
                <span className="status-dot red" />
                <span>Service Unavailable</span>
              </div>
              <h3 className="status-title">Unable to Load Projects</h3>
              <p className="status-description">
                We are experiencing difficulty connecting to the database server.
                The backend service may be offline or undergoing maintenance.
              </p>
              <div className="status-actions">
                <button
                  type="button"
                  className="status-btn status-btn--retry"
                  onClick={fetchProjects}
                >
                  <RefreshCw size={14} />
                  <span>Retry Connection</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="projects-status-card glass-panel">
            <div className="status-icon-wrapper">
              <FolderGit2 size={32} />
            </div>
            <div className="status-content">
              <div className="status-badge">
                <span className="status-dot green" />
                <span>Database Synced</span>
              </div>
              <h3 className="status-title">No Projects Found</h3>
              <p className="status-description">
                There are currently no projects listed in the database. Published projects will appear here once added via the admin dashboard.
              </p>
              <div className="status-actions">
                <button
                  type="button"
                  className="status-btn"
                  onClick={fetchProjects}
                >
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Projects Content */}
        {!loading && !error && projects.length > 0 && (
          <>
            {/* Filter Pills */}
            {allTags.length > 1 && (
              <div className="projects-filters">
                {allTags.map((tag) => {
                  const count =
                    tag === 'All'
                      ? projects.length
                      : projects.filter((p) => p.tags && p.tags.includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      className={`filter-btn ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => setSelectedTag(tag)}
                      type="button"
                    >
                      <span>{tag}</span>
                      <span className="filter-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Project Cards Grid */}
            <div className="projects-grid">
              {filteredProjects.map((project) => {
                const cardImages = getProjectImages(project);
                const hasImages = cardImages.length > 0;
                const primaryImage = cardImages[0];
                const hasFooter = Boolean(project.githubLink || project.liveLink);

                return (
                  <div key={project._id} className="project-card glass-panel">
                    {/* Card Preview / Code Mockup */}
                    <div
                      className="project-image-wrapper"
                      onClick={() => setActiveModalProject(project)}
                    >
                      {hasImages ? (
                        <>
                          <img
                            src={primaryImage}
                            alt={project.title}
                            className="project-image"
                          />
                          {cardImages.length > 1 && (
                            <div className="card-images-pill" title={`${cardImages.length} images available`}>
                              <Images size={12} />
                              <span>{cardImages.length}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="project-mockup-header">
                          <div className="mockup-topbar">
                            <div className="mockup-dots">
                              <span className="mockup-dot red" />
                              <span className="mockup-dot yellow" />
                              <span className="mockup-dot green" />
                            </div>
                            <span className="mockup-filename">
                              {project.codeTag || `${(project.tags && project.tags[0]) || 'app'}.jsx`}
                            </span>
                            <span className="mockup-icon">
                              <Code2 size={13} />
                            </span>
                          </div>
                          <div className="mockup-content">
                            <div className="mockup-badge">
                              <FolderGit2 size={13} />
                              <span>{project.category || 'Featured Application'}</span>
                            </div>
                            <div className="mockup-title">{project.title}</div>
                          </div>
                        </div>
                      )}

                      {/* Hover Action Overlay */}
                      <div className="project-hover-overlay">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalProject(project);
                          }}
                          className="overlay-btn overlay-btn--primary"
                          type="button"
                        >
                          <Eye size={15} />
                          <span>View Details</span>
                        </button>
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="overlay-btn overlay-btn--icon"
                            title="Open Live Application"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowUpRight size={17} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="project-card-content">
                      <div className="project-card-meta">
                        <span className="project-meta-category">
                          {project.category || 'Full Stack Application'}
                        </span>
                        {project.liveLink && (
                          <span className="project-live-indicator" title="Live Deployment">
                            <span className="live-pulse-dot" /> Live
                          </span>
                        )}
                      </div>

                      <h3
                        className="project-card-title"
                        onClick={() => setActiveModalProject(project)}
                      >
                        {project.title}
                      </h3>

                      <p className="project-card-description">{project.description}</p>

                      <div className="project-card-tags">
                        {project.tags &&
                          project.tags.map((tag, idx) => (
                            <span key={idx} className="project-tag-pill">
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Optional Project Card Footer — Render ONLY if links exist */}
                    {hasFooter && (
                      <div className="project-card-footer">
                        <div className="footer-links">
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="card-link github"
                              title="View GitHub Repository"
                            >
                              <Github size={15} />
                              <span>Code</span>
                            </a>
                          )}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="card-link live"
                              title="Visit Live Application"
                            >
                              <ExternalLink size={15} />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => setActiveModalProject(project)}
                          className="card-detail-trigger"
                          type="button"
                        >
                          <span>Details</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {activeModalProject && (
        <div
          className="modal-overlay"
          onClick={() => setActiveModalProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-content glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setActiveModalProject(null)}
              aria-label="Close details"
              type="button"
            >
              <X size={18} />
            </button>

            <div className="modal-header">
              <div className="modal-meta-row">
                <span className="modal-category">
                  {activeModalProject.category || 'Featured Application'}
                </span>
                {activeModalProject.liveLink && (
                  <span className="modal-live-badge">
                    <span className="live-pulse-dot" /> Live Deployed
                  </span>
                )}
              </div>
              <h3 className="modal-title">{activeModalProject.title}</h3>
              <div className="modal-tags">
                {activeModalProject.tags &&
                  activeModalProject.tags.map((tag, idx) => (
                    <span key={idx} className="project-tag-pill">
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            <div className="modal-body">
              {/* Image Preview / Gallery or Mockup */}
              {modalImages.length > 0 ? (
                <div className="modal-gallery-container">
                  <div className="modal-main-image-wrap">
                    <img
                      src={modalImages[modalImageIndex] || modalImages[0]}
                      alt={`${activeModalProject.title} preview`}
                      className="modal-image"
                    />

                    {modalImages.length > 1 && (
                      <>
                        <button
                          className="modal-nav-arrow modal-nav-arrow--prev"
                          onClick={handlePrevImage}
                          aria-label="Previous image"
                          type="button"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          className="modal-nav-arrow modal-nav-arrow--next"
                          onClick={handleNextImage}
                          aria-label="Next image"
                          type="button"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="modal-image-counter">
                          {modalImageIndex + 1} / {modalImages.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row if multiple images */}
                  {modalImages.length > 1 && (
                    <div className="modal-thumbnails-strip">
                      {modalImages.map((img, idx) => (
                        <button
                          key={idx}
                          className={`modal-thumb-btn ${idx === modalImageIndex ? 'modal-thumb-btn--active' : ''}`}
                          onClick={() => setModalImageIndex(idx)}
                          type="button"
                        >
                          <img src={img} alt={`Thumbnail ${idx + 1}`} className="modal-thumb-img" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="modal-mockup-wrap">
                  <div className="mockup-topbar">
                    <div className="mockup-dots">
                      <span className="mockup-dot red" />
                      <span className="mockup-dot yellow" />
                      <span className="mockup-dot green" />
                    </div>
                    <span className="mockup-filename">
                      {activeModalProject.codeTag || `${(activeModalProject.tags && activeModalProject.tags[0]) || 'app'}.jsx`}
                    </span>
                    <span className="mockup-icon">
                      <Code2 size={13} />
                    </span>
                  </div>
                  <div className="mockup-content">
                    <div className="mockup-badge">
                      <FolderGit2 size={13} />
                      <span>{activeModalProject.category || 'Featured Application'}</span>
                    </div>
                    <div className="mockup-title">{activeModalProject.title}</div>
                  </div>
                </div>
              )}

              <div className="modal-description-wrapper">
                <h4 className="modal-section-title">
                  <Sparkles size={16} /> About This Project
                </h4>
                <div className="modal-detailed-desc">
                  {activeModalProject.detailedDescription ||
                    activeModalProject.description}
                </div>
              </div>
            </div>

            {/* Optional Modal Footer */}
            {(activeModalProject.githubLink || activeModalProject.liveLink) && (
              <div className="modal-footer">
                {activeModalProject.githubLink && (
                  <a
                    href={activeModalProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-btn modal-btn--secondary"
                  >
                    <Github size={16} />
                    <span>View GitHub Repository</span>
                  </a>
                )}
                {activeModalProject.liveLink && (
                  <a
                    href={activeModalProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-btn modal-btn--primary"
                  >
                    <ExternalLink size={16} />
                    <span>Visit Live Application</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .projects-section {
          position: relative;
        }

        .section-header-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .section-header-wrap .section-title {
          left: auto;
          transform: none;
          display: inline-block;
          margin: 0 auto;
          text-align: center;
        }
        .section-desc {
          max-width: 620px;
          margin: 1.25rem auto 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* ==========================================
           LOADING STATE
           ========================================== */
        .projects-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 1rem;
          gap: 1.25rem;
          animation: statusFadeIn 0.3s ease;
        }

        .projects-spinner {
          width: 44px;
          height: 44px;
          border: 3px solid rgba(14, 165, 233, 0.15);
          border-radius: 50%;
          border-top-color: var(--color-primary, #0ea5e9);
          animation: spinAnimation 0.8s linear infinite;
        }

        .projects-loading-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: var(--text-secondary);
          letter-spacing: 0.02em;
        }

        /* ==========================================
           PROFESSIONAL ERROR & EMPTY STATES
           ========================================== */
        .projects-status-card {
          max-width: 600px;
          margin: 2rem auto 4rem;
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
          animation: statusFadeIn 0.35s ease;
        }

        .projects-status-card--error {
          border-color: rgba(239, 68, 68, 0.25);
          box-shadow: 0 20px 40px -15px rgba(239, 68, 68, 0.12);
        }

        @keyframes statusFadeIn {
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

        .status-dot.green {
          background: #10b981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.7);
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

        @keyframes spinAnimation {
          to {
            transform: rotate(360deg);
          }
        }

        /* Filter Pills */
        .projects-filters {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 2.75rem;
        }
        .filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 1.05rem;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-secondary);
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .filter-count {
          font-size: 0.72rem;
          padding: 0.1rem 0.4rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          font-family: var(--font-mono);
          font-weight: 500;
        }
        .filter-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(14, 165, 233, 0.25);
        }
        .filter-btn.active {
          background: var(--color-primary);
          color: #050d1a;
          border-color: var(--color-primary);
          font-weight: 700;
          box-shadow: 0 0 16px rgba(14, 165, 233, 0.35);
        }
        .filter-btn.active .filter-count {
          background: rgba(5, 13, 26, 0.25);
          color: #050d1a;
        }

        /* Project Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.75rem;
        }

        .project-card {
          display: flex;
          flex-direction: column;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(10, 15, 26, 0.65);
        }
        .project-card:hover {
          transform: translateY(-5px);
          border-color: rgba(14, 165, 233, 0.35);
          box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.6), 0 0 20px -6px rgba(14, 165, 233, 0.18);
        }

        /* Project Image / Mockup */
        .project-image-wrapper {
          position: relative;
          height: 195px;
          width: 100%;
          overflow: hidden;
          background: rgba(5, 13, 26, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
        }
        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-card:hover .project-image {
          transform: scale(1.04);
        }

        .card-images-pill {
          position: absolute;
          top: 0.65rem;
          right: 0.65rem;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          background: rgba(5, 13, 26, 0.75);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Mockup Header */
        .project-mockup-header,
        .modal-mockup-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(circle at 85% 20%, rgba(14, 165, 233, 0.15), transparent 55%),
            radial-gradient(circle at 15% 85%, rgba(6, 214, 160, 0.1), transparent 55%),
            rgba(5, 13, 26, 0.85);
          padding: 0.85rem 1rem;
        }
        .modal-mockup-wrap {
          min-height: 180px;
          border-radius: var(--border-radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .mockup-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .mockup-dots {
          display: flex;
          gap: 5px;
        }
        .mockup-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        .mockup-dot.red { background: #f43f5e; opacity: 0.8; }
        .mockup-dot.yellow { background: #f59e0b; opacity: 0.8; }
        .mockup-dot.green { background: #10b981; opacity: 0.8; }
        .mockup-filename {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .mockup-icon {
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }
        .mockup-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.4rem;
        }
        .mockup-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .mockup-title {
          font-family: 'Space Grotesk', var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }

        /* Hover Overlay */
        .project-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(5, 13, 26, 0.78);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .project-image-wrapper:hover .project-hover-overlay {
          opacity: 1;
        }
        .overlay-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.1rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .overlay-btn--primary {
          background: var(--color-primary);
          color: #050d1a;
        }
        .overlay-btn--primary:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }
        .overlay-btn--icon {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.55rem 0.65rem;
        }
        .overlay-btn--icon:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--color-accent);
          transform: translateY(-2px);
        }

        /* Card Content */
        .project-card-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .project-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .project-meta-category {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .project-live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--color-success);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .live-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-success);
          animation: pulseGlow 2s infinite;
        }

        .project-card-title {
          font-size: 1.22rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: color 0.2s ease;
          line-height: 1.35;
        }
        .project-card-title:hover {
          color: var(--color-primary);
        }

        .project-card-description {
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: auto;
        }

        .project-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding-top: 0.4rem;
        }
        .project-tag-pill {
          padding: 0.25rem 0.6rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }
        .project-card:hover .project-tag-pill {
          border-color: rgba(14, 165, 233, 0.2);
          color: var(--text-primary);
        }

        /* Optional Card Footer */
        .project-card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(5, 13, 26, 0.4);
        }
        .footer-links {
          display: flex;
          gap: 1.15rem;
        }
        .card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }
        .card-link:hover {
          color: var(--color-primary);
        }
        .card-link.live:hover {
          color: var(--color-accent);
        }

        .card-detail-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .card-detail-trigger:hover {
          color: var(--color-primary);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 12, 0.85);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: modalFadeIn 0.25s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content {
          width: 100%;
          max-width: 760px;
          max-height: 88vh;
          overflow-y: auto;
          position: relative;
          padding: 2.25rem !important;
          background: rgba(10, 16, 28, 0.95);
          border: 1px solid rgba(14, 165, 233, 0.25);
          border-radius: var(--border-radius-md);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(14, 165, 233, 0.1);
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalSlideUp {
          from { transform: translateY(24px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .modal-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 5;
        }
        .modal-close:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(90deg);
        }

        .modal-header {
          margin-bottom: 1.5rem;
          padding-right: 2.5rem;
        }
        .modal-meta-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .modal-category {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .modal-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.15rem 0.55rem;
          border-radius: 50px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-success);
        }
        .modal-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.85rem;
        }
        .modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Modal Gallery & Thumbnails */
        .modal-gallery-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .modal-main-image-wrap {
          position: relative;
          width: 100%;
          max-height: 360px;
          background: rgba(5, 13, 26, 0.9);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-image {
          width: 100%;
          max-height: 360px;
          object-fit: contain;
        }
        .modal-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(5, 13, 26, 0.75);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-nav-arrow:hover {
          background: var(--color-primary);
          color: #050d1a;
          border-color: var(--color-primary);
        }
        .modal-nav-arrow--prev { left: 0.75rem; }
        .modal-nav-arrow--next { right: 0.75rem; }
        .modal-image-counter {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          background: rgba(5, 13, 26, 0.8);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-primary);
        }

        .modal-thumbnails-strip {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.35rem;
        }
        .modal-thumb-btn {
          width: 64px;
          height: 48px;
          border-radius: 4px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.4);
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .modal-thumb-btn:hover {
          border-color: rgba(14, 165, 233, 0.4);
        }
        .modal-thumb-btn--active {
          border-color: var(--color-primary);
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.4);
        }
        .modal-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }
        .modal-detailed-desc {
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--text-secondary);
          white-space: pre-wrap;
        }

        .modal-footer {
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: flex-end;
          gap: 0.85rem;
        }
        .modal-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .modal-btn--primary {
          background: var(--color-primary);
          color: #050d1a;
        }
        .modal-btn--primary:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.35);
        }
        .modal-btn--secondary {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .modal-btn--secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(14, 165, 233, 0.3);
          transform: translateY(-2px);
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .modal-content {
            padding: 1.5rem !important;
          }
          .modal-title {
            font-size: 1.4rem;
          }
          .modal-footer {
            flex-direction: column-reverse;
          }
          .modal-btn {
            width: 100%;
            justify-content: center;
          }
        }
        @media (max-width: 640px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
          .project-card-footer {
            flex-wrap: wrap;
            gap: 0.75rem;
          }
        }
        @media (max-width: 425px) {
          .projects-filters {
            gap: 0.4rem;
          }
          .filter-btn {
            padding: 0.4rem 0.85rem;
            font-size: 0.76rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;
