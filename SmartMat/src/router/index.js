import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/UserStore'
import { verifyToken } from '../services/smartmatApi/UserService.js'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/scan',
      name: 'scan',
      component: () => import('../views/ScannerView.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/ListView.vue')
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import('../views/SetupView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/settings/SettingsView.vue')
    },
    {
      path: '/profile/profile',
      name: 'profileSettings',
      component: () => import('../views/settings/ProfileView.vue')
    },
    {
      path: '/profile/groups',
      name: 'groupsSettings',
      component: () => import('../views/settings/GroupView.vue')
    },
    {
      path: '/profile/allergens',
      name: 'allergensSettings',
      component: () => import('../views/settings/AllergensView.vue')
    },

    {
      path: '/recipe:id',
      name: 'recipe',
      component: () => import('../views/RecipeView.vue')
    },
    {
      path: '/plan',
      name: 'plan',
      component: () => import('../views/PlanView.vue')
    }
  ]
})

//Router guard that validates token before each route change and redirects to login if token is invalid
router.beforeEach(async (to, from, next) => {
  const publicPages = ['home', 'login', 'register']
  const authRequired = !publicPages.includes(to.name)

  const token = useUserStore().getToken

  if (authRequired) {
    if (!token) {
      return next('/login')
    } else {
      try {
        await verifyToken(useUserStore().getUsername)
        next()
      } catch (error) {
        console.log(error)
        useUserStore().logout()
        return next('/login')
      }
    }
  } else {
    next()
  }
})

export default router
