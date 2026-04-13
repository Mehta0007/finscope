import { createTransaction } from "@/api/transaction.api";
import { useToast } from "@/components/ui/Toast";
import type { TransactionInput } from "@/types/transaction.types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTransaction = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: TransactionInput) => {
      const token = await getToken();
      return createTransaction(token!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction added.");
    },
    onError: () => {
      toast.error("Failed to add transaction. Please try again.");
    },
  });
};
