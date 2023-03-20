<template>
  <ul
    class="os-menu"
    :class="[
      props.theme ? `os-menu--${props.theme}` : '',
      props.mode ? `os-menu--${props.mode}` : '',
    ]"
    :style="ulStyle"
  >
    <slot></slot>
  </ul>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  mode: {
    type: String,
    default: "inline",
    validator: (val) => ["inline", "horizontal", "vertical"].indexOf(val) > -1,
  },
  theme: {
    type: String,
    default: "light",
    validator: (val) => ["light", "dark"].indexOf(val) > -1,
  },
  activeKey: [String, Number],
  inlineCollapsed: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "240px",
  },
  router: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["on-select"]);

const router = useRouter();
const currentActiveKey = ref(props.activeKey);

const ulStyle = computed(() => {
  const style = {};
  if (props.mode === "inline" || props.mode === "vertical") {
    style.width = props.width;
  }
  return style;
});

const updateactiveKey = () => {
  if (typeof currentActiveKey.value === "undefined") {
    currentActiveKey.value = -1;
  }
  /*
  const submenus = findComponentsDownward(this, 'AtSubmenu')
  if (submenus && submenus.length) {
    submenus.forEach(submenu => {
      submenu.$emit('on-update-active', false)
    })
  }
  */
};

const routeToMenuItem = (item) => {
  const route = item.to || {};
  item.replace ? router.replace(route) : router.push(route);
};

const menuItemSelect = (item) => {
  currentActiveKey.value = item.name;
  emit("on-select", item.name);
  if (router) {
    routeToMenuItem(item);
  }
};

watch(
  () => props.activeKey,
  (val) => {
    currentActiveKey.value = val;
  }
);

watch(currentActiveKey, () => {
  updateactiveKey();
});

onMounted(() => {
  updateactiveKey();
});

defineExpose({ menuItemSelect, activeKey: props.activeKey });
</script>

<style>
.os-menu {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  color: #3f536e;
  font-size: 13px;
  list-style: none;
  background-color: #fff;
}

.os-menu__item {
  position: relative;
  display: block;
  list-style: none;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
  cursor: pointer;
  z-index: 1;
}

.os-menu__item a {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #3f536e;
}

.os-menu__item i {
  margin-right: 8px;
}

.os-menu__item .os-menu__item-link {
  padding: 12px 16px;
  width: 100%;
}

.os-menu__item--disabled {
  cursor: not-allowed;
}

.os-menu__item--disabled .os-menu__item-link {
  color: #c9c9c9;
  cursor: not-allowed;
  pointer-events: none;
}

.os-menu__item--disabled .os-menu__item-link:after {
  display: none;
}

.os-menu__item-group {
  padding: 0;
  line-height: 1;
}

.os-menu__item-group-title {
  display: inline-block;
  max-width: 100%;
  text-overflow: ellipsis;
  word-wrap: normal;
  width: 100%;
  padding: 12px;
  color: #bfbfbf;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  cursor: initial;
}

.os-menu__item-group-list {
  padding: 0;
}

.os-menu__submenu--disabled {
  color: #c9c9c9;
  cursor: not-allowed;
}

.os-menu__submenu-title {
  position: relative;
  cursor: pointer;
}

.os-menu__submenu-title i {
  margin-right: 8px;
}

.os-menu .os-dropdown__popover {
  width: 100%;
}

.os-menu .os-dropdown-menu {
  max-height: none;
}

.os-menu .os-dropdown-menu .os-menu__item {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  display: block;
  font-size: 12px;
  line-height: 1.5;
  white-space: nowrap;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  cursor: pointer;
}

.os-menu .os-dropdown-menu .os-menu__item--disabled {
  cursor: not-allowed;
}

.os-menu--horizontal,
.os-menu--vertical,
.os-menu--inline {
  z-index: auto;
}

.os-menu--horizontal .os-menu__item-group-list .os-menu__item,
.os-menu--vertical .os-menu__item-group-list .os-menu__item {
  float: none;
}

.os-menu--horizontal
  .os-menu__item-group-list
  .os-menu__item.os-menu__item--active
  .os-menu__item-link,
.os-menu--horizontal
  .os-menu__item-group-list
  .os-menu__item
  .os-menu__item-link.router-link-active,
.os-menu--vertical
  .os-menu__item-group-list
  .os-menu__item.os-menu__item--active
  .os-menu__item-link,
.os-menu--vertical
  .os-menu__item-group-list
  .os-menu__item
  .os-menu__item-link.router-link-active {
  color: #6190e8;
  font-weight: 700;
}

.os-menu--horizontal
  .os-menu__item-group-list
  .os-menu__item.os-menu__item--active
  .os-menu__item-link:after,
.os-menu--horizontal
  .os-menu__item-group-list
  .os-menu__item
  .os-menu__item-link.router-link-active:after,
.os-menu--vertical
  .os-menu__item-group-list
  .os-menu__item.os-menu__item--active
  .os-menu__item-link:after,
.os-menu--vertical
  .os-menu__item-group-list
  .os-menu__item
  .os-menu__item-link.router-link-active:after {
  display: none;
}

.os-menu--horizontal {
  position: relative;
  height: 39px;
  line-height: 39px;
  //border-bottom: 1px solid #e2ecf4;
  border: none;
}

.os-menu--horizontal .os-menu__item,
.os-menu--horizontal .os-menu__submenu {
  position: relative;
  float: left;
}

.os-menu--horizontal .os-menu__item.os-menu__item--active .os-menu__item-link,
.os-menu--horizontal .os-menu__item.os-menu__item--active .os-menu__item-link a {
  color: #6190e8;
}

.os-menu--horizontal .os-menu__item.os-menu__item--active .os-menu__item-link:after {
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}

.os-menu--horizontal .os-menu__item--disabled .os-menu__item-link,
.os-menu--horizontal .os-menu__item--disabled .os-menu__item-link:hover {
  color: #c9c9c9;
}

.os-menu--horizontal .os-menu__item-link {
  display: inline-block;
  padding: 0 16px;
}

.os-menu--horizontal .os-menu__item-link:after {
  content: "";
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 2px;
  left: 0;
  bottom: 0;
  background-color: #6190e8;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transition: all 0.15s;
  transition: all 0.15s;
}

.os-menu--horizontal .os-menu__item-link:hover,
.os-menu--horizontal .os-menu__item-link.router-link-active {
  color: #6190e8;
}

.os-menu--horizontal .os-menu__item-link:hover:after,
.os-menu--horizontal .os-menu__item-link.router-link-active:after {
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}

.os-menu--horizontal > .os-menu__submenu:hover > .os-menu__submenu-title,
.os-menu--horizontal
  > .os-menu__submenu.os-menu__submenu--active
  > .os-menu__submenu-title {
  color: #6190e8;
}

.os-menu--horizontal > .os-menu__submenu:hover:after,
.os-menu--horizontal > .os-menu__submenu.os-menu__submenu--active:after {
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}

.os-menu--horizontal .os-menu__submenu:after {
  content: "";
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 2px;
  left: 0;
  bottom: 0;
  background-color: #6190e8;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transition: all 0.15s;
  transition: all 0.15s;
}

.os-menu--horizontal .os-menu__submenu .os-menu__submenu-title {
  padding: 0 16px;
}

.os-menu--horizontal .os-menu__submenu .os-menu__item {
  display: block;
  float: none;
}

.os-menu--horizontal .os-menu__submenu .os-menu__item .os-menu__item-link {
  padding: 12px 16px;
}

.os-menu--horizontal .os-menu__submenu .os-menu__item .os-menu__item-link:after {
  display: none;
}

.os-menu--horizontal .os-menu__submenu .os-menu__submenu {
  display: block;
  float: none;
  height: inherit;
  font-size: 12px;
  line-height: 1.5;
}

.os-menu--horizontal .os-menu__submenu .os-menu__submenu .os-menu__submenu-title {
  padding: 12px 16px;
}

.os-menu--horizontal
  .os-menu__submenu
  .os-menu__submenu
  .os-menu__submenu-title
  i:last-child {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -6px;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

.os-menu--horizontal .os-menu__submenu .os-menu__submenu.os-menu__submenu--active:after {
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
}

.os-menu--horizontal .os-menu__submenu:hover > .os-menu__submenu-title,
.os-menu--horizontal
  .os-menu__submenu.os-menu__submenu--active
  > .os-menu__submenu-title {
  color: #6190e8;
}

.os-menu--horizontal .os-menu__submenu--disabled:hover .os-menu__submenu-title,
.os-menu--horizontal
  .os-menu__submenu--disabled.os-menu__submenu--active
  .os-menu__submenu-title {
  color: #c9c9c9;
  cursor: not-allowed;
}

.os-menu--horizontal .os-menu__submenu--disabled:hover:after,
.os-menu--horizontal .os-menu__submenu--disabled.os-menu__submenu--active:after {
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
}

.os-menu--vertical {
  position: relative;
  border-right: 1px solid #e2ecf4;
}

.os-menu--vertical .os-menu__item,
.os-menu--vertical .os-menu__submenu {
  position: relative;
  display: block;
}

.os-menu--vertical > .os-menu__item.os-menu__item--active > .os-menu__item-link {
  background-color: #ecf2fc33;
}

.os-menu--vertical > .os-menu__item.os-menu__item--active > .os-menu__item-link:after {
  opacity: 1;
}

.os-menu--vertical > .os-menu__submenu:hover:after {
  opacity: 1;
}

.os-menu--vertical > .os-menu__submenu:hover > .os-menu__submenu-title {
  color: #6190e8;
}

.os-menu--vertical > .os-menu__submenu.os-menu__submenu--active {
  background-color: #ecf2fc33;
}

.os-menu--vertical > .os-menu__submenu.os-menu__submenu--active:after {
  opacity: 1;
}

.os-menu--vertical > .os-menu__item > .os-menu__item-link:hover {
  color: #6190e8;
}

.os-menu--vertical > .os-menu__item > .os-menu__item-link:hover:after {
  opacity: 1;
}

.os-menu--vertical .os-menu__item.os-menu__item--active .os-menu__item-link,
.os-menu--vertical .os-menu__item.os-menu__item--active .os-menu__item-link a {
  color: #6190e8;
}

.os-menu--vertical .os-menu__item--disabled:hover,
.os-menu--vertical .os-menu__item--disabled:hover a {
  color: #c9c9c9;
}

.os-menu--vertical .os-menu__item--disabled .os-menu__item-link.router-link-active,
.os-menu--vertical .os-menu__item--disabled .os-menu__item-link.router-link-active:hover {
  color: #6190e8;
}

.os-menu--vertical .os-menu__item-link {
  padding: 12px 16px 12px 32px;
}

.os-menu--vertical .os-menu__item-link:after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background-color: #6190e8;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  -webkit-box-shadow: 1px 0 12px 0 #6190e8;
  box-shadow: 1px 0 12px #6190e8;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
  opacity: 0;
}

.os-menu--vertical .os-menu__item-link:hover {
  color: #6190e8;
}

.os-menu--vertical .os-menu__item-link.router-link-active {
  color: #6190e8;
  background-color: #ecf2fc33;
}

.os-menu--vertical .os-menu__item-link.router-link-active:after {
  opacity: 1;
}

.os-menu--vertical .os-menu__submenu {
  font-size: 13px;
}

.os-menu--vertical .os-menu__submenu:after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background-color: #6190e8;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  -webkit-box-shadow: 1px 0 12px 0 #6190e8;
  box-shadow: 1px 0 12px #6190e8;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
  opacity: 0;
}

.os-menu--vertical .os-menu__submenu .os-menu__submenu-title {
  padding: 12px 16px 12px 32px;
}

.os-menu--vertical .os-menu__submenu .os-menu__submenu-title i:last-child {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -7px;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

.os-menu--vertical .os-menu__submenu .os-menu__submenu {
  font-size: 12px;
}

.os-menu--vertical .os-menu__submenu .os-menu__submenu .os-menu__submenu-title,
.os-menu--vertical .os-menu__submenu .os-menu__item-link {
  padding-left: 24px;
}

.os-menu--vertical .os-menu__submenu:hover > .os-menu__submenu-title,
.os-menu--vertical .os-menu__submenu.os-menu__submenu--active > .os-menu__submenu-title {
  color: #6190e8;
}

.os-menu--vertical
  .os-menu__submenu.os-menu__submenu--disabled:hover
  > .os-menu__submenu-title,
.os-menu--vertical
  .os-menu__submenu.os-menu__submenu--disabled.os-menu__submenu--active
  > .os-menu__submenu-title {
  color: #c9c9c9;
  cursor: not-allowed;
}

.os-menu--vertical .os-menu__item-group-title {
  padding-left: 16px;
  font-weight: 700;
}

.os-menu--inline {
  position: relative;
  border-right: 1px solid #e2ecf4;
}

.os-menu--inline .os-menu__item,
.os-menu--inline .os-menu__submenu {
  position: relative;
  display: block;
  padding-left: 0;
  -webkit-transition: all 0.3s, color 0s;
  transition: all 0.3s, color 0s;
}

.os-menu--inline .os-menu__item:hover {
  color: #6190e8;
}

.os-menu--inline .os-menu__item:hover > .os-menu__item-link {
  color: #6190e8;
}

.os-menu--inline .os-menu__item.os-menu__item--active .os-menu__item-link {
  color: #6190e8;
  background-color: #ecf2fc33;
}

.os-menu--inline .os-menu__item.os-menu__item--active .os-menu__item-link:after {
  opacity: 1;
}

.os-menu--inline .os-menu__item--disabled.os-menu__item--active .os-menu__item-link {
  color: #c9c9c9;
  background-color: transparent;
}

.os-menu--inline
  .os-menu__item--disabled.os-menu__item--active
  .os-menu__item-link:after {
  opacity: 0;
}

.os-menu--inline .os-menu__submenu {
  font-size: 13px;
}

.os-menu--inline .os-menu__submenu.os-menu__submenu--active > .os-menu__submenu-title {
  color: #6190e8;
}

.os-menu--inline
  .os-menu__submenu.os-menu__submenu--disabled:hover
  > .os-menu__submenu-title,
.os-menu--inline
  .os-menu__submenu.os-menu__submenu--disabled.os-menu__submenu--active
  > .os-menu__submenu-title {
  color: #c9c9c9;
  cursor: not-allowed;
}

.os-menu--inline .os-menu__submenu.os-menu__submenu--opened .os-menu__submenu-title {
  font-weight: 700;
}

.os-menu--inline .os-menu__submenu.os-menu__submenu--opened .os-menu__submenu-icon {
  -webkit-transform: rotate(-180deg);
  transform: rotate(-180deg);
}

.os-menu--inline .os-menu__submenu > .os-menu__submenu-title:hover {
  color: #6190e8;
}

.os-menu--inline .os-menu__submenu .os-menu__submenu-title {
  padding: 12px 16px 12px 32px;
}

.os-menu--inline .os-menu__submenu .os-menu__submenu-title i:last-child {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -7px;
}

.os-menu--inline .os-menu__submenu .os-menu__submenu-icon {
  color: #c5d9e8;
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
}

.os-menu--inline .os-menu__submenu .os-menu__submenu {
  font-size: 13px;
}

.os-menu--inline .os-menu__submenu .os-menu__item-link {
  padding-left: 48px;
}

.os-menu--inline .os-menu__item-link {
  padding: 12px 16px 12px 32px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.os-menu--inline .os-menu__item-link:after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background-color: #6190e8;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  -webkit-box-shadow: 1px 0 12px 0 #6190e8;
  box-shadow: 1px 0 12px #6190e8;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
  opacity: 0;
}

.os-menu--inline .os-menu__item-link.router-link-active {
  color: #6190e8;
  background-color: #ecf2fc33;
}

.os-menu--inline .os-menu__item-link.router-link-active:after {
  opacity: 1;
}

.os-menu--inline .os-menu {
  margin: 8px 0;
}

.os-menu--inline .os-menu__item-group-title {
  padding-left: 40px;
  font-weight: 700;
}

.os-menu--dark,
.os-menu--dark .os-menu {
  color: #dfdfdf;
  background-color: #2c405a;
}

.os-menu--dark .os-menu__item a {
  color: #dfdfdf;
}

.os-menu--dark .os-menu__item .os-menu__item-link:after {
  width: 4px;
  border-radius: 0;
  background-color: #6190e8;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.os-menu--dark .os-menu__item:hover .os-menu__item-link,
.os-menu--dark .os-menu__item.os-menu__item--active .os-menu__item-link {
  color: #fff;
  background-color: #273a52;
}

.os-menu--dark .os-menu__item:hover .os-menu__item-link a,
.os-menu--dark .os-menu__item.os-menu__item--active .os-menu__item-link a {
  color: #fff;
}

.os-menu--dark .os-menu__item--disabled {
  opacity: 0.5;
}

.os-menu--dark .os-menu__item--disabled:hover .os-menu__item-link,
.os-menu--dark .os-menu__item--disabled.os-menu__item--active .os-menu__item-link {
  color: #c9c9c9;
  background-color: transparent;
}

.os-menu--dark .os-menu__submenu:hover .os-menu__submenu-title,
.os-menu--dark .os-menu__submenu.os-menu__submenu--active .os-menu__submenu-title {
  color: #fff;
  font-weight: 700;
}

.os-menu--dark .os-menu__submenu.os-menu__submenu--disabled .os-menu__submenu-title {
  opacity: 0.5;
  font-weight: 400;
  cursor: not-allowed;
}

.os-menu--dark.os-menu--horizontal {
  border: none;
}

.os-menu--dark.os-menu--horizontal .os-menu__item:hover:after,
.os-menu--dark.os-menu--horizontal .os-menu__item.os-menu__item--active:after,
.os-menu--dark.os-menu--horizontal .os-menu__item.os-menu__submenu--active:after,
.os-menu--dark.os-menu--horizontal .os-menu__submenu:hover:after,
.os-menu--dark.os-menu--horizontal .os-menu__submenu.os-menu__item--active:after,
.os-menu--dark.os-menu--horizontal .os-menu__submenu.os-menu__submenu--active:after {
  width: 100%;
  height: 4px;
}

.os-menu--dark.os-menu--horizontal
  .os-menu__submenu.os-menu__submenu--disabled:hover
  .os-menu__submenu-title,
.os-menu--dark.os-menu--horizontal
  .os-menu__submenu.os-menu__submenu--disabled.os-menu__item--active
  .os-menu__submenu-title {
  color: #c9c9c9;
}

.os-menu--dark.os-menu--horizontal .os-menu__submenu .os-menu__item {
  color: #3f536e;
}

.os-menu--dark.os-menu--horizontal
  .os-menu__submenu
  .os-menu__item:hover
  .os-menu__item-link,
.os-menu--dark.os-menu--horizontal
  .os-menu__submenu
  .os-menu__item.os-menu__item--active
  .os-menu__item-link {
  color: #6190e8;
  background-color: transparent;
}

.os-menu--dark.os-menu--horizontal
  .os-menu__submenu
  .os-menu__item:hover
  .os-menu__item-link
  a,
.os-menu--dark.os-menu--horizontal
  .os-menu__submenu
  .os-menu__item.os-menu__item--active
  .os-menu__item-link
  a {
  color: #6190e8;
}

.os-menu--dark.os-menu--horizontal .os-menu__submenu .os-menu__item a {
  color: #3f536e;
}

.os-menu--dark.os-menu--vertical .os-menu__submenu.os-menu__submenu--active {
  background-color: transparent;
}

.os-menu--dark.os-menu--vertical .os-menu__submenu.os-menu__submenu--active:after {
  content: "";
  width: 4px;
  border-radius: 0;
  background-color: #6190e8;
  -webkit-box-shadow: none;
  box-shadow: none;
  opacity: 1;
}

.os-menu--dark.os-menu--vertical .os-menu__submenu .os-menu__item {
  color: #3f536e;
}

.os-menu--dark.os-menu--vertical
  .os-menu__submenu
  .os-menu__item:hover
  .os-menu__item-link,
.os-menu--dark.os-menu--vertical
  .os-menu__submenu
  .os-menu__item.os-menu__item--active
  .os-menu__item-link {
  color: #6190e8;
  background-color: transparent;
}

.os-menu--dark.os-menu--vertical
  .os-menu__submenu
  .os-menu__item:hover
  .os-menu__item-link
  a,
.os-menu--dark.os-menu--vertical
  .os-menu__submenu
  .os-menu__item.os-menu__item--active
  .os-menu__item-link
  a {
  color: #6190e8;
}

.os-menu--dark.os-menu--vertical
  .os-menu__submenu
  .os-menu__item.os-menu__item--disabled
  .os-menu__item-link {
  color: #c9c9c9;
}

.os-menu--dark.os-menu--vertical .os-menu__submenu .os-menu__item a {
  color: #3f536e;
}
</style>
