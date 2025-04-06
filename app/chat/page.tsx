"use client"

import { IconSend2 } from "@tabler/icons-react"
import { useState } from "react"

// COMPONENTS
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const ChatPage = () => {
	// STATE
	const [input, setInput] = useState<string>("")
	const [messages, setMessages] = useState<any[]>([])

	// SUBMIT INPUT
	const handleSubmit = () => {
		console.log("Input submitted:", input)
		setMessages(prev => [
			...prev,
			{
				id: prev.length + 1,
				message: input,
				sender: "user",
			},
		])
		setInput("")
	}

	return (
		<div className="h-[calc(100dvh-64px)] flex flex-col py-4 px-4 lg:px-6">
			<div className="flex-1 w-full">
				<div className="flex flex-col gap-4 h-full overflow-y-auto">
					{messages.map((message, index) => (
						<div
							key={index}
							className={`p-2 rounded-md ${
								message.sender === "user"
									? "bg-blue-500 text-white self-end"
									: "bg-gray-200 text-black self-start"
							}`}
						>
							{message.message}
						</div>
					))}
				</div>
			</div>
			<div className="h-fit w-full flex items-center justify-between gap-2">
				<Input
					type="text"
					value={input}
					placeholder="e.g., Bought coffee for ₹150 at Starbucks"
					onChange={e => setInput(e.target.value)}
				/>
				<Button onClick={() => handleSubmit()}>
					<IconSend2 />
				</Button>
			</div>
		</div>
	)
}

export default ChatPage
