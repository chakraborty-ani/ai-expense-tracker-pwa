import axios, { AxiosResponse } from "axios"
import { getToken } from "./firebase/firebase-config"

type GetParams = {
	url: string
	token?: string | undefined | null
	params?: any
	headers?: any
}

type OtherParams = {
	url: string
	data?: any
	token?: string | undefined | null
	headers?: any
}

export const axiosGet = async <T>({
	url,
	params,
	headers,
}: GetParams): Promise<AxiosResponse<T> | { data: { message: string }; status: number }> => {
	const token = await getToken()
	try {
		return await axios.get<T>(url, {
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
			params,
		})
	} catch (error: any) {
		console.log("error at url: ", url)
		console.log(error)

		return {
			status: error.response?.status || 400,
			data: {
				message: error.response?.data?.message || "Cannot connect to server",
			},
		}
	}
}

export const axiosPost = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | { data: { message: string }; status: number }> => {
	const token = await getToken()

	try {
		return await axios.post<T>(url, data, {
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
		})
	} catch (error: any) {
		console.log("error at url: ", url)
		console.log(error)
		return {
			status: error.response?.status || 400,
			data: {
				message: error.response?.data?.message || "Cannot connect to server",
			},
		}
	}
}

export const axiosPut = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | { data: { message: string }; status: number }> => {
	const token = await getToken()
	try {
		return await axios.put<T>(url, data, {
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
		})
	} catch (error: any) {
		console.log("error at url: ", url)
		console.log(error)
		return {
			status: error.response?.status || 400,
			data: {
				message: error.response?.data?.message || "Cannot connect to server",
			},
		}
	}
}

export const axiosPatch = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | { data: { message: string }; status: number }> => {
	const token = await getToken()
	try {
		return await axios.patch<T>(url, data, {
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
		})
	} catch (error: any) {
		console.log("error at url: ", url)
		console.log(error)
		return {
			status: error.response?.status || 400,
			data: {
				message: error.response?.data?.message || "Cannot connect to server",
			},
		}
	}
}

export const axiosDelete = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | { data: { message: string }; status: number }> => {
	const token = await getToken()
	try {
		return await axios.delete<T>(url, {
			data,
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
		})
	} catch (error: any) {
		console.log("error at url: ", url)
		console.log(error)
		return {
			status: error.response?.status || 400,
			data: {
				message: error.response?.data?.message || "Cannot connect to server",
			},
		}
	}
}
