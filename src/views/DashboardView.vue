<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios.js";
import { useAuthStore } from "../stores/auth.js";

const authStore = useAuthStore();

const editingCatalogId = ref(null);
const editName = ref("");
const editDescription = ref("");

const myCatalogs = ref([]);
const categories = ref([]);
const loading = ref(true);

const name = ref("");
const description = ref("");
const errorMessage = ref("");
const creating = ref(false);

const productName = ref("");
const productDescription = ref("");
const productPrice = ref("");
const productStock = ref("");
const selectedCatalogId = ref("");
const selectedCategoryId = ref("");
const productErrorMessage = ref("");
const creatingProduct = ref(false);

const productImageFile = ref(null);
const uploadingImage = ref(false);

function handleImageChange(event) {
  productImageFile.value = event.target.files[0];
}

async function fetchMyCatalogs() {
  loading.value = true;
  try {
    const response = await api.get("/catalogs");
    myCatalogs.value = response.data.filter(
      (catalog) => catalog.userId === authStore.user.userId
    );
  } finally {
    loading.value = false;
  }
}

async function fetchCategories() {
  const response = await api.get("/categories");
  categories.value = response.data;
}

async function handleCreateCatalog() {
  errorMessage.value = "";
  creating.value = true;

  try {
    await api.post("/catalogs", { name: name.value, description: description.value });
    name.value = "";
    description.value = "";
    await fetchMyCatalogs();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Error al crear el catálogo";
  } finally {
    creating.value = false;
  }
}

async function handleCreateProduct() {
  productErrorMessage.value = "";
  creatingProduct.value = true;

  try {
    let imageUrl = "";

    if (productImageFile.value) {
      uploadingImage.value = true;
      const formData = new FormData();
      formData.append("image", productImageFile.value);

      const uploadResponse = await api.post("/products/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageUrl = uploadResponse.data.imageUrl;
      uploadingImage.value = false;
    }

    await api.post("/products", {
      name: productName.value,
      description: productDescription.value,
      price: Number(productPrice.value),
      stock: Number(productStock.value),
      catalogId: selectedCatalogId.value,
      categoryId: selectedCategoryId.value,
      imageUrl,
    });

    productName.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productStock.value = "";
    productImageFile.value = null;
  } catch (error) {
    productErrorMessage.value = error.response?.data?.error || "Error al crear el producto";
  } finally {
    creatingProduct.value = false;
  }
}

function startEdit(catalog) {
  editingCatalogId.value = catalog.id;
  editName.value = catalog.name;
  editDescription.value = catalog.description || "";
}

function cancelEdit() {
  editingCatalogId.value = null;
}

async function handleUpdateCatalog(catalogId) {
  try {
    await api.put(`/catalogs/${catalogId}`, {
      name: editName.value,
      description: editDescription.value,
    });
    editingCatalogId.value = null;
    await fetchMyCatalogs();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Error al editar el catálogo";
  }
}

async function handleDeleteCatalog(catalogId) {
  if (!confirm("¿Seguro que quieres borrar este catálogo?")) return;

  try {
    await api.delete(`/catalogs/${catalogId}`);
    await fetchMyCatalogs();
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Error al borrar el catálogo";
  }
}

onMounted(() => {
  fetchMyCatalogs();
  fetchCategories();
});
</script>

<template>
  <div>
    <h1>Mi panel</h1>

    <section class="panel">
      <h2>Crear nuevo catálogo</h2>
      <form @submit.prevent="handleCreateCatalog" class="form-grid">
        <div>
          <label for="catalogName">Nombre</label>
          <input id="catalogName" v-model="name" type="text" required />
        </div>
        <div>
          <label for="catalogDescription">Descripción</label>
          <input id="catalogDescription" v-model="description" type="text" />
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button type="submit" :disabled="creating">
          {{ creating ? "Creando..." : "Crear catálogo" }}
        </button>
      </form>
    </section>

    <section class="panel">
      <h2>Mis catálogos</h2>
      <p v-if="loading" class="muted">Cargando...</p>
      <p v-else-if="myCatalogs.length === 0" class="muted">Todavía no tienes catálogos.</p>
      <ul v-else class="catalog-list">
        <li v-for="catalog in myCatalogs" :key="catalog.id">
          <div v-if="editingCatalogId === catalog.id" class="edit-row">
            <input v-model="editName" type="text" />
            <input v-model="editDescription" type="text" />
            <button @click="handleUpdateCatalog(catalog.id)">Guardar</button>
            <button class="ghost-btn" @click="cancelEdit">Cancelar</button>
          </div>
          <div v-else class="catalog-row">
            <div>
              <RouterLink :to="`/catalogs/${catalog.id}`">{{ catalog.name }}</RouterLink>
              <span class="muted"> — {{ catalog.description }}</span>
            </div>
            <div class="row-actions">
              <button class="ghost-btn" @click="startEdit(catalog)">Editar</button>
              <button class="ghost-btn danger" @click="handleDeleteCatalog(catalog.id)">Borrar</button>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <section class="panel">
      <h2>Agregar producto</h2>

      <p v-if="myCatalogs.length === 0" class="muted">
        Primero necesitas crear un catálogo antes de agregar productos.
      </p>

      <form v-else @submit.prevent="handleCreateProduct" class="form-grid">
        <div>
          <label for="productCatalog">Catálogo</label>
          <select id="productCatalog" v-model="selectedCatalogId" required>
            <option disabled value="">Selecciona un catálogo</option>
            <option v-for="catalog in myCatalogs" :key="catalog.id" :value="catalog.id">
              {{ catalog.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="productCategory">Categoría</label>
          <select id="productCategory" v-model="selectedCategoryId" required>
            <option disabled value="">Selecciona una categoría</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="productName">Nombre</label>
          <input id="productName" v-model="productName" type="text" required />
        </div>

        <div>
          <label for="productDescription">Descripción</label>
          <input id="productDescription" v-model="productDescription" type="text" />
        </div>

        <div>
          <label for="productImage">Foto del producto</label>
          <input id="productImage" type="file" accept="image/*" @change="handleImageChange" />
        </div>

        <div>
          <label for="productPrice">Precio</label>
          <input id="productPrice" v-model="productPrice" type="number" step="0.01" min="0.01" required />
        </div>

        <div>
          <label for="productStock">Stock</label>
          <input id="productStock" v-model="productStock" type="number" min="0" required />
        </div>

        <p v-if="productErrorMessage" class="error">{{ productErrorMessage }}</p>

        <button type="submit" :disabled="creatingProduct">
          {{ creatingProduct ? "Creando..." : "Crear producto" }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.panel {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  align-items: end;
}

.form-grid button {
  height: fit-content;
}

.muted {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.error {
  color: #E24B4A;
  font-size: 0.85rem;
  grid-column: 1 / -1;
}

.catalog-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.catalog-list li {
  border-top: 1px solid var(--border);
  padding: 0.9rem 0;
}

.catalog-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.row-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.edit-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.edit-row input {
  width: auto;
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