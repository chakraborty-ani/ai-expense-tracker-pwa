import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAppSelector } from "./redux-hooks"

// TYPES
interface SocketEvents {
	sendMessage: (message: string) => void
	expenseAdded: (data: any) => void
	error: (error: string) => void
	messageError: (data: { message: string }) => void
}

interface UseSocketOptions {
	onExpenseAdded?: (data: any) => void
	onError?: (error: string) => void
	onMessageError?: (data: { message: string }) => void
}

// SOCKET URL
const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_SOCKET_URL

export const useSocket = (options?: UseSocketOptions) => {
	// SOCKET REF
	const socketRef = useRef<Socket<SocketEvents> | null>(null)

	// Keep options in a ref so callbacks are always current without reconnecting
	const optionsRef = useRef(options)
	useEffect(() => {
		optionsRef.current = options
	})

	// REDUX STATES
	const { currentUserToken } = useAppSelector(state => state.user)

	// STATES
	const [isConnected, setIsConnected] = useState(false)
	const [connectionError, setConnectionError] = useState(false)
	const [retryKey, setRetryKey] = useState(0)

	// CONNECT TO SOCKET
	useEffect(() => {
		if (!currentUserToken) return

		setConnectionError(false)

		const socket: Socket<SocketEvents> = io(SOCKET_URL, {
			transports: ["websocket"],
			auth: { token: currentUserToken },
		})

		socketRef.current = socket

		// SOCKET CONNECT
		socket.on("connect", () => {
			setIsConnected(true)
			setConnectionError(false)
		})

		// SOCKET DISCONNECT
		socket.on("disconnect", () => {
			setIsConnected(false)
		})

		// SOCKET CONNECTION ERROR
		socket.on("connect_error", () => {
			setIsConnected(false)
			setConnectionError(true)
		})

		// SOCKET EXPENSE ADDED — delegate to current options ref to avoid stale closure
		socket.on("expenseAdded", data => {
			optionsRef.current?.onExpenseAdded?.(data)
		})

		// SOCKET ERROR — delegate to current options ref
		socket.on("error", error => {
			optionsRef.current?.onError?.(error)
		})

		// SOCKET MESSAGE ERROR — delegate to current options ref
		socket.on("messageError", data => {
			optionsRef.current?.onMessageError?.(data)
		})

		return () => {
			socket.disconnect()
			socketRef.current = null
			setIsConnected(false)
		}
	}, [currentUserToken, retryKey])

	// RETURN SOCKET, CONNECTION STATUS, ERROR STATE, AND RETRY FUNCTION
	return {
		socket: socketRef.current,
		isConnected,
		connectionError,
		retry: () => setRetryKey(k => k + 1),
	}
}
