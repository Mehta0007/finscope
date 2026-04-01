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
  SELECT 
    id,
    user_id,
    amount::float,
    type,
    category,
    description,
    date,
    created_at
  FROM transactions
  WHERE user_id = $1
  ORDER BY created_at DESC;
`;
  const result = await pool.query(query, [userId]);

  return result.rows;
};

//DELETE


export const deleteTransactionById = async (id, userId) => {
  const query = `
    DELETE FROM transactions
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [id, userId]);

  return result.rows[0];
};


// UPDATES

export const updateTransactionById = async (id, userId, data) => {
  const { amount, type, category, description, date } = data

  const query = `
    UPDATE transactions
    SET
      amount = COALESCE($1, amount),
      type = COALESCE($2, type),
      category = COALESCE($3, category),
      description = COALESCE($4, description),
      date = COALESCE($5, date)
    WHERE id = $6 AND user_id = $7
    RETURNING *;
  `;

  const result = await pool.query(query, [amount, type, category, description, date, id, userId])

  return result.rows[0]
}