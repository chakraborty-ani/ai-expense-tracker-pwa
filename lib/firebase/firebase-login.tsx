import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase-config"

type FirebaseWithEmailPasswordProps = {
	email: string
	password: string
}

export const firebaseLoginWithEmailPassword = async ({ email, password }: FirebaseWithEmailPasswordProps) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password)
		
		return userCredential
	} catch (error) {
		if (error instanceof FirebaseError) {
			console.log("error code: ", error.code)
			// Handle specific Firebase errors
			switch (error.code) {
				case "auth/user-not-found":
					console.log("Login error: User not found")
					break
				case "auth/invalid-credential":
					console.log("Login error: Invalid credential")
					break
				case "auth/too-many-requests":
					console.log("Login error: Too many requests")
					break
				default:
					console.log("Login error: An unexpected error occurred", error.message)
			}
		} else {
			// Handle non-Firebase errors
			console.log("Unexpected error:", error)
		}
	}
}

export const firebaseRegisterWithEmailPassword = async ({
	email,
	password,
}: FirebaseWithEmailPasswordProps) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password)
		
		return userCredential
	} catch (error) {
		if (error instanceof FirebaseError) {
			console.log("error code: ", error.code)
			// Handle specific Firebase errors
			switch (error.code) {
				case "auth/user-not-found":
					console.log("Login error: User not found")
					break
				case "auth/invalid-credential":
					console.log("Login error: Invalid credential")
					break
				case "auth/too-many-requests":
					console.log("Login error: Too many requests")
					break
				default:
					console.log("Login error: An unexpected error occurred", error.message)
			}
		} else {
			// Handle non-Firebase errors
			console.log("Unexpected error:", error)
		}
	}
}
