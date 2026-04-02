import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const details = [
  { label: "Privacy", value: "Protected by default" },
  { label: "Tracking", value: "Fast daily logging" },
  { label: "Experience", value: "Calm and focused" },
];

export const Auth = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between py-5 sm:py-7">
          <Link
            to="/"
            className="inline-flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.32em] text-white/48 sm:text-[11px] sm:tracking-[0.38em]">
              FinScope
            </span>
            <span className="text-xs text-white/18">/</span>
            <span className="hidden text-sm text-white/40 sm:inline">
              Personal finance
            </span>
          </Link>

          <SignedOut>
            <div className="flex items-center gap-2 sm:gap-3">
              <SignInButton mode="modal">
                <button className="text-sm text-white/56 transition hover:text-white">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-full border border-white/14 px-3.5 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white hover:text-black sm:px-4">
                  Get started
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/dashboard"
                className="text-sm text-white/52 transition hover:text-white"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </header>

        <main className="flex flex-1 items-start py-6 sm:items-center sm:py-10 lg:py-16">
          <div className="grid w-full gap-10 sm:gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <section className="max-w-4xl pt-2 sm:pt-6 lg:pt-8">
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/32 sm:text-[11px] sm:tracking-[0.32em]">
                Finance, reduced to what matters
              </p>

              <h1 className="font-display mt-5 max-w-4xl text-[42px] leading-[0.92] tracking-[-0.03em] text-white sm:mt-8 sm:text-6xl lg:text-[92px]">
                A quieter way
                <br />
                to understand
                <br />
                your money.
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/56 sm:mt-8 sm:text-lg sm:leading-8">
                Track income, expenses, and balance with a cleaner experience
                built for attention, not overwhelm. FinScope helps you stay
                close to your numbers without feeling buried in them.
              </p>

              <SignedOut>
                <div className="mt-8 grid gap-3 sm:mt-10 sm:flex sm:flex-row sm:items-center sm:gap-4">
                  <SignUpButton mode="modal">
                    <button className="w-full rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-white/90 sm:w-auto">
                      Start for free
                    </button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <button className="w-full rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white sm:w-auto">
                      I already have an account
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="mt-8 sm:mt-10">
                  <Link
                    to="/dashboard"
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-white/90 sm:w-auto"
                  >
                    Open dashboard
                  </Link>
                </div>
              </SignedIn>

              <div className="mt-10 grid gap-6 border-t border-white/8 pt-6 sm:mt-16 sm:grid-cols-3 sm:gap-8 sm:pt-8">
                {details.map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 sm:text-[11px] sm:tracking-[0.22em]">
                      {item.label}
                    </p>
                    <p className="mt-2.5 text-sm leading-6 text-white/68 sm:mt-3">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="flex items-end lg:justify-end">
              <div className="w-full rounded-[24px] border border-white/8 bg-[#111111] p-5 sm:rounded-[28px] sm:p-6 lg:max-w-md lg:rounded-[32px] lg:p-7">
                <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-4 sm:items-center sm:pb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 sm:text-[11px] sm:tracking-[0.24em]">
                      Snapshot
                    </p>
                    <h2 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
                      This month
                    </h2>
                  </div>
                  <span className="text-xs text-white/36 sm:text-sm">April 2026</span>
                </div>

                <div className="pt-5 sm:pt-6">
                  <p className="text-sm text-white/36">Available balance</p>
                  <p className="mt-2 text-[38px] font-medium tracking-[-0.05em] text-white sm:text-5xl">
                    $12,480
                  </p>
                </div>

                <div className="mt-7 space-y-5 sm:mt-8">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-white/44">
                      <span>Income</span>
                      <span>$8,400</span>
                    </div>
                    <div className="h-[4px] rounded-full bg-white/8">
                      <div className="h-[4px] w-[78%] rounded-full bg-white" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-white/44">
                      <span>Expenses</span>
                      <span>$3,120</span>
                    </div>
                    <div className="h-[4px] rounded-full bg-white/8">
                      <div className="h-[4px] w-[43%] rounded-full bg-white/55" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-white/44">
                      <span>Savings</span>
                      <span>$2,940</span>
                    </div>
                    <div className="h-[4px] rounded-full bg-white/8">
                      <div className="h-[4px] w-[35%] rounded-full bg-white/28" />
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid gap-3 border-t border-white/8 pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-white/36">Authentication</span>
                    <span className="text-right text-white/78">Clerk</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-white/36">Backend</span>
                    <span className="text-right text-white/78">Express + PostgreSQL</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-white/36">Designed for</span>
                    <span className="text-right text-white/78">Daily clarity</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <footer className="flex flex-col gap-2 py-5 text-xs text-white/28 sm:flex-row sm:items-center sm:justify-between sm:py-6">
          <span>© 2026 FinScope</span>
          <span>Built with React, Clerk, Express, and PostgreSQL</span>
        </footer>
      </div>
    </div>
  );
};
