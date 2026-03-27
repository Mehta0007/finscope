import { addTransaction, getTransactionsByUser } from "../services/transaction.service.js";


export const createTransaction = (req, res) => {
  const userId = req.user.sub;

  const { amount, category, description, date } = req.body;

const newTransaction = addTransaction({
    userId,
    amount,
    category,
    description,
    date,
  })

  res.status(201).json(newTransaction)
  
};


export const getTransactions = (req, res) => {
    const userId= req.user.sub

    const userTransactions = getTransactionsByUser(userId)

    res.status(200).json(userTransactions)
}