// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/app'
import { getCurrentUser } from '@/utils/firebase'
const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@/views/HomeView.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/account',
		name: 'Account',
		component: () => import('@/views/AccountView.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/LoginView.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/art/:id',
		name: 'Art',
		component: () => import('@/views/ArtView.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/create',
		name: 'Create',
		component: () => import('@/views/ArtView.vue'),
		meta: { requiresAuth: true },
		children: [
			{
				path:':folder_uid',
				component: () => import('@/views/ArtView.vue'),
				meta: { requiresAuth: true }
			}
		]
	},
	{
		path: '/folder/:uid',
		name: 'Folder',
		component: () => import('@/views/FolderView.vue'),
		meta: { requiresAuth: true }
	},
	{ path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFoundView.vue') }
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL), // eslint-disable-line no-undef
	routes,
})


router.beforeEach(async (to) => {
	// redirect to login page if not logged in and trying to access a restricted page
	const store = useAppStore()
	if (to.meta.requiresAuth && ((!await getCurrentUser()) || !store.token)) {
		return '/login'
	}
	if (!to.meta.requiresAuth && ((await getCurrentUser()) || store.token)) {
		return '/'
	}
})

export default router
