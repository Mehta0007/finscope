import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";

export const Dashboard = () => {
  const { user } = useUser();

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-[#0f0f0f] text-white">
          <div className="max-w-2xl mx-auto px-6 py-12">
            
            {/* Header */}
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">Finance Tracker</p>
              <h1 className="text-4xl font-bold text-white">
                Hey, {user?.firstName} 👋
              </h1>
              <p className="text-zinc-400 mt-2 text-sm">Track your income and expenses in one place.</p>
            </div>

            {/* Form */}
            <TransactionForm />

            {/* List */}
            <div className="mt-10">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Transactions</p>
              <TransactionList />
            </div>

          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};