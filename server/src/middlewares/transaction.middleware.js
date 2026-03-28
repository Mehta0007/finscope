
export const validateTransaction = (req, res, next) => {
    const {amount, category, date, type} = req.body

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({message: "Invalid Amount"})
    }

    if (!category || category.trim() === "") {
        return res.status(400).json({message: "Category is required"})
    }
        
   if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "Type must be income or expense" });
  }

   if (!date || isNaN(new Date(date))) {
    return res.status(400).json({ message: "Invalid date" });
  }


  next()




}