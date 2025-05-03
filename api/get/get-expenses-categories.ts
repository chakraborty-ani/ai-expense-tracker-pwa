import { axiosGet } from "@/lib/axios"

const getExpensesCategories = async (): Promise<any> => {
	const res = await axiosGet({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories`,
	})

	return res
}

export default getExpensesCategories
