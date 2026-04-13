import { updateTransaction } from "@/api/transaction.api";
import { useToast } from "@/components/ui/Toast";
import type { TransactionInput } from "@/types/transaction.types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTransaction = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TransactionInput }) => {
      const token = await getToken();
      if (!token) throw new Error("No auth token");
      return updateTransaction(token, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction updated.");
    },
    onError: () => {
      toast.error("Failed to update transaction. Please try again.");
    },
  });
};
