<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped fixed width="250">
      <v-list dense>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.route"
          router
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="mr-4 text-right">
        <div>
          <strong>{{ userName }}</strong>
        </div>
        <div class="text-caption">{{ userRole }}</div>
      </div>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app padless>
      <v-col class="text-center" cols="12">
        &copy; 2025 - Mon Application Admin
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const drawer = ref(true);
const router = useRouter();
// Récupérer les informations utilisateur
const userName = ref(localStorage.getItem("user_name") || "Utilisateur");
const userRole = ref(localStorage.getItem("user_role") || "Invité");
const menuItems = [
  {
    title: "Tableau de bord",
    icon: "mdi-view-dashboard",
    route: "/admin/dashboard",
  },
  { title: "Utilisateurs", icon: "mdi-account-group", route: "/admin/users" },
  { title: "Paramètres", icon: "mdi-cog", route: "/admin/settings" },
  { title: "Tickets", icon: "mdi-ticket", route: "/admin/tickets" },
  { title: "Produits", icon: "mdi-package-variant", route: "/admin/produits" },
  { title: "Clôture de caisse", icon: "mdi-cash-register", route: "/admin/cloture" },
  { title: "Clôture de caisse", icon: "mdi-cash-register", route: "/admin/Closures" },

];

const logout = () => {
  localStorage.removeItem("api_token");
  router.push({ name: "Login" });
};
</script>

<style scoped>
/* Ajoutez ici votre style personnalisé */
</style>
