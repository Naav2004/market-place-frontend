<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

async function handleSubmit() {
  errorMessage.value = "";
  loading.value = true;

  try {
    await authStore.login(email.value, password.value);
    router.push("/");
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Ocurrió un error al iniciar sesión";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Bienvenido de vuelta</h1>

      <form @submit.prevent="handleSubmit">
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
        </div>

        <div>
          <label for="password">Contraseña</label>
          <input id="password" v-model="password" type="password" required />
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? "Ingresando..." : "Ingresar" }}
        </button>
      </form>

      <p class="switch-link">
        ¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
}

.auth-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 380px;
}

.auth-card h1 {
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-card form > div {
  margin-bottom: 1.1rem;
}

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.error {
  color: #E24B4A;
  font-size: 0.85rem;
}

.switch-link {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 1.5rem;
}
</style>