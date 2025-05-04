// COMPONENTS
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// TYPES
type EditExpenseModalProps = {
	openEditModal: boolean
	setOpenEditModal: (open: boolean) => void
	isEditLoading: boolean
	handleEditExpense: (data: { description: string; amount: string }) => Promise<void>
	form: any
}

const EditExpenseModal = ({
	isEditLoading,
	openEditModal,
	handleEditExpense,
	setOpenEditModal,
	form,
}: EditExpenseModalProps) => {
	return (
		<AlertDialog open={openEditModal || isEditLoading} onOpenChange={setOpenEditModal}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Edit Expense</AlertDialogTitle>
					<AlertDialogDescription>Update the expense details below.</AlertDialogDescription>
				</AlertDialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleEditExpense)} className="space-y-8">
						{/* DESCRIPTION */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="mb-4">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* AMOUNT */}
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem className="mb-4">
									<FormLabel>Amount (₹)</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* FOOTER */}
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isEditLoading}>Cancel</AlertDialogCancel>
							<Button type="submit" disabled={isEditLoading}>
								{isEditLoading ? "Saving..." : "Save Changes"}
							</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default EditExpenseModal
