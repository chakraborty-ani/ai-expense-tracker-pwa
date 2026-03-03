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

// Retry only on network errors or 5xx — never on 4xx (client errors are not retryable)
const isRetryable = (error: AxiosError): boolean => {
	if (!error.response) return true // network error / timeout
	return error.response.status >= 500
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const withRetry = async <T>(
	fn: () => Promise<T>,
	retries = 2,
	delayMs = 500
): Promise<T> => {
	let lastError: unknown
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fn()
		} catch (error) {
			lastError = error
			const axiosError = error as AxiosError
			if (attempt < retries && isRetryable(axiosError)) {
				await sleep(delayMs * (attempt + 1))
				continue
			}
			break
		}
	}
	throw lastError
}

const handleError = (error: unknown): CustomErrorResponse => {
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
		return await withRetry(() =>
			axios.get<T>(url, {
				headers: {
					...headers,
					Authorization: token ? token : undefined,
				},
				params,
			})
		)
	} catch (error) {
		return handleError(error)
	}
}

export const axiosPost = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await withRetry(() =>
			axios.post<T>(url, data, {
				headers: {
					...headers,
					Authorization: token ? token : undefined,
				},
			})
		)
	} catch (error) {
		return handleError(error)
	}
}

export const axiosPut = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await withRetry(() =>
			axios.put<T>(url, data, {
				headers: {
					...headers,
					Authorization: token ? token : undefined,
				},
			})
		)
	} catch (error) {
		return handleError(error)
	}
}

export const axiosPatch = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await withRetry(() =>
			axios.patch<T>(url, data, {
				headers: {
					...headers,
					Authorization: token ? token : undefined,
				},
			})
		)
	} catch (error) {
		return handleError(error)
	}
}

export const axiosDelete = async <T>({
	url,
	data,
	headers,
}: OtherParams): Promise<AxiosResponse<T> | CustomErrorResponse> => {
	const token = await getToken()
	try {
		return await withRetry(() =>
			axios.delete<T>(url, {
				data,
				headers: {
					...headers,
					Authorization: token ? token : undefined,
				},
			})
		)
	} catch (error) {
		return handleError(error)
	}
}
