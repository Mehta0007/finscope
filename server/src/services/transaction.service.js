

let transactions = []
//CREATE
export const addTransaction = (data) => {
 const newTransaction = {
    id: Date.now().toString(),
    ...data,
 }

 transactions.push(newTransaction)
 return newTransaction

}
 
//READ
export const getTransactionsByUser = (userId) => {
    return transactions.filter(t => t.userId === userId)
}


