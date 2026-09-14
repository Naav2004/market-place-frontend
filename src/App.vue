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
  <nav class="navbar">
    <RouterLink to="/" class="brand">Marketplace</RouterLink>

    <div class="nav-links">
      <template v-if="authStore.token">
        <RouterLink to="/dashboard">Mi panel</RouterLink>
        <button @click="handleLogout">Cerrar sesión</button>
      </template>

      <template v-else>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Registro</RouterLink>
      </template>
    </div>
  </nav>

  <main class="container">
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border);
}

.brand {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--text);
}

.brand:hover {
  text-decoration: none;
  color: var(--gold);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}
</style>