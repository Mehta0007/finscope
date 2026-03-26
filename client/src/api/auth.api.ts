


export const getProtectedData = async (getToken: () => Promise<string | null>) => {
  const token = await getToken();
  console.log(token)

  const res = await fetch("http://localhost:5000/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
