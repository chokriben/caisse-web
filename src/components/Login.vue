<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
const emit = defineEmits(["login-success"]);
const router = useRouter();
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);

function appendToCode(num) {
  password.value += num;
}

function clearCode() {
  password.value = "";
}

function removeLastDigit() {
  password.value = password.value.slice(0, -1);
}

async function submitLogin() {
  if (!password.value) {
    toast.info("Veuillez remplir tous les champs.");
    return;
  }

  loading.value = true;

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/login", {
      password: password.value,
    });

    const { token, user } = response.data;
    localStorage.setItem("api_token", token);
    localStorage.setItem("user_name", user.name);
    localStorage.setItem("user_role", user.role);

    if (user.role === "admin") {
      router.push({ name: "Tickets" });
    } else {
      router.push({ name: "Caisse" });
    }

    emit("login-success", user);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Mot de passe incorrect.");
      } else if (error.response.status === 403) {
        toast.error(error.response.data.message || "Accès refusé.");
      } else {
        toast.error("Erreur serveur, veuillez réessayer plus tard.");
      }
    } else {
      toast.error("Erreur réseau, impossible de contacter le serveur.");
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="fill-height caisse-login-container" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <v-card class="pa-6 elevation-10">
          <v-card-title class="justify-center text-h4 font-weight-bold mb-4">
            🛒 Connexion Caisse
          </v-card-title>

          <v-card-text>
            <!-- Clavier numérique -->
            <div class="numeric-keypad">
              <v-row>
                <v-col cols="4" v-for="n in [1, 2, 3]" :key="n">
                  <v-btn block @click="appendToCode(n)" class="key-btn">{{
                    n
                  }}</v-btn>
                </v-col>
                <v-col cols="4" v-for="n in [4, 5, 6]" :key="n">
                  <v-btn block @click="appendToCode(n)" class="key-btn">{{
                    n
                  }}</v-btn>
                </v-col>
                <v-col cols="4" v-for="n in [7, 8, 9]" :key="n">
                  <v-btn block @click="appendToCode(n)" class="key-btn">{{
                    n
                  }}</v-btn>
                </v-col>
                <v-col cols="4">
                  <v-btn block @click="clearCode" class="key-btn" color="error">
                    C
                  </v-btn>
                </v-col>
                <v-col cols="4">
                  <v-btn block @click="appendToCode(0)" class="key-btn"
                    >0</v-btn
                  >
                </v-col>
                <v-col cols="4">
                  <v-btn
                    block
                    @click="removeLastDigit"
                    class="key-btn"
                    color="warning"
                  >
                    ⌫
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Mot de passe -->
            <v-text-field
              label="Mot de passe"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showPassword = !showPassword"
              outlined
              rounded
              hide-details
              :disabled="loading"
              dense
              style="font-size: 1.4rem"
              class="mb-6"
            />

            <!-- Bouton connexion -->
            <v-btn
              color="primary"
              block
              height="56"
              class="text-h6"
              @click="submitLogin"
              :loading="loading"
              :disabled="loading"
            >
              🔐 Se connecter
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.caisse-login-container {
  background: linear-gradient(to bottom right, #f5f7fa, #d4e0f0);
}

.v-card {
  border-radius: 20px;
}

.v-btn {
  border-radius: 12px;
}

.numeric-keypad {
  margin-bottom: 20px;
}

.key-btn {
  font-size: 1.5rem;
  height: 60px;
}
</style>
