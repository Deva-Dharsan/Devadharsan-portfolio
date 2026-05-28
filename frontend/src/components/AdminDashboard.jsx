import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Layers, Briefcase, Mail, Trash2, Plus, Edit, Check, X,
  FileSpreadsheet, Eye, EyeOff, RefreshCw, Download, Search,
  ChevronDown, ChevronUp, Activity, Terminal, Shield, Clock,
  Database, Zap, MessageSquare, BarChart3
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const { token, API_URL } = useContext(AuthContext);

  // States for fetched items
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]);

  // States for loadings/errors
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState({ success: null, error: null });

  // States for Forms (Add / Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Message search and expansion
  const [msgSearch, setMsgSearch] = useState('');
  const [expandedMsgs, setExpandedMsgs] = useState({});

  // Live clock
  const [clock, setClock] = useState(new Date());

  // Animated counters
  const [animatedStats, setAnimatedStats] = useState({ projects: 0, experiences: 0, unread: 0, total: 0 });

  // Canvas ref for matrix rain
  const canvasRef = useRef(null);

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    tags: '',
    imageUrl: '',
    githubLink: '',
    liveLink: '',
    order: 0,
  });

  // Experience Form State
  const [experienceForm, setExperienceForm] = useState({
    role: '',
    company: '',
    duration: '',
    description: '',
    skills: '',
    order: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [API_URL]);

  // Live clock tick
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Animated count-up effect
  useEffect(() => {
    const targets = {
      projects: projects.length,
      experiences: experiences.length,
      unread: messages.filter(m => m.status === 'unread').length,
      total: messages.length,
    };
    const duration = 800;
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setAnimatedStats({
        projects: Math.round(targets.projects * ease),
        experiences: Math.round(targets.experiences * ease),
        unread: Math.round(targets.unread * ease),
        total: Math.round(targets.total * ease),
      });
      if (step >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [projects.length, experiences.length, messages.length]);

  // Matrix rain canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'アイウエオカキクケコ0123456789ABCDEF<>/{}[];';
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff4115';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 55);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [projRes, expRes, msgRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/experiences`),
        fetch(`${API_URL}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (projRes.ok) setProjects(await projRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      triggerStatus(null, 'SYNC_FAILED: Unable to fetch datasets.');
    } finally {
      setLoading(false);
    }
  };

  const triggerStatus = (success, error) => {
    setActionStatus({ success, error });
    setTimeout(() => {
      setActionStatus({ success: null, error: null });
    }, 4000);
  };

  // --- Export Data ---
  const handleExport = () => {
    const data = { projects, experiences, messages, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerStatus('DATA_EXPORTED: Download initiated.', null);
  };

  // --- Toggle message expansion ---
  const toggleMsgExpand = (id) => {
    setExpandedMsgs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Project CRUD handlers ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEditing ? `${API_URL}/projects/${editingId}` : `${API_URL}/projects`;
    const method = isEditing ? 'PUT' : 'POST';

    const formattedTags = projectForm.tags
      ? projectForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...projectForm, tags: formattedTags }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Action failed');
      }

      triggerStatus(
        isEditing ? 'PROJECT_UPDATED: Changes saved.' : 'PROJECT_CREATED: Entry added.',
        null
      );
      
      resetProjectForm();
      fetchDashboardData();
    } catch (err) {
      triggerStatus(null, err.message);
    }
  };

  const startEditProject = (project) => {
    setIsEditing(true);
    setEditingId(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      detailedDescription: project.detailedDescription || '',
      tags: project.tags ? project.tags.join(', ') : '',
      imageUrl: project.imageUrl || '',
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      order: project.order || 0,
    });
  };

  const deleteProject = async (id) => {
    if (!window.confirm('CONFIRM: Delete this project entry?')) return;
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete project');

      triggerStatus('PROJECT_DELETED: Entry removed.', null);
      fetchDashboardData();
    } catch (err) {
      triggerStatus(null, err.message);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      detailedDescription: '',
      tags: '',
      imageUrl: '',
      githubLink: '',
      liveLink: '',
      order: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  // --- Experience CRUD handlers ---
  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEditing ? `${API_URL}/experiences/${editingId}` : `${API_URL}/experiences`;
    const method = isEditing ? 'PUT' : 'POST';

    const formattedSkills = experienceForm.skills
      ? experienceForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...experienceForm, skills: formattedSkills }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Action failed');
      }

      triggerStatus(
        isEditing ? 'MILESTONE_UPDATED: Changes saved.' : 'MILESTONE_CREATED: Entry added.',
        null
      );
      
      resetExperienceForm();
      fetchDashboardData();
    } catch (err) {
      triggerStatus(null, err.message);
    }
  };

  const startEditExperience = (exp) => {
    setIsEditing(true);
    setEditingId(exp._id);
    setExperienceForm({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
      skills: exp.skills ? exp.skills.join(', ') : '',
      order: exp.order || 0,
    });
  };

  const deleteExperience = async (id) => {
    if (!window.confirm('CONFIRM: Remove this milestone?')) return;
    try {
      const response = await fetch(`${API_URL}/experiences/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete experience');

      triggerStatus('MILESTONE_REMOVED: Entry deleted.', null);
      fetchDashboardData();
    } catch (err) {
      triggerStatus(null, err.message);
    }
  };

  const resetExperienceForm = () => {
    setExperienceForm({
      role: '',
      company: '',
      duration: '',
      description: '',
      skills: '',
      order: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  // --- Message Actions ---
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/messages/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to update message status');

      triggerStatus('MSG_STATUS: Marked as read.', null);
      fetchDashboardData();
    } catch (err) {
      triggerStatus(null, err.message);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('CONFIRM: Delete this message permanently?')) return;
    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete message');

      triggerStatus('MSG_DELETED: Entry purged.', null);
      fetchDashboardData();
    } catch (err) {
      triggerStatus(null, err.message);
    }
  };

  // Filtered messages
  const filteredMessages = messages.filter(msg => {
    if (!msgSearch) return true;
    const q = msgSearch.toLowerCase();
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q)
    );
  });

  if (loading && projects.length === 0) {
    return (
      <div className="hk-dash-wrapper">
        <canvas ref={canvasRef} className="hk-matrix-canvas" />
        <div className="hk-scanlines" />
        <div className="hk-loading">
          <div className="hk-spinner" />
          <p>&gt; syncing_datasets...</p>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'projects', label: 'Projects', icon: Layers, count: projects.length },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: experiences.length },
    { id: 'messages', label: 'Messages', icon: Mail, count: messages.filter(m => m.status === 'unread').length },
  ];

  return (
    <div className="hk-dash-wrapper">
      <canvas ref={canvasRef} className="hk-matrix-canvas" />
      <div className="hk-scanlines" />

      <div className="hk-dash-container">
        {/* Header */}
        <div className="hk-dash-header">
          <div className="hk-header-left">
            <Terminal size={20} className="hk-header-icon" />
            <h1 className="hk-glitch" data-text="CONTROL_PANEL">CONTROL_PANEL</h1>
          </div>
          <div className="hk-header-right">
            <div className="hk-clock">
              <Clock size={13} />
              <span>{clock.toLocaleTimeString('en-US', { hour12: false })}</span>
            </div>
            <div className="hk-status-dot" />
            <span className="hk-status-text">ONLINE</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="hk-stats-row">
          <div className="hk-stat-card">
            <div className="hk-stat-icon hk-stat-icon--blue"><Database size={18} /></div>
            <div className="hk-stat-info">
              <span className="hk-stat-num">{animatedStats.projects}</span>
              <span className="hk-stat-label">Projects</span>
            </div>
          </div>
          <div className="hk-stat-card">
            <div className="hk-stat-icon hk-stat-icon--purple"><Briefcase size={18} /></div>
            <div className="hk-stat-info">
              <span className="hk-stat-num">{animatedStats.experiences}</span>
              <span className="hk-stat-label">Experience</span>
            </div>
          </div>
          <div className="hk-stat-card">
            <div className="hk-stat-icon hk-stat-icon--yellow"><Zap size={18} /></div>
            <div className="hk-stat-info">
              <span className="hk-stat-num">{animatedStats.unread}</span>
              <span className="hk-stat-label">Unread</span>
            </div>
          </div>
          <div className="hk-stat-card">
            <div className="hk-stat-icon hk-stat-icon--green"><MessageSquare size={18} /></div>
            <div className="hk-stat-info">
              <span className="hk-stat-num">{animatedStats.total}</span>
              <span className="hk-stat-label">Total Msgs</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="hk-quick-actions">
          <button className="hk-action-btn" onClick={fetchDashboardData}>
            <RefreshCw size={14} />
            <span>REFRESH</span>
          </button>
          <button className="hk-action-btn" onClick={handleExport}>
            <Download size={14} />
            <span>EXPORT_JSON</span>
          </button>
        </div>

        {/* Status alerts */}
        {actionStatus.success && (
          <div className="hk-alert hk-alert--success">
            <Check size={14} />
            <span>{actionStatus.success}</span>
          </div>
        )}
        {actionStatus.error && (
          <div className="hk-alert hk-alert--error">
            <X size={14} />
            <span>{actionStatus.error}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="hk-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`hk-tab ${activeTab === tab.id ? 'hk-tab--active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'projects') resetProjectForm();
                if (tab.id === 'experience') resetExperienceForm();
              }}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              {tab.count > 0 && <span className="hk-tab-badge">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="hk-content" key={activeTab}>

          {/* ============= PROJECTS ============= */}
          {activeTab === 'projects' && (
            <div className="hk-pane">
              <h2 className="hk-pane-title">
                &gt; {isEditing ? 'edit_project' : 'new_project'}
              </h2>

              <div className="hk-form-card">
                <form onSubmit={handleProjectSubmit}>
                  <div className="hk-form-row">
                    <div className="hk-field">
                      <label className="hk-label">project_title</label>
                      <input
                        type="text"
                        className="hk-input"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="E-Commerce App"
                      />
                    </div>
                    <div className="hk-field">
                      <label className="hk-label">order_index</label>
                      <input
                        type="number"
                        className="hk-input"
                        value={projectForm.order}
                        onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="hk-field">
                    <label className="hk-label">short_description</label>
                    <input
                      type="text"
                      className="hk-input"
                      required
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="A short snippet explaining the project."
                    />
                  </div>

                  <div className="hk-field">
                    <label className="hk-label">detailed_description</label>
                    <textarea
                      className="hk-input hk-textarea"
                      value={projectForm.detailedDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, detailedDescription: e.target.value })}
                      placeholder="Comprehensive explanation of tech choice, features..."
                    />
                  </div>

                  <div className="hk-field">
                    <label className="hk-label">tags // comma_separated</label>
                    <input
                      type="text"
                      className="hk-input"
                      value={projectForm.tags}
                      onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                      placeholder="React, Node.js, Express, MongoDB"
                    />
                  </div>

                  <div className="hk-field">
                    <label className="hk-label">image_url</label>
                    <input
                      type="text"
                      className="hk-input"
                      value={projectForm.imageUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/project.png"
                    />
                  </div>

                  <div className="hk-form-row">
                    <div className="hk-field">
                      <label className="hk-label">github_url</label>
                      <input
                        type="url"
                        className="hk-input"
                        value={projectForm.githubLink}
                        onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="hk-field">
                      <label className="hk-label">live_url</label>
                      <input
                        type="url"
                        className="hk-input"
                        value={projectForm.liveLink}
                        onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                        placeholder="https://mysite.com"
                      />
                    </div>
                  </div>

                  <div className="hk-form-actions">
                    <button type="submit" className="hk-btn-primary">
                      {isEditing ? 'UPDATE_PROJECT' : 'SAVE_PROJECT'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={resetProjectForm} className="hk-btn-secondary">
                        CANCEL
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <h2 className="hk-pane-title" style={{ marginTop: '2.5rem' }}>&gt; existing_projects</h2>
              <div className="hk-item-list">
                {projects.map((proj, idx) => (
                  <div key={proj._id} className="hk-item-row" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="hk-item-meta">
                      <h4>{proj.title} <span className="hk-badge">idx:{proj.order}</span></h4>
                      <p>{proj.description}</p>
                    </div>
                    <div className="hk-item-actions">
                      <button onClick={() => startEditProject(proj)} className="hk-icon-btn hk-icon-btn--edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => deleteProject(proj._id)} className="hk-icon-btn hk-icon-btn--delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="hk-empty">
                    <Layers size={32} />
                    <p>&gt; no_projects_found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============= EXPERIENCE ============= */}
          {activeTab === 'experience' && (
            <div className="hk-pane">
              <h2 className="hk-pane-title">
                &gt; {isEditing ? 'edit_milestone' : 'new_milestone'}
              </h2>

              <div className="hk-form-card">
                <form onSubmit={handleExperienceSubmit}>
                  <div className="hk-form-row">
                    <div className="hk-field">
                      <label className="hk-label">role_title</label>
                      <input
                        type="text"
                        className="hk-input"
                        required
                        value={experienceForm.role}
                        onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                        placeholder="Senior Developer"
                      />
                    </div>
                    <div className="hk-field">
                      <label className="hk-label">company_name</label>
                      <input
                        type="text"
                        className="hk-input"
                        required
                        value={experienceForm.company}
                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                        placeholder="Google"
                      />
                    </div>
                  </div>

                  <div className="hk-form-row">
                    <div className="hk-field">
                      <label className="hk-label">duration</label>
                      <input
                        type="text"
                        className="hk-input"
                        required
                        value={experienceForm.duration}
                        onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                        placeholder="Jan 2023 - Present"
                      />
                    </div>
                    <div className="hk-field">
                      <label className="hk-label">sort_order</label>
                      <input
                        type="number"
                        className="hk-input"
                        value={experienceForm.order}
                        onChange={(e) => setExperienceForm({ ...experienceForm, order: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="hk-field">
                    <label className="hk-label">job_description</label>
                    <textarea
                      className="hk-input hk-textarea"
                      required
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                      placeholder="Describe your responsibilities..."
                    />
                  </div>

                  <div className="hk-field">
                    <label className="hk-label">skills // comma_separated</label>
                    <input
                      type="text"
                      className="hk-input"
                      value={experienceForm.skills}
                      onChange={(e) => setExperienceForm({ ...experienceForm, skills: e.target.value })}
                      placeholder="React, AWS, Node, GraphQL"
                    />
                  </div>

                  <div className="hk-form-actions">
                    <button type="submit" className="hk-btn-primary">
                      {isEditing ? 'UPDATE_MILESTONE' : 'SAVE_MILESTONE'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={resetExperienceForm} className="hk-btn-secondary">
                        CANCEL
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <h2 className="hk-pane-title" style={{ marginTop: '2.5rem' }}>&gt; timeline_milestones</h2>
              <div className="hk-item-list">
                {experiences.map((exp, idx) => (
                  <div key={exp._id} className="hk-item-row" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="hk-item-meta">
                      <h4>{exp.role} <span className="hk-at">@</span> {exp.company} <span className="hk-badge">idx:{exp.order}</span></h4>
                      <p>{exp.duration}</p>
                    </div>
                    <div className="hk-item-actions">
                      <button onClick={() => startEditExperience(exp)} className="hk-icon-btn hk-icon-btn--edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => deleteExperience(exp._id)} className="hk-icon-btn hk-icon-btn--delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <div className="hk-empty">
                    <Briefcase size={32} />
                    <p>&gt; no_milestones_found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============= MESSAGES ============= */}
          {activeTab === 'messages' && (
            <div className="hk-pane">
              <h2 className="hk-pane-title">&gt; incoming_transmissions</h2>

              {/* Search Bar */}
              <div className="hk-search-bar">
                <Search size={15} className="hk-search-icon" />
                <input
                  type="text"
                  className="hk-search-input"
                  placeholder="search by name, email, subject..."
                  value={msgSearch}
                  onChange={e => setMsgSearch(e.target.value)}
                />
                {msgSearch && (
                  <button className="hk-search-clear" onClick={() => setMsgSearch('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="hk-item-list">
                {filteredMessages.length === 0 ? (
                  <div className="hk-empty">
                    <Mail size={32} />
                    <p>&gt; {msgSearch ? 'no_matches_found' : 'inbox_empty'}</p>
                  </div>
                ) : (
                  filteredMessages.map((msg, idx) => (
                    <div
                      key={msg._id}
                      className={`hk-msg-card ${msg.status === 'unread' ? 'hk-msg-card--unread' : ''}`}
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <div className="hk-msg-header" onClick={() => toggleMsgExpand(msg._id)}>
                        <div className="hk-msg-sender">
                          {msg.status === 'unread' && <span className="hk-unread-dot" />}
                          <span className="hk-msg-name">{msg.name}</span>
                          <span className="hk-msg-email">&lt;{msg.email}&gt;</span>
                        </div>
                        <div className="hk-msg-right">
                          <span className="hk-msg-date">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                          {expandedMsgs[msg._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      <div className="hk-msg-subject">
                        <strong>subject:</strong> {msg.subject}
                      </div>

                      {expandedMsgs[msg._id] && (
                        <div className="hk-msg-expand">
                          <pre className="hk-msg-body">{msg.message}</pre>
                          <div className="hk-msg-actions">
                            {msg.status === 'unread' && (
                              <button onClick={() => markAsRead(msg._id)} className="hk-btn-small hk-btn-small--read">
                                <Check size={13} />
                                MARK_READ
                              </button>
                            )}
                            <button onClick={() => deleteMessage(msg._id)} className="hk-btn-small hk-btn-small--delete">
                              <Trash2 size={13} />
                              DELETE
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* ==========================================
           HACKER DASHBOARD — ROOT WRAPPER
           ========================================== */
        .hk-dash-wrapper {
          position: relative;
          min-height: 100vh;
          background: #0a0a0a;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          padding-top: calc(var(--navbar-height) + 20px);
          padding-bottom: 4rem;
          overflow: hidden;
        }

        .hk-matrix-canvas {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          opacity: 0.7;
        }

        .hk-scanlines {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.012) 2px,
            rgba(0, 255, 65, 0.012) 4px
          );
        }

        .hk-dash-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ==========================================
           LOADING
           ========================================== */
        .hk-loading {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1.2rem;
          color: #00ff41;
          font-size: 0.85rem;
        }

        .hk-spinner {
          width: 40px;
          height: 40px;
          border: 2.5px solid rgba(0, 255, 65, 0.15);
          border-radius: 50%;
          border-top-color: #00ff41;
          animation: hkSpin 0.8s linear infinite;
        }

        @keyframes hkSpin {
          to { transform: rotate(360deg); }
        }

        /* ==========================================
           HEADER
           ========================================== */
        .hk-dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 255, 65, 0.1);
        }

        .hk-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hk-header-icon {
          color: #00ff41;
          filter: drop-shadow(0 0 6px rgba(0, 255, 65, 0.4));
        }

        /* Glitch effect */
        .hk-glitch {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.4rem;
          font-weight: 400;
          color: #00ff41;
          text-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
          position: relative;
          letter-spacing: 0.06em;
        }

        .hk-glitch::before,
        .hk-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }

        .hk-glitch::before {
          animation: hkGlitch1 3s infinite;
          clip-path: inset(40% 0 61% 0);
          color: #00d4ff;
        }

        .hk-glitch::after {
          animation: hkGlitch2 3s infinite;
          clip-path: inset(65% 0 13% 0);
          color: #ff0040;
        }

        @keyframes hkGlitch1 {
          0%, 92% { transform: translateX(0); }
          93% { transform: translateX(-4px); }
          94% { transform: translateX(4px); }
          95% { transform: translateX(-2px); }
          96%, 100% { transform: translateX(0); }
        }

        @keyframes hkGlitch2 {
          0%, 90% { transform: translateX(0); }
          91% { transform: translateX(3px); }
          92% { transform: translateX(-3px); }
          93% { transform: translateX(2px); }
          94%, 100% { transform: translateX(0); }
        }

        .hk-header-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.72rem;
          color: #3a6a3a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hk-clock {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #00ff41;
          padding: 0.3rem 0.6rem;
          background: rgba(0, 255, 65, 0.05);
          border: 1px solid rgba(0, 255, 65, 0.12);
          border-radius: 4px;
          font-size: 0.75rem;
          font-variant-numeric: tabular-nums;
        }

        .hk-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00ff41;
          animation: hkPulse 1.5s infinite;
        }

        @keyframes hkPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; box-shadow: 0 0 8px #00ff41; }
        }

        .hk-status-text {
          color: #00ff41;
        }

        /* ==========================================
           STATS ROW
           ========================================== */
        .hk-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .hk-stat-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1.1rem 1.2rem;
          background: rgba(10, 10, 10, 0.85);
          border: 1px solid rgba(0, 255, 65, 0.1);
          border-radius: 6px;
          transition: all 0.3s ease;
          animation: hkFadeUp 0.5s ease forwards;
          opacity: 0;
        }

        .hk-stat-card:nth-child(1) { animation-delay: 0s; }
        .hk-stat-card:nth-child(2) { animation-delay: 0.08s; }
        .hk-stat-card:nth-child(3) { animation-delay: 0.16s; }
        .hk-stat-card:nth-child(4) { animation-delay: 0.24s; }

        .hk-stat-card:hover {
          border-color: rgba(0, 255, 65, 0.3);
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.06);
          transform: translateY(-2px);
        }

        .hk-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hk-stat-icon--green { background: rgba(0, 255, 65, 0.1); color: #00ff41; }
        .hk-stat-icon--blue { background: rgba(0, 212, 255, 0.1); color: #00d4ff; }
        .hk-stat-icon--purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        .hk-stat-icon--yellow { background: rgba(255, 200, 0, 0.1); color: #ffc800; }

        .hk-stat-info {
          display: flex;
          flex-direction: column;
        }

        .hk-stat-num {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e0e0e0;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .hk-stat-label {
          font-size: 0.68rem;
          color: #4a6a4a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.2rem;
        }

        @keyframes hkFadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ==========================================
           QUICK ACTIONS
           ========================================== */
        .hk-quick-actions {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .hk-action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(0, 255, 65, 0.04);
          border: 1px solid rgba(0, 255, 65, 0.15);
          border-radius: 4px;
          color: #00ff41;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s ease;
          text-transform: uppercase;
        }

        .hk-action-btn:hover {
          background: rgba(0, 255, 65, 0.1);
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.1);
          transform: translateY(-1px);
        }

        /* ==========================================
           ALERTS
           ========================================== */
        .hk-alert {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 1rem;
          border-radius: 4px;
          font-size: 0.78rem;
          margin-bottom: 1rem;
          animation: hkSlideIn 0.35s ease;
        }

        .hk-alert--success {
          background: rgba(0, 255, 65, 0.06);
          border: 1px solid rgba(0, 255, 65, 0.2);
          color: #00ff41;
        }

        .hk-alert--error {
          background: rgba(255, 50, 50, 0.06);
          border: 1px solid rgba(255, 50, 50, 0.2);
          color: #ff4444;
        }

        @keyframes hkSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ==========================================
           TABS
           ========================================== */
        .hk-tabs {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(0, 255, 65, 0.08);
          padding-bottom: 0;
        }

        .hk-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: #3a6a3a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
        }

        .hk-tab:hover {
          color: #00ff41;
          background: rgba(0, 255, 65, 0.03);
        }

        .hk-tab--active {
          color: #00ff41;
          border-bottom-color: #00ff41;
          text-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
        }

        .hk-tab-badge {
          font-size: 0.65rem;
          padding: 0.1rem 0.45rem;
          background: rgba(0, 255, 65, 0.12);
          color: #00ff41;
          border-radius: 10px;
          line-height: 1.3;
        }

        /* ==========================================
           CONTENT AREA
           ========================================== */
        .hk-content {
          animation: hkFadeUp 0.4s ease forwards;
        }

        .hk-pane-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          font-weight: 400;
          color: #00ff41;
          text-transform: lowercase;
          margin-bottom: 1.2rem;
          text-shadow: 0 0 8px rgba(0, 255, 65, 0.2);
          text-align: left;
          letter-spacing: 0.03em;
        }

        .hk-pane-title::after {
          display: none;
        }

        /* ==========================================
           FORM CARD
           ========================================== */
        .hk-form-card {
          padding: 1.8rem;
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid rgba(0, 255, 65, 0.1);
          border-radius: 6px;
        }

        .hk-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .hk-field {
          margin-bottom: 1.1rem;
        }

        .hk-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 500;
          color: #00ff41;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
          opacity: 0.65;
        }

        .hk-input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          background: rgba(0, 255, 65, 0.03);
          border: 1.5px solid rgba(0, 255, 65, 0.1);
          border-radius: 4px;
          color: #c8ffc8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          transition: all 0.25s ease;
          caret-color: #00ff41;
        }

        .hk-input::placeholder {
          color: #1e3a1e;
        }

        .hk-input:focus {
          outline: none;
          border-color: #00ff41;
          background: rgba(0, 255, 65, 0.05);
          box-shadow: 0 0 0 3px rgba(0, 255, 65, 0.06);
        }

        .hk-textarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.5;
        }

        .hk-form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .hk-btn-primary {
          padding: 0.7rem 1.5rem;
          background: rgba(0, 255, 65, 0.1);
          border: 1.5px solid rgba(0, 255, 65, 0.3);
          border-radius: 4px;
          color: #00ff41;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .hk-btn-primary:hover {
          background: rgba(0, 255, 65, 0.18);
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.15);
          transform: translateY(-1px);
        }

        .hk-btn-secondary {
          padding: 0.7rem 1.5rem;
          background: transparent;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #6a6a6a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s ease;
          text-transform: uppercase;
        }

        .hk-btn-secondary:hover {
          border-color: rgba(255, 255, 255, 0.2);
          color: #aaa;
        }

        /* ==========================================
           ITEM ROWS
           ========================================== */
        .hk-item-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .hk-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.2rem;
          background: rgba(10, 10, 10, 0.7);
          border: 1px solid rgba(0, 255, 65, 0.06);
          border-radius: 4px;
          transition: all 0.3s ease;
          animation: hkFadeUp 0.4s ease forwards;
          opacity: 0;
        }

        .hk-item-row:hover {
          border-color: rgba(0, 255, 65, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.04);
          transform: translateX(3px);
        }

        .hk-item-meta h4 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          font-weight: 600;
          color: #c8ffc8;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.2rem;
        }

        .hk-item-meta p {
          font-size: 0.78rem;
          color: #4a6a4a;
        }

        .hk-badge {
          font-size: 0.6rem;
          padding: 0.1rem 0.4rem;
          background: rgba(0, 255, 65, 0.08);
          border: 1px solid rgba(0, 255, 65, 0.15);
          border-radius: 3px;
          color: #00d4ff;
          font-weight: 400;
        }

        .hk-at {
          color: #00ff41;
          font-weight: 400;
        }

        .hk-item-actions {
          display: flex;
          gap: 0.4rem;
        }

        .hk-icon-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: 1px solid transparent;
          background: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .hk-icon-btn--edit {
          color: #00d4ff;
          border-color: rgba(0, 212, 255, 0.15);
        }
        .hk-icon-btn--edit:hover {
          background: rgba(0, 212, 255, 0.12);
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.15);
        }

        .hk-icon-btn--delete {
          color: #ff4444;
          border-color: rgba(255, 68, 68, 0.15);
        }
        .hk-icon-btn--delete:hover {
          background: rgba(255, 68, 68, 0.12);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.15);
        }

        .hk-empty {
          text-align: center;
          padding: 3rem;
          color: #2a4a2a;
        }

        .hk-empty p {
          color: #2a4a2a;
          margin-top: 0.8rem;
          font-size: 0.85rem;
        }

        /* ==========================================
           SEARCH BAR
           ========================================== */
        .hk-search-bar {
          position: relative;
          margin-bottom: 1.2rem;
        }

        .hk-search-icon {
          position: absolute;
          left: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          color: #00ff4150;
          pointer-events: none;
        }

        .hk-search-input {
          width: 100%;
          padding: 0.65rem 2.5rem 0.65rem 2.6rem;
          background: rgba(0, 255, 65, 0.03);
          border: 1.5px solid rgba(0, 255, 65, 0.1);
          border-radius: 4px;
          color: #c8ffc8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          transition: all 0.25s ease;
          caret-color: #00ff41;
        }

        .hk-search-input::placeholder {
          color: #1e3a1e;
        }

        .hk-search-input:focus {
          outline: none;
          border-color: #00ff41;
          box-shadow: 0 0 0 3px rgba(0, 255, 65, 0.06);
        }

        .hk-search-clear {
          position: absolute;
          right: 0.7rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #4a6a4a;
          cursor: pointer;
          display: flex;
          padding: 0.2rem;
        }
        .hk-search-clear:hover { color: #00ff41; }

        /* ==========================================
           MESSAGE CARDS
           ========================================== */
        .hk-msg-card {
          background: rgba(10, 10, 10, 0.7);
          border: 1px solid rgba(0, 255, 65, 0.06);
          border-left: 3px solid transparent;
          border-radius: 4px;
          transition: all 0.3s ease;
          animation: hkFadeUp 0.4s ease forwards;
          opacity: 0;
          overflow: hidden;
        }

        .hk-msg-card--unread {
          border-left-color: #00ff41;
        }

        .hk-msg-card:hover {
          border-color: rgba(0, 255, 65, 0.15);
        }

        .hk-msg-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem 1.1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .hk-msg-header:hover {
          background: rgba(0, 255, 65, 0.02);
        }

        .hk-msg-sender {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .hk-unread-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00ff41;
          flex-shrink: 0;
          animation: hkPulse 1.5s infinite;
        }

        .hk-msg-name {
          font-weight: 600;
          color: #c8ffc8;
          font-size: 0.88rem;
        }

        .hk-msg-email {
          color: #3a6a3a;
          font-size: 0.78rem;
        }

        .hk-msg-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #3a6a3a;
        }

        .hk-msg-date {
          font-size: 0.72rem;
        }

        .hk-msg-subject {
          padding: 0 1.1rem 0.6rem;
          font-size: 0.82rem;
          color: #6a8a6a;
        }

        .hk-msg-subject strong {
          color: #00d4ff;
          font-weight: 500;
        }

        .hk-msg-expand {
          animation: hkExpand 0.3s ease;
        }

        @keyframes hkExpand {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 600px; }
        }

        .hk-msg-body {
          margin: 0 1.1rem;
          padding: 0.9rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 255, 65, 0.05);
          border-radius: 3px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          color: #8aaa8a;
          line-height: 1.55;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .hk-msg-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.4rem;
          padding: 0.7rem 1.1rem;
        }

        .hk-btn-small {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.7rem;
          border-radius: 3px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1px solid transparent;
          background: none;
        }

        .hk-btn-small--read {
          color: #00ff41;
          border-color: rgba(0, 255, 65, 0.2);
        }
        .hk-btn-small--read:hover {
          background: rgba(0, 255, 65, 0.1);
        }

        .hk-btn-small--delete {
          color: #ff4444;
          border-color: rgba(255, 68, 68, 0.2);
        }
        .hk-btn-small--delete:hover {
          background: rgba(255, 68, 68, 0.1);
        }

        /* ==========================================
           RESPONSIVE
           ========================================== */
        @media (max-width: 992px) {
          .hk-stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hk-dash-container {
            padding: 0 1.2rem;
          }

          .hk-dash-header {
            flex-direction: column;
            gap: 0.8rem;
            align-items: flex-start;
          }

          .hk-tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .hk-tab {
            white-space: nowrap;
            font-size: 0.72rem;
            padding: 0.6rem 0.9rem;
          }
        }

        @media (max-width: 576px) {
          .hk-stats-row {
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
          }

          .hk-stat-card {
            padding: 0.85rem;
          }

          .hk-stat-num {
            font-size: 1.2rem;
          }

          .hk-form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .hk-glitch {
            font-size: 1rem;
          }

          .hk-quick-actions {
            flex-wrap: wrap;
          }

          .hk-item-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .hk-item-actions {
            align-self: flex-end;
          }

          .hk-msg-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.4rem;
          }

          .hk-msg-right {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
