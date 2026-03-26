


export const createTransaction = (req, res) => {
    console.log("👉 CONTROLLER HIT");
  const userId = req.user.sub;
  console.log("USER ID:", userId);
  const { amount, category, description, date } = req.body;
console.log("BODY:", req.body);
  res.json({
    message: "data received",
    userId,
    amount,
    category,
    description,
    date,
  });
};
