// import { useAppStore } from '/store/app'
import { auth, getCurrentUser } from './firebase'
import store from '../store';
import { setToken, setTokenExpirationDate } from './../features/token/tokenSlice'
import { User } from 'firebase/auth'
async function checkTokenValid() {
	const expirationTime = store.getState().token.tokenExpirationDate
	if(expirationTime === '' || new Date() > new Date(expirationTime)) {
		let user: User | null = auth.currentUser
		if (user === null) {
			user = await getCurrentUser() as User
		}
		const token = await user.getIdToken()
		const expireTime = (await user.getIdTokenResult()).expirationTime
		// dispatch(setToken({token: token}))
		// dispatch(setTokenExpirationDate({tokenExpirationDate: expireTime}))
		store.dispatch(setToken({token: token}))
		store.dispatch(setTokenExpirationDate({tokenExpirationDate: expireTime}))
	}
}

async function apiCall(urlEnding: string, method: string, authNeeded: boolean, body = {}) {
	if(authNeeded) await checkTokenValid()
	const authToken = store.getState().token.token
	const urlBase = import.meta.env.PROD ? import.meta.env.VITE_API_PROD : import.meta.env.VITE_API_DEV
	const url = urlBase + urlEnding
	let response
	if(method === 'GET') {
		response = await fetch(url, {
			method: method,
			headers: authNeeded ? {
				'Authorization': `Bearer ${authToken}`
			} : {}
		})
	} else {
		response = await fetch(url, {
			method: method,
			headers: authNeeded ? {
				'Authorization': `Bearer ${authToken}`
			} : {},
			body: JSON.stringify(body)
		})
	}
	const resp = await response.json()
	return resp
}

// async function profileImageUpload(image: image) {
// 	await checkTokenValid()
// 	const formData = new FormData()
// 	formData.append('image', image)
// 	const urlBase = import.meta.env.PROD ? import.meta.env.VITE_API_PROD : import.meta.env.VITE_API_DEV
// 	const url = urlBase + '/profile'
// 	const resp = await fetch(url, {
// 		method: 'POST',
// 		headers:{'Authorization': `Bearer ${authToken}`},
// 		body: formData
// 	})
// 	const res = await resp.json()
// 	store.setImage(res.imageUrl)
// }

export { apiCall }
// export { apiCall, profileImageUpload}
