"use client"

import { usePathname, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { SpinnerCircularFixed } from "spinners-react"

// FIREBASE
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

// REDUX
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks"
import { updateCurrentUserToken } from "@/store/slices/user-slice"
import { RootState } from "@/store/store"

// CONSTANTS
const NON_AUTHENTICATED_ROUTES = ["/login", "/register"]

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch()
	const pathname = usePathname()
	const router = useRouter()
	const [isCheckingAuth, setIsCheckingAuth] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	// REDUX STATES
	const { currentUserToken } = useAppSelector((state: RootState) => state.user)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async user => {
			if (user) {
				const token = await user.getIdToken()
				dispatch(updateCurrentUserToken(token))
				setIsAuthenticated(true)
			} else {
				dispatch(updateCurrentUserToken(null))
				setIsAuthenticated(false)
			}
			setIsCheckingAuth(false)
		})

		return () => unsubscribe()
	}, [dispatch])

	// Redirect to /login if user is not authenticated and not on a public route
	useEffect(() => {
		if (!isCheckingAuth && !isAuthenticated && !NON_AUTHENTICATED_ROUTES.includes(pathname)) {
			router.replace("/login")
		}
	}, [isCheckingAuth, isAuthenticated, pathname, router])

	// **Prevent rendering children while checking auth**
	if (isCheckingAuth || (!isAuthenticated && !NON_AUTHENTICATED_ROUTES.includes(pathname))) {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-background">
				<SpinnerCircularFixed
					size={50}
					thickness={180}
					speed={100}
					color="var(--foreground)"
					secondaryColor="var(--card)"
				/>
			</div>
		)
	}

	// Only render children if the authentication is verified
	return <div>{children}</div>
}
