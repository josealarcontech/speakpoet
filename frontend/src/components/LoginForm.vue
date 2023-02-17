<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiCall } from '@/utils/fetch'
import { loginUser } from '@/utils/auth'

const emit = defineEmits(['storeData'])
const router = useRouter()
const toastMessage = ref('')
const toastType = ref('success')
const toastActive = ref(false)
const toastTimeout = 5000
const form = ref(null)
const password = ref('')
const email = ref('')
const loading = ref(false)
const hidePassword = ref(true)
const toggleHidePassword = () => {
	hidePassword.value = !hidePassword.value
}
const emailRules = ref([
	(v) => !!v || 'E-mail is required',
	(v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || 'E-mail must be valid' // eslint-disable-line no-useless-escape
])
const login = async() => {
	try {
		const { valid } = await form.value.validate()
		if (!valid) return
		loading.value = true
		const data = {
			email: email.value,
			password: password.value
		}
		const loginRes = await loginUser(data)
		data.uid = loginRes.uid
		const dbRes = await apiCall('/login', 'POST', false, data)
		const toStore = {
			token: loginRes.token,
			imageUrl: dbRes.imageUrl,
			expire: loginRes.expirationTime,
			email: dbRes.email,
			alias: dbRes.alias
		}
		loading.value = false
		emit('storeData', toStore)
		router.push('/')
	} catch (error) {
		toastMessage.value = error
		toastType.value = 'error'
		toastActive.value = true
		loading.value = false
	}
}
</script>
<template>
	<div>
		<v-container>
			<v-form ref="form">
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field variant="outlined" v-model="email" :rules="emailRules" label="Email" required>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field :type="hidePassword ? 'password' : 'text'" @click:append-inner="toggleHidePassword" :append-inner-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined" v-model="password" label="Password" required>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-btn @click="login()" :loading="loading" block color="secondary">Login</v-btn>
				</v-row>
			</v-form>
		</v-container>
		<v-snackbar :color="toastType" v-model="toastActive" :timeout="toastTimeout">{{ toastMessage }}</v-snackbar>
	</div>
</template>
