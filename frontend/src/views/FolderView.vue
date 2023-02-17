<script setup>
import { useRouter, useRoute } from 'vue-router'
import { apiCall } from '@/utils/fetch'
import { ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const toastMessage = ref('')
const toastType = ref('success')
const toastActive = ref(false)
const toastTimeout = 5000
const art = ref([])
const folder = ref({
	info: {
		name: 'folder',
		genre: {
			name: 'Uncategorized'
		},
		type: {
			name: 'Uncategorized'
		}
	}
})
const artToDelete = ref({})
const showDelete = ref(false)
const getFolderArts = async() => {
	const resp = await apiCall(`/folder_art/${route.params.uid}`, 'GET', true)
	folder.value = resp
	art.value = resp.works
}
const openArt = (work) => {
	router.push(`/art/${work.uid}`)
}
const newArtPage = () => {
	router.push(`/create/${route.params.uid}`)
}
const deleteArt = async() => {
	await apiCall(`/art/${artToDelete.value.uid}`, 'DELETE', true)
	closeDeleteDialog()
	toastMessage.value = 'Successfully deleted art'
	toastType.value = 'success'
	toastActive.value = true
	await getFolderArts()
}
const openDelete = (art) => {
	artToDelete.value = art
	showDelete.value = true
}
const closeDeleteDialog = () => {
	showDelete.value = false
	artToDelete.value = {}
}
const goHome = () => {
	router.push('/')
}
onMounted(async() => {
	try {
		await getFolderArts()
	} catch (error) {
		console.error(error)
		toastMessage.value = 'There was an error, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
})
</script>
<template>
	<div>
		<v-container>
			<v-row class="title-row" align="center">
				<v-btn @click="goHome()" class="title-folder-button" size="large" variant="text" icon="mdi-folder" color="blue-darken-2"></v-btn>
				<h1 class="title">{{ folder.info.name }}</h1>
				<v-btn @click="newArtPage()" size="large" variant="text" icon="mdi-file-plus" color="success"></v-btn>
			</v-row>
			<v-row no-gutters>
				<h5 class="folder-info">{{ folder.info.genre.name }}</h5>
				<h5>{{ folder.info.type.name }}</h5>
			</v-row>
			<div class="container" v-if="art.length > 0">
				<v-card width="400" height="100" v-for="(work, i) in art" :key="i" class="card">
					<v-container class="max-height">
						<v-row no-gutters class="max-height">
							<v-col cols="2" @click="openArt(work)">
								<v-row no-gutters class="max-height" align="center">
									<v-icon icon="mdi-file" size="45" color="blue-darken-2"></v-icon>
								</v-row>
							</v-col>
							<v-col cols="8" class="max-height" @click="openArt(work)">
								<v-row no-gutters class="half-height">
									<h4>{{ work.name }}</h4>
								</v-row>
								<v-divider/>
								<v-row no-gutters justify="space-around" align="center" class="half-height">
									<h4>{{ work.type.name }}</h4> <v-divider inset vertical></v-divider> <h4>{{ work.genre.name }}</h4>
								</v-row>
							</v-col>
							<v-col cols="2" class="max-height">
								<v-row class="max-height" justify="center" align="center" no-gutters>
									<v-btn class="ml-5" variant="text" icon="mdi-delete" color="error" @click="openDelete(work)"></v-btn>
								</v-row>
							</v-col>
						</v-row>
					</v-container>
				</v-card>
			</div>
			<div v-if="art.length == 0">
				<v-row style="height: 200px; padding-left: 20px;" align="center">
					<h3>This {{ folder.info.name }} folder is empty. Click on the <v-icon icon="mdi-file-plus" color="success"/> icon above to start creating your next masterpiece!</h3>
				</v-row>
			</div>
		</v-container>
		<v-dialog v-model="showDelete" width=600 persistent>
			<v-card>
				<v-card-text>
					Are you sure you want to delete the masterpiece: {{ artToDelete.name }}? This is not reversible.
				</v-card-text>
				<v-card-actions>
					<v-spacer/>
					<v-btn color="error" @click="deleteArt">Delete</v-btn>
					<v-btn color="success" @click="closeDeleteDialog">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-snackbar :color="toastType" v-model="toastActive" :timeout="toastTimeout">{{ toastMessage }}</v-snackbar>
	</div>
</template>

<style scoped>
	.container {
		display:flex;
		flex-wrap:wrap;
		flex-direction: row;
	}
	.card {
		margin: 10px;
		cursor: pointer;
	}
	.title-row {
		padding-bottom: 10px;
	}
	.title {
		padding-left: 25px;
		padding-right: 5px;
	}
	.title-folder-button {
		margin-left: 3px;
		margin-right: -15px;
	}
	.max-height {
		height: 100%;
	}
	.half-height {
		height: 50%;
	}
	.folder-info {
		padding-left: 10px;
		padding-right: 10px; 
	}
</style>
