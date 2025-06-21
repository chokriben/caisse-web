<template>
  <v-card class="pa-5" max-width="600" elevation="4">
    <v-card-title>
      Clôture de Caisse
      <span style="margin-left:auto; font-weight:normal; font-size:0.9rem; color:gray;">
        {{ currentDateTime }}
      </span>
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submitCloture">
        <v-text-field
          label="Montant réel dans la caisse"
          v-model="realCash"
          type="number"
          prepend-icon="mdi-cash"
          required
        />
        <v-btn type="submit" color="primary" :loading="loading">
          Clôturer
        </v-btn>
      </v-form>

      <v-alert v-if="message" type="success" class="mt-4">
        {{ message }}
      </v-alert>
      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const realCash = ref("");
const message = ref("");
const error = ref("");
const loading = ref(false);

// Déclaration et mise à jour de la date/heure actuelle
const currentDateTime = ref("");

const updateDateTime = () => {
  const now = new Date();
  currentDateTime.value = now.toLocaleString(); // Format date + heure locale
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000); // mise à jour chaque seconde
});

const submitCloture = async () => {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const response = await axios.post(
      "http://localhost:8000/api/close-cash",
      {
        real_cash: parseFloat(realCash.value),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("api_token")}`,
        },
      }
    );

    message.value = response.data.message;
    realCash.value = "";
  } catch (err) {
    if (err.response && err.response.status === 409) {
      error.value = err.response.data.message;
    } else {
      error.value = "Erreur lors de la clôture.";
    }
  } finally {
    loading.value = false;
  }
};
</script>
