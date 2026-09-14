<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <p v-if="product.description">{{ product.description }}</p>
    <p>${{ product.price }}</p>
    <p>Stock: {{ product.stock }}</p>
    <p v-if="product.category">Categoría: {{ product.category.name }}</p>
    <RouterLink v-if="product.catalogId" :to="`/catalogs/${product.catalogId}`">
      Ver catálogo
    </RouterLink>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
}
</style>