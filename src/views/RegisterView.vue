<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const authStore = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("buyer");
const errorMessage = ref("");
const loading = ref(false);

async function handleSubmit() {
  errorMessage.value = "";
  loading.value = true;

  try {
    await authStore.register(name.value, email.value, password.value, role.value);
    router.push("/login");
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Ocurrió un error al registrarse";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h1>Registro</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Nombre</label>
        <input id="name" v-model="name" type="text" required />
      </div>

      <div>
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required />
      </div>

      <div>
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" required />
      </div>

      <div>
        <label for="role">Tipo de cuenta</label>
        <select id="role" v-model="role">
          <option value="buyer">Comprador</option>
          <option value="vendor">Vendedor</option>
        </select>
      </div>

      <p v-if="errorMessage">{{ errorMessage }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? "Registrando..." : "Registrarse" }}
      </button>
    </form>
  </div>
</template>