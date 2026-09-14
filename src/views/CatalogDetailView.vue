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
    <p v-if="loading" class="muted">Cargando...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div v-else-if="catalog">
      <div class="catalog-header">
        <h1>{{ catalog.name }}</h1>
        <p v-if="catalog.description" class="muted">{{ catalog.description }}</p>
      </div>

      <h2>Productos</h2>
      <p v-if="catalog.products.length === 0" class="muted">Este catálogo todavía no tiene productos.</p>

      <div v-else class="products-grid">
        <div v-for="product in catalog.products" :key="product.id" class="product-slot">
          <div v-if="editingProductId === product.id" class="edit-card">
            <input v-model="editName" type="text" placeholder="Nombre" />
            <input v-model="editPrice" type="number" step="0.01" min="0.01" placeholder="Precio" />
            <input v-model="editStock" type="number" min="0"  placeholder="Stock" />
            <select v-model="editCategoryId">
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <div class="edit-actions">
              <button @click="handleUpdateProduct(product.id)">Guardar</button>
              <button class="ghost-btn" @click="cancelEditProduct">Cancelar</button>
            </div>
          </div>

          <div v-else>
            <ProductCard :product="product" :show-catalog-link="false" />
            <div v-if="isOwner()" class="owner-actions">
              <button class="ghost-btn" @click="startEditProduct(product)">Editar</button>
              <button class="ghost-btn danger" @click="handleDeleteProduct(product.id)">Borrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
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
  gap: 1rem;
}

.owner-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.edit-card {
  background-color: var(--surface);
  border: 1px solid var(--gold);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.ghost-btn {
  background-color: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.ghost-btn:hover {
  color: var(--text);
  border-color: var(--text-muted);
  opacity: 1;
}

.ghost-btn.danger:hover {
  color: #E24B4A;
  border-color: #E24B4A;
}
</style>