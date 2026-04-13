// components/FAQSection.tsx
import { useState } from "react"

const faqs = [
  {
    q: "Is FinScope free to use?",
    a: "Yes. FinScope is completely free during its early access period. No credit card required, no hidden limits.",
  },
  {
    q: "Where is my data stored?",
    a: "Your data is stored securely in a PostgreSQL database and tied to your account. Only you can access it.",
  },
  {
    q: "Can I use it on mobile?",
    a: "FinScope is fully responsive and works on any screen size. A dedicated mobile app is on the roadmap.",
  },
  {
    q: "Does it connect to my bank?",
    a: "Not yet. Right now FinScope is manual — you log what matters. Bank sync is planned for a future release.",
  },
  {
    q: "Can I export my data?",
    a: "CSV export is coming soon. Your data will always be yours to take with you.",
  },
]

export const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-[#0a0a0a] text-white px-5 sm:px-6 lg:px-10 py-28 sm:py-36 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24">

        {/* Left label */}
        <div className="max-w-xs">
          <p className="text-[10px] uppercase tracking-[0.32em] text-white/30 sm:text-[11px]">
            FAQ
          </p>
         <h2 className="font-display mt-5 text-4xl sm:text-5xl tracking-[-0.02em] leading-[0.95]">
  Questions,
  <br />
  answered.
</h2>
          <p className="mt-6 text-white/40 text-[15px] leading-7">
            Still unsure about something? Reach out and we'll get back to you.
          </p>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-white/[0.06]">
          {faqs.map((faq, i) => (
            <div key={i} className="py-6 cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
              <div className="flex items-center justify-between gap-6">
                <span className="text-[15px] sm:text-base font-medium">
                  {faq.q}
                </span>
                <span className="text-white/30 text-xl leading-none shrink-0 transition-transform duration-300"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </div>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? '200px' : '0px' }}
              >
                <p className="pt-4 text-white/40 text-[15px] leading-7 max-w-xl">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}