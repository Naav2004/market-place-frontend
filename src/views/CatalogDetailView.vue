<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axios.js";
import { useAuthStore } from "../stores/auth.js";
import ProductCard from "../components/ProductCard.vue";

const route = useRoute();
const authStore = useAuthStore();

const catalog = ref(null);
const categories = ref([]);
const loading = ref(true);
const errorMessage = ref("");

const editingProductId = ref(null);
const editName = ref("");
const editPrice = ref("");
const editStock = ref("");
const editCategoryId = ref("");

async function fetchCatalog() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get(`/catalogs/${route.params.id}`);
    catalog.value = response.data;
  } catch (error) {
    errorMessage.value = "No se pudo cargar el catálogo";
  } finally {
    loading.value = false;
  }
}

async function fetchCategories() {
  const response = await api.get("/categories");
  categories.value = response.data;
}

function isOwner() {
  return authStore.user && catalog.value && catalog.value.userId === authStore.user.userId;
}

function startEditProduct(product) {
  editingProductId.value = product.id;
  editName.value = product.name;
  editPrice.value = product.price;
  editStock.value = product.stock;
  editCategoryId.value = product.categoryId;
}

function cancelEditProduct() {
  editingProductId.value = null;
}

async function handleUpdateProduct(productId) {
  try {
    await api.put(`/products/${productId}`, {
      name: editName.value,
      price: Number(editPrice.value),
      stock: Number(editStock.value),
      categoryId: editCategoryId.value,
    });
    editingProductId.value = null;
    await fetchCatalog();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Error al editar el producto";
  }
}

async function handleDeleteProduct(productId) {
  if (!confirm("¿Seguro que quieres borrar este producto?")) return;

  try {
    await api.delete(`/products/${productId}`);
    await fetchCatalog();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Error al borrar el producto";
  }
}

onMounted(() => {
  fetchCatalog();
  fetchCategories();
});
</script>

<template>
  <div>
    <p v-if="loading">Cargando...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <div v-else-if="catalog">
      <h1>{{ catalog.name }}</h1>
      <p v-if="catalog.description">{{ catalog.description }}</p>

      <h2>Productos</h2>
      <p v-if="catalog.products.length === 0">Este catálogo todavía no tiene productos.</p>

      <div v-else class="products-grid">
        <div v-for="product in catalog.products" :key="product.id">
          <div v-if="editingProductId === product.id">
            <input v-model="editName" type="text" />
            <input v-model="editPrice" type="number" step="0.01" />
            <input v-model="editStock" type="number" />
            <select v-model="editCategoryId">
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <button @click="handleUpdateProduct(product.id)">Guardar</button>
            <button @click="cancelEditProduct">Cancelar</button>
          </div>

          <div v-else>
            <ProductCard :product="product" />
            <template v-if="isOwner()">
              <button @click="startEditProduct(product)">Editar</button>
              <button @click="handleDeleteProduct(product.id)">Borrar</button>
            </template>
          </div>
        </div>
      </div>
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