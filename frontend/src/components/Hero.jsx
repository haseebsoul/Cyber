import './Hero.css';

function Hero() {
  return (
    <section id="home" className="cs-hero">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <span className="cs-eyebrow">The security platform for modern web</span>

            <h1 className="cs-display">
              Protect.<br />
              Detect.<br />
              <span className="cs-display-muted">Analyze.</span>
            </h1>

            <p className="cs-lead cs-hero-lead">
              CyberSentinel-AI is a cybersecurity platform designed around Web
              Application Firewall protection, Intrusion Detection, and AI-based
              anomaly analysis — built for security research and SOC simulation.
            </p>

            <div className="cs-hero-ctas">
              <a href="#cta" className="cs-btn cs-btn-dark">
                Start free trial <span aria-hidden>→</span>
              </a>
              <a href="#how" className="cs-btn cs-btn-light">
                Watch demo
              </a>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="cs-hero-art-wrap" aria-hidden="true">
              <HeroArt />
            </div>
          </div>
        </div>

        <div className="cs-hero-stats">
          <Stat value="98%" label="Detection accuracy" sub="TARGET" />
          <Stat value="<50ms" label="Analysis latency" sub="GOAL" />
          <Stat value="24/7" label="Security monitoring" sub="DESIGNED FOR" />
          <Stat value="05" label="Core capabilities" sub="WAF · IDS · AI" />
          <Stat value="17" label="Event signals" sub="TRACKED" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, sub }) {
  return (
    <div className="cs-hero-stat">
      <div className="cs-hero-stat-value">{value}</div>
      <div className="cs-hero-stat-label">{label}</div>
      <div className="cs-hero-stat-sub mono">{sub}</div>
    </div>
  );
}

/* Deterministic dithered pixel triangle — matches Optimus hero art */
function HeroArt() {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const size = 46;
  const cell = 9;
  const cells = [];
  const cx = size / 2 - 0.5;
  const cy = size / 2 - 0.5;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);
      const dist = dx * 0.8 + dy * 0.55;
      const maxD = size * 0.48;
      if (dist > maxD) continue;

      const density = 1 - dist / maxD;
      if (rand() > density * 0.95) continue;

      const opacity = 0.08 + rand() * 0.82;
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={x * cell}
          y={y * cell}
          width={cell - 1.2}
          height={cell - 1.2}
          fill="#0a0a0a"
          opacity={opacity}
        />
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size * cell} ${size * cell}`}
      className="cs-hero-art"
      preserveAspectRatio="xMidYMid meet"
    >
      {cells}
    </svg>
  );
}

export default Hero;