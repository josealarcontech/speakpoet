<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { apiCall } from '@/utils/fetch'

const router = useRouter()
const toastMessage = ref('')
const toastType = ref('success')
const toastActive = ref(false)
const toastTimeout = 5000
const folders = ref([])
const showDialog = ref(false)
const tags = ref([])
const showDeleteDialog = ref(false)
const cleanFolder = ref({
	name: 'New Folder',
	genre: {},
	type: {}
})
const editedFolder = ref({
	name: 'New Folder',
	genre: {},
	type: {}
})
const toDeleteFolder = ref({})
const genreTags = ref([])
const typeTags = ref([])
const editing = ref(true) //false = adding, true = editing
const genreUncategorizedTag = ref({})
const typeUncategorizedTag = ref ({})
const getInfo = async() => {
	await getTags()
	await getFolders()
}
const getTags = async() => {
	const resp = await apiCall('/tags', 'GET', true)
	tags.value = resp
	genreTags.value = resp.filter(tag => tag.category === 'genre')
	typeTags.value = resp.filter(tag => tag.category === 'type')
	genreUncategorizedTag.value = genreTags.value.find(tag => tag.name === 'Uncategorized')
	typeUncategorizedTag.value = typeTags.value.find(tag => tag.name === 'Uncategorized')
	cleanFolder.value.genre = genreUncategorizedTag
	cleanFolder.value.type = typeUncategorizedTag
}
const getFolders = async() => {
	try {
		const resp = await apiCall('/folders', 'GET', true)
		folders.value = resp
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error getting folders, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
}
const openEdit = (folder) => {
	editing.value = true
	editedFolder.value = {...folder}
	showDialog.value = true
}
const saveFolder = async() => {
	try {
		if(editing.value) {
			await editFolder()
		} else {
			await addFolder()
		}
		toastMessage.value = editing.value ? 'Successfully changed folder' : 'Successfully added folder'
		toastType.value = 'success'
		toastActive.value = true
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error saving folder, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
}
const addFolder = async() => {
	await apiCall('/folders', 'POST', true, editedFolder.value)
	await getFolders()
	cancel()
}
const editFolder = async() => {
	await apiCall('/folders', 'PUT', true, editedFolder.value)
	await getFolders()
	cancel()
}
const cancel = () => {
	showDialog.value = false
	editedFolder.value = {}
}
const addFolderDialog = () => {
	editing.value = false
	editedFolder.value = {...cleanFolder.value}
	showDialog.value = true
}
const openFolder = (folder) => {
	router.push(`/folder/${folder.uid}`)
}

const closeDeleteDialog = () => {
	showDeleteDialog.value = false
	toDeleteFolder.value = {}
}

const deleteFolder = async() => {
	await apiCall(`/folders/${toDeleteFolder.value.uid}`, 'DELETE', true)
	closeDeleteDialog()
	toastMessage.value = 'Successfully deleted folder'
	toastType.value = 'success'
	toastActive.value = true
	await getInfo()
}
const folderNameRules = ref([
	(v) => !!v || 'Name is required',
	(v) => v.length < 31 || 'Folder name cannot be longer than 30 characters'
])
const openDelete = (folder) => {
	toDeleteFolder.value = folder
	showDeleteDialog.value = true
}
onMounted (async()=> {
	await getInfo()
})
</script>
<template>
	<div>
		<v-container>
			<v-row class="title-row" align="center">
				<v-icon class="title-icon" icon="mdi-home" size="large" color="blue-darken-2"></v-icon>
				<h1 class="title">Folders</h1>
				<v-btn @click="addFolderDialog()" size="large" variant="text" icon="mdi-folder-plus" color="success"></v-btn>
			</v-row>
			<div class="container" v-if="folders.length > 0">
				<v-card width="400" height="100" v-for="(folder, i) in folders" :key="i" class="card">
					<v-container class="max-height">
						<v-row no-gutters class="max-height">
							<v-col cols="2" @click="openFolder(folder)">
								<v-row no-gutters class="max-height" align="center">
									<v-icon icon="mdi-folder" size="45" color="blue-darken-2"></v-icon>
								</v-row>
							</v-col>
							<v-col cols="8" class="max-height" @click="openFolder(folder)">
								<v-row no-gutters class="half-height">
									<h4>{{ folder.name }}</h4>
								</v-row>
								<v-divider/>
								<v-row no-gutters justify="space-around" align="center" class="half-height">
									<h4>{{ folder.type.name }}</h4> <v-divider inset vertical></v-divider> <h4>{{ folder.genre.name }}</h4>
								</v-row>
							</v-col>
							<v-col cols="2" class="max-height">
								<v-row class="edit-button" justify="end" align="center">
									<v-btn variant="text" icon="mdi-pencil" color="warning" @click="openEdit(folder)"></v-btn>
								</v-row>
								<v-row class="half-height" justify="end" align="center">
									<v-btn variant="text" icon="mdi-delete" color="error" @click="openDelete(folder)"></v-btn>
								</v-row>
							</v-col>
						</v-row>
					</v-container>
				</v-card>
			</div>
			<div v-if="folders.length == 0">
				<v-row style="height: 200px; padding-left: 20px;" align="center">
					<h3>You don't have any folders. Click on the <v-icon icon="mdi-folder-plus" color="success"/> icon above to create your next collection of masterpieces!</h3>
				</v-row>
			</div>
		</v-container>
		<v-dialog v-model="showDialog" width=600 persistent>
			<v-card>
				<v-card-title>{{ editing ? 'Edit Folder' : 'Add Folder' }}</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
								<v-text-field variant="outlined" v-model="editedFolder.name" counter="30" :rules="folderNameRules"></v-text-field>
							</v-col>
							<v-col cols="6">
								<v-select variant="outlined" v-model="editedFolder.genre" :items="genreTags" item-title="name" item-value="uid" label="Genre" return-object></v-select>
							</v-col>
							<v-col cols="6">
								<v-select variant="outlined" v-model="editedFolder.type" :items="typeTags" item-title="name" item-value="uid" label="Type" return-object></v-select>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue-darken-1" @click="cancel">Cancel</v-btn>
					<v-btn color="success" @click="saveFolder">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="showDeleteDialog" width=600 persistent>
			<v-card>
				<v-card-text>
					Are you sure you want to delete Folder: {{ toDeleteFolder.name }}? This will also delete all art in the folder. This is not reversible.
				</v-card-text>
				<v-card-actions>
					<v-spacer/>
					<v-btn color="error" @click="deleteFolder">Delete</v-btn>
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
	.title-icon {
		padding-left: 30px;
		padding-right: 5px;
	}
	.max-height {
		height: 100%;
	}
	.half-height {
		height: 50%;
	}
	.edit-button {
		height: 50%;
		padding-bottom: 40px;
	}
</style>
