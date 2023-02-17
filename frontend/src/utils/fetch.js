import { useAppStore } from '@/store/app'
import { auth, getCurrentUser } from './firebase'
const store = useAppStore()

async function checkTokenValid() {
	if(!store.tokenValid()) {
		let user = auth.currentUser
		if (user === null) {
			user = await getCurrentUser()
		}
		const token = await user.getIdToken()
		const expireTime = user.stsTokenManager.expirationTime
		store.setToken(token)
		store.setTokenExpirationDate(expireTime)
	}
}

async function apiCall(urlEnding, method, authNeeded, body = {}) {
	if(authNeeded) await checkTokenValid()
	const store = useAppStore()
	const urlBase = import.meta.env.PROD ? import.meta.env.VITE_API_PROD : import.meta.env.VITE_API_DEV
	const url = urlBase + urlEnding
	let response
	if(method === 'GET') {
		response = await fetch(url, {
			method: method,
			headers: authNeeded ? {
				'Authorization': `Bearer ${store.token}`
			} : {}
		})
	} else {
		response = await fetch(url, {
			method: method,
			headers: authNeeded ? {
				'Authorization': `Bearer ${store.token}`
			} : {},
			body: JSON.stringify(body)
		})
	}
	const resp = await response.json()
	return resp
}

async function profileImageUpload(image) {
	await checkTokenValid()
	const store = useAppStore()
	const formData = new FormData()
	formData.append('image', image)
	const urlBase = import.meta.env.PROD ? import.meta.env.VITE_API_PROD : import.meta.env.VITE_API_DEV
	const url = urlBase + '/profile'
	const resp = await fetch(url, {
		method: 'POST',
		headers:{'Authorization': `Bearer ${store.token}`},
		body: formData
	})
	const res = await resp.json()
	store.setImage(res.imageUrl)
}

export { apiCall, profileImageUpload}