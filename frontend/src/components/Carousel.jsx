/**
 * Carousel.jsx
 * ---------------------------------------------------------
 * Product showcase — 5 clickable slides.
 * User clicks dots or prev/next buttons to change slides.
 * Data lives in the SLIDES array — easy to edit.
 */

import { useState } from "react";
import "./Carousel.css";

// 5 slides — each is one module of the platform
const SLIDES = [
  {
    id: "waf",
    tag: "WAF",
    title: "Web Application Firewall",
    description:
      "Real-time inspection of HTTP traffic against known attack patterns and suspicious request shapes.",
    signals: ["sqli.pattern", "xss.payload", "path.traversal"],
  },
  {
    id: "ids",
    tag: "IDS",
    title: "Real-Time Threat Detection",
    description:
      "Surfaces security events as they happen so suspicious activity does not go unnoticed.",
    signals: ["event.created", "alert.high", "severity.medium"],
  },
  {
    id: "ai",
    tag: "AI",
    title: "AI Anomaly Analysis",
    description:
      "Evaluates behavior against expected patterns and flags deviations that may indicate an attack.",
    signals: ["score.0.42", "drift.detected", "baseline.v3"],
  },
  {
    id: "soc",
    tag: "SOC",
    title: "Security Operations Center",
    description:
      "Centralizes threats, alerts, and blocked requests into one analyst-friendly dashboard.",
    signals: ["queue.19", "resolved.184", "open.7"],
  },
  {
    id: "ip",
    tag: "IP",
    title: "IP Risk & Reputation",
    description:
      "Scores source IPs by risk and reputation to support faster triage and response decisions.",
    signals: ["risk.high", "reputation.34", "geo.unknown"],
  },
];

function Carousel() {
  // Track which slide is currently shown (0 to 4)
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDES[currentSlide];
  const totalSlides = SLIDES.length;

  // Go to previous slide (wraps to last slide if at start)
  const goPrev = () => {
    setCurrentSlide((index) => (index === 0 ? totalSlides - 1 : index - 1));
  };

  // Go to next slide (wraps to first slide if at end)
  const goNext = () => {
    setCurrentSlide((index) => (index === totalSlides - 1 ? 0 : index + 1));
  };

  return (
    <section id="showcase" className="carousel-section">
      <div className="container">

        {/* Section header */}
        <div className="carousel-head text-center">
          <span className="section-eyebrow">Product Showcase</span>
          <h2 className="section-title">Five modules. One platform.</h2>
          <p className="section-sub">
            Each module handles a different part of the security pipeline.
          </p>
        </div>

        {/* Carousel */}
        <div className="carousel">

          {/* Left arrow */}
          <button
            type="button"
            className="carousel-arrow carousel-arrow-left"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            ←
          </button>

          {/* Slide card */}
          <div className="carousel-card">

            <div className="carousel-tag">{slide.tag}</div>

            <h3 className="carousel-title">{slide.title}</h3>
            <p className="carousel-description">{slide.description}</p>

            <div className="carousel-signals">
              {slide.signals.map((signal) => (
                <span className="carousel-signal" key={signal}>
                  {signal}
                </span>
              ))}
            </div>

            <div className="carousel-counter">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>

          {/* Right arrow */}
          <button
            type="button"
            className="carousel-arrow carousel-arrow-right"
            onClick={goNext}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        {/* Dots navigation */}
        <div className="carousel-dots">
          {SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`carousel-dot ${index === currentSlide ? "carousel-dot-active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Carousel;