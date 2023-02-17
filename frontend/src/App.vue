<script setup>
import { useAppStore } from './store/app'
import { useRouter, useRoute } from 'vue-router'
import { signOutUser } from './utils/firebase'
const store = useAppStore()
const router = useRouter()
const route = useRoute()
const goHome = () => {
	router.push('/')
}
const logout = async () => {
	await signOutUser()
	store.clearToken()
	store.clearUser()
	router.push('/login')
}
const goToSettings = () => {
	router.push('/account')
}
</script>

<template>
	<v-app class="app">
		<v-app-bar v-if="route.meta.requiresAuth">
			<v-app-bar-title>
				<v-img
					height="50"
					width="150"
					src="@/assets/spLogo.svg"
					cover
					@click="goHome()"
					class="app-bar-image"
				></v-img>
			</v-app-bar-title>
			<template v-slot:append>
				<v-menu
					min-width="200px"
					rounded
				>
				<template v-slot:activator="{ props }">
					<v-btn
						icon
						v-bind="props"
					>
						<v-avatar :image="store.profileImage"></v-avatar>
					</v-btn>
				</template>
				<v-card>
					<v-card-text>
						<div class="mx-auto text-center">
							<h3>{{ store.userAlias }}</h3>
							<p class="text-caption mt-1">
								{{ store.userEmail }}
							</p>
							<v-divider class="my-3"></v-divider>
							<v-btn
								rounded
								variant="text"
								@click="goToSettings"
							>
								Edit Account
							</v-btn>
							<v-divider class="my-3"></v-divider>
							<v-btn
								rounded
								variant="text"
								@click="logout()"
							>
								Logout
							</v-btn>
						</div>
					</v-card-text>
				</v-card>
			</v-menu>
			</template>
		</v-app-bar>
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<style scoped>
.app {
	background-color: #f0f2f5;
}
.app-bar-image {
	cursor: pointer;
	width: 200px;
}
</style>
