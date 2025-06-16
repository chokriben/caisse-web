<template>
  <v-container>
    <h2>Liste des utilisateurs</h2>

    <v-btn color="primary" class="mb-4" @click="dialog = true">
      Ajouter un caissier
    </v-btn>

    <!-- Dialog pour formulaire ajout caissier -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Ajouter un caissier</v-card-title>
        <v-card-text>
          <v-text-field v-model="newUser.name" label="Nom" required />
          <v-text-field v-model="newUser.code" label="Code" required />
          <v-text-field v-model="newUser.email" label="Email (optionnel)" />
          <v-text-field
            v-model="newUser.password"
            label="Mot de passe"
            type="password"
            required
          />
          <v-text-field
            v-model="newUser.password_confirmation"
            label="Confirmer mot de passe"
            type="password"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="submitNewUser" :loading="loading">
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      loading-text="Chargement..."
      class="elevation-1"
    >
      <template #item.role="{ item }">
        <v-chip
          :color="item.role === 'admin' ? 'red lighten-2' : 'blue lighten-2'"
          dark
          small
        >
          {{ item.role }}
        </v-chip>
      </template>
    </v-data-table>

    <v-alert v-if="error" type="error" dismissible class="mt-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const users = ref([]);
const loading = ref(false);
const error = ref(null);
const dialog = ref(false);

const newUser = ref({
  name: "",
  code: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "caisser", // rôle fixe pour ce formulaire
});

const headers = [
  { title: "Nom", key: "name" },
  { title: "Code", key: "code" },
  { title: "Email", key: "email" },
  { title: "Rôle", key: "role" },
];

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const token = localStorage.getItem("api_token");
    const response = await axios.get("http://127.0.0.1:8000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = response.data.users;
  } catch (e) {
    error.value = "Erreur lors de la récupération des utilisateurs.";
  } finally {
    loading.value = false;
  }
};

const submitNewUser = async () => {
  loading.value = true;
  error.value = null;

  try {
    const token = localStorage.getItem("api_token");
    await axios.post(
      "http://127.0.0.1:8000/api/register",
      {
        name: newUser.value.name,
        code: newUser.value.code,
        email: newUser.value.email,
        role: newUser.value.role,
        password: newUser.value.password,
        password_confirmation: newUser.value.password_confirmation,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dialog.value = false;
    // Réinitialiser le formulaire
    newUser.value = {
      name: "",
      code: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "caisser",
    };
    fetchUsers(); // rafraîchir la liste après ajout
  } catch (e) {
    error.value = "Erreur lors de l'ajout de l'utilisateur.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
