// components/FeaturesSection.tsx
import { useEffect, useRef, useState } from "react"

const features = [
  {
    number: "01",
    title: "Log in seconds",
    description:
      "Add an income or expense entry in under 10 seconds. No categories to configure, no dashboards to set up. Just open and log.",
    tag: "Speed",
    stat: "< 10s",
    statLabel: "average entry time",
  },
  {
    number: "02",
    title: "See your balance clearly",
    description:
      "A single number tells you where you stand. FinScope keeps the math out of your way and puts the clarity front and center.",
    tag: "Clarity",
    stat: "1",
    statLabel: "number that matters",
  },
  {
    number: "03",
    title: "Monthly snapshots",
    description:
      "Every month is archived automatically. Go back, compare, and notice patterns — without exporting a single spreadsheet.",
    tag: "History",
    stat: "∞",
    statLabel: "months archived",
  },
  {
    number: "04",
    title: "Built for daily use",
    description:
      "No weekly review rituals. No complex setup. FinScope is designed to be opened every day and closed in under a minute.",
    tag: "Habit",
    stat: "~1 min",
    statLabel: "daily check-in",
  },
]

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
useEffect(() => {
  const handleScroll = () => {
    if (!sectionRef.current) return

    const sectionTop = sectionRef.current.offsetTop
    const sectionHeight = sectionRef.current.offsetHeight
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight

    const scrolled = scrollY - sectionTop
    const scrollable = sectionHeight - windowHeight

    if (scrollable <= 0) return

    const total = Math.max(0, Math.min(1, scrolled / scrollable))

    setProgress(total)
    setActiveIndex(Math.min(features.length - 1, Math.floor(total * features.length)))
  }

  window.addEventListener("scroll", handleScroll, { passive: true })
  handleScroll() // run once on mount
  return () => window.removeEventListener("scroll", handleScroll)
}, [])

  const active = features[activeIndex]

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{ height: `${features.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06] z-20">
          <div
            className="h-full bg-white/40 transition-all duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Feature dots */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {features.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === activeIndex ? '20px' : '4px',
                height: '4px',
                background: i === activeIndex ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
          <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — number + title */}
            <div className="relative">

              {/* Giant background number */}
              <span
                className="font-display absolute -top-8 -left-4 select-none pointer-events-none leading-none text-white/[0.04] transition-all duration-700"
                style={{ fontSize: 'clamp(120px, 22vw, 280px)', letterSpacing: '-0.04em' }}
              >
                {active.number}
              </span>

              {/* Tag */}
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/30 mb-6">
                  <span className="w-4 h-px bg-white/20" />
                  {active.tag}
                </span>

                {/* Title */}
                <h2
                  key={activeIndex}
                  className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-[-0.02em] text-white"
                  style={{ animation: 'featureFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}
                >
                  {active.title}
                </h2>

                {/* Thin line */}
                <div className="mt-8 w-12 h-px bg-white/20" />

                {/* Description */}
                <p
                  key={`desc-${activeIndex}`}
                  className="mt-6 text-white/40 text-[15px] leading-[1.8] max-w-sm"
                  style={{ animation: 'featureFadeUp 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both' }}
                >
                  {active.description}
                </p>
              </div>
            </div>

            {/* Right — stat card */}
            <div className="flex lg:justify-end">
              <div
                key={`card-${activeIndex}`}
                className="w-full max-w-sm border border-white/[0.07] rounded-3xl p-8 bg-white/[0.02]"
                style={{ animation: 'featureFadeUp 0.6s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both' }}
              >
                {/* Stat */}
                <div className="border-b border-white/[0.06] pb-7 mb-7">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/20 mb-3">
                    {active.statLabel}
                  </p>
                  <p
                    className="font-display text-7xl sm:text-8xl leading-none tracking-tight text-white/90"
                  >
                    {active.stat}
                  </p>
                </div>

                {/* Feature list */}
                <div className="space-y-3">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 transition-all duration-300"
                      style={{ opacity: i === activeIndex ? 1 : 0.2 }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                        style={{ background: i === activeIndex ? 'white' : 'rgba(255,255,255,0.3)' }}
                      />
                      <span className="text-sm text-white/60">{f.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom index */}
        <div className="px-5 sm:px-10 lg:px-16 pb-8 max-w-7xl mx-auto w-full flex justify-between items-center">
          <span className="text-[11px] text-white/20 uppercase tracking-[0.24em]">
            How it works
          </span>
          <span className="text-[11px] text-white/20 tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
          </span>
        </div>

      </div>

      <style>{`
        @keyframes featureFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}