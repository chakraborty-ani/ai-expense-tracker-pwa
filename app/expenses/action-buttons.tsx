import { useState } from "react"
import { toast } from "sonner"

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

// TYPES
type ActionButtonsProps = {
	expenseId: string
	refetchExpenses: () => Promise<void>
}

const ActionButtons = ({ expenseId, refetchExpenses }: ActionButtonsProps) => {
	// STATE
	const [openDropdown, setOpenDropdown] = useState<boolean>(false)
	const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false)
	const [openEditModal, setOpenEditModal] = useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
	// const [isEditLoading, setIsEditLoading] = useState<boolean>(false)

	// FUNCTION --> DELETE EXPENSE RECORD
	const handleDeleteExpense = async () => {
		setIsDeleteLoading(true)

		const res = await deleteExpenseRecord({ expenseId })

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

	// FUNCTION --> EDIT EXPENSE RECORD
	const handleEditExpense = () => {
		console.log("Edit expense record -> ", expenseId)
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
							Confirm Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* EDIT MODAL */}
			<AlertDialog open={openEditModal} onOpenChange={setOpenEditModal}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Edit Expense</AlertDialogTitle>
						<AlertDialogDescription>Update the expense details below.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleEditExpense}>Save Changes</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default ActionButtons
