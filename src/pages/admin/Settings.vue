<template>
  <v-container>
    <h1>Paramètres</h1>

    <v-form v-model="valid" ref="form">
      <v-text-field
        v-model="settings.appName"
        label="Nom de l'application"
        :rules="[v => !!v || 'Ce champ est requis']"
        required
      ></v-text-field>

      <v-switch
        v-model="settings.darkMode"
        label="Mode sombre"
      ></v-switch>

      <v-textarea
        v-model="settings.description"
        label="Description de l'application"
        rows="4"
      ></v-textarea>

      <v-btn
        :disabled="!valid"
        color="primary"
        @click="saveSettings"
      >
        Sauvegarder
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";

const valid = ref(false);
const settings = reactive({
  appName: "Mon Application Admin",
  darkMode: false,
  description: "",
});

const saveSettings = () => {
  if (!valid.value) {
    alert("Veuillez corriger les erreurs dans le formulaire.");
    return;
  }
  // Ici, tu peux envoyer les settings à une API ou les stocker en localStorage
  localStorage.setItem("app_settings", JSON.stringify(settings));
  alert("Paramètres sauvegardés !");
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>
