import {pool} from "../config/db.js"


//CREATE
export const addTransaction = async(userId, data) => {
    const { amount, type, category, description, date } = data 
 const result = await pool.query(
    `INSERT INTO transactions (user_id, amount, type, category, description, date )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [userId, amount, type, category, description, date]
 )

 return result.rows[0]

}
 
//READ
export const getTransactionsByUser = async (userId) => {
  const query = `
    SELECT * FROM transactions
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};


