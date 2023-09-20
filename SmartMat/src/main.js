import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import './assets/css/main.css'

const app = createApp(App)

const pinia = createPinia()

pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(VueApexCharts)
app.use(router)

app.mount('#app')
