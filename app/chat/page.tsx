"use client"

import dayjs from "@/lib/dayjs-wrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { isNil, omitBy } from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// ICONS
import { IconEdit, IconMessages, IconSend2, IconWifiOff } from "@tabler/icons-react"

// COMPONENTS
import SectionLoader from "@/components/loaders/section-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EditExpenseModal from "../expenses/edit-expense-modal"

// HOOKS
import { useSocket } from "@/hooks/use-socket"
import { useCategories } from "@/hooks/use-categories"

// APIS
import updateExpenseRecord from "@/api/patch/update-expense-record"

// TYPES
import { Category } from "../expenses/expenses-types"

type UserMessage = {
	id: number
	message: string
	sender: "user"
}

type BotMessage = {
	id: number
	message: {
		id: string
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
	id: string
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

// FORM VALIDATION SCHEMA
const formValidationSchema = z.object({
	description: z.string().min(1, "Description is required"),
	amount: z.string().min(1, "Amount is required"),
	categoryId: z.string().min(1, "Category is required"),
})

const ChatPage = () => {
	// REF FOR SCROLLING TO BOTTOM
	const chatContainerRef = useRef<HTMLDivElement>(null)

	// CATEGORIES from shared cache
	const { categories, loadingCategories } = useCategories()

	// STATE
	const [input, setInput] = useState<string>("")
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isEditLoading, setIsEditLoading] = useState<boolean>(false)
	const [openEditModal, setOpenEditModal] = useState<boolean>(false)
	const [selectedMessage, setSelectedMessage] = useState<ExpenseData>()

	// FORM
	const form = useForm<z.infer<typeof formValidationSchema>>({
		resolver: zodResolver(formValidationSchema),
		defaultValues: {
			description: "",
			amount: "",
			categoryId: "",
		},
	})

	// SOCKET CONNECTION
	const { isConnected, connectionError, retry, socket } = useSocket({
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

	// EDIT EXPENSE
	const handleEditExpense = async (data: z.infer<typeof formValidationSchema>) => {
		setIsEditLoading(true)

		const res = await updateExpenseRecord({
			expenseId: selectedMessage?.id ?? "",
			data: omitBy(
				{
					description: data.description || undefined,
					amount: data.amount ? parseFloat(data.amount) : undefined,
					categoryId: data.categoryId || undefined,
				},
				isNil
			),
		})

		if (res.status === 200) {
			toast.success("Updated successfully", {
				description: "The expense record has been updated.",
			})

			setMessages(prev =>
				prev.map(message => {
					if (message.sender === "bot" && message.message.id === selectedMessage?.id) {
						return {
							...message,
							message: {
								...message.message,
								description: data.description,
								amount: parseFloat(data.amount),
								category: {
									name: categories.find((cat: Category) => cat.value === data.categoryId)?.label || "",
								},
							},
						}
					}
					return message
				})
			)

			setOpenEditModal(false)
			form.reset()
		} else {
			toast.error("Something went wrong", {
				description: "Unable to update the expense record. Please try again.",
			})
		}

		setIsEditLoading(false)
	}

	// EFFECT TO SCROLL TO BOTTOM AFTER MESSAGE UPDATE
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
		}
	}, [messages])

	// EFFECT TO SET FORM VALUES WHEN EDIT MODAL OPENS
	useEffect(() => {
		if (openEditModal) {
			form.setValue("description", selectedMessage?.description || "")
			form.setValue("amount", selectedMessage?.amount.toString() || "")
			form.setValue(
				"categoryId",
				categories.find((cat: Category) => cat.label === selectedMessage?.category.name)?.value || ""
			)
		}
	}, [openEditModal, form, selectedMessage?.description, selectedMessage?.amount, selectedMessage?.category.name, categories])

	// FUNCTION TO HANDLE EDIT ICON CLICK
	const handleOnEditIconClick = ({ message }: { message: ExpenseData }) => {
		setOpenEditModal(true)
		setSelectedMessage(message)
	}

	return (
		<div className="h-[calc(100dvh-64px)] flex flex-col">
			{isConnected ? (
				<>
					{/* CHAT AREA */}
					<div
						ref={chatContainerRef}
						className="flex-1 w-full overflow-y-auto flex flex-col gap-4 py-4 px-4 lg:px-6"
					>
						{messages.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full gap-4">
								<IconMessages size={"20%"} className="text-neutral-400 dark:text-neutral-800" />
								<p className="text-neutral-500 dark:text-neutral-700 font-semibold">
									No expenses logged yet. Start by entering your first expense!
								</p>
							</div>
						) : (
							messages.map(message =>
								message.sender === "user" ? (
									<div
										key={message.id}
										className="p-2 rounded-md bg-blue-500 text-white self-end max-w-[70%]"
									>
										{message.message}
									</div>
								) : (
									<div
										key={message.id}
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
										<div className="flex items-center justify-between mt-2">
											<div className="text-xs text-muted-foreground">
												{dayjs(message?.message?.createdAt)
													.local()
													.format("MMMM DD, YYYY")}{" "}
												•{" "}
												{dayjs(message?.message?.createdAt).local().format("hh:mm A")}
											</div>
											<IconEdit
												size={20}
												className="text-muted-foreground cursor-pointer"
												onClick={() =>
													handleOnEditIconClick({ message: message?.message })
												}
											/>
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

					{/* EDIT MODAL */}
					<EditExpenseModal
						loadingCategories={loadingCategories}
						isEditLoading={isEditLoading}
						openEditModal={openEditModal}
						handleEditExpense={handleEditExpense}
						setOpenEditModal={setOpenEditModal}
						form={form}
						categories={categories}
					/>
				</>
			) : connectionError ? (
				<div className="flex flex-col items-center justify-center h-full gap-4">
					<IconWifiOff size={48} className="text-muted-foreground" />
					<p className="text-sm font-medium">Unable to connect to the chat server</p>
					<p className="text-xs text-muted-foreground">Check your connection and try again</p>
					<Button variant="outline" onClick={retry}>
						Retry
					</Button>
				</div>
			) : (
				<SectionLoader />
			)}
		</div>
	)
}

export default ChatPage
