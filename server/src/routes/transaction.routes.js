import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("transactions route working");
});

router.post("/", authMiddleware, createTransaction)

export default router;