import { axiosPatch } from "@/lib/axios"

type PropsType = {
    expenseId: string
    data: {
        description?: string
        amount?: number
    }
}

const updateExpenseRecord = async ({ expenseId, data }: PropsType): Promise<any> => {
    const res = await axiosPatch({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/expenses/${expenseId}`,
        data
    })

    return res
}

export default updateExpenseRecord
