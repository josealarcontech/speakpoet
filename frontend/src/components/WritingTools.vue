<script setup>
import { ref } from 'vue'
import { apiCall } from '@/utils/fetch'
const toastMessage = ref('')
const toastType = ref('success')
const toastActive = ref(false)
const toastTimeout = 2000
const tab = ref(0)
const dictWord = ref('')
const thesWord = ref('')
const dictEntry = ref('')
const thesEntry = ref('')
const randomEntry = ref('')
const getDefinition = async() => {
	try {
		const resp = await apiCall(`/tools/dict/${dictWord.value}`, 'GET', true)
		dictEntry.value = resp
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error using tool, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
}
const getSynonym = async() => {
	try {
		const resp = await apiCall(`/tools/thes/${thesWord.value}`, 'GET', true)
		thesEntry.value = resp
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error using tool, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
}
const getRandom = async() => {
	try {
		const resp = await apiCall('/tools/rand', 'GET', true)
		randomEntry.value = resp
	} catch (error) {
		console.error(error)
		toastMessage.value = 'Error using tool, please try again'
		toastType.value = 'error'
		toastActive.value = true
	}
}
</script>
<template>
	<v-container class="container">
		<h2>Writing Tools</h2>
		<v-tabs
			v-model="tab"
			bg-color="primary"
			class="mt-3"
		>
			<v-tab value=0>Dictionary</v-tab>
			<v-tab value=1>Thesaurus</v-tab>
			<v-tab value=2>Random Word</v-tab>
		</v-tabs>

			<v-window v-model="tab" class="pt-3">
				<v-window-item value=0>
					You keep using that word. I do not think it means what you think it means." Find out, get a definition!
					<v-text-field variant="solo" v-model="dictWord" class="pt-3"></v-text-field>
					<v-btn @click="getDefinition()" block color="success" class="mb-3">Define</v-btn>
					<div v-if="dictEntry != '' && dictEntry.valid" class="dict-text">
						{{ dictEntry.definition }}
					</div>
					<div v-if="dictEntry != '' && !dictEntry.valid">
						Invalid word, please define a different word
					</div>
				</v-window-item>

				<v-window-item value=1>
					'Great' is such a boring word, use a great-er one!
					<v-text-field variant="solo" v-model="thesWord" class="pt-3"></v-text-field>
					<v-btn @click="getSynonym" block color="success" class="mb-3">Redefine</v-btn>
					<div v-if="thesEntry != ''">
						<h3 class="pb-3">Word: {{ thesEntry.word }}</h3>
						<v-row>
							<v-col>
								<h4 class="pb-3">Synonyms</h4>
								<div v-if="thesEntry.synonyms.length > 0" class="pl-3">
									<h5 v-for="(syn, i) in thesEntry.synonyms" :key="i">
										{{ syn }}
									</h5>
								</div>
								<div v-else class="pl-3">
									No synonyms
								</div>
							</v-col>
							<v-col>
								<h4 class="pb-3">Antonyms</h4>
								<div v-if="thesEntry.antonyms.length > 0" class="pl-3">
									<h5 v-for="(syn, i) in thesEntry.antonyms" :key="i">
										{{ syn }}
									</h5>
								</div>
								<div v-else class="pl-3">
									No antonyms
								</div>
							</v-col>
						</v-row>
						
					</div>
				</v-window-item>

				<v-window-item value=2>
					Need some inspiration? Try rhyming the next word or use it as a jumping off point!
					<v-btn @click="getRandom()" block color="success"  class="mt-3">Get Random!</v-btn>
					<div class="pt-3" v-if="randomEntry != ''">
						<v-row class="pl-3 pt-3 pb-3">
							Random Word: <h4 class="pl-3">{{ randomEntry }}</h4>
						</v-row>
						<div class="pt-3 rand-help-text">Try using this word in a rhyme, or base a piece off of this word. Challenge yourself to master it.</div>
					</div>
				</v-window-item>
			</v-window>
		<v-snackbar :color="toastType" v-model="toastActive" :timeout="toastTimeout">{{ toastMessage }}</v-snackbar>
		</v-container>
</template>
<style scoped>
.container {
	background-color: #f0f2f5;
	height: 100%;
	overflow: auto;
}
.dict-text {
	font-size: 10pt;
}
.rand-help-text {
	font-size: 8pt;
}
</style>