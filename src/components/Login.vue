<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const emit = defineEmits(["login-success"]);
const router = useRouter();
const code = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);

async function submitLogin() {
  if (!code.value || !password.value) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  loading.value = true;

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/login", {
      code: code.value,
      password: password.value,
    });

    const { token, user } = response.data;

    localStorage.setItem("api_token", token);
 // Redirection vers la page TheWelcome
    router.push({ name: "TheWelcome" });
    emit("login-success", user);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("Code ou mot de passe incorrect.");
    } else {
      alert("Erreur serveur, veuillez réessayer plus tard.");
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h5">Connexion</v-card-title>
          <v-card-text>
            <v-text-field
              label="Code"
              v-model="code"
              prepend-icon="mdi-barcode"
              outlined
              dense
              clearable
              :disabled="loading"
            />
            <v-text-field
              label="Mot de passe"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showPassword = !showPassword"
              outlined
              dense
              clearable
              :disabled="loading"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              block
              @click="submitLogin"
              :loading="loading"
              :disabled="loading"
            >
              Se connecter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
