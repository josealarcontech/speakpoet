import { FirebaseError } from 'firebase/app'
import { auth } from './firebase'
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { newUser } from './types'
export interface userRegisterReturn {
	token: string;
	uid: string;
	expirationTime: string;
}
async function registerUser(newUser:newUser) {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
		const user = userCredential.user as User
		const token = await user.getIdToken()
		const expirationTime = (await user.getIdTokenResult()).expirationTime
		return { token, uid: user.uid, expirationTime }
	} catch (error) {
		if(error instanceof FirebaseError) {
			if(error.code === 'auth/email-already-in-use') {
				throw 'An account already exists with this email'
			} else {
				console.error(error)
				throw 'Error logging in, please try again'
			}
		}
	}
}
async function loginUser (user : newUser) {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password)
		const credUser = userCredential.user
		const token = await credUser.getIdToken()
		const expirationTime = (await credUser.getIdTokenResult()).expirationTime
		return { token, uid: credUser.uid, expirationTime }
	} catch (error) {
		if(error instanceof FirebaseError) {
			if(error.code === 'auth/user-not-found') {
				throw 'Incorrect email or password'
			} else {
				console.error(error)
				throw 'Error logging in, please try again'
			}
		}
	}
}
export { registerUser, loginUser }