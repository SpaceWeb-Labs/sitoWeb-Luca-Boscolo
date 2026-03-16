import { createHead } from '@unhead/vue/client'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(createHead())
app.mount('#app')
