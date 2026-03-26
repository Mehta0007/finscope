import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getProtectedData } from "../../api/auth.api";



export const FinancialRecordList = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);

useEffect(() => {
    const fetchData = async () => {
      const result = await getProtectedData(getToken);
      console.log(result);
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Records</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};