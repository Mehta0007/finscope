import express from "express";
import cors from "cors";
import { authMiddleware } from "./src/middlewares/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated",
        userId: req.user.sub,
    })
})

export default app;