"use client"

import dayjs from "@/lib/dayjs-wrapper"
import { ColumnDef } from "@tanstack/react-table"

// COMPONENTS
import ActionButtons from "./action-buttons"

// TYPES
import type { ExpenseRecordType } from "./expenses-types"

export const columns = (refetchExpenses: () => Promise<void>): ColumnDef<ExpenseRecordType>[] => [
	{
		accessorKey: "category.name",
		header: "Category",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "amount",
		cell: ({ row }) => {
			const amount = row.original.amount
			const currency = "₹"
			return `${currency} ${amount}`
		},
		header: "Amount",
	},
	// {
	// 	accessorKey: "createdAt",
	// 	cell: ({ row }) => dayjs(row.original.createdAt).local().format("DD/MM/YYYY"),
	// 	header: "Created At",
	// 	// header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
	// },
	{
		accessorKey: "updatedAt",
		cell: ({ row }) => dayjs(row.original.updatedAt).local().format("DD/MM/YYYY"),
		header: "Updated At",
		// header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const expense = row.original
			return <ActionButtons expense={expense} refetchExpenses={refetchExpenses} />
		},
	},
]
