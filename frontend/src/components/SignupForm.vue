<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiCall } from '@/utils/fetch'
import { registerUser } from '@/utils/auth'
const router = useRouter()
const emit = defineEmits(['storeData'])
const form = ref(null)

const name = ref('')
const lastName = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const alias = ref('')
const toastMessage = ref('')
const toastType = ref('success')
const toastActive = ref(false)
const toastTimeout = 5000
const loading = ref(false)
const emailRules = ref([
	(v) => !!v || 'E-mail is required',
	(v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || 'E-mail must be valid' // eslint-disable-line no-useless-escape
])
const passwordRules = ref([
	(v) => !!v || 'Password is required',
	(v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/.test(v) || 'Password must have at least 8 characters, one uppercase letter and one number'
])
const passwordConfirmationRules = ref([
	(v) => !!v || 'Password Confirmation is required'
])
const nameRules = ref([
	(v) => !!v || 'Name is required',
	(v) => v.length < 21 || 'Name cannot be longer than 20 characters'
])
const lastNameRules = ref([
	(v) => !!v || 'Last Name is required',
	(v) => v.length < 21 || 'Last Name cannot be longer than 20 characters'
])
const aliasRules = ref([
	(v) => !!v || 'Pen Name is required',
	(v) => v.length > 3 || 'Alias must be at least 4 characters long',
	(v) => v.length < 26 || 'Alias cannot be longer than 25 characters'
])
const passwordConfirmationRule = computed(()=> {
	return () => (password.value === confirmPassword.value) || 'Password must match'
})
const signup = async() => {
	try {
		const { valid } = await form.value.validate()
		if (!valid) return
		loading.value = true
		const aliasFoundRes = await apiCall(`/alias/${alias.value}`, 'GET', false)
		if (aliasFoundRes.aliasFound) {
			toastMessage.value = 'Alias already in use'
			toastType.value = 'error'
			toastActive.value = true
			loading.value = false
			return
		}
		const data = {
			email: email.value,
			password: password.value,
			lastname: lastName.value,
			name: name.value,
			alias: alias.value
		}
		const registerRes = await registerUser(data)
		data.uid = registerRes.uid
		const dbRes = await apiCall('/signup', 'POST', false, data)
		const toStore = {
			token: registerRes.token,
			imageUrl: dbRes.imageUrl,
			expire: registerRes.expirationTime,
			email: dbRes.email,
			alias: dbRes.alias
		}
		loading.value = false
		emit('storeData', toStore)
		router.push('/')
	} catch (error) {
		loading.value = false
		toastMessage.value = error
		toastType.value = 'error'
		toastActive.value = true
	}
}
</script>

<template>
	<div>
		<v-form ref="form">
			<v-container>
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field variant="outlined" v-model="email" :rules="emailRules" label="Email" required>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field variant="outlined" type="password" v-model="password" label="Password" :rules="passwordRules" required>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field variant="outlined" type="password" v-model="confirmPassword" :rules="passwordConfirmationRules.concat(passwordConfirmationRule)" label="Password Confirmation" required>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field counter="20" variant="outlined" v-model="name" label="Name" :rules="nameRules" required>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field counter="20" variant="outlined" v-model="lastName" label="Last Name" :rules="lastNameRules" required>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field counter="25" variant="outlined" v-model="alias" label="Pen Name/Alias" :rules="aliasRules" required hint="Unique display name, cannot be changed">
						</v-text-field>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-btn block :loading="loading" color="secondary" @click="signup()">Sign Up</v-btn>
				</v-row>
			</v-container>
		</v-form>
		<v-snackbar :color="toastType" v-model="toastActive" :timeout="toastTimeout">{{ toastMessage }}</v-snackbar>
	</div>
</template>
