import { FirebaseError } from "firebase/app"
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	sendPasswordResetEmail,
} from "firebase/auth"
import { auth } from "./firebase-config"

// TYPES
type FirebaseWithEmailPasswordProps = {
	email: string
	password: string
}

// FUNCTION -> GENERATE ERROR MESSAGE
const generateErrorMessage = (error: FirebaseError) => {
	switch (error.code) {
		case "auth/user-not-found":
			return "User not found"
		case "auth/invalid-credential":
			return "Invalid credential"
		case "auth/too-many-requests":
			return "Too many requests"
		default:
			return "An unexpected error occurred"
	}
}

// FUNCTIONS -> AUTHENTICATION WITH EMAIL AND PASSWORD (LOGIN)
export const firebaseLoginWithEmailPassword = async ({ email, password }: FirebaseWithEmailPasswordProps) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password)

		return userCredential
	} catch (error) {
		if (error instanceof FirebaseError) {
			console.log("error code: ", error.code)
			console.log("Login error:", generateErrorMessage(error))
		} else {
			console.log("Unexpected error:", error)
		}
	}
}

// FUNCTIONS -> AUTHENTICATION WITH EMAIL AND PASSWORD (REGISTER)
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
			console.log("Login error:", generateErrorMessage(error))
		} else {
			console.log("Unexpected error:", error)
		}
	}
}

// FUNCTIONS -> AUTHENTICATION WITH GOOGLE
export const firebaseLoginWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider()
		const result = await signInWithPopup(auth, provider)
		const user = result.user
		return user
	} catch (error) {
		if (error instanceof FirebaseError) {
			console.log("error code: ", error.code)
			console.log("Login error:", generateErrorMessage(error))
		} else {
			console.log("Unexpected error:", error)
		}
	}
}

// FUNCTIONS -> FORGOT PASSWORD
export const firebaseForgotPassword = async ({ email }: { email: string }) => {
	try {
		await sendPasswordResetEmail(auth, email)
		console.log("Password reset email sent successfully.")
	} catch (error) {
		if (error instanceof FirebaseError) {
			console.log("error code: ", error.code)
			console.log("Forgot password error:", generateErrorMessage(error))
		} else {
			console.log("Unexpected error:", error)
		}
	}
}
