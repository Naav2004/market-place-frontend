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
    <h1>Explorar marketplace</h1>

    <p v-if="loading">Cargando productos...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="products.length === 0">Todavía no hay productos.</p>

    <div v-else class="products-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
</style>