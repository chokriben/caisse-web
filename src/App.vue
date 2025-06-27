<script setup>
import { ref, onMounted } from "vue";
import Login from "./components/Login.vue";
import { toast } from "vue3-toastify";

const isLoggedIn = ref(false);

onMounted(() => {
  const token = localStorage.getItem("api_token");
  if (token) {
    isLoggedIn.value = true;
  }
});

function onLoginSuccess() {
  isLoggedIn.value = true;
}

// Exemple fonction pour recevoir une notification
function receiveNotification(data) {
  toast.success(`${data?.title ?? "???"}\n${data.content}`, {
    icon: "🔔",
  });
}
</script>

<template>
  <main>
    <Login v-if="!isLoggedIn" @login-success="onLoginSuccess" />
    <router-view v-else />
  </main>
</template>

<style scoped>
/* Si tu veux customiser le style des toasts, tu peux utiliser ce sélecteur global */
.Toastify__toast-body {
  line-height: 0.9rem;
}
</style>
