import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Layers, Briefcase, Mail, Trash2, Plus, Edit, Check, X,
  FileSpreadsheet, Eye, EyeOff, RefreshCw, Download, Search,
  ChevronDown, ChevronUp, Activity, Terminal, Shield, Clock,
  Database, Zap, MessageSquare, BarChart3, Upload, Images, Image as ImageIcon,
  LogOut, ExternalLink, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const { token, API_URL, logout, user } = useContext(AuthContext);

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
    category: '',
    description: '',
    detailedDescription: '',
    tags: '',
    imageUrl: '',
    images: [],
    codeTag: '',
    githubLink: '',
    liveLink: '',
    order: 0,
  });
  const [manualImageUrl, setManualImageUrl] = useState('');

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

  // Matrix rain canvas — English hacker words & code chars (matching AdminLogin)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // English hacker-style characters and words fragments
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;<>?/~`!';
    const hackerWords = [
      'ACCESS', 'DENIED', 'ROOT', 'SUDO', 'SSH', 'PING', 'PORT', 'NULL',
      'HACK', 'EXEC', 'INIT', 'BOOT', 'SYS', 'AUTH', 'KEY', 'TOKEN',
      'SHELL', 'BASH', 'NODE', 'API', 'SQL', 'XSS', 'CSRF', 'ADMIN',
      'LOGIN', 'PASS', 'HASH', 'SALT', 'CRYPT', 'BYTE', 'HEX', 'BIT',
      'NET', 'SCAN', 'PROXY', 'TRACE', 'ROUTE', 'HOST', 'DNS', 'IP',
      '127.0.0.1', '0x', 'FF', '00', 'ERR', 'OK', '200', '403', '500',
      'MONGODB', 'REACT', 'EXPRESS', 'ANGULAR', 'SECURITY', 'PAYLOAD',
    ];

    // Build a pool of single chars + word fragments
    const pool = chars.split('').concat(
      hackerWords.flatMap(w => w.split(''))
    );

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    // Track whether column is in "word mode"
    const wordQueues = Array(columns).fill(null).map(() => ({ chars: [], idx: 0 }));

    // Randomly seed some columns with words
    const seedWord = (col) => {
      const word = hackerWords[Math.floor(Math.random() * hackerWords.length)] + ' ';
      wordQueues[col] = { chars: word.split(''), idx: 0 };
    };
    columns && [...Array(Math.floor(columns * 0.18))].forEach(() => {
      const col = Math.floor(Math.random() * columns);
      seedWord(col);
    });

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        let char;
        const wq = wordQueues[i];

        if (wq && wq.idx < wq.chars.length) {
          char = wq.chars[wq.idx];
          wq.idx++;
          if (wq.idx >= wq.chars.length) {
            wordQueues[i] = { chars: [], idx: 0 };
          }
          // Bright green for word chars
          ctx.fillStyle = '#00ff41';
          ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
        } else {
          char = pool[Math.floor(Math.random() * pool.length)];
          // Dim green for normal rain
          ctx.fillStyle = 'rgba(0, 255, 65, 0.2)';
          ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

          // Randomly start a word stream
          if (Math.random() > 0.994) seedWord(i);
        }

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
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
  const handleMultipleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Compress on client-side canvas to maintain fast uploads and lightweight payloads
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedData = canvas.toDataURL('image/jpeg', 0.85);

          setProjectForm((prev) => {
            const updatedImages = [...(prev.images || []), compressedData];
            return {
              ...prev,
              images: updatedImages,
              imageUrl: prev.imageUrl || updatedImages[0],
            };
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!manualImageUrl.trim()) return;
    const url = manualImageUrl.trim();
    setProjectForm((prev) => {
      const updated = [...(prev.images || []), url];
      return {
        ...prev,
        images: updated,
        imageUrl: prev.imageUrl || updated[0],
      };
    });
    setManualImageUrl('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setProjectForm((prev) => {
      const updated = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        imageUrl: updated.includes(prev.imageUrl) ? prev.imageUrl : (updated[0] || ''),
      };
    });
  };

  const handleSetPrimaryImage = (imgSrc) => {
    setProjectForm((prev) => ({
      ...prev,
      imageUrl: imgSrc,
    }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEditing ? `${API_URL}/projects/${editingId}` : `${API_URL}/projects`;
    const method = isEditing ? 'PUT' : 'POST';

    const formattedTags = projectForm.tags
      ? projectForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const projectImages = Array.isArray(projectForm.images) ? projectForm.images : [];
    const primaryImage = projectForm.imageUrl || (projectImages.length > 0 ? projectImages[0] : '');

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...projectForm,
          imageUrl: primaryImage,
          images: projectImages,
          tags: formattedTags,
        }),
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

    const projectImages = Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : (project.imageUrl ? [project.imageUrl] : []);

    setProjectForm({
      title: project.title || '',
      category: project.category || '',
      description: project.description || '',
      detailedDescription: project.detailedDescription || '',
      tags: project.tags ? project.tags.join(', ') : '',
      imageUrl: project.imageUrl || (projectImages[0] || ''),
      images: projectImages,
      codeTag: project.codeTag || '',
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      order: project.order !== undefined ? project.order : 0,
    });
    setManualImageUrl('');
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
      category: '',
      description: '',
      detailedDescription: '',
      tags: '',
      imageUrl: '',
      images: [],
      codeTag: '',
      githubLink: '',
      liveLink: '',
      order: 0,
    });
    setManualImageUrl('');
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
        {/* Cyberpunk Top Bar Header */}
        <div className="hk-dash-header">
          <div className="hk-header-left">
            <div className="hk-header-icon-box">
              <Terminal size={22} className="hk-header-icon" />
            </div>
            <div className="hk-title-stack">
              <h1 className="hk-glitch" data-text="CONTROL_PANEL">CONTROL_PANEL</h1>
            </div>
          </div>

          <div className="hk-header-right">
            {/* Authenticated Admin Badge */}
            <div className="hk-user-badge">
              <ShieldCheck size={14} className="hk-user-shield" />
              <span className="hk-user-email">{user?.email || 'admin@root'}</span>
            </div>

            {/* Live Terminal Clock */}
            <div className="hk-clock">
              <Clock size={13} />
              <span>{clock.toLocaleTimeString('en-US', { hour12: false })}</span>
            </div>

            {/* Online Status Beacon */}
            <div className="hk-status-badge">
              <div className="hk-status-dot" />
              <span className="hk-status-text">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Stats HUD Row */}
        <div className="hk-stats-row">
          <div className="hk-stat-card hk-stat-card--blue">
            <div className="hk-stat-corner tl" />
            <div className="hk-stat-corner br" />
            <div className="hk-stat-icon hk-stat-icon--blue"><Database size={20} /></div>
            <div className="hk-stat-info">
              <div className="hk-stat-sub">// ACTIVE_DATASETS</div>
              <span className="hk-stat-num">{animatedStats.projects}</span>
              <span className="hk-stat-label">Projects Published</span>
            </div>
          </div>
          <div className="hk-stat-card hk-stat-card--purple">
            <div className="hk-stat-corner tl" />
            <div className="hk-stat-corner br" />
            <div className="hk-stat-icon hk-stat-icon--purple"><Briefcase size={20} /></div>
            <div className="hk-stat-info">
              <div className="hk-stat-sub">// WORK_HISTORY</div>
              <span className="hk-stat-num">{animatedStats.experiences}</span>
              <span className="hk-stat-label">Milestones Logged</span>
            </div>
          </div>
          <div className="hk-stat-card hk-stat-card--yellow">
            <div className="hk-stat-corner tl" />
            <div className="hk-stat-corner br" />
            <div className="hk-stat-icon hk-stat-icon--yellow"><Zap size={20} /></div>
            <div className="hk-stat-info">
              <div className="hk-stat-sub">// INCOMING_ALERTS</div>
              <span className="hk-stat-num">{animatedStats.unread}</span>
              <span className="hk-stat-label">Unread Messages</span>
            </div>
          </div>
          <div className="hk-stat-card hk-stat-card--green">
            <div className="hk-stat-corner tl" />
            <div className="hk-stat-corner br" />
            <div className="hk-stat-icon hk-stat-icon--green"><MessageSquare size={20} /></div>
            <div className="hk-stat-info">
              <div className="hk-stat-sub">// TRANSMISSIONS</div>
              <span className="hk-stat-num">{animatedStats.total}</span>
              <span className="hk-stat-label">Total Inquiries</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & System Info Bar */}
        <div className="hk-quick-actions-bar">
          <div className="hk-quick-actions">
            <button className="hk-action-btn" onClick={fetchDashboardData} title="Sync with live database">
              <RefreshCw size={14} className={loading ? 'hk-spin' : ''} />
              <span>SYNC_DATA</span>
            </button>
            <button className="hk-action-btn" onClick={handleExport} title="Download JSON data snapshot">
              <Download size={14} />
              <span>EXPORT_SNAPSHOT</span>
            </button>
          </div>
          <div className="hk-sys-indicator">
            <span className="hk-sys-text">PROTOCOL: REST_API / MONGODB_ATLAS</span>
          </div>
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
                        placeholder="Personal Developer Portfolio"
                      />
                    </div>
                    <div className="hk-field">
                      <label className="hk-label">category / stack_badge</label>
                      <input
                        type="text"
                        className="hk-input"
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        placeholder="Full Stack · MERN Stack"
                      />
                    </div>
                  </div>

                  <div className="hk-form-row">
                    <div className="hk-field">
                      <label className="hk-label">tags // comma_separated</label>
                      <input
                        type="text"
                        className="hk-input"
                        value={projectForm.tags}
                        onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                        placeholder="React.js, Node.js, Express.js, MongoDB"
                      />
                    </div>
                    <div className="hk-field">
                      <label className="hk-label">mockup_filename // optional</label>
                      <input
                        type="text"
                        className="hk-input"
                        value={projectForm.codeTag}
                        onChange={(e) => setProjectForm({ ...projectForm, codeTag: e.target.value })}
                        placeholder="Portfolio.jsx"
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
                      placeholder="Comprehensive explanation of tech choice, features, architecture..."
                      rows={5}
                    />
                  </div>

                  {/* Multi-Image Manager */}
                  <div className="hk-field">
                    <label className="hk-label">project_images // upload_or_url</label>

                    <div className="hk-image-controls">
                      <label className="hk-file-upload-btn">
                        <Upload size={14} />
                        <span>Upload Images from Device</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleMultipleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>

                      <div className="hk-url-input-wrap">
                        <input
                          type="text"
                          className="hk-input"
                          placeholder="or paste image URL (https://...)"
                          value={manualImageUrl}
                          onChange={(e) => setManualImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="hk-btn-add-url"
                          onClick={handleAddImageUrl}
                        >
                          <Plus size={14} /> Add URL
                        </button>
                      </div>
                    </div>

                    {/* Previews Grid */}
                    {projectForm.images && projectForm.images.length > 0 && (
                      <div className="hk-image-preview-grid">
                        {projectForm.images.map((imgSrc, idx) => {
                          const isPrimary = projectForm.imageUrl === imgSrc || (idx === 0 && !projectForm.imageUrl);
                          return (
                            <div key={idx} className={`hk-image-preview-card ${isPrimary ? 'is-primary' : ''}`}>
                              <img src={imgSrc} alt={`Preview ${idx + 1}`} className="hk-preview-img" />
                              <div className="hk-preview-overlay">
                                {isPrimary ? (
                                  <span className="hk-primary-badge">PRIMARY</span>
                                ) : (
                                  <button
                                    type="button"
                                    className="hk-btn-set-primary"
                                    onClick={() => handleSetPrimaryImage(imgSrc)}
                                  >
                                    Set Primary
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="hk-btn-remove-img"
                                  onClick={() => handleRemoveImage(idx)}
                                  title="Remove Image"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="hk-form-row">
                    <div className="hk-field">
                      <label className="hk-label">github_url // optional</label>
                      <input
                        type="url"
                        className="hk-input"
                        value={projectForm.githubLink}
                        onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="hk-field">
                      <label className="hk-label">live_url // optional</label>
                      <input
                        type="url"
                        className="hk-input"
                        value={projectForm.liveLink}
                        onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                        placeholder="https://mysite.com"
                      />
                    </div>
                    <div className="hk-field" style={{ maxWidth: 120 }}>
                      <label className="hk-label">order_idx</label>
                      <input
                        type="number"
                        className="hk-input"
                        value={projectForm.order}
                        onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
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
                {projects.map((proj, idx) => {
                  const thumb = proj.imageUrl || (proj.images && proj.images[0]);
                  return (
                    <div key={proj._id} className="hk-item-row" style={{ animationDelay: `${idx * 0.05}s` }}>
                      {thumb && <img src={thumb} alt="" className="hk-thumb-mini" />}
                      <div className="hk-item-meta">
                        <h4>
                          {proj.title}
                          {proj.category && <span className="hk-badge">{proj.category}</span>}
                          {proj.images?.length > 1 && (
                            <span className="hk-badge">+{proj.images.length} imgs</span>
                          )}
                        </h4>
                        <p>{proj.description}</p>
                      </div>
                      <div className="hk-item-actions">
                        <button onClick={() => startEditProject(proj)} className="hk-icon-btn hk-icon-btn--edit" title="Edit Project">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => deleteProject(proj._id)} className="hk-icon-btn hk-icon-btn--delete" title="Delete Project">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
           CYBERPUNK HEADER
           ========================================== */
        .hk-dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding: 1.1rem 1.4rem;
          background: rgba(8, 14, 8, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 255, 65, 0.18);
          border-radius: 8px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 255, 65, 0.15);
        }

        .hk-header-left {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .hk-header-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: rgba(0, 255, 65, 0.08);
          border: 1px solid rgba(0, 255, 65, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00ff41;
          box-shadow: 0 0 14px rgba(0, 255, 65, 0.25);
          flex-shrink: 0;
        }

        .hk-header-icon {
          color: #00ff41;
          filter: drop-shadow(0 0 6px rgba(0, 255, 65, 0.6));
        }

        .hk-title-stack {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hk-system-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: #00ff41;
          letter-spacing: 0.12em;
          opacity: 0.85;
          text-transform: uppercase;
          font-weight: 600;
        }

        .hk-bracket {
          color: #00d4ff;
          font-weight: 700;
        }

        /* Glitch effect */
        .hk-glitch {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 400;
          color: #00ff41;
          text-shadow: 0 0 12px rgba(0, 255, 65, 0.4);
          position: relative;
          letter-spacing: 0.06em;
          margin: 0;
          line-height: 1.1;
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
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* User badge */
        .hk-user-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.7rem;
          background: rgba(0, 212, 255, 0.06);
          border: 1px solid rgba(0, 212, 255, 0.25);
          border-radius: 4px;
          color: #00d4ff;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
        }

        .hk-user-shield {
          color: #00d4ff;
        }

        .hk-user-email {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'JetBrains Mono', monospace;
        }

        .hk-role-tag {
          background: #00ff41;
          color: #050d05;
          font-weight: 700;
          font-size: 0.58rem;
          padding: 1px 5px;
          border-radius: 2px;
          letter-spacing: 0.06em;
        }

        .hk-clock {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #00ff41;
          padding: 0.35rem 0.65rem;
          background: rgba(0, 255, 65, 0.05);
          border: 1px solid rgba(0, 255, 65, 0.18);
          border-radius: 4px;
          font-size: 0.75rem;
          font-variant-numeric: tabular-nums;
        }

        .hk-status-badge {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.35rem 0.65rem;
          background: rgba(0, 255, 65, 0.04);
          border: 1px solid rgba(0, 255, 65, 0.15);
          border-radius: 4px;
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
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .hk-header-actions {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .hk-head-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.42rem 0.8rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-transform: uppercase;
          border: 1px solid transparent;
        }

        .hk-head-action-btn--portfolio {
          background: rgba(0, 255, 65, 0.08);
          border-color: rgba(0, 255, 65, 0.3);
          color: #00ff41;
        }

        .hk-head-action-btn--portfolio:hover {
          background: rgba(0, 255, 65, 0.2);
          box-shadow: 0 0 14px rgba(0, 255, 65, 0.25);
          transform: translateY(-1px);
        }

        .hk-head-action-btn--logout {
          background: rgba(255, 68, 68, 0.08);
          border-color: rgba(255, 68, 68, 0.3);
          color: #ff5555;
        }

        .hk-head-action-btn--logout:hover {
          background: rgba(255, 68, 68, 0.22);
          box-shadow: 0 0 14px rgba(255, 68, 68, 0.25);
          transform: translateY(-1px);
        }

        /* ==========================================
           STATS HUD ROW
           ========================================== */
        .hk-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .hk-stat-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.95rem;
          padding: 1.15rem 1.25rem;
          background: rgba(10, 16, 10, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 255, 65, 0.12);
          border-radius: 6px;
          transition: all 0.3s ease;
          animation: hkFadeUp 0.5s ease forwards;
          opacity: 0;
          overflow: hidden;
        }

        .hk-stat-corner {
          position: absolute;
          width: 7px;
          height: 7px;
          border: 1.5px solid transparent;
          pointer-events: none;
        }

        .hk-stat-corner.tl {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        .hk-stat-corner.br {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }

        .hk-stat-card--blue {
          border-top: 2px solid #00d4ff;
        }
        .hk-stat-card--blue .hk-stat-corner {
          border-color: #00d4ff;
        }

        .hk-stat-card--purple {
          border-top: 2px solid #a855f7;
        }
        .hk-stat-card--purple .hk-stat-corner {
          border-color: #a855f7;
        }

        .hk-stat-card--yellow {
          border-top: 2px solid #ffc800;
        }
        .hk-stat-card--yellow .hk-stat-corner {
          border-color: #ffc800;
        }

        .hk-stat-card--green {
          border-top: 2px solid #00ff41;
        }
        .hk-stat-card--green .hk-stat-corner {
          border-color: #00ff41;
        }

        .hk-stat-card:nth-child(1) { animation-delay: 0s; }
        .hk-stat-card:nth-child(2) { animation-delay: 0.08s; }
        .hk-stat-card:nth-child(3) { animation-delay: 0.16s; }
        .hk-stat-card:nth-child(4) { animation-delay: 0.24s; }

        .hk-stat-card:hover {
          border-color: rgba(0, 255, 65, 0.35);
          box-shadow: 0 6px 24px rgba(0, 255, 65, 0.08);
          transform: translateY(-2px);
        }

        .hk-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hk-stat-icon--green { background: rgba(0, 255, 65, 0.12); color: #00ff41; border: 1px solid rgba(0, 255, 65, 0.25); }
        .hk-stat-icon--blue { background: rgba(0, 212, 255, 0.12); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.25); }
        .hk-stat-icon--purple { background: rgba(168, 85, 247, 0.12); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.25); }
        .hk-stat-icon--yellow { background: rgba(255, 200, 0, 0.12); color: #ffc800; border: 1px solid rgba(255, 200, 0, 0.25); }

        .hk-stat-info {
          display: flex;
          flex-direction: column;
        }

        .hk-stat-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          color: #00ff41;
          letter-spacing: 0.08em;
          opacity: 0.7;
          margin-bottom: 0.2rem;
        }

        .hk-stat-num {
          font-size: 1.65rem;
          font-weight: 700;
          color: #f0f0f0;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 10px rgba(0, 255, 65, 0.15);
        }

        .hk-stat-label {
          font-size: 0.68rem;
          color: #6a9a6a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.3rem;
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
           QUICK ACTIONS & SYSTEM BAR
           ========================================== */
        .hk-quick-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.6rem;
          flex-wrap: wrap;
        }

        .hk-quick-actions {
          display: flex;
          gap: 0.75rem;
        }

        .hk-action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.1rem;
          background: rgba(0, 255, 65, 0.05);
          border: 1px solid rgba(0, 255, 65, 0.2);
          border-radius: 4px;
          color: #00ff41;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.73rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          cursor: pointer;
          transition: all 0.25s ease;
          text-transform: uppercase;
        }

        .hk-action-btn:hover {
          background: rgba(0, 255, 65, 0.14);
          border-color: rgba(0, 255, 65, 0.4);
          box-shadow: 0 0 16px rgba(0, 255, 65, 0.15);
          transform: translateY(-1px);
        }

        .hk-spin {
          animation: hkSpin 1s linear infinite;
        }

        .hk-sys-indicator {
          display: flex;
          align-items: center;
          padding: 0.45rem 0.85rem;
          background: rgba(0, 255, 65, 0.03);
          border: 1px solid rgba(0, 255, 65, 0.1);
          border-radius: 4px;
        }

        .hk-sys-text {
          font-size: 0.68rem;
          color: #3f6e3f;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ==========================================
           ALERTS
           ========================================== */
        .hk-alert {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.8rem 1.1rem;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-bottom: 1.2rem;
          animation: hkSlideIn 0.35s ease;
          font-family: 'JetBrains Mono', monospace;
        }

        .hk-alert--success {
          background: rgba(0, 255, 65, 0.08);
          border: 1px solid rgba(0, 255, 65, 0.3);
          color: #00ff41;
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.1);
        }

        .hk-alert--error {
          background: rgba(255, 50, 50, 0.08);
          border: 1px solid rgba(255, 50, 50, 0.3);
          color: #ff5555;
          box-shadow: 0 0 15px rgba(255, 50, 50, 0.1);
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

        /* Image Manager in Admin */
        .hk-image-controls {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.4rem;
        }

        .hk-file-upload-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          background: rgba(0, 255, 65, 0.08);
          border: 1px dashed rgba(0, 255, 65, 0.4);
          border-radius: 4px;
          color: #00ff41;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hk-file-upload-btn:hover {
          background: rgba(0, 255, 65, 0.16);
          border-color: #00ff41;
          box-shadow: 0 0 12px rgba(0, 255, 65, 0.2);
        }

        .hk-url-input-wrap {
          display: flex;
          gap: 0.5rem;
        }

        .hk-btn-add-url {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.55rem 0.95rem;
          background: rgba(0, 255, 65, 0.1);
          border: 1px solid rgba(0, 255, 65, 0.25);
          border-radius: 4px;
          color: #00ff41;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.76rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .hk-btn-add-url:hover {
          background: rgba(0, 255, 65, 0.2);
        }

        .hk-image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 0.75rem;
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 255, 65, 0.1);
          border-radius: 4px;
        }

        .hk-image-preview-card {
          position: relative;
          width: 100%;
          height: 80px;
          border-radius: 4px;
          overflow: hidden;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          background: #000;
        }

        .hk-image-preview-card.is-primary {
          border-color: #00ff41;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }

        .hk-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hk-preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          padding: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .hk-image-preview-card:hover .hk-preview-overlay {
          opacity: 1;
        }

        .hk-primary-badge {
          align-self: flex-start;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          background: #00ff41;
          color: #000;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 2px;
        }

        .hk-btn-set-primary {
          align-self: flex-start;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          background: rgba(0, 255, 65, 0.2);
          color: #00ff41;
          border: 1px solid rgba(0, 255, 65, 0.4);
          padding: 1px 5px;
          border-radius: 2px;
          cursor: pointer;
        }

        .hk-btn-set-primary:hover {
          background: #00ff41;
          color: #000;
        }

        .hk-btn-remove-img {
          background: rgba(255, 68, 68, 0.2);
          border: 1px solid rgba(255, 68, 68, 0.5);
          color: #ff4444;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .hk-btn-remove-img:hover {
          background: #ff4444;
          color: #fff;
        }

        .hk-thumb-mini {
          width: 44px;
          height: 34px;
          border-radius: 3px;
          object-fit: cover;
          border: 1px solid rgba(0, 255, 65, 0.2);
          margin-right: 0.75rem;
          flex-shrink: 0;
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
            gap: 1rem;
            align-items: flex-start;
          }

          .hk-header-right {
            width: 100%;
            justify-content: space-between;
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
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .hk-stat-card {
            padding: 0.95rem;
          }

          .hk-stat-num {
            font-size: 1.35rem;
          }

          .hk-form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .hk-glitch {
            font-size: 1.15rem;
          }

          .hk-header-right {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .hk-header-actions {
            width: 100%;
            display: flex;
            gap: 0.5rem;
          }

          .hk-head-action-btn {
            flex: 1;
            justify-content: center;
          }

          .hk-quick-actions-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .hk-quick-actions {
            flex-wrap: wrap;
            width: 100%;
          }

          .hk-action-btn {
            flex: 1;
            justify-content: center;
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
