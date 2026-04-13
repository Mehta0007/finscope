import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const LastSection = () => {
  const textRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: lineRef.current, start: "top 90%" }
        }
      )
      gsap.fromTo(textRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: textRef.current, start: "top 95%" }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <footer
      className="relative bg-[#0a0a0a] text-white"
      style={{ height: '320px', overflow: 'hidden' }}
    >
      {/* Vertical line */}
      <div
        ref={lineRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-white/10"
        style={{ height: '52px' }}
      />

      {/* Giant text — nudged up so descenders don't clip */}
      <div
        className="absolute left-0 right-0 flex items-center"
        style={{ top: '52px', bottom: '56px' }}
      >
        <span
          ref={textRef}
          className="select-none pointer-events-none whitespace-nowrap font-sans font-black leading-none"
          style={{
            fontSize: 'clamp(72px, 11vw, 160px)', // smaller = no clipping
            letterSpacing: '-0.04em',
            color: 'rgba(255,255,255,0.055)',
            paddingLeft: '2vw',
            lineHeight: '1',       // explicit line-height prevents extra space
          }}
        >
          FinScope
        </span>

        {/* Right dissolve */}
        <div
          className="absolute inset-y-0 right-0 pointer-events-none"
          style={{
            width: '50%',
            background: 'linear-gradient(to left, #0a0a0a 40%, transparent)',
          }}
        />

        {/* Bottom dissolve */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '60px',
            background: 'linear-gradient(to top, #0a0a0a 50%, transparent)',
          }}
        />
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-sm text-white/30"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '14px 40px',
        }}
      >
        <span>© 2026</span>
        <span>Made by <span className="text-white/60">Ankit</span></span>
      </div>
    </footer>
  )
}