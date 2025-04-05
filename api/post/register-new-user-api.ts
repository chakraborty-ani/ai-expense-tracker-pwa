import { axiosPost } from "@/lib/axios"

type DataTypes = {
	email: string
	firstname: string
	lastname: string
    firebaseId: string
}

const registerNewUserApi = async ({ ...data }: DataTypes): Promise<any> => {
    const res = await axiosPost({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
        data
    })

    return res
}

export default registerNewUserApi
