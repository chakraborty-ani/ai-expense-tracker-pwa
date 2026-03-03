"use client"

import { useAppSelector } from "@/hooks/redux-hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

// COMPONENTS
import SectionLoader from "@/components/loaders/section-loader"
import CategoryFilter from "./category-filter"
import { columns } from "./columns"
import { DataTable } from "./data-table"

// APIS
import getAllExpensesByUserId from "@/api/get/get-all-expenses-by-user-id"

// HOOKS
import { useCategories } from "@/hooks/use-categories"

// TYPES
import type { ExpensesData } from "./expenses-types"

type ExpenseApiParams = {
	page: number
	limit: number
	categoryId?: string
	orderBy?: "asc" | "desc"
}

const ExpensesPage = () => {
	// REDUX STATE
	const { currentUserDetails } = useAppSelector(state => state.user)

	// CATEGORIES from shared cache
	const { categories, loadingCategories } = useCategories()

	// STATE
	const [loading, setLoading] = useState<boolean>(true)
	const [expenses, setExpenses] = useState<ExpensesData>([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [itemsPerPage, setItemsPerPage] = useState<number>(10)
	const [totalItems, setTotalItems] = useState<number>(0)
	const [totalPages, setTotalPages] = useState<number>(0)
	const [selectedCategory, setSelectedCategory] = useState<string>("")
	const [debouncedCategory, setDebouncedCategory] = useState<string>("")

	// DEBOUNCE CATEGORY FILTER — prevents a request on every keystroke/click
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedCategory(selectedCategory)
		}, 300)
		return () => clearTimeout(timer)
	}, [selectedCategory])

	// FUNCTION --> GET ALL EXPENSES BY USER ID
	const getAllExpenses = useCallback(
		async ({ page, limit, categoryId, orderBy = "desc" }: ExpenseApiParams) => {
			try {
				setLoading(true)

				const res = await getAllExpensesByUserId({
					userId: currentUserDetails?.id ?? "",
					params: { page, limit, categoryId, orderBy },
				})

				if (res.status === 200) {
					setExpenses(res.data?.data?.expenses || [])
					setTotalItems(res.data?.data?.meta?.totalItems || 0)
					setCurrentPage(res.data?.data?.meta?.currentPage || 1)
					setTotalPages(res.data?.data?.meta?.totalPages || 1)
					setItemsPerPage(res.data?.data?.meta?.limit || 10)
				} else {
					toast.error("Something went wrong!", {
						description: res.data?.message,
					})
				}
			} catch (error) {
				console.error(error)
				toast.error("Something went wrong!", {
					description: "Failed to fetch expenses",
				})
			} finally {
				setLoading(false)
			}
		},
		[currentUserDetails?.id]
	)

	// FETCH EXPENSES WHENEVER PAGE, LIMIT, USER, OR DEBOUNCED CATEGORY CHANGES
	useEffect(() => {
		if (currentUserDetails?.id) {
			getAllExpenses({ page: currentPage, limit: itemsPerPage, categoryId: debouncedCategory })
		}
	}, [currentUserDetails?.id, currentPage, itemsPerPage, debouncedCategory, getAllExpenses])

	// MEMOIZE COLUMNS — prevents ColumnDef array from being recreated on every render
	const tableColumns = useMemo(
		() => columns(() => getAllExpenses({ page: currentPage, limit: itemsPerPage }), categories),
		[getAllExpenses, currentPage, itemsPerPage, categories]
	)

	return (
		<div className="px-6 py-6">
			{/* HEADER */}
			<div className="mb-8">
				<h1 className="text-2xl font-semibold">Expenses</h1>
				<p className="text-sm text-muted-foreground">
					View and manage all your recorded expenses in one place
				</p>
			</div>

			{/* EXPENSES TABLE */}
			{loading || loadingCategories ? (
				<div className="flex items-center justify-center w-full h-[calc(100vh-250px)]">
					<SectionLoader />
				</div>
			) : (
				<>
					<div className="flex items-center justify-end mb-4">
						<CategoryFilter
							categoryList={categories}
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
						/>
					</div>

					<DataTable
						columns={tableColumns}
						data={expenses}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						itemsPerPage={itemsPerPage}
						setItemsPerPage={setItemsPerPage}
						totalItems={totalItems}
						totalPages={totalPages}
					/>
				</>
			)}
		</div>
	)
}

export default ExpensesPage
