"use client";

import { Link } from "react-router-dom";

/**
 * DashboardCTA — production-grade "Open dashboard" button.
 *
 * Drop-in replacement for the <Link className="app-dashboard-cta ..."> pattern.
 * Builds on top of your existing `app-button-primary` styles — only animations
 * and micro-interactions are added here.
 *
 * Usage:
 *   <DashboardCTA className="w-full sm:w-auto" />
 */

/* ─── Styles ─────────────────────────────────────────────────────────── */
const CSS = `
.dca {
  --e: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spd: 400ms;
  position: relative !important;
  overflow: hidden !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-decoration: none;
  transition:
    transform 220ms var(--e),
    box-shadow var(--spd) ease;
  animation: dca-breathe 4s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* Idle breathing glow — draws the eye subtly */
@keyframes dca-breathe {
  0%, 100% { box-shadow: 0 0 0 0 transparent; }
  50%       { box-shadow: 0 4px 20px rgba(0,0,0,.1); }
}

/* Hover — lift + shadow + stop pulsing */
.dca:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0,0,0,.16), 0 3px 10px rgba(0,0,0,.08) !important;
  animation: none;
}

/* Active — press into screen */
.dca:active {
  transform: translateY(1px) scale(0.982);
  box-shadow: 0 3px 10px rgba(0,0,0,.08) !important;
  animation: none;
}

.dca:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}

/* ── Shimmer sweep ────────────────────────────────────────────────────── */
/* A translucent light band sweeps left-to-right on hover, once. */
.dca__shimmer {
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,.22) 50%,
    transparent 100%
  );
  transform: translateX(-120%) skewX(-15deg);
  pointer-events: none;
  z-index: 0;
}

.dca:hover .dca__shimmer {
  animation: dca-sweep 680ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes dca-sweep {
  to { transform: translateX(340%) skewX(-15deg); }
}

/* ── Label ────────────────────────────────────────────────────────────── */
.dca__label {
  position: relative;
  z-index: 1;
  transition: letter-spacing var(--spd) ease;
}

.dca:hover .dca__label {
  letter-spacing: 0.006em; /* barely perceptible — feels alive */
}

/* ── Arrow ────────────────────────────────────────────────────────────── */
/* Split into a growing line + a separate chevron for independent control. */
.dca__arrow {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  margin-left: 10px;
  transition:
    transform var(--spd) var(--e),
    gap var(--spd) var(--e);
}

/* Whole arrow translates right on hover */
.dca:hover .dca__arrow  { transform: translateX(5px);  gap: 2px; }
.dca:active .dca__arrow { transform: translateX(8px);  gap: 3px; }

/* The horizontal line — extends from left on hover */
.dca__arrow-line {
  display: block;
  width: 10px;
  height: 1.8px;
  background: currentColor;
  border-radius: 2px;
  transform-origin: left center;
  transition: width var(--spd) var(--e);
}

.dca:hover .dca__arrow-line  { width: 14px; }
.dca:active .dca__arrow-line { width: 16px; }

/* Chevron — stays flush to the right of the line */
.dca__arrow-head {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* ── Reduced motion ───────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .dca,
  .dca__shimmer,
  .dca__arrow,
  .dca__arrow-line,
  .dca__label {
    transition-duration: 0ms !important;
    animation: none !important;
  }
}
`;

/* ─── Component ───────────────────────────────────────────────────────── */
interface DashboardCTAProps {
  /** Pass Tailwind sizing utilities e.g. "w-full sm:w-auto" */
  className?: string;
}

export function DashboardCTA({ className = "" }: DashboardCTAProps) {
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static constant */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Link
        to="/dashboard"
        className={`app-button-primary dca rounded-full px-6 py-3.5 text-sm font-medium transition hover:opacity-90 ${className}`}
        aria-label="Open dashboard"
      >
        {/* Shimmer overlay */}
        <span className="dca__shimmer" aria-hidden="true" />

        {/* Label */}
        <span className="dca__label">Open dashboard</span>

        {/* Arrow: extending line + chevron */}
        <span className="dca__arrow" aria-hidden="true">
          <span className="dca__arrow-line" />
          <span className="dca__arrow-head">
            <svg
              width="7"
              height="11"
              viewBox="0 0 7 11"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1.5L6 5.5L1 9.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      </Link>
    </>
  );
}