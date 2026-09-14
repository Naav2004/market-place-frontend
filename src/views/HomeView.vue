<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.vue";

const products = ref([]);
const loading = ref(true);
const errorMessage = ref("");

async function fetchProducts() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/products");
    products.value = response.data.data;
  } catch (error) {
    errorMessage.value = "No se pudieron cargar los productos";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div>
    <div class="hero">
      <h1>Piezas hechas a mano,<br />con historia propia</h1>
      <p class="hero-subtitle">Descubre catálogos de creadores independientes</p>
    </div>

    <p v-if="loading" class="muted">Cargando productos...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="products.length === 0" class="muted">Todavía no hay productos.</p>

    <div v-else class="products-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 1rem 3.5rem;
}

.hero h1 {
  font-size: 2.8rem;
  max-width: 700px;
  margin: 0 auto 0.75rem;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.muted {
  color: var(--text-muted);
}

.error {
  color: #E24B4A;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}
</style>