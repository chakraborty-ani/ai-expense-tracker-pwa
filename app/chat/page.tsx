"use client"

import dayjs from "@/lib/dayjs-wrapper"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

// ICONS
import { IconSend2, IconMessages } from "@tabler/icons-react"

// COMPONENTS
import SectionLoader from "@/components/loaders/section-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// HOOKS
import { useSocket } from "@/hooks/use-socket"

// TYPES
type UserMessage = {
	id: number
	message: string
	sender: "user"
}

type BotMessage = {
	id: number
	message: {
		category: {
			name: string
		}
		description: string
		amount: number
		createdAt: string
	}
	sender: "bot"
}

type ChatMessage = UserMessage | BotMessage

type ExpenseData = {
	category: {
		name: string
	}
	description: string
	amount: number
	createdAt: string
}

type SocketError = {
	message: string
}

const ChatPage = () => {
	// REF FOR SCROLLING TO BOTTOM
	const chatContainerRef = useRef<HTMLDivElement>(null)

	// STATE
	const [input, setInput] = useState<string>("")
	const [messages, setMessages] = useState<ChatMessage[]>([])

	// SOCKET CONNECTION
	const { isConnected, socket } = useSocket({
		// ON EXPENSE ADDED
		onExpenseAdded: (data: ExpenseData) => {
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
		onError: (error: SocketError | string) => {
			toast.error("Something went wrong!", {
				description: typeof error === "string" ? error : error?.message,
			})
		},
	})

	// SUBMIT INPUT
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

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

	// EFFECT TO SCROLL TO BOTTOM AFTER MESSAGE UPDATE
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
		}
	}, [messages])

	return (
		<div className="h-[calc(100dvh-64px)] flex flex-col">
			{isConnected ? (
				<>
					{/* HEADER */}
					{/* <div className="px-4 py-4">
						<h1 className="text-2xl font-bold">Chat</h1>
						<p className="text-sm text-muted-foreground">
							Effortless expense tracking through seamless conversation
						</p>
					</div> */}

					{/* CHAT AREA */}
					<div
						ref={chatContainerRef}
						className="flex-1 w-full overflow-y-auto flex flex-col gap-4 py-4 px-4 lg:px-6"
					>
						{messages.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full gap-4">
								<IconMessages size={"20%"} color="var(--muted)" />
								<p className="text-muted font-semibold">No expenses logged yet. Start by entering your first expense!</p>
							</div>
						) : (
							messages.map((message, index) =>
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
										<div className="text-sm text-muted-foreground mt-1">
											{message?.message?.description}
										</div>
										<div className="text-xl font-semibold mt-2">
											₹{message?.message?.amount}
										</div>
										<div className="text-xs text-muted-foreground mt-1">
											{dayjs(message?.message?.createdAt)
												.local()
												.format("MMMM DD, YYYY")}{" "}
											• {dayjs(message?.message?.createdAt).local().format("hh:mm A")}
										</div>
									</div>
								)
							)
						)}
					</div>

					{/* INPUT AREA */}
					<form
						className="mt-4 pt-2 flex items-center gap-2 py-4 px-4"
						onSubmit={e => handleSubmit(e)}
					>
						<Input
							type="text"
							value={input}
							placeholder="e.g., Bought coffee for ₹150 at Starbucks"
							onChange={e => setInput(e.target.value)}
						/>
						<Button type="submit" className="cursor-pointer">
							<IconSend2 />
						</Button>
					</form>
				</>
			) : (
				<SectionLoader />
			)}
		</div>
	)
}

export default ChatPage
