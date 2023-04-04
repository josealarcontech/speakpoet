import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, onAuthStateChanged } from 'firebase/auth'

var config = {
	apiKey: import.meta.env.VITE_FB_CONFIG_API_KEY,
	authDomain: import.meta.env.VITE_FB_CONFIG_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FB_CONFIG_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FB_CONFIG_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FB_CONFIG_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FB_CONFIG_APP_ID,
	measurementId: import.meta.env.VITE_FB_CONFIG_MEASUREMENT_ID
}
const app = initializeApp(config)
const auth = getAuth(app)
if (!import.meta.env.PROD) {
	connectAuthEmulator(auth, 'http://127.0.0.1:9099')
}

function getCurrentUser() {
	return new Promise((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(user) => {
				unsubscribe()
				resolve(user)
			},
			reject
		)
	})
}

async function signOutUser () {
	await auth.signOut()
}
export { app, auth, getCurrentUser, signOutUser }
