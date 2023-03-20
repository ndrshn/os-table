<template>
  <div :class="`os-row flex-${props.align}`" :style="rowStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, defineExpose } from "vue";

const props = defineProps({
  gutter: {
    type: [Number, Array],
    default: 0 | [0, 0],
  },
  align: {
    type: String,
    default: "start",
  },
});

const rowStyle = computed(() => {
  const gt = props.gutter;
  const style = {};
  const horizontalGutter = gt[0] > 0 ? `${gt[0] / -2}px` : undefined;
  const verticalGutter = gt[1] > 0 ? `${gt[1] / -2}px` : undefined;

  if (horizontalGutter) {
    style.marginLeft = horizontalGutter;
    style.marginRight = horizontalGutter;
  }

  if (verticalGutter) {
    style.marginTop = verticalGutter;
    style.marginBottom = verticalGutter;
  }
  return style;
});
defineExpose({
  gutter: props.gutter,
});
</script>

<style></style>
