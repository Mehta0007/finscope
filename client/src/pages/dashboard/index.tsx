import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import {
  getCategoryBreakdown,
  exportTransactionsToCSV,
  formatCurrencyINR,
  getMonthlyTrend,
  getTransactionSummary,
  sortTransactionsByDate,
} from "@/lib/transactions";
import { Download } from "lucide-react";
import { TransactionList } from "@/components/transactions/TransactionList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { ImportCSVButton } from "@/components/transactions/ImportCSVButton";

export const Dashboard = () => {
  const { user } = useUser();
  const [activeTrendMetric, setActiveTrendMetric] = useState<"income" | "expense">(
    "income",
  );
  const { transactions } = useTransactions();
  const summary = getTransactionSummary(transactions ?? []);
  const recentTransactions = sortTransactionsByDate(transactions ?? []).slice(0, 3);
  const categoryBreakdown = getCategoryBreakdown(transactions ?? []);
  const monthlyTrend = getMonthlyTrend(transactions ?? []);
  const monthlyLabel = summary.referenceMonthLabel;
  const monthlyTotal = summary.monthlyIncome + summary.monthlyExpenses;
  const incomeWidth =
    monthlyTotal === 0 ? 0 : (summary.monthlyIncome / monthlyTotal) * 100;
  const expenseWidth =
    monthlyTotal === 0 ? 0 : (summary.monthlyExpenses / monthlyTotal) * 100;
  const stats = [
    { label: "Net balance", value: formatCurrencyINR(summary.balance) },
    { label: "Income", value: formatCurrencyINR(summary.totalIncome) },
    { label: "Expenses", value: formatCurrencyINR(summary.totalExpenses) },
  ];
  const maxTrendValue = Math.max(
    ...monthlyTrend.map((month) => Math.max(month.income, month.expense)),
    1,
  );

  return (
    <>
      <SignedIn>
        <div className="app-shell min-h-screen">
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <header className="app-border border-b pb-6 sm:pb-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <Link
                  to="/"
                  className="app-text-subtle text-sm transition hover:opacity-90"
                >
                  Back to home
                </Link>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <ImportCSVButton />
                  <button
                    type="button"
                    onClick={() => exportTransactionsToCSV(transactions ?? [])}
                    className="app-button-secondary inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition hover:opacity-90"
                  >
                    <Download className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>
                  <div className="app-surface rounded-full border p-1">
                    <UserButton
                      userProfileMode="modal"
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "h-8 w-8",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="app-text-faint text-[10px] uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.32em]">
                    FinScope dashboard
                  </p>

                  <h1 className="font-display app-animate-in mt-3 text-[2.6rem] leading-[0.95] tracking-[-0.03em] sm:text-5xl lg:text-[4.3rem]">
                    Welcome back, {user?.firstName || "there"}.
                  </h1>

                  <p className="app-text-subtle mt-3 max-w-xl text-sm leading-7 sm:text-base">
                    Track income and expenses with a cleaner overview of your
                    financial activity across every transaction you log.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="app-surface app-hover-lift app-animate-in rounded-2xl border px-4 py-4"
                    >
                      <p className="app-text-faint text-[11px] uppercase tracking-[0.18em]">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            <main className="grid gap-8 py-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-10 lg:py-10">
              <section>
                <div className="app-surface app-animate-in rounded-[24px] border p-5 sm:p-6">
                  <div className="mb-5">
                    <p className="app-text-faint text-[10px] uppercase tracking-[0.22em] sm:text-[11px]">
                      Add transaction
                    </p>
                    <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                      New entry
                    </h2>
                    <p className="app-text-subtle mt-2 text-sm leading-6">
                      Log an income or expense in a few seconds.
                    </p>
                  </div>

                  <TransactionForm />
                </div>

                <div className="app-surface app-hover-lift app-animate-in mt-6 rounded-[24px] border p-5 sm:p-6">
                  <div className="app-border flex items-start justify-between gap-4 border-b pb-4">
                    <div>
                      <p className="app-text-faint text-[10px] uppercase tracking-[0.22em] sm:text-[11px]">
                        Overview
                      </p>
                      <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                        Active month
                      </h2>
                    </div>
                    <span className="app-text-subtle text-sm">{monthlyLabel}</span>
                  </div>

                  <div className="pt-5">
                    <p className="app-text-subtle text-sm">Monthly net</p>
                    <p className="mt-2 text-[38px] font-medium tracking-[-0.05em] sm:text-5xl">
                      {formatCurrencyINR(summary.monthlyBalance)}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div>
                      <div className="app-text-subtle mb-2 flex items-center justify-between text-sm">
                        <span>Income</span>
                        <span>{formatCurrencyINR(summary.monthlyIncome)}</span>
                      </div>
                      <div className="h-[4px] rounded-full bg-[var(--bar-track)]">
                        <div
                          className="h-[4px] rounded-full bg-[var(--bar-primary)]"
                          style={{ width: `${incomeWidth}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="app-text-subtle mb-2 flex items-center justify-between text-sm">
                        <span>Expenses</span>
                        <span>{formatCurrencyINR(summary.monthlyExpenses)}</span>
                      </div>
                      <div className="h-[4px] rounded-full bg-[var(--bar-track)]">
                        <div
                          className="h-[4px] rounded-full bg-[var(--bar-secondary)]"
                          style={{ width: `${expenseWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="app-border mt-6 border-t pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="app-text-subtle">Transactions logged</span>
                      <span>{transactions?.length ?? 0}</span>
                    </div>
                  </div>
                </div>

                <div className="app-surface app-hover-lift app-animate-in mt-6 rounded-[24px] border p-5 sm:p-6">
                  <div className="app-border mb-5 border-b pb-4">
                    <p className="app-text-faint text-[10px] uppercase tracking-[0.22em] sm:text-[11px]">
                      Analytics
                    </p>
                    <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                      Spending mix
                    </h2>
                    <p className="app-text-subtle mt-2 text-sm leading-6">
                      Your top expense categories based on the transactions logged so far.
                    </p>
                  </div>

                  {categoryBreakdown.length > 0 ? (
                    <div className="space-y-4">
                      {categoryBreakdown.map((item) => (
                        <div key={item.category}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="app-text-muted">{item.category}</span>
                            <span className="app-text-subtle">
                              {formatCurrencyINR(item.amount)}
                            </span>
                          </div>
                          <div className="h-[6px] rounded-full bg-[var(--bar-track)]">
                            <div
                              className="h-[6px] rounded-full bg-[var(--bar-primary)]"
                              style={{ width: `${item.share}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="app-text-subtle text-sm leading-6">
                      Add a few expenses to unlock category insights.
                    </p>
                  )}
                </div>
              </section>

              <section>
                <div className="app-surface app-animate-in rounded-[24px] border p-5 sm:p-6">
                  <div className="app-border mb-5 flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="app-text-faint text-[10px] uppercase tracking-[0.22em] sm:text-[11px]">
                        Activity
                      </p>
                      <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                        Recent transactions
                      </h2>
                    </div>

                    <p className="app-text-subtle text-sm">
                      Grouped by day so your activity is easier to scan
                    </p>
                  </div>

                  {recentTransactions.length > 0 ? (
                    <div className="mb-5 grid gap-3 sm:grid-cols-3">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="app-surface-muted app-hover-lift rounded-2xl border px-4 py-4"
                        >
                          <p className="app-text-faint text-[10px] uppercase tracking-[0.18em]">
                            {transaction.type}
                          </p>
                          <p className="mt-2 text-sm font-medium capitalize">
                            {transaction.category}
                          </p>
                          <p className="app-text-subtle mt-2 text-sm">
                            {new Date(transaction.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <p className="mt-3 text-base font-medium">
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrencyINR(transaction.amount).replace(
                              "\u20B9",
                              "\u20B9 ",
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="app-surface-muted app-hover-lift mb-5 rounded-2xl border p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="app-text-faint text-[10px] uppercase tracking-[0.18em]">
                          Cash flow
                        </p>
                        <p className="app-text-muted mt-2 text-sm">
                          Last 6 months
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTrendMetric("income")}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            activeTrendMetric === "income"
                              ? "app-button-primary border-transparent"
                              : "app-button-secondary hover:opacity-90"
                          }`}
                        >
                          Income
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTrendMetric("expense")}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            activeTrendMetric === "expense"
                              ? "app-button-primary border-transparent"
                              : "app-button-secondary hover:opacity-90"
                          }`}
                        >
                          Expense
                        </button>
                      </div>
                    </div>

                    <div className="-mx-1 overflow-x-auto pb-2">
                      <div className="flex min-w-[420px] gap-3 px-1 sm:min-w-0 sm:grid sm:grid-cols-6">
                      {monthlyTrend.map((month) => (
                        <div key={month.key} className="flex min-w-[56px] flex-col items-center gap-3">
                          <div
                            className="flex h-28 items-end gap-1"
                            title={`${month.label}: Income ${formatCurrencyINR(
                              month.income,
                            )}, Expense ${formatCurrencyINR(month.expense)}`}
                          >
                            <div
                              className={`w-3 rounded-full transition ${
                                activeTrendMetric === "income"
                                  ? "bg-[var(--bar-primary)] opacity-100"
                                  : "bg-[var(--bar-secondary)] opacity-50"
                              }`}
                              style={{
                                height: `${Math.max(
                                  10,
                                  (month.income / maxTrendValue) * 100,
                                )}%`,
                              }}
                            />
                            <div
                              className={`w-3 rounded-full transition ${
                                activeTrendMetric === "expense"
                                  ? "bg-[var(--bar-secondary)] opacity-100"
                                  : "bg-[var(--bar-secondary)] opacity-50"
                              }`}
                              style={{
                                height: `${Math.max(
                                  10,
                                  (month.expense / maxTrendValue) * 100,
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="app-text-faint text-[11px] uppercase tracking-[0.14em]">
                            {month.label}
                          </span>
                        </div>
                      ))}
                      </div>
                    </div>

                    <div className="app-surface-muted mt-4 rounded-xl border px-4 py-3">
                      <p className="app-text-faint text-[10px] uppercase tracking-[0.18em]">
                        Focus metric
                      </p>
                      <p className="app-text-muted mt-2 text-sm">
                        {activeTrendMetric === "income"
                          ? "Income bars are highlighted so you can compare earning momentum over time."
                          : "Expense bars are highlighted so you can spot heavier spending months faster."}
                      </p>
                    </div>
                  </div>

                  <TransactionList />
                </div>
              </section>
            </main>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
