import { FirebaseApp, initializeApp } from "firebase/app"
import { getAuth, signOut } from "firebase/auth"

type FirebaseConfig = {
	apiKey: string | undefined
	authDomain: string | undefined
	projectId: string | undefined
	appId: string | undefined
}

const firebaseConfig: FirebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_API_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_API_PROJECT_ID,
	appId: process.env.NEXT_PUBLIC_API_APP_ID,
}

const app: FirebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const signOutCurrentUser = async () => {
	return await signOut(auth)
}

export const getToken = async () => {
	return await auth.currentUser?.getIdToken(true)
}