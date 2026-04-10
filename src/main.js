import '@/assets/styles/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import es from '@vee-validate/i18n/dist/locale/es.json'
import * as rules from '@vee-validate/rules'

Object.entries(rules).forEach(([name, rule]) => {
  if (typeof rule === 'function') defineRule(name, rule)
})

configure({
  generateMessage: localize('es', es),
})

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
