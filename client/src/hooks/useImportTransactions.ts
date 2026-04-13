import { createTransaction } from "@/api/transaction.api";
import { useToast } from "@/components/ui/Toast";
import type { TransactionInput } from "@/types/transaction.types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useImportTransactions = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (transactions: TransactionInput[]) => {
      const token = await getToken();
      const results = [];
      for (const transaction of transactions) {
        const result = await createTransaction(token!, transaction);
        results.push(result);
      }
      return results;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(`${data.length} transaction${data.length > 1 ? "s" : ""} imported.`);
    },
    onError: () => {
      toast.error("Import failed. Some transactions may not have been saved.");
    },
  });
};
