<script setup>
import { ref, onMounted } from 'vue'
import { apiCall, profileImageUpload } from '@/utils/fetch'
const toastMessage = ref('')
const toastType = ref('success')
const toastActive = ref(false)
const toastTimeout = 5000
const user = ref({})
const joinedDate = ref(new Date)
const imageDialog = ref(false)
const form = ref(null)
const nameRules = ref([
	(v) => !!v || 'Name is required',
	(v) => v.length < 21 || 'Name cannot be longer than 20 characters'
])
const lastNameRules = ref([
	(v) => !!v || 'Last Name is required',
	(v) => v.length < 21 || 'Last Name cannot be longer than 20 characters'
])
const imageRules = ref([
	(value) => !value || !value.length || value[0].size < 1000000 || 'Avatar size should be less than 1 MB!'
])
const options = ref({ weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
const getUser = async() => {
	const resp = await apiCall('/user', 'GET', true)
	return resp
}
const updateAccount = async() => {
	const { valid } = await form.value.validate()
	if (!valid) return
	try {
		const resp = await apiCall('/user', 'PUT', true, user.value)
		toastMessage.value = 'Succesfully updated account'
		toastType.value = 'success'
		toastActive.value = true
		return resp
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error updating account, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
}
onMounted(async() => {
	try {
		user.value = await getUser()
		joinedDate.value = new Date(user.value.createdDate)
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error getting user info, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
})
const newImage = ref({})
const saveProfileImage = async() =>{
	try {
		await profileImageUpload(newImage.value[0])
		toastMessage.value = 'Succesfully updated profile picture'
		toastType.value = 'success'
		toastActive.value = true
		user.value = await getUser()
		closeImageDialog()
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error updating profile picture, please try again'
		toastType.value = 'error'
		toastActive.value = true
		closeImageDialog()
	}
}
const closeImageDialog = () => {
	imageDialog.value = false
	newImage.value = {}
}
</script>
<template>
	<div>
		<v-container>
		<h1>Account Info</h1>
		<v-row align="center" class="main-row">
			<v-col>
				<v-row align="center" justify="space-around">
					<div>
						<h3 class="title-spacing">Profile Image</h3>
						<v-img :src="user.imageUrl" height="340" width="340" cover></v-img>
						<v-btn color="warning" class="edit-profile-button" @click="()=> {imageDialog = !imageDialog}" variant="text" icon="mdi-pencil"></v-btn>
					</div>
				</v-row>
			</v-col>
			<v-col>
				<v-row align="center" justify="space-around" class="info-row">
					<div>
						<h3 class="title-spacing">Joined: {{ joinedDate.toLocaleDateString('en-us', options) }}</h3>
						<h3 class="title-spacing">Alias: {{ user.alias }}</h3>
						<h3 class="title-spacing">Email: {{ user.email }}</h3>
						<v-form ref="form">
							<v-text-field counter="20" :rules="nameRules" label="Name" placeholder="Name" variant="solo" v-model="user.name"></v-text-field>
							<v-text-field counter="20" :rules="lastNameRules" label="Last Name" placeholder="Last Name" variant="solo" v-model="user.lastname"></v-text-field>
						</v-form>
						<v-btn @click="updateAccount" block color="success">Save</v-btn>
					</div>
				</v-row>
			</v-col>
		</v-row>
		</v-container>
		<v-dialog v-model="imageDialog" class="profile-image-dialog" persistent>
			<v-card>
				<v-card-title>Edit Profile Image</v-card-title>
				<v-card-text>
					<v-file-input
						variant="solo"
						accept="image/png, image/jpeg"
						label="New Profile Image"
						prepend-icon="mdi-account-circle"
						show-size
						:rules="imageRules"
						v-model="newImage"
					></v-file-input>
				</v-card-text>
				<v-card-actions>
					<v-spacer/>
					<v-btn variant="text" @click="closeImageDialog()" color="error">Cancel</v-btn>
					<v-btn variant="text" @click="saveProfileImage()" color="success">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-snackbar :color="toastType" v-model="toastActive" :timeout="toastTimeout">{{ toastMessage }}</v-snackbar>
	</div>
</template>
<style scoped>
	.main-row {
		padding-top: 60px;
	}
	.title-spacing {
		padding-bottom: 15px;
	}
	.edit-profile-button {
		margin-left: 280px;
		margin-top: -79px;
	}
	.info-row {
		width: 500px;
	}
	.profile-image-dialog {
		width: 600px;
	}
</style>