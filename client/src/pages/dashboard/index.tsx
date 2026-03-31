import { useState } from "react"
import { useUser } from '@clerk/clerk-react'
import { FinancialRecordForm } from './financial-record-form'
import { FinancialRecordList } from './financial-record-list'

export const Dashboard = () => {
  const { user } = useUser()
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Welcome {user?.firstName}! Here Are Your Finances:
      </h1>
      <FinancialRecordForm onTransactionAdded={() => setRefresh(r => r + 1)} />
      <FinancialRecordList refresh={refresh} />
    </div>
  )
}