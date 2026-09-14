import { defineStore } from "pinia";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios.js";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(token.value ? jwtDecode(token.value) : null);

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    token.value = response.data.token;
    localStorage.setItem("token", token.value);
    user.value = jwtDecode(token.value);
  }

  async function register(name, email, password, role) {
    await api.post("/auth/register", { name, email, password, role });
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  }

  return { token, user, login, register, logout };
});