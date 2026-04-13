import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction as deleteTransactionAPI } from "@/api/transaction.api";
import { useToast } from "@/components/ui/Toast";

export const useDeleteTransaction = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) throw new Error("No auth token");
      return deleteTransactionAPI(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted.");
    },
    onError: () => {
      toast.error("Failed to delete transaction. Please try again.");
    },
  });
};
