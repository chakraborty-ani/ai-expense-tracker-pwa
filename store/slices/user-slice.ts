import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export interface UserDetails {
	id: string
	firstname?: string
	lastname?: string
	email?: string
	[key: string]: unknown
}

export interface UserType {
	currentUserDetails: UserDetails | null
	currentUserToken: string | null
	userDataloading: boolean
}

const initialState: UserType = {
	currentUserDetails: null,
	currentUserToken: null,
	userDataloading: true,
}

export const userSlice = createSlice({
	name: "currentUserDetails",
	initialState,
	reducers: {
		updateUser: (state, action: PayloadAction<UserDetails | null>) => {
			state.currentUserDetails = action.payload
		},
		updateCurrentUserToken: (state, action: PayloadAction<string | null>) => {
			state.currentUserToken = action.payload
		},
		updateLoading: (state, action: PayloadAction<boolean>) => {
			state.userDataloading = action.payload
		},
	},
})

// Action creators are generated for each case reducer function
export const { updateUser, updateCurrentUserToken, updateLoading } = userSlice.actions

export default userSlice.reducer
