import { UseFormReturn } from "react-hook-form"

// COMPONENTS
import ModalLoader from "@/components/loaders/modal-loader"
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// TYPES
import { Category } from "./expenses-types"

export type EditExpenseFormValues = {
	description: string
	amount: string
	categoryId: string
}

type EditExpenseModalProps = {
	loadingCategories?: boolean
	openEditModal: boolean
	setOpenEditModal: (open: boolean) => void
	isEditLoading: boolean
	handleEditExpense: (data: EditExpenseFormValues) => Promise<void>
	form: UseFormReturn<EditExpenseFormValues>
	categories: Category[]
}

const EditExpenseModal = ({
	loadingCategories,
	isEditLoading,
	openEditModal,
	handleEditExpense,
	setOpenEditModal,
	form,
	categories,
}: EditExpenseModalProps) => {
	return (
		<AlertDialog open={openEditModal || isEditLoading} onOpenChange={setOpenEditModal}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Edit Expense</AlertDialogTitle>
					<AlertDialogDescription>Update the expense details below.</AlertDialogDescription>
				</AlertDialogHeader>

				{loadingCategories ? (
					<div className="w-full h-[200px] flex justify-center items-center">
						<ModalLoader />
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleEditExpense)} className="space-y-8">
							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem className="mb-4 w-full">
										<FormLabel>Category</FormLabel>
										<FormControl>
											<Select onValueChange={field.onChange} value={field.value || ""}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a category" />
												</SelectTrigger>
												<SelectContent className="max-h-40 overflow-y-auto">
													{categories.map(category => (
														<SelectItem
															key={category.value}
															value={category.value}
														>
															{category.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
				)}
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default EditExpenseModal
