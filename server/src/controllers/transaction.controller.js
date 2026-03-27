import { addTransaction } from "../services/transaction.service.js";


export const createTransaction = (req, res) => {
  const userId = req.user.sub;

  const { amount, category, description, date } = req.body;

const newTransaction = addTransaction({
    message: "data received",
    userId,
    amount,
    category,
    description,
    date,
  })

  res.status(201).json(newTransaction)
  
};
