"use client"

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
} from "@tanstack/react-table"

import { DataTablePagination } from "@/components/data-tables/reusable-components/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	currentPage: number
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>
	itemsPerPage: number
	setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
	totalItems: number
	totalPages: number
}

export function DataTable<TData, TValue>({
	columns,
	data,
	currentPage,
	setCurrentPage,
	setItemsPerPage,
	totalItems,
	itemsPerPage,
	totalPages,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
	})

	return (
		<>
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-muted">
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-12">
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="mt-4">
				<DataTablePagination
					table={table}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					itemsPerPage={itemsPerPage}
					setItemsPerPage={setItemsPerPage}
					totalItems={totalItems}
					totalPages={totalPages}
				/>
			</div>
		</>
	)
}
