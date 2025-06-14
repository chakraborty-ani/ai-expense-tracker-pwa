import { FirebaseError } from "firebase/app"
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	sendPasswordResetEmail,
} from "firebase/auth"
import { auth } from "./firebase-config"

// COMPONENTS
import { toast } from "sonner"

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
			toast.error(generateErrorMessage(error), {
				description: "Please check your email and password.",
			})
		} else {
			console.log("Unexpected error:", error)
			toast.error("Something went wrong", {
				description: "An unexpected error occurred while logging in.",
			})
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
			toast.error(generateErrorMessage(error), {
				description: "Please try again or use a different login method.",
			})
		} else {
			console.log("Unexpected error:", error)
			toast.error("Something went wrong", {
				description: "An unexpected error occurred while registering.",
			})
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
			toast.error(generateErrorMessage(error), {
				description: "Please try again or use a different login method.",
			})
		} else {
			console.log("Unexpected error:", error)
			toast.error("Something went wrong", {
				description: "An unexpected error occurred while logging in with Google.",
			})
		}
	}
}

// FUNCTIONS -> FORGOT PASSWORD
export const firebaseForgotPassword = async ({ email }: { email: string }) => {
	try {
		await sendPasswordResetEmail(auth, email)
		toast.success("Password reset link sent to your email.")
	} catch (error) {
		if (error instanceof FirebaseError) {
			console.log("error code: ", error.code)
			console.log("Forgot password error:", generateErrorMessage(error))
			toast.error(generateErrorMessage(error), {
				description: "Please check your email and try again.",
			})
		} else {
			console.log("Unexpected error:", error)
			toast.error("Something went wrong", {
				description: "An unexpected error occurred while sending the reset link.",
			})
		}
	}
}
