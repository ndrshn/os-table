<template>
  <div class="container-fluid">
    <os-table :data="data" :columns="columns" border pagination sticky size="small" stripe :loading="loading"
      style="width: 100%">
      <template #header>
        <span color="info">test</span>
      </template>
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'id'">
          <span color="info">{{ record.id }}</span>
        </template>
        <template v-else>{{ record[column.key] }}</template>
      </template>
      <template #footer>
        <span>test</span>
      </template>
    </os-table>
  </div>
</template>

<script setup>
import { ref } from "vue";

const data = ref([]);
const loading = ref(false);
const columns = ref([]);

const getData = async () => {
  loading.value = true;
  await fetch("/api/products")
    .then((res) => res.json())
    .then((res) => {
      data.value = res.products;
    });
  const filters = await fetch("/api/products/categories")
    .then((res) => res.json())
    .then((res) => res);
  columns.value = [
    {
      title: "id",
      key: "id",
      align: "center",
      width: 30,
    },
    {
      title: "Title",
      key: "title",
    },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "Category",
      key: "category",
      meta: {
        filterType: "select",
        filters,
      },
      width: 120,
    },
    {
      title: "stock",
      key: "stock",
      align: "right",
    },
    {
      title: "Price",
      key: "price",
    },
  ];
  loading.value = false;
};

getData();
</script>

<style></style>
