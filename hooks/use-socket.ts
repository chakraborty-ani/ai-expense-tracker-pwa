import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAppSelector } from "./redux-hooks"

// TYPES
interface SocketEvents {
	sendMessage: (message: string) => void
	expenseAdded: (data: any) => void
	error: (error: string) => void
}

interface UseSocketOptions {
	onExpenseAdded?: (data: any) => void
	onError?: (error: string) => void
}

// SOCKET URL
const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_SOCKET_URL

export const useSocket = (options?: UseSocketOptions) => {
	// SOCKET REF
	const socketRef = useRef<Socket<SocketEvents> | null>(null)

	// REDUX STATES
	const { currentUserToken } = useAppSelector(state => state.user)

	// STATES
	const [isConnected, setIsConnected] = useState(false)

    // CONNECT TO SOCKET
	useEffect(() => {
		if (!currentUserToken) return

		const connectSocket = async () => {
			const socket: Socket<SocketEvents> = io(SOCKET_URL, {
				transports: ["websocket"],
				auth: { token: currentUserToken },
			})

			socketRef.current = socket

			// SOCKET CONNECT
			socket.on("connect", () => {
				setIsConnected(true)
				// console.log("Connected to socket server")
			})

			// SOCKET EXPENSE ADDED
			if (options?.onExpenseAdded) {
				socket.on("expenseAdded", options.onExpenseAdded)
			}

			// SOCKET ERROR
			if (options?.onError) {
				socket.on("error", options.onError)
			}
		}

		connectSocket()

		return () => {
			socketRef.current?.disconnect()
			socketRef.current = null
		}
	}, [])

    // RETURN SOCKET AND CONNECTION STATUS
	return {
		socket: socketRef.current,
		isConnected,
	}
}
