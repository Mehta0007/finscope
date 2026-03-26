import { verifyToken } from "@clerk/clerk-sdk-node";

export const authMiddleware = async (req, res, next) => {
  try {
    console.log("👉 MIDDLEWARE HIT");
    console.log("HEADERS:", req.headers);
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      console.log("❌ NO TOKEN");

      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
console.log("TOKEN EXTRACTED:", token ? "YES" : "NO");
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.user = payload; // attach user info

    next();
  } catch (error) {
    console.log("❌ ERROR IN MIDDLEWARE:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};