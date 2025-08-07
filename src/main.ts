import '@/index.css'
import '@fontsource/geologica/400.css'
import '@fontsource/geologica/500.css'
import '@fontsource/geologica/600.css'
import '@fontsource/geologica/700.css'
import '@fontsource/manrope/500.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
