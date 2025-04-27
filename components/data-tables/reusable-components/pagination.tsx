import { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
	table: Table<TData>
	currentPage: number
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>
	itemsPerPage: number
	setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
	totalItems: number
	totalPages: number
}

export function DataTablePagination<TData>({
	table,
	currentPage,
	setCurrentPage,
	setItemsPerPage,
	totalItems,
	itemsPerPage,
	totalPages,
}: DataTablePaginationProps<TData>) {
	// HANDLERS
	const handlePrevPage = ({ toFirst = false }: { toFirst?: boolean }) => {
		setCurrentPage(toFirst ? 1 : prev => Math.max(prev - 1, 1))
	}

	const handleNextPage = ({ toLast = false }: { toLast?: boolean }) => {
		const maxPage = Math.ceil(totalItems / itemsPerPage)
		setCurrentPage(toLast ? totalPages : prev => Math.min(prev + 1, maxPage))
	}

	const handlePageSizeChange = (value: string) => {
		setItemsPerPage(Number(value))
		setCurrentPage(1)
	}

	return (
		<div className="flex items-center justify-between px-2">
			<div className="flex-1 text-sm text-muted-foreground">
				{/* {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{" "}
				row(s) selected. */}
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={itemsPerPage.toString()}
						onValueChange={handlePageSizeChange}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map(pageSize => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {currentPage} of {totalPages}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
						onClick={() => handlePrevPage({ toFirst: true })}
						disabled={currentPage === 1}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0 cursor-pointer"
						onClick={() => handlePrevPage({ toFirst: false })}
						disabled={currentPage === 1}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0 cursor-pointer"
						onClick={() => handleNextPage({ toLast: false })}
						disabled={currentPage === totalPages}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
						onClick={() => handleNextPage({ toLast: true })}
						disabled={currentPage === totalPages}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	)
}
