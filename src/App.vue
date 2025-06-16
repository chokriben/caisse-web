<script setup>
import { ref, onMounted } from "vue";
import Login from "./components/Login.vue";
import Caisse from "./components/Caisse.vue";

const isLoggedIn = ref(false);
onMounted(() => {
  // Vérifie s’il y a un token dans localStorage
  const token = localStorage.getItem("api_token");
  if (token) {
    isLoggedIn.value = true;
  }
});

function onLoginSuccess() {
  isLoggedIn.value = true;
}
</script>

<template>
  <main>
    <Login v-if="!isLoggedIn" @login-success="onLoginSuccess" />

    <router-view v-else />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
