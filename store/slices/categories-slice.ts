import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { Category } from "@/app/expenses/expenses-types"

interface CategoriesState {
	categories: Category[]
	isLoaded: boolean
}

const initialState: CategoriesState = {
	categories: [],
	isLoaded: false,
}

export const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<Category[]>) => {
			state.categories = action.payload
			state.isLoaded = true
		},
		clearCategories: (state) => {
			state.categories = []
			state.isLoaded = false
		},
	},
})

export const { setCategories, clearCategories } = categoriesSlice.actions
export default categoriesSlice.reducer
