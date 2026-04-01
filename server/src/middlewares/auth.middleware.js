import { verifyToken } from "@clerk/clerk-sdk-node";

export const authMiddleware = async (req, res, next) => {

  try {

 if (req.method === "OPTIONS") {
      return next();
    }


    const authHeader = req.headers.authorization
    console.log("HEADERS:", req.headers);
    if (!authHeader) {
      console.log("❌ NO TOKEN");

      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.user = payload; // attach user info

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};