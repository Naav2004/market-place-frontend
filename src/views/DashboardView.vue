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
    await api.post("/products", {
      name: productName.value,
      description: productDescription.value,
      price: Number(productPrice.value),
      stock: Number(productStock.value),
      catalogId: selectedCatalogId.value,
      categoryId: selectedCategoryId.value,
    });
    productName.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productStock.value = "";
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

    <section>
      <h2>Crear nuevo catálogo</h2>
      <form @submit.prevent="handleCreateCatalog">
        <div>
          <label for="catalogName">Nombre</label>
          <input id="catalogName" v-model="name" type="text" required />
        </div>
        <div>
          <label for="catalogDescription">Descripción</label>
          <input id="catalogDescription" v-model="description" type="text" />
        </div>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <button type="submit" :disabled="creating">
          {{ creating ? "Creando..." : "Crear catálogo" }}
        </button>
      </form>
    </section>

    <section>
  <h2>Mis catálogos</h2>
  <p v-if="loading">Cargando...</p>
  <p v-else-if="myCatalogs.length === 0">Todavía no tienes catálogos.</p>
  <ul v-else>
    <li v-for="catalog in myCatalogs" :key="catalog.id">
      <div v-if="editingCatalogId === catalog.id">
        <input v-model="editName" type="text" />
        <input v-model="editDescription" type="text" />
        <button @click="handleUpdateCatalog(catalog.id)">Guardar</button>
        <button @click="cancelEdit">Cancelar</button>
      </div>
      <div v-else>
        <RouterLink :to="`/catalogs/${catalog.id}`">{{ catalog.name }}</RouterLink>
        — {{ catalog.description }}
        <button @click="startEdit(catalog)">Editar</button>
        <button @click="handleDeleteCatalog(catalog.id)">Borrar</button>
      </div>
    </li>
  </ul>
</section>

    <section>
      <h2>Agregar producto</h2>

      <p v-if="myCatalogs.length === 0">
        Primero necesitas crear un catálogo antes de agregar productos.
      </p>

      <form v-else @submit.prevent="handleCreateProduct">
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
          <label for="productPrice">Precio</label>
          <input id="productPrice" v-model="productPrice" type="number" step="0.01" required />
        </div>

        <div>
          <label for="productStock">Stock</label>
          <input id="productStock" v-model="productStock" type="number" required />
        </div>

        <p v-if="productErrorMessage">{{ productErrorMessage }}</p>

        <button type="submit" :disabled="creatingProduct">
          {{ creatingProduct ? "Creando..." : "Crear producto" }}
        </button>
      </form>
    </section>
  </div>
</template>