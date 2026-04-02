import { updateTransaction } from "@/api/transaction.api";
import type { TransactionInput } from "@/types/transaction.types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTransaction = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TransactionInput;
    }) => {
      const token = await getToken();

      if (!token) {
        throw new Error("No auth token");
      }

      return updateTransaction(token, id, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
