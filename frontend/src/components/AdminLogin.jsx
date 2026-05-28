import React, { useState, useContext, useEffect, useRef } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertTriangle, Terminal, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typedTitle, setTypedTitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const canvasRef = useRef(null);

  const { login } = useContext(AuthContext);
  const fullTitle = '> SYSTEM_ACCESS';

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullTitle.length) {
        setTypedTitle(fullTitle.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(blink);
  }, []);

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

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff4120';
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

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'ACCESS_DENIED: Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="hk-login-wrapper">
      <canvas ref={canvasRef} className="hk-matrix-bg" />
      <div className="hk-scanlines" />

      <div className="hk-login-card">
        <div className="hk-login-header">
          <div className="hk-lock-icon">
            <Shield size={26} />
          </div>
          <h2 className="hk-typed-title">
            {typedTitle}
            <span className={`hk-cursor ${showCursor ? '' : 'hk-cursor--hide'}`}>_</span>
          </h2>
          <p className="hk-login-sub">
            <Terminal size={13} style={{ marginRight: 6 }} />
            Authenticate to access control panel
          </p>
        </div>

        {error && (
          <div className="hk-alert">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="hk-form">
          <div className="hk-field">
            <label className="hk-label" htmlFor="hk-email">admin_email</label>
            <div className="hk-input-wrap">
              <Mail className="hk-input-icon" size={15} />
              <input
                id="hk-email"
                type="email"
                className="hk-input"
                placeholder="admin@portfolio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="hk-field">
            <label className="hk-label" htmlFor="hk-password">password</label>
            <div className="hk-input-wrap">
              <Lock className="hk-input-icon" size={15} />
              <input
                id="hk-password"
                type={showPassword ? 'text' : 'password'}
                className="hk-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="hk-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="hk-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="hk-spinner" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                <Lock size={14} />
                INITIATE_LOGIN
              </>
            )}
          </button>
        </form>

        <div className="hk-footer-line">
          <span>encrypted connection</span>
          <span className="hk-dot-pulse" />
          <span>secure</span>
        </div>
      </div>

      <style>{`
        .hk-login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }

        .hk-matrix-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.6;
        }

        .hk-scanlines {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.015) 2px,
            rgba(0, 255, 65, 0.015) 4px
          );
        }

        .hk-login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 440px;
          margin: 0 1.5rem;
          padding: 2.5rem;
          background: rgba(10, 10, 10, 0.92);
          border: 1px solid rgba(0, 255, 65, 0.2);
          border-radius: 6px;
          box-shadow:
            0 0 40px rgba(0, 255, 65, 0.06),
            inset 0 1px 0 rgba(0, 255, 65, 0.08);
          animation: hkCardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes hkCardIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .hk-login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .hk-lock-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(0, 255, 65, 0.06);
          border: 1.5px solid rgba(0, 255, 65, 0.25);
          color: #00ff41;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.2rem;
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.15);
          animation: hkPulseIcon 2.5s infinite alternate;
        }

        @keyframes hkPulseIcon {
          from { box-shadow: 0 0 20px rgba(0, 255, 65, 0.15); }
          to { box-shadow: 0 0 35px rgba(0, 255, 65, 0.3); }
        }

        .hk-typed-title {
          font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
          font-size: 1.5rem;
          font-weight: 400;
          color: #00ff41;
          letter-spacing: 0.05em;
          margin-bottom: 0.6rem;
          text-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }

        .hk-cursor {
          color: #00ff41;
          animation: none;
        }
        .hk-cursor--hide {
          opacity: 0;
        }

        .hk-login-sub {
          font-size: 0.75rem;
          color: #4a6a4a;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .hk-alert {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 1rem;
          margin-bottom: 1.5rem;
          background: rgba(255, 50, 50, 0.08);
          border: 1px solid rgba(255, 50, 50, 0.25);
          border-radius: 4px;
          color: #ff4444;
          font-size: 0.8rem;
          animation: hkShake 0.4s ease;
        }

        @keyframes hkShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }

        .hk-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .hk-field {}

        .hk-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          color: #00ff41;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
          opacity: 0.7;
        }

        .hk-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .hk-input-icon {
          position: absolute;
          left: 0.9rem;
          color: #00ff4160;
          pointer-events: none;
        }

        .hk-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.6rem;
          background: rgba(0, 255, 65, 0.03);
          border: 1.5px solid rgba(0, 255, 65, 0.12);
          border-radius: 4px;
          color: #c8ffc8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.88rem;
          transition: all 0.25s ease;
          caret-color: #00ff41;
        }

        .hk-input::placeholder {
          color: #2a4a2a;
        }

        .hk-input:focus {
          outline: none;
          border-color: #00ff41;
          background: rgba(0, 255, 65, 0.06);
          box-shadow: 0 0 0 3px rgba(0, 255, 65, 0.08), 0 0 15px rgba(0, 255, 65, 0.05);
        }

        .hk-eye-btn {
          position: absolute;
          right: 0.8rem;
          background: none;
          border: none;
          color: #00ff4160;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.2rem;
          transition: color 0.2s;
        }
        .hk-eye-btn:hover { color: #00ff41; }

        .hk-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.85rem;
          margin-top: 0.5rem;
          background: rgba(0, 255, 65, 0.08);
          border: 1.5px solid rgba(0, 255, 65, 0.3);
          border-radius: 4px;
          color: #00ff41;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .hk-submit-btn:hover:not(:disabled) {
          background: rgba(0, 255, 65, 0.15);
          box-shadow: 0 0 25px rgba(0, 255, 65, 0.2), inset 0 0 15px rgba(0, 255, 65, 0.05);
          transform: translateY(-1px);
        }

        .hk-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .hk-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0, 255, 65, 0.2);
          border-top-color: #00ff41;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .hk-footer-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-top: 2rem;
          padding-top: 1.2rem;
          border-top: 1px solid rgba(0, 255, 65, 0.08);
          font-size: 0.65rem;
          color: #2a4a2a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .hk-dot-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00ff41;
          animation: hkDotPulse 1.5s infinite;
        }

        @keyframes hkDotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @media (max-width: 480px) {
          .hk-login-card {
            padding: 2rem 1.5rem;
            margin: 0 1rem;
          }
          .hk-typed-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
