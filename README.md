# OsTable

Simple datatable library based on Vue 3 and AT-UI.

## Usage

First install the library with following code:

```bash
npm i os-table
```

Then:

```js
<template>
  <os-table :data="data" :columns="columns" />
<template>

<script setup>
import OsTable from 'os-table';
<script>
```

## Example Code

```js
<template>
  <div class="container-fluid">
    <os-table
      :data="data"
      :columns="columns"
      border
      pagination
      sticky
      size="small"
      stripe
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const data = ref([]);
const columns = [
  {
    title: "id",
    key: "id",
    align: "center",
    width: 50,
    sortType: "normal",
  },
  {
    title: "firstName",
    key: "firstName",
    icon: "user",
    sortType: "normal",
  },
  {
    title: "lastName",
    key: "lastName",
    icon: "user",
    sortType: "normal",
  },
  {
    title: "email",
    key: "email",
    icon: "mail",
    sortType: "normal",
  },
  {
    title: "company.name",
    key: "company.name",
    icon: "building",
  },
  {
    title: "address.coordinates",
    key: "address.coordinates",
    icon: "map-pin",
  },
];

const getData = async () => {
  loading.value = true;
  await fetch("/api/users")
    .then((res) => res.json())
    .then((res) => {
      data.value = res.users;
    });
  loading.value = false;
};

getData();
</script>
```

## Preview

![os-table](os-table.png)
