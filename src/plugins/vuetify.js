// plugins/vuetify.js
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // ✅ Ajout important pour les icônes MDI
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // ✅ Définir MDI comme pack d'icônes par défaut
  },
})
