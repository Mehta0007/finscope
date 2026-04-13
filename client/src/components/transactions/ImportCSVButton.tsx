import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useImportTransactions } from "@/hooks/useImportTransactions";
import { useToast } from "@/components/ui/Toast";
import { parseCSVToTransactions } from "@/lib/transactions";
import type { TransactionInput } from "@/types/transaction.types";

// A small state machine drives this component:
//   idle → (user picks file) → preview → (user confirms) → idle
//                                      → (user cancels)  → idle
// If the file has zero valid rows, we skip preview entirely and fire an error toast.
type State =
  | { phase: "idle" }
  | { phase: "preview"; valid: TransactionInput[]; skipped: number }
  | { phase: "importing" };

export const ImportCSVButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useImportTransactions();
  const toast = useToast();
  const [state, setState] = useState<State>({ phase: "idle" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== "string") return;

      const { valid, errors } = parseCSVToTransactions(text);

      // Nothing importable — show the first error as a toast and stay idle
      // so the header doesn't get cluttered with a useless "No valid rows found"
      if (valid.length === 0) {
        toast.error(errors[0] ?? "No valid rows found in this file.");
        return;
      }

      setState({ phase: "preview", valid, skipped: errors.length });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleConfirm = () => {
    if (state.phase !== "preview") return;
    setState({ phase: "importing" });
    mutate(state.valid, {
      onSuccess: () => setState({ phase: "idle" }),
      onError: () => setState({ phase: "idle" }),
    });
  };

  if (state.phase === "preview") {
    return (
      <div className="flex items-center gap-2">
        <span className="app-text-subtle text-xs">
          {state.valid.length} ready
          {state.skipped > 0 && `, ${state.skipped} skipped`}
        </span>
        <button
          type="button"
          onClick={handleConfirm}
          className="app-button-secondary rounded-full border px-3 py-2 text-xs font-medium transition hover:opacity-90"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setState({ phase: "idle" })}
          className="app-button-secondary rounded-full border px-3 py-2 text-xs font-medium transition hover:opacity-90"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        disabled={isPending || state.phase === "importing"}
        onClick={() => fileInputRef.current?.click()}
        className="app-button-secondary inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition hover:opacity-90 disabled:opacity-40"
      >
        <Upload className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="hidden sm:inline">
          {state.phase === "importing" ? "Importing..." : "Import CSV"}
        </span>
      </button>
    </>
  );
};
