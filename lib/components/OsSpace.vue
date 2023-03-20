<template>
  <div
    class="os-space"
    :style="{
      ...props.style,
      gap: `${props.size}px`,
      flexDirection: props.layout === 'horizontal' ? 'row' : 'column',
      alignItems: props.layout === 'horizontal' ? 'center' : 'flex-start',
      justifyContent: props.layout === 'horizontal' ? 'flex-start' : 'center',
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 6,
  },
  layout: {
    type: String,
    default: "horizontal",
  },
  style: [String, Object],
});
</script>

<style>
.os-space {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
}
</style>
