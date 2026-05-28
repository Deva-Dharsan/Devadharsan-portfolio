import React, { useState, useEffect, useContext } from 'react';
import { Mail, MapPin, Send, CheckCircle, AlertTriangle, Linkedin, Github, MessageCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });
  const [focused, setFocused] = useState('');
  const { API_URL } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to send message');
      setStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus((p) => ({ ...p, success: false })), 6000);
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err.message });
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <span className="section-label">Get In Touch</span>
        <h2 className="section-titlee">Let&apos;s Connect</h2>
        <p className="contact-sub">
          I am actively looking for opportunities. Whether it's a job offer, internship, or just a chat — I would love to hear from you.
        </p>

        <div className="contact-grid">
          {/* Info Panel */}
          <div className="contact-info-panel glass-panel">
            <h3 className="cip-heading">Contact Information</h3>

            <div className="cip-links">
              <a href="mailto:devadharshan.pro@gmail.com" className="cip-link">
                <div className="cip-icon" style={{ '--icon-color': 'var(--color-primary)' }}>
                  <Mail size={20} />
                </div>
                <div className="cip-text">
                  <span className="cip-label">Email</span>
                  <span className="cip-value">devadharshan.pro@gmail.com</span>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/deva-dharsan/" target="_blank" rel="noopener noreferrer" className="cip-link">
                <div className="cip-icon" style={{ '--icon-color': '#0a66c2' }}>
                  <Linkedin size={20} />
                </div>
                <div className="cip-text">
                  <span className="cip-label">LinkedIn</span>
                  <span className="cip-value">deva-dharsan</span>
                </div>
              </a>

              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="cip-link">
                <div className="cip-icon" style={{ '--icon-color': 'var(--text-primary)' }}>
                  <Github size={20} />
                </div>
                <div className="cip-text">
                  <span className="cip-label">GitHub</span>
                  <span className="cip-value">github.com</span>
                </div>
              </a>

              <div className="cip-link cip-link--plain">
                <div className="cip-icon" style={{ '--icon-color': 'var(--color-accent)' }}>
                  <MapPin size={20} />
                </div>
                <div className="cip-text">
                  <span className="cip-label">Location</span>
                  <span className="cip-value">India &middot; Remote / On-Site</span>
                </div>
              </div>
            </div>

            <div className="cip-status">
              <span className="cip-status-dot"></span>
              <div>
                <p className="cip-status-title">Available for Opportunities</p>
                <p className="cip-status-sub">Full-Time &nbsp;·&nbsp; Internship</p>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="contact-form-panel glass-panel">
            <div className="cfp-header">
              <MessageCircle size={20} className="cfp-icon" />
              <h3>Send a Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="cfp-form">
              <div className="cfp-row">
                <div className={`form-group cfp-field ${focused === 'name' ? 'cfp-field--focused' : ''}`}>
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input
                    type="text" id="name" name="name"
                    value={formData.name} onChange={handleChange}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                    className="form-control" placeholder="Jane Smith" required
                  />
                </div>
                <div className={`form-group cfp-field ${focused === 'email' ? 'cfp-field--focused' : ''}`}>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    className="form-control" placeholder="jane@company.com" required
                  />
                </div>
              </div>

              <div className={`form-group cfp-field ${focused === 'subject' ? 'cfp-field--focused' : ''}`}>
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text" id="subject" name="subject"
                  value={formData.subject} onChange={handleChange}
                  onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                  className="form-control" placeholder="Job Opportunity / Internship Offer" required
                />
              </div>

              <div className={`form-group cfp-field ${focused === 'message' ? 'cfp-field--focused' : ''}`}>
                <label htmlFor="message" className="form-label">Your Message</label>
                <textarea
                  id="message" name="message"
                  value={formData.message} onChange={handleChange}
                  onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                  className="form-control" placeholder="Tell me about the role, your company, and how I can help..."
                  required style={{ minHeight: '130px' }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary cfp-submit" disabled={status.submitting}>
                {status.submitting ? 'Sending...' : 'Send Message'}
                <Send size={17} />
              </button>
            </form>

            {status.success && (
              <div className="cfp-alert cfp-alert--success">
                <CheckCircle size={18} />
                <span>Message sent! I will get back to you within 24 hours.</span>
              </div>
            )}
            {status.error && (
              <div className="cfp-alert cfp-alert--error">
                <AlertTriangle size={18} />
                <span>{status.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-section { background-color: var(--bg-secondary); }

        .contact-sub {
          text-align: center;
          max-width: 560px;
          margin: -1.5rem auto 3rem;
          font-size: 1rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 4fr 6fr;
          gap: 2rem;
          align-items: start;
        }

        /* Info Panel */
        .contact-info-panel {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .cip-heading {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cip-links {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .cip-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-normal);
          border: 1px solid transparent;
        }
        .cip-link:not(.cip-link--plain):hover {
          background: rgba(14,165,233,0.05);
          border-color: rgba(14,165,233,0.12);
          transform: translateX(4px);
        }
        .cip-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          color: var(--icon-color, var(--color-primary));
          flex-shrink: 0;
          transition: all var(--transition-normal);
        }
        .cip-link:not(.cip-link--plain):hover .cip-icon {
          background: rgba(255,255,255,0.07);
        }
        .cip-text { display: flex; flex-direction: column; gap: 0.1rem; }
        .cip-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cip-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .cip-status {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.25rem;
          background: rgba(16,185,129,0.06);
          border: 1px solid rgba(16,185,129,0.18);
          border-radius: var(--border-radius-sm);
        }
        .cip-status-dot {
          width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
          background: var(--color-success);
          animation: pulseGlow 2s infinite;
        }
        .cip-status-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-success);
          margin-bottom: 0.1rem;
        }
        .cip-status-sub {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        /* Form Panel */
        .contact-form-panel {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .cfp-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .cfp-icon { color: var(--color-primary); }
        .cfp-header h3 { font-size: 1.1rem; font-weight: 700; }

        .cfp-form { display: flex; flex-direction: column; gap: 0; }

        .cfp-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .cfp-field { position: relative; }
        .cfp-field--focused .form-label { color: var(--color-accent); }

        .cfp-submit {
          width: 100%;
          padding: 0.9rem;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .cfp-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .cfp-submit:disabled:hover { transform: none; }

        .cfp-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: var(--border-radius-sm);
          font-size: 0.88rem;
          font-weight: 500;
          animation: fadeInUp 0.4s ease;
        }
        .cfp-alert--success {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          color: #6ee7b7;
        }
        .cfp-alert--error {
          background: rgba(244,63,94,0.08);
          border: 1px solid rgba(244,63,94,0.2);
          color: #fda4af;
        }

        @media (max-width: 992px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 576px) {
          .cfp-row { grid-template-columns: 1fr; gap: 0; }
          .contact-info-panel, .contact-form-panel { padding: 2rem 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default Contact;
