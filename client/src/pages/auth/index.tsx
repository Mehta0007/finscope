import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { DashboardCTA } from "@/components/DashboardCTA";
// import { FeaturesSection } from "@/components/FeaturesSection";
// import { FAQSection } from "@/components/FAQSection";
// import { LastSection } from "@/components/footerSection";

const details = [
  { label: "Privacy", value: "Protected by default" },
  { label: "Tracking", value: "Fast daily logging" },
  { label: "Experience", value: "Calm and focused" },
];

export const Auth = () => {
  return (
    <div className="app-shell auth-scene">
      {/* Hero section — constrained wrapper */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-6 lg:px-10">
       <header className="sticky top-4 z-50">
  <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-black/[0.07] dark:border-white/10 bg-white/75 dark:bg-white/5 px-2.5 py-1.5 shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-none backdrop-blur-2xl">

    <Link
  to="/"
  className="group flex items-center gap-3 rounded-full px-2.5 py-1.5 transition-all duration-200 hover:bg-black/[0.04] dark:hover:bg-white/5"
>
  {/* Logo mark */}
  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.06] transition-all duration-300 group-hover:scale-[1.03]">
    
    {/* subtle inner glow */}
    <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-emerald-400/10 to-sky-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    {/* clean icon */}
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      className="relative z-10"
    >
      <path
        d="M2 11 L5 7.5 L7.5 9.5 L11.5 3.5 L14 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground/80"
      />
    </svg>
  </div>

  {/* Wordmark */}
  <div className="flex flex-col leading-none">
    <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-foreground/90">
      FinScope
    </span>
    <span className="hidden text-[9px] tracking-[0.16em] uppercase text-foreground/40 sm:block">
      Personal finance
    </span>
  </div>
</Link>

    {/* RIGHT */}
    <SignedOut>
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <SignInButton mode="modal">
          <button className="rounded-full px-3.5 py-1.5 text-[13px] app-text-subtle transition hover:bg-black/5 dark:hover:bg-white/5">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="rounded-full bg-[#0d0d0d] dark:bg-white px-4 py-1.5 text-[13px] font-semibold text-white dark:text-black transition hover:opacity-80">
            Get started
          </button>
        </SignUpButton>
      </div>
    </SignedOut>

    <SignedIn>
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Dashboard — premium pill */}
        <Link
  to="/dashboard"
  className="group relative flex items-center gap-2 rounded-full border border-black/10 dark:border-white/[0.12] bg-black/[0.03] dark:bg-white/[0.05] px-4 py-[7px] text-[13px] font-medium transition-all duration-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
>
  <span className="app-text-subtle transition-colors group-hover:text-foreground">
    Dashboard
  </span>

  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
    →
  </span>
</Link>

        {/* Clerk avatar — untouched */}
        <div className="rounded-full border border-white/10 p-[2px]">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </SignedIn>
  </div>
</header>

        <main className="flex flex-1 items-start py-6 sm:items-center sm:py-10 lg:py-16">
          <div className="grid w-full gap-10 sm:gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <section className="max-w-4xl pt-2 sm:pt-6 lg:pt-8">
              <p className="app-text-faint text-[10px] uppercase tracking-[0.26em] sm:text-[11px] sm:tracking-[0.32em]">
                Finance, reduced to what matters
              </p>

              <h1 className="font-display app-animate-in mt-5 max-w-4xl text-[42px] leading-[0.92] tracking-[-0.03em] sm:mt-8 sm:text-6xl lg:text-[92px]">
                A quieter way
                <br />
                to understand
                <br />
                your money.
              </h1>

              <p className="app-text-subtle mt-6 max-w-xl text-[15px] leading-7 sm:mt-8 sm:text-lg sm:leading-8">
                Track income, expenses, and balance with a cleaner experience
                built for attention, not overwhelm. FinScope helps you stay
                close to your numbers without feeling buried in them.
              </p>

              <SignedOut>
                <div className="mt-8 grid gap-3 sm:mt-10 sm:flex sm:flex-row sm:items-center sm:gap-4">
                  <SignUpButton mode="modal">
                    <button className="app-button-primary w-full rounded-full px-6 py-3.5 text-sm font-medium transition hover:opacity-90 sm:w-auto">
                      Start for free
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="app-button-secondary w-full rounded-full border px-6 py-3.5 text-sm font-medium transition hover:opacity-90 sm:w-auto">
                      I already have an account
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="mt-8 sm:mt-10">
                  <DashboardCTA className="w-full sm:w-auto" />
                </div>
              </SignedIn>

              <div className="app-border mt-10 grid gap-6 border-t pt-6 sm:mt-16 sm:grid-cols-3 sm:gap-8 sm:pt-8">
                {details.map((item) => (
                  <div key={item.label} className="app-animate-in">
                    <p className="app-text-faint text-[10px] uppercase tracking-[0.2em] sm:text-[11px] sm:tracking-[0.22em]">
                      {item.label}
                    </p>
                    <p className="app-text-muted mt-2.5 text-sm leading-6 sm:mt-3">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="flex items-end lg:justify-end">
              <div className="app-surface app-animate-in app-hover-lift w-full rounded-[24px] border p-5 sm:rounded-[28px] sm:p-6 lg:max-w-md lg:rounded-[32px] lg:p-7">
                <div className="app-border flex items-start justify-between gap-4 border-b pb-4 sm:items-center sm:pb-5">
                  <div>
                    <p className="app-text-faint text-[10px] uppercase tracking-[0.22em] sm:text-[11px] sm:tracking-[0.24em]">
                      Snapshot
                    </p>
                    <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                      This month
                    </h2>
                  </div>
                  <span className="app-text-subtle text-xs sm:text-sm">
                    April 2026
                  </span>
                </div>

                <div className="pt-5 sm:pt-6">
                  <p className="app-text-subtle text-sm">Available balance</p>
                  <p className="mt-2 text-[38px] font-medium tracking-[-0.05em] sm:text-5xl">
                    $12,480
                  </p>
                </div>

                <div className="mt-7 space-y-5 sm:mt-8">
                  <div>
                    <div className="app-text-subtle mb-2 flex items-center justify-between text-sm">
                      <span>Income</span>
                      <span>$8,400</span>
                    </div>
                    <div className="h-[4px] rounded-full bg-[var(--bar-track)]">
                      <div className="h-[4px] w-[78%] rounded-full bg-[var(--bar-primary)]" />
                    </div>
                  </div>
                  <div>
                    <div className="app-text-subtle mb-2 flex items-center justify-between text-sm">
                      <span>Expenses</span>
                      <span>$3,120</span>
                    </div>
                    <div className="h-[4px] rounded-full bg-[var(--bar-track)]">
                      <div className="h-[4px] w-[43%] rounded-full bg-[var(--bar-secondary)]" />
                    </div>
                  </div>
                  <div>
                    <div className="app-text-subtle mb-2 flex items-center justify-between text-sm">
                      <span>Savings</span>
                      <span>$2,940</span>
                    </div>
                    <div className="h-[4px] rounded-full bg-[var(--bar-track)]">
                      <div className="h-[4px] w-[35%] rounded-full bg-[var(--bar-secondary)] opacity-70" />
                    </div>
                  </div>
                </div>

                <div className="app-border mt-7 grid gap-3 border-t pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="app-text-subtle">Authentication</span>
                    <span className="text-right">Clerk</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="app-text-subtle">Backend</span>
                    <span className="text-right">Express + PostgreSQL</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="app-text-subtle">Designed for</span>
                    <span className="text-right">Daily clarity</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Sections outside the constrained wrapper */}
      {/* <FeaturesSection /> */}
      {/* <FAQSection /> */}
      {/* <LastSection /> */}
    </div>
  );
};
