import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import {
  getCategoryBreakdown,
  formatCurrencyINR,
  getMonthlyTrend,
  getTransactionSummary,
  sortTransactionsByDate,
} from "@/lib/transactions";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "../../components/transactions/TransactionForm";

export const Dashboard = () => {
  const { user } = useUser();
  const { transactions } = useTransactions();
  const summary = getTransactionSummary(transactions ?? []);
  const recentTransactions = sortTransactionsByDate(transactions ?? []).slice(0, 3);
  const categoryBreakdown = getCategoryBreakdown(transactions ?? []);
  const monthlyTrend = getMonthlyTrend(transactions ?? []);
  const monthlyLabel = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
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
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <header className="border-b border-white/8 pb-6 sm:pb-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <Link
                  to="/"
                  className="text-sm text-white/52 transition hover:text-white"
                >
                  Back to home
                </Link>

                <div className="rounded-full border border-white/8 bg-[#111111] p-1">
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

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/30 sm:text-[11px] sm:tracking-[0.32em]">
                    FinScope dashboard
                  </p>

                  <h1 className="font-display mt-3 text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl lg:text-[4.3rem]">
                    Welcome back, {user?.firstName || "there"}.
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/52 sm:text-base">
                    Track income and expenses with a cleaner overview of your
                    financial activity across every transaction you log.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/8 bg-[#111111] px-4 py-4"
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            <main className="grid gap-8 py-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-10 lg:py-10">
              <section>
                <div className="rounded-[24px] border border-white/8 bg-[#111111] p-5 sm:p-6">
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 sm:text-[11px]">
                      Add transaction
                    </p>
                    <h2 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
                      New entry
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/48">
                      Log an income or expense in a few seconds.
                    </p>
                  </div>

                  <TransactionForm />
                </div>

                <div className="mt-6 rounded-[24px] border border-white/8 bg-[#111111] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 sm:text-[11px]">
                        Overview
                      </p>
                      <h2 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
                        This month
                      </h2>
                    </div>
                    <span className="text-sm text-white/38">{monthlyLabel}</span>
                  </div>

                  <div className="pt-5">
                    <p className="text-sm text-white/36">Monthly net</p>
                    <p className="mt-2 text-[38px] font-medium tracking-[-0.05em] text-white sm:text-5xl">
                      {formatCurrencyINR(summary.monthlyBalance)}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-white/44">
                        <span>Income</span>
                        <span>{formatCurrencyINR(summary.monthlyIncome)}</span>
                      </div>
                      <div className="h-[4px] rounded-full bg-white/8">
                        <div
                          className="h-[4px] rounded-full bg-white"
                          style={{ width: `${incomeWidth}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-white/44">
                        <span>Expenses</span>
                        <span>{formatCurrencyINR(summary.monthlyExpenses)}</span>
                      </div>
                      <div className="h-[4px] rounded-full bg-white/8">
                        <div
                          className="h-[4px] rounded-full bg-white/50"
                          style={{ width: `${expenseWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/8 pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/36">Transactions logged</span>
                      <span className="text-white/78">{transactions?.length ?? 0}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/8 bg-[#111111] p-5 sm:p-6">
                  <div className="mb-5 border-b border-white/8 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 sm:text-[11px]">
                      Analytics
                    </p>
                    <h2 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
                      Spending mix
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/42">
                      Your top expense categories based on the transactions logged so far.
                    </p>
                  </div>

                  {categoryBreakdown.length > 0 ? (
                    <div className="space-y-4">
                      {categoryBreakdown.map((item) => (
                        <div key={item.category}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-white/72">{item.category}</span>
                            <span className="text-white/42">
                              {formatCurrencyINR(item.amount)}
                            </span>
                          </div>
                          <div className="h-[6px] rounded-full bg-white/8">
                            <div
                              className="h-[6px] rounded-full bg-white"
                              style={{ width: `${item.share}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-6 text-white/42">
                      Add a few expenses to unlock category insights.
                    </p>
                  )}
                </div>
              </section>

              <section>
                <div className="rounded-[24px] border border-white/8 bg-[#111111] p-5 sm:p-6">
                  <div className="mb-5 flex flex-col gap-2 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 sm:text-[11px]">
                        Activity
                      </p>
                      <h2 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
                        Recent transactions
                      </h2>
                    </div>

                    <p className="text-sm text-white/38">
                      Grouped by day so your activity is easier to scan
                    </p>
                  </div>

                  {recentTransactions.length > 0 ? (
                    <div className="mb-5 grid gap-3 sm:grid-cols-3">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4"
                        >
                          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                            {transaction.type}
                          </p>
                          <p className="mt-2 text-sm font-medium capitalize text-white">
                            {transaction.category}
                          </p>
                          <p className="mt-2 text-sm text-white/44">
                            {new Date(transaction.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <p className="mt-3 text-base font-medium text-white">
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

                  <div className="mb-5 rounded-2xl border border-white/8 bg-black/20 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                          Cash flow
                        </p>
                        <p className="mt-2 text-sm text-white/70">
                          Last 6 months
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/42">
                        <span>Income</span>
                        <span>Expense</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-3">
                      {monthlyTrend.map((month) => (
                        <div key={month.key} className="flex flex-col items-center gap-3">
                          <div className="flex h-28 items-end gap-1">
                            <div
                              className="w-3 rounded-full bg-white"
                              style={{
                                height: `${Math.max(
                                  10,
                                  (month.income / maxTrendValue) * 100,
                                )}%`,
                              }}
                            />
                            <div
                              className="w-3 rounded-full bg-white/35"
                              style={{
                                height: `${Math.max(
                                  10,
                                  (month.expense / maxTrendValue) * 100,
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-[11px] uppercase tracking-[0.14em] text-white/34">
                            {month.label}
                          </span>
                        </div>
                      ))}
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
