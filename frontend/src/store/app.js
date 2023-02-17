// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
	state: () => ({
		token: '',
		profileImage: '',
		tokenExpirationDate: '',
		userAlias: '',
		userEmail: ''
	}),
	actions: {
		setImage(payload) {
			this.profileImage = payload
		},
		setToken(payload) {
			this.token = payload
		},
		setUserAlias(payload) {
			this.userAlias = payload
		},
		setUserEmail(payload) {
			this.userEmail = payload
		},
		clearToken() {
			this.token = ''
			this.tokenExpirationDate = ''
		},
		setTokenExpirationDate(payload) {
			this.tokenExpirationDate = payload
		},
		tokenValid() {
			return new Date() < new Date(this.tokenExpirationDate)
		},
		clearUser() {
			this.profileImage = ''
			this.userAlias = '',
			this.userEmail = ''
		}
	},
	persist: true
})
