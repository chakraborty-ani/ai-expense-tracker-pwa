"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { isNil, omitBy } from "lodash"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// COMPONENTS
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// APIS
import deleteExpenseRecord from "@/api/delete/delete-expense-record"
import updateExpenseRecord from "@/api/patch/update-expense-record"

// TYPES
import EditExpenseModal from "./edit-expense-modal"
import type { ExpenseRecordType } from "./expenses-types"
type ActionButtonsProps = {
	expense: ExpenseRecordType
	refetchExpenses: () => Promise<void>
}

// FORM VALIDATION SCHEMA
const formValidationSchema = z.object({
	description: z.string().min(1, "Description is required"),
	amount: z.string().min(1, "Amount is required"),
})

const ActionButtons = ({ expense, refetchExpenses }: ActionButtonsProps) => {
	const [openDropdown, setOpenDropdown] = useState<boolean>(false)
	const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false)
	const [openEditModal, setOpenEditModal] = useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
	const [isEditLoading, setIsEditLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formValidationSchema>>({
		resolver: zodResolver(formValidationSchema),
		defaultValues: {
			description: expense.description,
			amount: expense.amount.toString(),
		},
	})

	// DELETE EXPENSE
	const handleDeleteExpense = async () => {
		setIsDeleteLoading(true)

		const res = await deleteExpenseRecord({ expenseId: expense.id })

		if (res.status === 200) {
			toast.success("Deleted successfully", {
				description: "The expense record has been deleted.",
			})
			refetchExpenses()
			setOpenDeleteAlert(false)
		} else {
			toast.error("Something went wrong", {
				description: "Unable to delete the expense record. Please try again.",
			})
		}

		setIsDeleteLoading(false)
	}

	// EDIT EXPENSE
	const handleEditExpense = async (data: z.infer<typeof formValidationSchema>) => {
		setIsEditLoading(true)

		const res = await updateExpenseRecord({
			expenseId: expense.id,
			data: omitBy(
				{
					description: form.formState.dirtyFields.description ? data.description : undefined,
					amount: form.formState.dirtyFields.amount ? parseFloat(data.amount) : undefined,
				},
				isNil
			),
		})

		if (res.status === 200) {
			toast.success("Updated successfully", {
				description: "The expense record has been updated.",
			})
			refetchExpenses()
			setOpenEditModal(false)
			form.reset()
		} else {
			toast.error("Something went wrong", {
				description: "Unable to update the expense record. Please try again.",
			})
		}

		setIsEditLoading(false)
	}

	return (
		<>
			{/* DROPDOWN MENU */}
			<DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => {
							form.reset({
								description: expense.description,
								amount: expense.amount.toString(),
							})
							setOpenDropdown(false)
							setOpenEditModal(true)
						}}
					>
						Edit
					</DropdownMenuItem>

					<DropdownMenuItem
						className="text-red-800 focus:text-red-800 cursor-pointer"
						onClick={() => {
							setOpenDropdown(false)
							setOpenDeleteAlert(true)
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* DELETE CONFIRMATION */}
			<AlertDialog open={openDeleteAlert || isDeleteLoading} onOpenChange={setOpenDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this expense record.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleteLoading}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteExpense} disabled={isDeleteLoading}>
							{isDeleteLoading ? "Deleting..." : "Confirm Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* EDIT MODAL */}
			<EditExpenseModal 
				form={form}
				isEditLoading={isEditLoading}
				openEditModal={openEditModal}
				handleEditExpense={handleEditExpense}
				setOpenEditModal={setOpenEditModal}
			/>
		</>
	)
}

export default ActionButtons
