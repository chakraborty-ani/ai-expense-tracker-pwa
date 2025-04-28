import { axiosDelete } from "@/lib/axios"

type PropsType = {
    expenseId: string
}

const deleteExpenseRecord = async ({ expenseId }: PropsType): Promise<any> => {
    const res = await axiosDelete({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/expenses/${expenseId}`,
    })

    return res
}

export default deleteExpenseRecord
