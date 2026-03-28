import { addTransaction, getTransactionsByUser } from "../services/transaction.service.js";

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { amount, category, description, date, type } = req.body;

    const newTransaction = await addTransaction(userId, {
      amount,
      category,
      description,
      date,
      type
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.sub
    const userTransactions = await getTransactionsByUser(userId)
    res.status(200).json(userTransactions)
  } catch (error) {
    console.log("❌ ERROR:", error)
    res.status(500).json({ message: "Failed to fetch transactions" })
  }
}