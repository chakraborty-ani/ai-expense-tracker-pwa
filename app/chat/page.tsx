"use client"

import { IconSend2 } from "@tabler/icons-react"
import { useState } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

// COMPONENTS
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// HOOKS
import { useSocket } from "@/hooks/use-socket"

const ChatPage = () => {
	// STATE
	const [input, setInput] = useState<string>("")
	const [messages, setMessages] = useState<any[]>([])

	// SOCKET CONNECTION
	const { isConnected, socket } = useSocket({
		// ON EXPENSE ADDED
		onExpenseAdded: (data: any) => {
			setMessages(prev => [
				...prev,
				{
					id: prev.length + 1,
					message: data,
					sender: "bot",
				},
			])
		},
		// ON ERROR
		onError: (error: any) => {
			toast.error("Something went wrong!", {
				description: typeof error === "string" ? error : error?.message,
			})
		},
	})

	// SUBMIT INPUT
	const handleSubmit = () => {
		// VALIDATE INPUT
		if (!input) return

		// VALIDATE SOCKET CONNECTION
		if (!isConnected) {
			toast.error("ERROR!", {
				description: "Socket not connected",
			})
			return
		}

		// VALIDATE SOCKET INSTANCE
		if (!socket) {
			toast.error("ERROR!", {
				description: "Socket instance not found",
			})
			return
		}

		// SEND MESSAGE TO SOCKET
		socket.emit("sendMessage", input)

		// ADD MESSAGE TO CHAT
		setMessages(prev => [
			...prev,
			{
				id: prev.length + 1,
				message: input,
				sender: "user",
			},
		])

		// CLEAR INPUT
		setInput("")
	}

	return (
		<div className="h-[calc(100dvh-64px)] flex flex-col">
			{/* CHAT AREA */}
			<div className="flex-1 w-full overflow-y-auto flex flex-col gap-4 py-4 px-4 lg:px-6">
				{messages.map((message, index) =>
					message.sender === "user" ? (
						<div
							key={index}
							className="p-2 rounded-md bg-blue-500 text-white self-end max-w-[70%]"
						>
							{message.message}
						</div>
					) : (
						<div
							key={index}
							className="p-3 rounded-md bg-muted text-primary self-start min-w-[250px] max-w-[75%] shadow-sm"
						>
							<div className="text-sm font-medium">
								{message?.message?.category?.name}
							</div>
							<div className="text-sm text-muted-foreground mt-1">{message?.message?.description}</div>
							<div className="text-xl font-semibold mt-2">₹{message?.message?.amount}</div>
							<div className="text-xs text-muted-foreground mt-1">
								{dayjs(message?.message?.createdAt).local().format("MMMM DD, YYYY")} •{" "}
								{dayjs(message?.message?.createdAt).local().format("hh:mm A")}
							</div>
						</div>
					)
				)}
			</div>

			{/* INPUT */}
			<div className="mt-4 pt-2 flex items-center gap-2 py-4 px-4">
				<Input
					type="text"
					value={input}
					placeholder="e.g., Bought coffee for ₹150 at Starbucks"
					onChange={e => setInput(e.target.value)}
				/>
				<Button onClick={handleSubmit} className="cursor-pointer">
					<IconSend2 />
				</Button>
			</div>
		</div>
	)
}

export default ChatPage
