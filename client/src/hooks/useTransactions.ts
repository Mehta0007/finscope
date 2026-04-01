import { getTransaction } from "@/api/transaction.api";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = () => {
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const token = await getToken();
   
      return getTransaction(token!);
    },
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
