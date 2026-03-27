

let transactions = []

export const addTransaction = (data) => {
 const newTransaction = {
    id: Date.now().toString(),
    ...data,
 }

 transactions.push(newTransaction)

 return newTransaction
}