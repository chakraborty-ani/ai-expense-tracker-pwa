import { axiosGet } from "@/lib/axios"

type PropsType = {
	userId: string
	params?: Record<string, string | number>
}

const getAllExpensesByUserId = async ({ userId, params }: PropsType): Promise<any> => {
	const res = await axiosGet({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/expenses/user/${userId}`,
		params,
	})

	return res
}

export default getAllExpensesByUserId
