
const API_URL = "http://localhost:5000/transactions"

export const getTransactions = async (getToken: () => Promise<string | null>) => {
  const token = await getToken()

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.json()
}

export const createTransaction = async (getToken: () => Promise<string | null>, data: any) => {
  const token = await getToken()

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return res.json()
}

export const deleteTransaction = async (getToken: () => Promise<string | null>, id: string) => {
  const token = await getToken()

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.json()
}

export const updateTransaction = async (getToken: () => Promise<string | null>, id: string, data: any) => {
  const token = await getToken()

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return res.json()
}



