<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/require-default-prop -->
<template>
  <div class="os-table" :class="{
    'os-table--fixHeight': props.height,
    'os-table--stripe': props.stripe,
    [`os-table--${props.size}`]: props.size,
    [`os-table--border`]: props.border,
  }" :style="tableStyles">
    <div v-if="slots.header" class="os-table-header">
      <os-row>
        <os-col :span="24">
          <slot name="header"></slot>
        </os-col>
      </os-row>
    </div>
    <!-- S Content -->
    <os-loader v-if="loading" />
    <div v-else class="os-table__content" :style="contentStyle">
      <!-- S Header -->
      <div v-if="props.height" class="os-table__header">
        <table>
          <colgroup>
            <col v-for="(column, index) in columnsData" :key="index" :width="setCellWidth(column)" />
          </colgroup>
          <thead ref="header" class="os-table__thead">
            <tr>
              <th v-if="props.optional" class="os-table__cell os-table__column-selection">
                <os-checkbox v-model:value="isSelectAll" @click="handleSelectAll" />
              </th>
              <th v-for="(column, index) in columnsData" :key="index" class="os-table__cell os-table__column"
                :class="column.className" :style="{
                  cursor: column.sortType ? 'pointer' : 'text',
                }" @click="column.sortType && handleSort(index)">
                {{ column.title }}
                <template v-if="column.sortType">
                  <div class="os-table__column-sorter" :class="{
                    'sort-asc': column._sortType === 'asc',
                    'sort-desc': column._sortType === 'desc',
                  }">
                    <span class="os-table__column-sorter-up" @click.stop="handleSort(index, 'asc')"><i
                        class="icon icon-chevron-up"></i></span>
                    <span class="os-table__column-sorter-down" @click.stop="handleSort(index, 'desc')"><i
                        class="icon icon-chevron-down"></i></span>
                  </div>
                </template>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <!-- E Header -->

      <!-- S Body -->
      <div class="os-table__body" :style="bodyStyle">
        <table>
          <colgroup>
            <col v-for="(column, index) in columnsData" :key="index" :width="setCellWidth(column)" />
          </colgroup>
          <thead v-if="!props.height" ref="header" class="os-table__thead" :style="{
            position: props.sticky ? 'sticky' : '',
            top: props.sticky ? `${props.sticky}px` : '',
          }">
            <tr>
              <!-- S Checkbox -->
              <th v-if="props.optional" class="os-table__cell os-table__column-selection">
                <os-checkbox v-model:value="isSelectAll" @click.prevent="handleSelectAll" />
              </th>
              <!-- E Checkbox -->
              <!-- S Column th -->
              <th v-for="(column, index) in columnsData" :key="index" class="os-table__cell os-table__column"
                :class="column.className" :style="{
                  cursor: column.sortType ? 'pointer' : 'text',
                  textAlign: column.align ? column.align : 'left',
                  width: column.width
                    ? `${column.width > 29 ? column.width : 30}px`
                    : 'auto',
                }" @click="column.sortType && handleSort(index)">
                <slot v-if="slots.headerCell != undefined" :key="column.key" :column="column" :text="column.title"
                  name="headerCell"></slot>

                <template v-else>
                  <i v-if="column.icon" :class="`ti ti-${column.icon}`" style="color: #6190e8; margin-right: 6px" />
                  <span>{{ column.title }}</span>
                  <div v-if="column.sortType" class="os-table__column-sorter" style="float: right" :class="{
                    'sort-asc': column._sortType === 'asc',
                    'sort-desc': column._sortType === 'desc',
                  }">
                    <span class="os-table__column-sorter-up" @click.stop="handleSort(index, 'asc')"><i
                        class="ti ti-chevron-up"></i></span>
                    <span class="os-table__column-sorter-down" @click.stop="handleSort(index, 'desc')"><i
                        class="ti ti-chevron-down"></i></span>
                  </div>
                </template>
              </th>
              <!-- E Column th -->
            </tr>
            <tr>
              <td v-if="props.optional"></td>
              <td v-for="(column, index) in columnsData" :key="index" class="os-table__cell os-table__filters"
                :class="column.className">
                <template v-if="column.key.split('.').length < 2">
                  <os-input v-model:value="searchInputs[column.key]" :data-key="column.key" :placeholder="column.title"
                  size="small" @search="onSearch" />
                <!--os-select
                    v-if="
                      column
                        ? column.filterType === 'select'
                          ? true
                          : false
                        : false
                    "
                    v-model:value="searchInputs[column.key]"
                    style="width: 100%"
                    @on-change="(value) => onSelectChange(column.key, value)"
                  >
                    <os-option
                      v-for="(opt, _index) in column.filters"
                      :key="_index"
                      :label="opt"
                      :value="opt"
                                                            />
                                                          </os-select-->
                </template>
              </td>
            </tr>
          </thead>

          <tbody v-if="sortData.length" ref="body" class="os-table__tbody">
            <template v-for="(item, index) in sortData" :key="index">
              <tr>
                <td v-if="props.optional" class="os-table__cell os-table__column-selection">
                  <os-checkbox v-model:value="objData[props.rowKey || index].isChecked" @on-change="changeRowSelection" />
                </td>
                <td v-for="(column, index2) in columns" :key="index2" class="os-table__cell" :style="{
                  textAlign: column.align ? column.align : 'left',
                  width: column.width ? `${column.width}px` : 'auto',
                }">
                  <template v-if="column.render">
                    <Cell :item="item" :column="column" :index="index2" :render="column.render" />
                  </template>
                  <template v-else>
                    <slot v-if="slots.bodyCell" :record="item" :column="column" name="bodyCell">
                    </slot>

                    <template v-else>{{ getProp(item, column.key) }}</template>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>

          <tbody v-else class="os-table__tbody">
            <tr>
              <td v-if="props.optional"></td>
              <td v-for="(column, index) in columnsData" :key="index" class="os-table__cell os-table__filters"
                :class="column.className">
                <os-input v-if="column ? column.filter : true" v-model:value="searchInputs[column.key]"
                  :placeholder="column.title" :data-key="column.key" @search="onSearch" />
              </td>
            </tr>
            <tr>
              <td class="os-table__cell os-table__cell--nodata"
                :colspan="props.optional ? columns.length + 1 : columns.length">
                <slot name="emptyText">Kayıt yok.</slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- E Body -->
    </div>
    <!-- E Content -->
    <!-- S Pagination -->
    <div ref="footer" class="os-table__footer">
      <os-row :gutter="[12, 12]" style="width: 100%">
        <os-col :span="24" style="display: flex; justify-content: center">
          <os-pagination v-if="props.pagination" :current="currentPage" :size="props.size" circle :total="allData.length"
            :page-size="props.pageSize" :show-total="props.showPageTotal" :show-sizer="props.showPageSizer"
            :show-quickjump="props.showPageQuickjump" style="width: fit-content" @page-change="pageChange"
            @pagesize-change="pageSizeChange" />
        </os-col>
        <os-col v-if="slots.footer" :span="24">
          <slot name="footer"></slot>
        </os-col>
      </os-row>
    </div>
    <!-- E Pagination -->
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  nextTick,
  onBeforeUnmount,
  onMounted,
  useSlots,
} from "vue";
import { deepCopy, camelCase } from "../tools";
import Cell from "./render";
import OsCheckbox from "./OsCheckbox.vue";
import OsPagination from "./OsPagination.vue";
import OsInput from "./OsInput.vue";
import OsLoader from "./OsLoader.vue";
import OsCol from "./OsCol.vue";

const emit = defineEmits([
  "on-select-all",
  "on-selection-change",
  "on-sort-change",
  "on-page-size-change",
  "on-page-change",
  "update:selectedKeys",
]);
const slots = useSlots();
const props = defineProps({
  size: {
    type: String,
    default: "normal",
  },
  stripe: {
    type: Boolean,
    default: false,
  },
  sticky: {
    type: Number,
    default: 0
  },
  border: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default() {
      return [];
    },
  },
  columns: {
    type: Array,
    default() {
      return [];
    },
  },
  rowKey: {
    type: String,
    default: "id",
  },
  optional: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Boolean,
    default: false,
  },
  pageSize: {
    type: Number,
    default: 100,
  },
  showPageTotal: {
    type: Boolean,
    default: false,
  },
  showPageSizer: {
    type: Boolean,
    default: false,
  },
  showPageQuickjump: {
    type: Boolean,
    default: false,
  },
  height: {
    type: [Number, String],
  },
  selectedKeys: {
    type: Array,
    default: () => [],
  },
});

const sortData = ref([]);
const allData = ref([]);
const total = ref(0);
const bodyHeight = ref(0);
const pageCurSize = ref(props.pageSize);
const columnsWidth = ref({});
const currentPage = ref(1);
const header = ref();
const body = ref();
const footer = ref();
const loading = ref(props.loading);
const filteredData = ref(props.data);

const searchInputs = ref([]);

const getStyle = (element, styleName) => {
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === "float") {
    styleName = "cssFloat";
  }

  try {
    const computed = document.defaultView.getComputedStyle(element, "");
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

const objData = computed(() => {
  const rowData = {};
  filteredData.value.forEach((row, index) => {
    const newRow = deepCopy(row);
    newRow.isChecked = !!newRow.isChecked;
    rowData[props.rowKey || index] = newRow;
  });
  return rowData;
});

const columnsData = computed(() => {
  const columns = deepCopy(props.columns);
  columns.forEach((column, idx) => {
    column._index = idx;
    column._sortType = "normal";
    if (column.sortType) {
      column._sortType = column.sortType;
    }
  });
  return columns;
});

const tableStyles = computed(() => {
  const styles = {};
  if (props.height) {
    styles.height = `${props.height}px`;
  }
  if (props.width) {
    styles.width = `${props.width}px`;
  }
  return styles;
});

const isSelectAll = computed(() => {
  let isAll = true;
  if (!sortData.value.length) {
    isAll = false;
  }
  for (let i = 0, len = sortData.value.length; i < len; i++) {
    if (!objData.value[sortData.value[i].index].isChecked) {
      isAll = false;
      break;
    }
  }
  return isAll;
});

const bodyStyle = computed(() => {
  const styles = {};
  if (bodyHeight.value !== 0) {
    const headerHeight = parseInt(getStyle(header.value, "height")) || 0;
    styles.height = `${bodyHeight.value}px`;
    styles.marginTop = `${headerHeight}px`;
  }
  return styles;
});

const contentStyle = computed(() => {
  const styles = {};
  if (bodyHeight.value !== 0) {
    const headerHeight = parseInt(getStyle(header.value, "height")) || 0;
    styles.height = `${bodyHeight.value + headerHeight}px`;
  }
  return styles;
});

const makeData = () => {
  const _data = deepCopy(filteredData.value);
  _data.forEach((row, idx) => {
    row.index = idx;
  });
  return _data;
};

const calculateBodyHeight = () => {
  if (props.height) {
    nextTick(() => {
      const headerHeight = parseInt(getStyle(header.value, "height")) || 0;
      const footerHeight = parseInt(getStyle(footer.value, "height")) || 0;
      bodyHeight.value = props.height - headerHeight - footerHeight;
    });
  } else {
    bodyHeight.value = 0;
  }
};

const makeDataWithSort = () => {
  let _data = makeData();
  let sortType = "normal";
  let sortIndex = -1;
  for (let i = 0, len = columnsData.value.length; i < len; i++) {
    if (columnsData.value[i].sortType && columnsData.value[i].sortType !== "normal") {
      sortType = columnsData.value[i].sortType;
      sortIndex = i;
      break;
    }
  }
  if (sortType !== "normal") {
    _data = sort(_data, sortType, sortIndex);
  }
  return _data;
};

const makeDataWithSortAndPage = (pageNum) => {
  let _data = [];
  allData.value = makeDataWithSort();

  _data = makeDataWithPaginate(pageNum);
  return _data;
};

const makeDataWithPaginate = (page) => {
  page = page || 1;
  const pageStart = (page - 1) * pageCurSize.value;
  const pageEnd = pageStart + pageCurSize.value;
  let pageData = [];

  if (props.pagination) {
    pageData = allData.value.slice(pageStart, pageEnd);
  } else {
    pageData = allData.value;
  }
  return pageData;
};

const handleSelectAll = () => {
  const status = !isSelectAll.value;
  for (const _data of sortData.value) {
    objData.value[_data.index].isChecked = status;
  }
  const selection = getSelection();
  status && emit("on-select-all", selection);
  emit("on-selection-change", selection);
};

const handleSort = (index, type) => {
  const key = columnsData.value[index].key;
  const sortType = columnsData.value[index]._sortType;
  const sortNameArr = ["normal", "desc", "asc"];

  if (columnsData.value[index].sortType) {
    if (!type) {
      const tmpIdx = sortNameArr.indexOf(sortType);
      if (tmpIdx >= 0) {
        type = sortNameArr[tmpIdx + 1 > 2 ? 0 : tmpIdx + 1];
      }
    }
    if (type === "normal") {
      sortData.value = makeDataWithSortAndPage(currentPage.value);
    } else {
      sortData.value = sort(sortData.value, type, index);
    }
  }
  columnsData.value[index]._sortType = type;

  emit("on-sort-change", {
    column: JSON.parse(JSON.stringify(props.columns[columnsData.value[index]._index])),
    order: type,
    key,
  });
};

const sort = (data, type, index) => {
  const key = columnsData.value[index].key;
  data.sort((a, b) => {
    if (columnsData.value[index].sortMethod) {
      return columnsData.value[index].sortMethod(a[key], b[key], type);
    } else if (type === "asc") {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
  return data;
};

const getSelection = () => {
  const selectionIndexArray = [];
  for (const i in objData.value) {
    if (objData.value[i].isChecked) {
      selectionIndexArray.push(i | 0);
    }
  }
  return JSON.parse(
    JSON.stringify(
      filteredData.value.filter((data, index) => selectionIndexArray.indexOf(index) > -1)
    )
  );
};

const changeRowSelection = () => {
  const selection = getSelection();
  const selectionIndexArray = [];
  for (const i in objData.value) {
    if (objData.value[i].isChecked) {
      selectionIndexArray.push(i | 0);
    }
  }
  emit("on-selection-change", selection);
  emit("update:selectedKeys", selection);
};
const pageChange = (page) => {
  emit("on-page-change", page);
  currentPage.value = page;
  sortData.value = makeDataWithPaginate(page);
};
const pageSizeChange = (size) => {
  emit("on-page-size-change", size);
  pageCurSize.value = size;
};

const handleResize = () => {
  nextTick(() => {
    const _columnsWidth = {};
    if (filteredData.value.length) {
      const $td = body.value.querySelectorAll("tr")[0].querySelectorAll("td");
      for (let i = 0; i < $td.length; i++) {
        const column = columnsData.value[i];
        let width = parseInt(getStyle($td[i], "width"));

        if (column) {
          if (column.width) {
            width = column.width;
          }
          _columnsWidth[column._index] = { width };
        }
      }
    }
    columnsWidth.value = _columnsWidth;
  });
};

const setCellWidth = (column) => {
  let width = "";
  if (column.width) {
    width = column.width;
  } else if (columnsWidth.value[column._index]) {
    width = columnsWidth.value[column._index].width;
  }
  width = width === "0" ? "" : width;
  return width;
};

const onSearch = (value, event) => {
  filteredData.value = props.data.filter((el) =>
    el[event.target.parentElement.dataset.key]
      .toString()
      .toLowerCase()
      .includes(String(value).toLowerCase())
  );
};

const getProp = (obj, prop) => {
  const parts = prop.split(".");
  if (parts && parts.length > 0) {
    while (parts.length > 1) {
      obj = obj[parts.shift()];
    }
    return obj[parts.shift()];
  } else {
    return obj[prop];
  }
};

sortData.value = makeDataWithSortAndPage();

onMounted(() => {
  calculateBodyHeight();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

watch(
  () => props.height,
  () => {
    calculateBodyHeight();
  }
);

watch(
  () => props.loading,
  (newValue) => {
    loading.value = newValue;
  }
);

watch(allData, () => {
  total.value = allData.value.length;
});
</script>
<style>
.os-table {
  position: relative;
  color: #3f536e;
  font-size: 13px;
  font-family: "Inter", sans-serif;
}

.os-table table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
  overflow: hidden;
}

.os-table table th,
.os-table table td {
  height: 40px;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: middle;
  border-bottom: 1px solid #cedeea;
}

.os-table table th.os-table__cell--nodata,
.os-table table td.os-table__cell--nodata {
  text-align: center;
}

.os-table__cell {
  padding: 0 12px;
  border-bottom: 1px solid #cedeea;
}

.os-table__content {
  border: 1px solid #cedeea;
  border-bottom-width: 0;
}

.os-table__thead>tr>th {
  font-weight: 500;
  text-align: left;
  background-color: #f9fafc;
  white-space: nowrap;
}

.os-table__thead .os-table__column-sorter {
  display: inline-block;
  vertical-align: middle;
  height: 18px;
  width: 12px;
}

.os-table__thead .os-table__column-sorter-up,
.os-table__thead .os-table__column-sorter-down {
  display: block;
  color: #5a6b82;
  font-size: 12px;
  line-height: 1;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
}

.os-table__thead .os-table__column-sorter-up:hover,
.os-table__thead .os-table__column-sorter-down:hover,
.os-table__thead .os-table__column-sorter.sort-desc .os-table__column-sorter-down,
.os-table__thead .os-table__column-sorter.sort-asc .os-table__column-sorter-up {
  color: #6190e8;
}

.os-table__tbody {
  background-color: #fff;
}

/*
.os-table__tbody > tr {
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
}
*/

.os-table__tbody>tr:hover {
  background-color: #ecf5ff;
}

.os-table__footer {
  position: relative;
  margin: 16px 0;
  height: 28px;
}

.os-table--fixHeight .os-table__content {
  border-bottom-width: 1px;
}

.os-table--fixHeight .os-table__header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.os-table--fixHeight .os-table__header table {
  border: 1px solid #cedeea;
  border-bottom: none;
}

.os-table--fixHeight .os-table__body {
  overflow: scroll;
}

.os-table--fixHeight .os-table__tbody>tr:last-child td {
  border-bottom: none;
}

.os-table--stripe .os-table__tbody>tr:nth-child(2n) {
  background-color: #fff;
}

.os-table--stripe .os-table__tbody>tr:hover {
  background-color: #f6fafe;
}

.os-table--border .os-table__content {
  border-right: none;
}

.os-table--border .os-table__thead th,
.os-table--border .os-table__thead td,
.os-table--border .os-table__tbody th,
.os-table--border .os-table__tbody td {
  border-right: 1px solid #cedeea;
}

.os-table--large {
  font-size: 13px;
}

.os-table--large table th,
.os-table--large table td {
  height: 56px;
}

.os-table--small {
  font-size: 12px;
}

.os-table--small table th,
.os-table--small table td {
  height: 32px;
}

.os-table--small .os-table__thead .os-table__column-sorter {
  width: 7px;
  height: 14px;
}

.os-table--small .os-table__thead .os-table__column-sorter-up,
.os-table--small .os-table__thead .os-table__column-sorter-down {
  font-size: 7px;
}

.os-table__filters {
  padding: 6px;
  background-color: #f9fafc;
}

.filters-row {
  height: 0px !important;
  transition: all 1s;
  width: 100%;
}

.filters-row.show {
  height: 32px;
}

.os-table-header {
  border: 1px solid #cedeea;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  height: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: #fff;
  padding: 12px;
}

.os-table__footer {
  border-radius: 0 0 4px 4px;
  border: 1px solid #cedeea;
  background-color: #fff;
  border-top: none;
  height: auto;
  display: flex;
  margin: 0 !important;
  padding: 12px;
}
</style >
