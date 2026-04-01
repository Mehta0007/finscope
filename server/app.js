import express from "express";
import cors from "cors";
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
import  transactionRoutes  from "./src/routes/transaction.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json());

app.use("/transactions", transactionRoutes);

app.get("/", (req, res) => {
    res.send("ROOT HIT 🚨");
});

app.get("/", (req, res) => {
    res.send("ROOT HIT 🚨");
});
app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated",
        userId: req.user.sub,
    })
})

export default app;