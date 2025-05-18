
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import './assets/main.css'
import colors from 'vuetify/util/colors'


const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VBtn: { variant: 'outlined' },
    VTextField: { variant: 'solo' }
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#0044AD',
          secondary: '#AFB0B1',
          customBgColor: '#F2F6FF'
        }
      },
      dark: {
        colors: {
          primary: '#0044AD',
          secondary: '#AFB0B1',
          customBgColor: '#F2F6FF',
        }
      }
    }
  }

})
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify) // 註冊 Vuetify

app.mount('#app')
