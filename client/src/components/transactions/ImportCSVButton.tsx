import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useImportTransactions } from "@/hooks/useImportTransactions";
import { parseCSVToTransactions } from "@/lib/transactions";
import type { TransactionInput } from "@/types/transaction.types";

// A small state machine drives this component:
//   idle → (user picks file) → preview → (user confirms) → idle
//                                      → (user cancels)  → idle
type State =
  | { phase: "idle" }
  | { phase: "preview"; valid: TransactionInput[]; errors: string[] }
  | { phase: "importing" };

export const ImportCSVButton = () => {
  // A ref to the hidden <input type="file"> — we click it programmatically
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useImportTransactions();
  const [state, setState] = useState<State>({ phase: "idle" });

  // Step 1: User picks a file. FileReader reads it as plain text, then we parse it.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== "string") return;
      const { valid, errors } = parseCSVToTransactions(text);
      setState({ phase: "preview", valid, errors });
    };
    // Tells the browser to read the file and call onload when done.
    reader.readAsText(file);

    // Reset so the same file can be re-imported if needed
    e.target.value = "";
  };

  // Step 2: User confirms — run the batch import mutation
  const handleConfirm = () => {
    if (state.phase !== "preview" || !state.valid.length) return;
    setState({ phase: "importing" });
    mutate(state.valid, {
      onSuccess: () => setState({ phase: "idle" }),
      onError: () => setState({ phase: "idle" }),
    });
  };

  if (state.phase === "preview") {
    return (
      <div className="flex items-center gap-2">
        {state.errors.length > 0 && (
          <span className="app-text-subtle text-xs">
            {state.errors.length} row{state.errors.length > 1 ? "s" : ""} skipped
          </span>
        )}

        {state.valid.length > 0 ? (
          <>
            <span className="app-text-subtle text-xs">
              {state.valid.length} row{state.valid.length > 1 ? "s" : ""} ready
            </span>
            <button
              type="button"
              onClick={handleConfirm}
              className="app-button-secondary rounded-full border px-3 py-2 text-xs font-medium transition hover:opacity-90"
            >
              Confirm import
            </button>
          </>
        ) : (
          <span className="app-text-subtle text-xs">No valid rows found</span>
        )}

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
      {/* Hidden file input — only .csv files are accepted */}
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
