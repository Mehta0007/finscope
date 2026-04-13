"use client";

import type React from "react";
import { useTheme } from "@/hooks/useTheme";

/** Extends CSSProperties to allow CSS custom properties (--d, --spd, etc). */
type CSSWithVars = React.CSSProperties & { [key: `--${string}`]: string | number };

/**
 * ThemeToggle — production-grade animated theme switcher.
 * Drop-in replacement. Requires: useTheme hook with { theme, toggleTheme }.
 * Zero external icon dependencies — SVGs are inlined.
 */

const STARS = [
  { top: "22%", left: "14%", r: 2.5, d: 0 },
  { top: "58%", left: "22%", r: 1.5, d: 80 },
  { top: "30%", left: "48%", r: 2,   d: 40 },
  { top: "68%", left: "60%", r: 1.5, d: 130 },
  { top: "18%", left: "76%", r: 2,   d: 60 },
  { top: "50%", left: "88%", r: 1.5, d: 100 },
];

/* ─── Styles ─────────────────────────────────────────────────────────── */
const CSS = `
.tt {
  --e: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spd: 420ms;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.tt:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
  border-radius: 99px;
}

/* Track */
.tt__track {
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: 999px;
  overflow: hidden;
  background: linear-gradient(135deg, #64b5d9, #9fd5f0);
  transition: background var(--spd) ease;
  box-shadow:
    0 0 0 1.5px rgba(0,0,0,.1),
    0 2px 8px rgba(0,0,0,.15),
    inset 0 1px 0 rgba(255,255,255,.4);
  flex-shrink: 0;
}
.tt--dark .tt__track {
  background: linear-gradient(135deg, #080d1a, #141830);
  box-shadow:
    0 0 0 1.5px rgba(255,255,255,.07),
    0 2px 12px rgba(0,0,0,.45),
    inset 0 1px 0 rgba(255,255,255,.03);
}

/* Stars */
.tt__star {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transform: scale(0);
  transition:
    opacity 280ms ease var(--d, 0ms),
    transform 280ms var(--e) var(--d, 0ms);
}
.tt--dark .tt__star {
  opacity: 1;
  transform: scale(1);
  animation: tt-twinkle 2.5s ease-in-out infinite var(--d, 0ms);
}
@keyframes tt-twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* Clouds */
.tt__cloud {
  position: absolute;
  background: rgba(255,255,255,.8);
  border-radius: 999px;
  filter: blur(3px);
  transition:
    opacity var(--spd) ease,
    transform var(--spd) ease;
}
.tt__cloud--a {
  width: 22px; height: 9px;
  top: 6px; left: 6px;
}
.tt__cloud--b {
  width: 14px; height: 7px;
  bottom: 7px; left: 16px;
  opacity: .55;
}
.tt--dark .tt__cloud {
  opacity: 0;
  transform: translateX(-8px);
}

/* Knob */
.tt__knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #fff9e8, #ffe090);
  box-shadow:
    0 2px 6px rgba(0,0,0,.2),
    0 0 0 1px rgba(255,190,0,.25),
    inset 0 1px 0 rgba(255,255,255,.85);
  transform: translateX(0) scale(1);
  transition:
    transform var(--spd) var(--e),
    background var(--spd) ease,
    box-shadow var(--spd) ease;
  z-index: 2;
  will-change: transform;
}
.tt--dark .tt__knob {
  transform: translateX(32px) scale(1);
  background: linear-gradient(145deg, #ece6ff, #cdb8fc);
  box-shadow:
    0 2px 8px rgba(0,0,0,.45),
    0 0 0 1px rgba(140,90,255,.3),
    0 0 16px rgba(140,90,255,.2),
    inset 0 1px 0 rgba(255,255,255,.25);
}
.tt:active .tt__knob {
  transform: translateX(0) scale(0.88);
}
.tt--dark:active .tt__knob {
  transform: translateX(32px) scale(0.88);
}

/* Knob glow */
.tt__glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,0,.3) 0%, transparent 65%);
  transition: background var(--spd) ease;
  pointer-events: none;
}
.tt--dark .tt__glow {
  background: radial-gradient(circle, rgba(150,90,255,.3) 0%, transparent 65%);
}

/* Icons */
.tt__icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    opacity 180ms ease,
    transform 380ms var(--e);
}
.tt__icon--sun {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  color: #b45309;
}
.tt__icon--moon {
  opacity: 0;
  transform: scale(0) rotate(-40deg);
  color: #5b21b6;
}
.tt--dark .tt__icon--sun {
  opacity: 0;
  transform: scale(0) rotate(40deg);
}
.tt--dark .tt__icon--moon {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* Sun ray rotation */
.tt__rays {
  animation: tt-spin 10s linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}
@keyframes tt-spin {
  to { transform: rotate(360deg); }
}

/* Label */
.tt__label {
  position: relative;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  height: 1em;
  overflow: hidden;
  width: 32px;
}
.tt__lbl {
  position: absolute;
  inset: 0;
  transition:
    opacity 220ms ease,
    transform 380ms var(--e);
}
.tt__lbl--light {
  opacity: 1;
  transform: translateY(0);
}
.tt__lbl--dark {
  opacity: 0;
  transform: translateY(110%);
}
.tt--dark .tt__lbl--light {
  opacity: 0;
  transform: translateY(-110%);
}
.tt--dark .tt__lbl--dark {
  opacity: 1;
  transform: translateY(0);
}

/* Respect system reduced-motion preferences */
@media (prefers-reduced-motion: reduce) {
  .tt__knob,
  .tt__track,
  .tt__star,
  .tt__cloud,
  .tt__icon,
  .tt__lbl,
  .tt__glow {
    transition-duration: 0ms !important;
    animation: none !important;
  }
}
`;

/* ─── Inlined SVG icons ───────────────────────────────────────────────── */
const SunIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <g className="tt__rays">
      <line x1="12" y1="2"     x2="12" y2="4" />
      <line x1="12" y1="20"    x2="12" y2="22" />
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12"    x2="4"  y2="12" />
      <line x1="20" y1="12"    x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
    </g>
  </svg>
);

const MoonIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/* ─── Component ───────────────────────────────────────────────────────── */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static constant */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleTheme}
        className={`tt${dark ? " tt--dark" : ""}`}
      >
        <span className="tt__track" aria-hidden="true">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="tt__star"
              style={{
                top: s.top,
                left: s.left,
                width: `${s.r}px`,
                height: `${s.r}px`,
                "--d": `${s.d}ms`,
              } as CSSWithVars}
            />
          ))}
          <span className="tt__cloud tt__cloud--a" />
          <span className="tt__cloud tt__cloud--b" />
          <span className="tt__knob">
            <span className="tt__glow" />
            <span className="tt__icon tt__icon--sun">{SunIcon}</span>
            <span className="tt__icon tt__icon--moon">{MoonIcon}</span>
          </span>
        </span>

        {/* <span className="tt__label" aria-hidden="true">
          <span className="tt__lbl tt__lbl--light">Light</span>
          <span className="tt__lbl tt__lbl--dark">Dark</span>
        </span> */}
      </button>
    </>
  );
}