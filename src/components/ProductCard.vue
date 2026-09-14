<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
  showCatalogLink: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="product-card">
    <div class="product-card__body">
      <h3>{{ product.name }}</h3>
      <p v-if="product.description" class="description">{{ product.description }}</p>

      <div class="meta">
        <span class="price">${{ product.price }}</span>
        <span class="stock">{{ product.stock }} en stock</span>
      </div>

      <span v-if="product.category" class="category-tag">{{ product.category.name }}</span>
    </div>

    <RouterLink v-if="showCatalogLink && product.catalogId" :to="`/catalogs/${product.catalogId}`" class="catalog-link">
      Ver catálogo →
    </RouterLink>
  </div>
</template>

<style scoped>
.product-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.product-card:hover {
  border-color: var(--gold);
  transform: translateY(-2px);
}

.product-card h3 {
  font-size: 1.15rem;
  margin: 0 0 0.4rem;
}

.description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.price {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--gold);
}

.stock {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.category-tag {
  display: inline-block;
  width: fit-content;
  background-color: var(--wine);
  color: var(--text);
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.catalog-link {
  font-size: 0.85rem;
  align-self: flex-start;
}
</style>