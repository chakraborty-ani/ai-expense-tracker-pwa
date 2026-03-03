import { FirebaseApp, initializeApp } from "firebase/app"
import { getAuth, signOut } from "firebase/auth"

const requiredEnvVars = {
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_API_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_API_PROJECT_ID,
	appId: process.env.NEXT_PUBLIC_API_APP_ID,
}

const missingVars = Object.entries(requiredEnvVars)
	.filter(([, value]) => !value)
	.map(([key]) => key)

if (missingVars.length > 0) {
	throw new Error(
		`Missing required Firebase environment variables: ${missingVars.join(", ")}. ` +
		`Check your .env file.`
	)
}

const app: FirebaseApp = initializeApp(requiredEnvVars as Record<string, string>)
export const auth = getAuth(app)

export const signOutCurrentUser = async () => {
	return await signOut(auth)
}

export const getToken = async () => {
	return await auth.currentUser?.getIdToken(true)
}
