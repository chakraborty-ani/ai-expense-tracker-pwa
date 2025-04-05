import { axiosGet } from "@/lib/axios"

const getUserProfile = async (): Promise<any> => {
	const res = await axiosGet({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/me`,
	})

	return res
}

export default getUserProfile
