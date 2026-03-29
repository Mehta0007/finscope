import { addTransaction, getTransactionsByUser } from "../services/transaction.service.js";
import { deleteTransactionById } from "../services/transaction.service.js";
import { updateTransactionById } from "../services/transaction.service.js";

//CREATE
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

//DELETE
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    const deleted = await deleteTransactionById(id, userId);

    if (!deleted) {
      return res.status(404).json({
        message: "Transaction not found or unauthorized",
      });
    }

    res.json({
      message: "Transaction deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};
//UPDATE
export const updateTransaction = async (req, res) => {
  try {
    const userId = req.user.sub
    const { id } = req.params
    const data = req.body

const updated = await updateTransactionById(id, userId, data)

if (!updated) {
  return res.status(404).json({message: "Transaction not found or unauthorized"})
}

 res.status(200).json({ message: "Transaction updated successfully", data: updated })

  } catch (error) {
    console.log("❌ ERROR:", error)
    res.status(500).json({ message: "Failed to update transaction" })
  }
}
