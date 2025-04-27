export type ExpenseRecordType = {
    id: string
    amount: number
    description: string
    category: Record<string, string>
    createdAt: string
    updatedAt: string
}

export type ExpensesData = ExpenseRecordType[] | []