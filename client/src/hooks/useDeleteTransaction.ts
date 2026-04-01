import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction as deleteTransactionAPI } from "@/api/transaction.api";

export const useDeleteTransaction = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
 
      if (!token) {
        throw new Error("No auth token");
      }

      return deleteTransactionAPI(token, id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};