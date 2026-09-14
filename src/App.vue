<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth.js";

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<template>
  <nav>
    <RouterLink to="/">Inicio</RouterLink>

    <template v-if="authStore.token">
      <RouterLink to="/dashboard">Mi panel</RouterLink>
      <button @click="handleLogout">Cerrar sesión</button>
    </template>

    <template v-else>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Registro</RouterLink>
    </template>
  </nav>

  <main>
    <RouterView />
  </main>
</template>