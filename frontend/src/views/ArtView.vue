<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiCall } from '@/utils/fetch'
import WritingTools from '@/components/WritingTools.vue'
const route = useRoute()
const router = useRouter()
const toastMessage = ref('')
const toastType = ref('success')
const toastActive = ref(false)
const toastTimeout = 5000
const genreTags = ref([])
const typeTags = ref([])
const cleanArt = ref({
	name: '',
	genre: {},
	type: {},
	folder: {},
	content: '',
	folderId: ''
})
const editedArt = ref({
	name: '',
	genre: {},
	type: {},
	folder: {},
	content: '',
	folderId: ''
})
const genreUncategorizedTag = ref({})
const typeUncategorizedTag = ref({})
const folders = ref([])
const fromFolder = ref(false)
const creating = ref(false)
const currentFolder = ref({})
const drawer = ref(false)
const options = ref({ weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
const panel = ref(['main'])
const titleRules = ref([
	(v) => !!v || 'Title is required',
	(v) => v.length < 31 || 'Title cannot be longer than 30 characters'
])
const artRules = ref([
	(v) => v.length < 500000 || 'Art cannot be longer than 500,000 characters'
])
const getArt = async() => {
	const resp = await apiCall(`/art/${route.params.id}`, 'GET', true)
	return resp
}
const getTags = async() => {
	const resp = await apiCall('/tags', 'GET', true)
	genreTags.value = resp.filter(tag => tag.category === 'genre')
	typeTags.value = resp.filter(tag => tag.category === 'type')
	genreUncategorizedTag.value = genreTags.value.find(tag => tag.name === 'Uncategorized')
	typeUncategorizedTag.value = typeTags.value.find(tag => tag.name === 'Uncategorized')
	if(creating.value) {
		if(fromFolder.value) {
			editedArt.value.genre = genreTags.value.find(tag => tag.uid === currentFolder.value.genre.uid)
			editedArt.value.type = typeTags.value.find(tag => tag.uid === currentFolder.value.type.uid)
			cleanArt.value.genre = genreTags.value.find(tag => tag.uid === currentFolder.value.genre.uid)
			cleanArt.value.type = typeTags.value.find(tag => tag.uid === currentFolder.value.type.uid)
		} else {
			editedArt.value.genre = genreUncategorizedTag.value
			editedArt.value.type = typeUncategorizedTag.value
			cleanArt.value.genre = genreUncategorizedTag.value
			cleanArt.value.type = typeUncategorizedTag.value
		}
	}
}
const getFolders = async() => {
	const resp = await apiCall('/folders', 'GET', true)
	folders.value = resp
	if(creating.value) {
		if(fromFolder.value) {
			editedArt.value.folder = folders.value.find(folder => folder.uid === route.params.folder_uid)
			cleanArt.value.folder = folders.value.find(folder => folder.uid === route.params.folder_uid)
		} else {
			editedArt.value.folder = folders.value[0]
			cleanArt.value.folder = folders.value[0]
		}
	}
	currentFolder.value = editedArt.value.folder
}
const saveArt = async() => {
	if(editedArt.value.name === '' || editedArt.value.name.length > 30) {
		panel.value = ['main']
		toastMessage.value = 'Must give your art a name.'
		toastType.value = 'error'
		toastActive.value = true
		return
	}
	if (editedArt.value.content.length > 500000) {
		toastMessage.value = 'Must reduce your art length. Consider creating a new piece in this folder.'
		toastType.value = 'error'
		toastActive.value = true
		return
	}
	try {
		if(creating.value) {
			editedArt.value.folderId = editedArt.value.folder.uid
			const resp = await apiCall('/art', 'POST', true, editedArt.value)
			cleanArt.value = {...editedArt.value}
			cleanArt.value.createdDate = new Date().toISOString()
			cleanArt.value.lastEditDate = new Date().toISOString()
			router.replace(`/art/${resp}`)
			creating.value = false
			fromFolder.value = false
			panel.value = []
		} else {
			editedArt.value.folderId = editedArt.value.folder.uid
			await apiCall(`/art/${route.params.id}`, 'PUT', true, editedArt.value)
			fromFolder.value = false
			cleanArt.value = {...editedArt.value}
			panel.value = []
		}
		toastMessage.value = 'Successfully saved your masterpiece'
		toastType.value = 'success'
		toastActive.value = true
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error saving art, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
}

onMounted(async() => {
	try {
		creating.value = (route.path.split('/')[1] === 'create')
		fromFolder.value = !!route.params.folder_uid
		if(!creating.value) {
			fromFolder.value = false
			const currentArt = await getArt()
			editedArt.value = {...currentArt}
			cleanArt.value = {...currentArt}
		}
		panel.value = creating.value ? ['main'] : []
		await getFolders()
		await getTags()
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error getting info, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
})
</script>
<template>
	<div>
		<v-container>
			<v-expansion-panels v-model="panel" >
				<v-expansion-panel value="main">
					<v-expansion-panel-title color="blue-darken-2">
						<v-row no-gutters>
							<v-col cols="4" class="d-flex justify-start">
								<v-text-field class="expansion-title-section" label="Art Title" variant="plain" density="compact" v-model="cleanArt.name" readonly></v-text-field>
							</v-col>
							<v-col cols="4" class="d-flex justify-start">
								<v-text-field class="expansion-title-section" label="Folder" variant="plain" density="compact" v-model="cleanArt.folder.name" readonly></v-text-field>
							</v-col>
							<v-col cols="2" class="d-flex justify-start">
								<v-text-field class="expansion-title-section" label="Art Genre" variant="plain" density="compact" v-model="cleanArt.genre.name" readonly></v-text-field>
							</v-col>
							<v-col cols="2" class="d-flex justify-start">
								<v-text-field class="expansion-title-section" label="Art Type" variant="plain" density="compact" v-model="cleanArt.type.name" readonly></v-text-field>
							</v-col>
						</v-row>
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<v-row>
							<v-col cols="8">
								<v-text-field :rules="titleRules" counter="30" variant="solo" v-model="editedArt.name" label="New Art Title"></v-text-field>
							</v-col>
							<v-col>
								<v-row class="pt-4 pb-1">
									<v-spacer/>
									<h4>{{ creating ? '' :`Created: ${new Date(cleanArt.createdDate).toLocaleDateString('en-us', options)}`  }}</h4>
								</v-row>
								<v-row>
									<v-spacer/>
									<h4>{{ creating ? '' :`Last Edit: ${new Date(cleanArt.lastEditDate).toLocaleDateString('en-us', options)}`  }}</h4>
								</v-row>
							</v-col>
						</v-row>
						<v-row
							justify="space-between"
							no-gutters
						>
							<v-col cols="5">
								<v-select variant="solo" v-model="editedArt.folder" :items="folders" item-title="name" item-value="uid" label="New Art Folder" return-object></v-select>
							</v-col>
							<v-col cols="3">
								<v-select variant="solo" v-model="editedArt.genre" :items="genreTags" item-title="name" item-value="uid" label="New Art Genre" return-object></v-select>
							</v-col>
							<v-col cols="3">
								<v-select variant="solo" v-model="editedArt.type" :items="typeTags" item-title="name" item-value="uid" label="New Art Type" return-object></v-select>
							</v-col>
						</v-row>
						<v-row no-gutters>
							<p class="warning-text">Click the Save button to save changes. Art info and content do not save automatically.</p>
						</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
			<v-textarea class="pt-4" bg-color="#ffffff" rows="25" no-resize :rules="artRules" counter="500,000" v-model="editedArt.content" placeholder="My new masterpiece"></v-textarea>
			<div class="floating">
				<v-container>
					<v-row class="pb-3 pl-2">
						<v-tooltip text="Writing Tools" location="top">
							<template v-slot:activator="{ props }">
								<v-btn v-bind="props" @click="drawer = !drawer" color="blue-darken-2" icon="mdi-pen"></v-btn>
							</template>
						</v-tooltip>
					</v-row>
					<v-row>
						<v-tooltip text="Save" location="bottom">
							<template v-slot:activator="{ props }">
								<v-btn size="x-large" v-bind="props" @click="saveArt()" icon="mdi-floppy" color="success"></v-btn>
							</template>
						</v-tooltip>
					</v-row>
				</v-container>
			</div>
			<v-navigation-drawer location="right" v-model="drawer" temporary style="width: 500px;">
				<writing-tools/>
			</v-navigation-drawer>
		</v-container>
		<v-snackbar :color="toastType" v-model="toastActive" :timeout="toastTimeout">{{ toastMessage }}</v-snackbar>
	</div>
</template>
<style scoped>
	.floating {
		position:fixed;
		bottom:70px;
		right:50px;
		display: flex;
		
	}
	.expansion-title-section {
		height: 30px;
	}
	.warning-text {
		color:orange;
		font-size: 9pt;
	}
</style>