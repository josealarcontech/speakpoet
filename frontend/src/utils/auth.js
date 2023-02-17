import { auth } from './firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
async function registerUser(newUser) {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
		const user = userCredential.user
		const token = await user.getIdToken()
		return { token, uid: user.uid, expirationTime: user.stsTokenManager.expirationTime }
	} catch (error) {
		if(error.code === 'auth/email-already-in-use') {
			throw 'An account already exists with this email'
		} else {
			console.error(error)
			throw 'Error logging in, please try again'
		}
	}
}
async function loginUser (user) {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password)
		const credUser = userCredential.user
		const token = await credUser.getIdToken()
		return { token, uid: credUser.uid, expirationTime: credUser.stsTokenManager.expirationTime }
	} catch (error) {
		if(error.code === 'auth/user-not-found') {
			throw 'Incorrect email or password'
		} else {
			console.error(error)
			throw 'Error logging in, please try again'
		}
	}
}
export { registerUser, loginUser }