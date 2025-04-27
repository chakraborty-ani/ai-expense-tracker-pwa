"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "@/lib/dayjs-wrapper"

// TYPES
import type { ExpenseRecordType } from "./expenses-types"
import { DataTableColumnHeader } from "@/components/data-tables/reusable-components/column-header"

export const columns: ColumnDef<ExpenseRecordType>[] = [
	{
		accessorKey: "amount",
		cell: ({ row }) => {
			const amount = row.original.amount
			const currency = "₹"
			return `${currency} ${amount}`
		},
		header: "Amount",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "category.name",
		header: "Category",
	},
	{
		accessorKey: "createdAt",
		cell: ({ row }) => dayjs(row.original.createdAt).local().format("DD/MM/YYYY"),
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
	},
	{
		accessorKey: "updatedAt",
		cell: ({ row }) => dayjs(row.original.updatedAt).local().format("DD/MM/YYYY"),
		header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
	},
]
