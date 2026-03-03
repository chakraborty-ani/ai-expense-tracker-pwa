"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import getExpensesCategories from "@/api/get/get-expenses-categories"
import { useAppDispatch, useAppSelector } from "./redux-hooks"
import { setCategories } from "@/store/slices/categories-slice"

export const useCategories = () => {
	const dispatch = useAppDispatch()
	const { categories, isLoaded } = useAppSelector(state => state.categories)
	const { currentUserDetails } = useAppSelector(state => state.user)

	const [loadingCategories, setLoadingCategories] = useState(!isLoaded)

	useEffect(() => {
		// Already fetched — skip
		if (isLoaded) {
			setLoadingCategories(false)
			return
		}

		if (!currentUserDetails?.id) return

		let cancelled = false

		const fetchCategories = async () => {
			try {
				setLoadingCategories(true)
				const res = await getExpensesCategories()

				if (cancelled) return

				if (res.status === 200) {
					dispatch(
						setCategories(
							res.data?.data.map((item: Record<string, string>) => ({
								label: item.name,
								value: item.id,
							})) || []
						)
					)
				} else {
					toast.error("Something went wrong!", {
						description: res.data?.message,
					})
				}
			} catch {
				if (!cancelled) {
					toast.error("Something went wrong!", {
						description: "Failed to fetch categories",
					})
				}
			} finally {
				if (!cancelled) setLoadingCategories(false)
			}
		}

		fetchCategories()

		return () => {
			cancelled = true
		}
	}, [currentUserDetails?.id, isLoaded, dispatch])

	return { categories, loadingCategories }
}
