<script setup>
import { useAppStore } from './../store/app'
import { ref } from 'vue'
import LoginForm from '../components/LoginForm.vue'
import SignupForm from '../components/SignupForm.vue'
import { loginTexts } from './../utils/texts'
const store = useAppStore()
const loginPhase = ref(true)
const phase = ref('0')
const signupPhase = () => {
	loginPhase.value = false
	phase.value = '1'
}
const returnToLoginPhase = () => {
	loginPhase.value = true
	phase.value = '0'
}
const storeData = (obj) => {
	store.setToken(obj.token)
	store.setImage(obj.imageUrl)
	store.setTokenExpirationDate(obj.expire)
	store.setUserAlias(obj.alias)
	store.setUserEmail(obj.email)
}
</script>

<template>
	<v-container class="container">
		<v-row align="center" class="rows">
			<v-col>
				<v-row align="center" class="rows" no-gutters justify="center">
					<div class="text-container">
						<div class="pl-5">
							<v-img
							width="400"
							height="150"
							src="@/assets/spLogo.svg"
							cover
							></v-img>
						</div>
						<v-carousel height=150 interval=8000 hide-delimiters cycle :show-arrows="false">
							<v-carousel-item v-for="(quote, i) in loginTexts()" :key="i">
								<h2>{{ quote }}</h2>
							</v-carousel-item>
						</v-carousel>
					</div>
				</v-row>
			</v-col>
			<v-col>
				<v-row align="end" class="rows" no-gutters justify="center">
					<v-carousel :show-arrows="false" hide-delimiters v-model="phase" class="carousel">
						<v-carousel-item value='0'>
							<v-card elevation="2" outlined width="400px" transition="slide-x-reverse-transition" >
								<login-form @store-data="storeData"/>
								<v-divider></v-divider>
								<v-container>
									<v-btn block color="success" @click="signupPhase()">Sign Up</v-btn>
								</v-container>
							</v-card>
						</v-carousel-item>
						<v-carousel-item value='1'>
							<v-card elevation="2" outlined width="400px" transition="slide-x-reverse-transition" >
								<signup-form @store-data="storeData"/>
								<v-divider></v-divider>
								<v-container>
									<v-btn block color="success" @click="returnToLoginPhase()">Have an account? Login</v-btn>
								</v-container>
							</v-card>
						</v-carousel-item>
					</v-carousel>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>
<style scoped>
.container {
	height: 80%;
}
.rows {
	height: 100%;
}
.text-container {
	width: 500px;
}
.text-title {
	padding-bottom: 10px;
}
.carousel {
	height: inherit !important;
	width: inherit !important;
}
</style>