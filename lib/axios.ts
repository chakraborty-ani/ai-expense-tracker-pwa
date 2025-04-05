import axios, { AxiosResponse, AxiosError, AxiosRequestHeaders } from "axios"
import { getToken } from "./firebase/firebase-config"

type GetParams = {
	url: string
	token?: string | undefined | null
	params?: Record<string, unknown>
	headers?: AxiosRequestHeaders
}

type OtherParams = {
	url: string
	data?: Record<string, unknown>
	token?: string | undefined | null
	headers?: AxiosRequestHeaders
}

type CustomErrorResponse = {
	status: number
	data: {
		message: string
	}
}

const handleError = (error: unknown, url: string): CustomErrorResponse => {
	console.log("error at url: ", url)
	console.log(error)

	const axiosError = error as AxiosError<{ message?: string }>

	return {
		status: axiosError.response?.status || 400,
		data: {
			message: axiosError.response?.data?.message || "Cannot connect to server",
		},
	}
}

export const axiosGet = async <T>({
	url,
	params,
	headers,
}: GetParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await axios.get<T>(url, {
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
			params,
		})
	} catch (error) {
		return handleError(error, url)
	}
}

export const axiosPost = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await axios.post<T>(url, data, {
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
		})
	} catch (error) {
		return handleError(error, url)
	}
}

export const axiosPut = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await axios.put<T>(url, data, {
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
		})
	} catch (error) {
		return handleError(error, url)
	}
}

export const axiosPatch = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await axios.patch<T>(url, data, {
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
		})
	} catch (error) {
		return handleError(error, url)
	}
}

export const axiosDelete = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await axios.delete<T>(url, {
			data,
			headers: {
				...headers,
				Authorization: token ? token : undefined,
			},
		})
	} catch (error) {
		return handleError(error, url)
	}
}
