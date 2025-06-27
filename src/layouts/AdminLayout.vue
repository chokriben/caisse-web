<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      fixed
      width="280"
      color="blue-grey darken-4"
      dark
    >
      <v-list dense nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.route"
          router
          link
          class="drawer-item"
          exact
        >
          <v-list-item-icon>
            <v-icon size="30">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1 font-weight-medium">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left class="gradient-app-bar" dark height="80">
      <v-toolbar-title class="text-h5 font-weight-bold">
        🛒 Caisse - {{ userRole }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="mr-6 text-right d-flex flex-column align-end">
        <span class="text-h6 font-weight-medium">{{ userName }}</span>
        <span class="caption">Rôle : {{ userRole }}</span>
      </div>

      <v-btn icon large color="red lighten-1" @click="logout">
        <v-icon size="36">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

 <v-footer
  app
  class="footer-bar gradient-footer d-flex align-center justify-center"
  dark
  height="60"
>

      <span class="white--text text-subtitle-2">
        &copy; 2025 - Mon Application Caisse
      </span>
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
  {
    title: "Clôture de caisse",
    icon: "mdi-cash-register",
    route: "/admin/cloture",
  },
  {
    title: "Liste des Clôtures ",
    icon: "mdi-clipboard-list",
    route: "/admin/Closures",
  },
];

const logout = () => {
  localStorage.removeItem("api_token");
  router.push({ name: "Login" });
};
</script>

<style scoped>
.drawer-item {
  padding-top: 12px;
  padding-bottom: 12px;
  transition: background-color 0.3s;
  border-radius: 8px;
}

.drawer-item.router-link-exact-active {
  background-color: #1e88e5 !important;
  color: white !important;
}

.v-list-item-title {
  font-size: 1.1rem;
}
.main-content {
  background-color: #f5f5f5;
  min-height: calc(100vh - 140px);
}

.footer-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.gradient-app-bar {
  background: linear-gradient(90deg, #4a148c, #880e4f); /* Violet -> Rose foncé */
}


</style>
