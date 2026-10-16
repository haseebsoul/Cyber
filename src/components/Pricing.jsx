import { useState } from 'react';
import './Pricing.css';

const TIERS = [
  {
    num: '01',
    name: 'Starter',
    tagline: 'For individuals and small projects',
    priceMonthly: 0,
    priceAnnual: 0,
    priceLabel: '$0',
    cta: 'Start free',
    features: [
      'Up to 3 projects',
      '1GB log storage',
      'Community support',
      'Basic rule engine',
      'HTTPS inspection',
    ],
    popular: false,
  },
  {
    num: '02',
    name: 'Pro',
    tagline: 'For growing teams and businesses',
    priceMonthly: 24,
    priceAnnual: 20,
    priceLabel: '$24',
    cta: 'Start trial',
    features: [
      'Unlimited projects',
      '100GB log storage',
      'Priority support',
      'Advanced analytics',
      'AI anomaly detection',
      'IP reputation feed',
      'SOC dashboard access',
    ],
    popular: true,
  },
  {
    num: '03',
    name: 'Enterprise',
    tagline: 'For large-scale operations',
    priceMonthly: null,
    priceAnnual: null,
    priceLabel: 'Custom',
    cta: 'Contact sales',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      '24/7 dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment',
      'Security audit',
      'Custom contracts',
    ],
    popular: false,
  },
];

function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="cs-pricing">
      <div className="container">
        {/* Head */}
        <div className="cs-pricing-head">
          <span className="cs-eyebrow">Pricing</span>
          <h2 className="cs-h2">
            Simple, transparent<br />
            <span className="cs-h2-muted">pricing.</span>
          </h2>
          <p className="cs-pricing-sub">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Toggle */}
        <div className="cs-pricing-toggle">
          <button
            type="button"
            className={`cs-pricing-toggle-btn ${!annual ? 'is-active' : ''}`}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-label="Toggle annual pricing"
            onClick={() => setAnnual((v) => !v)}
            className={`cs-pricing-switch ${annual ? 'is-on' : ''}`}
          >
            <span className="cs-pricing-switch-knob" />
          </button>
          <button
            type="button"
            className={`cs-pricing-toggle-btn ${annual ? 'is-active' : ''}`}
            onClick={() => setAnnual(true)}
          >
            Annual
          </button>
          <span className="cs-pricing-save mono">Save 17%</span>
        </div>

        {/* Cards */}
        <div className="cs-pricing-grid">
          {TIERS.map((t) => {
            const price =
              t.priceLabel === 'Custom'
                ? 'Custom'
                : `$${annual ? t.priceAnnual : t.priceMonthly}`;
            const suffix =
              t.priceLabel === 'Custom'
                ? ''
                : annual
                ? '/month · billed yearly'
                : '/month';

            return (
              <div
                key={t.num}
                className={`cs-price-card ${t.popular ? 'is-popular' : ''}`}
              >
                {t.popular && (
                  <div className="cs-price-badge mono">MOST POPULAR</div>
                )}

                <div className="cs-price-num mono">{t.num}</div>
                <h3 className="cs-price-name">{t.name}</h3>
                <p className="cs-price-tagline">{t.tagline}</p>

                <div className="cs-price-value-wrap">
                  <div className="cs-price-value">{price}</div>
                  {suffix && (
                    <span className="cs-price-suffix">{suffix}</span>
                  )}
                </div>

                <div className="cs-price-divider" />

                <ul className="cs-price-features">
                  {t.features.map((f) => (
                    <li key={f}>
                      <span className="cs-price-check">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  className={`cs-btn ${t.popular ? 'cs-btn-dark' : 'cs-btn-light'} cs-price-cta`}
                >
                  {t.cta}
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="cs-price-note">
          All plans include automatic updates, HTTPS inspection, and DDoS
          protection. <a href="#features">Compare all features →</a>
        </p>
      </div>
    </section>
  );
}

export default Pricing;