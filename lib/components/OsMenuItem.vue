<template>
  <li
    class="os-menu__item"
    :class="[
      active ? 'os-menu__item--active' : '',
      props.disabled ? 'os-menu__item--disabled' : '',
    ]"
    @click="handleClick"
  >
    <nuxt-link
      v-if="Object.keys(props.to).length"
      class="os-menu__item-link"
      ref="link"
      :to="props.to"
    >
      <i v-if="props.icon" :class="`ti ti-${props.icon}`" style="margin-right: 6px" />
      <slot></slot>
    </nuxt-link>
    <div v-else class="os-menu__item-link">
      <i v-if="props.icon" :class="`ti ti-${props.icon}`" style="margin-right: 6px" />
      <slot></slot>
    </div>
  </li>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";

const props = defineProps({
  key: {
    type: [String, Number],
  },
  to: {
    type: [Object, String],
    default() {
      return {};
    },
  },
  replace: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: String,
});

const active = ref(false);
const parent = ref();
const handleClick = (evt) => {
  evt.preventDefault();
  if (props.disabled) return;
  if (parent && parent.exposed) {
    parent.exposed.menuItemSelect(this);
  }
};

onMounted(() => {
  parent.value = getCurrentInstance().parent;
  /*
  this.$on('on-update-active', name => {
    this.$nextTick(() => {
      if (this.key === name || (this.$refs.link && this.$refs.link.$el.classList.contains('router-link-active'))) {
        this.active = true

        const parents = findComponentsUpward(this, 'AtSubmenu')
        if (parents && parents.length) {
          parents.forEach(parent => {
            parent.$emit('on-update-active', true)
          })
        }
      } else {
        this.active = false
      }
    })
  })*/
});
</script>
