import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTransaction, deleteTransaction, getTransactions } from "../controllers/transaction.controller.js";
import { validateTransaction } from "../middlewares/transaction.middleware.js";
// import { updateTransactionById } from "../services/transaction.service.js";
import { updateTransaction } from "../controllers/transaction.controller.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("transactions route working");
// });

router.post("/", authMiddleware,validateTransaction ,createTransaction)
router.get("/", authMiddleware, getTransactions)
router.delete("/:id", authMiddleware, deleteTransaction);
router.put(
  "/:id",
  authMiddleware,
  updateTransaction
);

export default router;