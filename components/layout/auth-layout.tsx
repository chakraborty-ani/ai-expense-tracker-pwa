"use client"

import { usePathname, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"

// FIREBASE
import { auth } from "@/lib/firebase/firebase-config"

// COMPONENTS
import PageLoader from "../loaders/page-loader"

// REDUX
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks"
import { updateCurrentUserToken, updateLoading, updateUser } from "@/store/slices/user-slice"
import { RootState } from "@/store/store"

// APIS
import getUserProfile from "@/api/get/get-user-profile"

// CONSTANTS
import { NON_AUTHENTICATED_ROUTES } from "@/lib/constants"

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch()
	const pathname = usePathname()
	const router = useRouter()

	// Local state to track if authentication check is complete
	const [isAuthChecked, setIsAuthChecked] = useState(false)

	// REDUX STATES
	const { currentUserToken, userDataloading } = useAppSelector(
		(state: RootState) => state.user
	)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async user => {
			if (user) {
				const token = await user.getIdToken()
				dispatch(updateCurrentUserToken(token))
			} else {
				dispatch(updateCurrentUserToken(null))
				if (!NON_AUTHENTICATED_ROUTES.includes(pathname)) {
					router.replace("/login")
				}
			}
			setIsAuthChecked(true) // Authentication check is complete
		})

		return () => unsubscribe()
	}, [dispatch, pathname, router])

	useEffect(() => {
		if (!isAuthChecked) return

		let cancelled = false

		;(async () => {
			if (currentUserToken) {
				const response = await getUserProfile()
				if (cancelled) return
				if (response.status === 200) {
					dispatch(updateUser(response.data.data))
				} else {
					dispatch(updateUser(null))
					if (!NON_AUTHENTICATED_ROUTES.includes(pathname)) {
						router.replace("/login")
					}
				}
			} else {
				dispatch(updateUser(null))
				if (!NON_AUTHENTICATED_ROUTES.includes(pathname)) {
					router.replace("/login")
				}
			}
			if (!cancelled) dispatch(updateLoading(false))
		})()

		return () => {
			cancelled = true
		}
	}, [currentUserToken, isAuthChecked, dispatch, pathname, router])

	if (
		!isAuthChecked ||
		userDataloading ||
		(currentUserToken === null && !NON_AUTHENTICATED_ROUTES.includes(pathname))
	) {
		return <PageLoader />
	}

	return <>{children}</>
}
