<template>
  <v-dialog v-model="localVisible" max-width="700px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">Ajouter un produit</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form @submit.prevent="submitForm" ref="formRef">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.name" label="Nom *" required></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.price" label="Prix *" required></v-text-field>
            </v-col>

      

         

           
          </v-row>

          <v-row justify="end" class="mt-4">
            <v-btn color="success" class="mr-2" type="submit" prepend-icon="mdi-check">
              Ajouter
            </v-btn>
            <v-btn color="secondary" @click="fermerPopup" prepend-icon="mdi-close">
              Annuler
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue'
import axios from 'axios'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible', 'fermer', 'dataChanged'],
  setup(props, { emit }) {
    const localVisible = ref(props.visible)
    const form = ref({
      name: '',
      price: '',
    })

    watch(
      () => props.visible,
      (val) => {
        localVisible.value = val
      }
    )

    watch(localVisible, (val) => {
      if (val !== props.visible) {
        emit('update:visible', val)
      }
    })

    const fermerPopup = () => {
      localVisible.value = false
      emit('fermer')
    }

    const submitForm = async () => {
      if (!form.value.name || !form.value.price) {
        alert('Veuillez remplir les champs obligatoires : name et price.')
        return
      }

      try {
        await axios.post('http://127.0.0.1:8000/api/products', form.value)
        emit('dataChanged')
        fermerPopup()
      } catch (err) {
        console.error('Erreur lors de l’ajout :', err)
        alert('Une erreur est survenue lors de l’ajout du chantier.')
      }
    }

    return {
      localVisible,
      form,
      fermerPopup,
      submitForm,
    }
  },
}
</script>
