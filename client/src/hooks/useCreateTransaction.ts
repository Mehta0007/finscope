import { createTransaction } from "@/api/transaction.api";
import type { TransactionInput } from "@/types/transaction.types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateTransaction = () => {
     const { getToken } = useAuth();
     const queryClient = useQueryClient()


     return useMutation({
        mutationFn: async (data: TransactionInput) => {
       
            const token = await getToken()


            return createTransaction(token!, data)
        },

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["transactions"]})
        },
     })
}