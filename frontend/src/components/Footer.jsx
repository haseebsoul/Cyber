import './Footer.css';

function Footer() {
  return (
    <footer className="cs-footer">
      <div className="cs-footer-pattern" aria-hidden="true"></div>

      <div className="container position-relative">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="cs-foot-brand">
              CyberSentinel<span className="cs-brand-tm">™</span>
            </div>
            <p className="cs-foot-desc">
              The security platform for teams who ship. Protect, detect, and
              analyze every request with confidence.
            </p>
            <div className="cs-foot-social">
              <a
                href="https://github.com/haseebsoul/CyberSentinel-AI"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>LinkedIn</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Twitter</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-6">
            <h4 className="cs-foot-head">Product</h4>
            <ul className="cs-foot-list">
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#metrics">Metrics</a></li>
              <li><a href="#showcase">Showcase</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-6">
            <h4 className="cs-foot-head">Developers</h4>
            <ul className="cs-foot-list">
              <li>
                <a
                  href="https://github.com/haseebsoul/CyberSentinel-AI"
                  target="_blank"
                  rel="noreferrer"
                >
                  Repository
                </a>
              </li>
              <li><a href="#stack">Tech stack</a></li>
              <li><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Documentation</span></li>
              <li><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>API Reference</span></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-6">
            <h4 className="cs-foot-head">Project</h4>
            <ul className="cs-foot-list">
              <li><a href="#about">About</a></li>
              <li><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Roadmap</span></li>
              <li><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Changelog</span></li>
              <li><span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Contact</span></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-6">
            <h4 className="cs-foot-head">Author</h4>
            <ul className="cs-foot-list">
              <li className="cs-foot-author">
                <i className="bi bi-person-circle me-2"></i>
                Muhammad Haseeb Khan
              </li>
              <li>
                <a
                  href="https://github.com/haseebsoul"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-github me-2"></i>
                  @haseebsoul
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="cs-foot-bottom">
          <p className="cs-foot-copy">
            © {new Date().getFullYear()} CyberSentinel-AI · Built by{' '}
            <a
              href="https://github.com/haseebsoul"
              target="_blank"
              rel="noreferrer"
            >
              Muhammad Haseeb Khan
            </a>
          </p>
          <p className="cs-foot-status">
            <span className="cs-foot-status-dot"></span>
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
