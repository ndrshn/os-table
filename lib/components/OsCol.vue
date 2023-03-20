<template>
  <div :class="classes" :style="colStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";

const props = defineProps({
  span: Number,
  xs: Number,
  sm: Number,
  md: Number,
  lg: Number,
  xl: Number,
  xxl: Number,
  xxxl: Number,
});

const parent = getCurrentInstance().parent;
const colStyle = computed(() => {
  const gutterVal = parent.exposed.gutter;
  const style = {};
  if (gutterVal && gutterVal[0] > 0) {
    const horizontalGutter = `${gutterVal[0] / 2}px`;
    style.paddingLeft = horizontalGutter;
    style.paddingRight = horizontalGutter;
  }

  // Vertical gutter use padding when gap not support
  if (gutterVal && gutterVal[1] > 0) {
    const verticalGutter = `${gutterVal[1] / 2}px`;
    style.paddingTop = verticalGutter;
    style.paddingBottom = verticalGutter;
  }
  return style;
});

const classes = computed(() => {
  const { span } = props;
  let sizeClassObj = {};
  ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"].forEach((size) => {
    let sizeProps = {};
    const propSize = props[size];
    if (typeof propSize === "number") {
      sizeProps.span = propSize;
    } else if (typeof propSize === "object") {
      sizeProps = propSize || {};
    }

    sizeClassObj = {
      ...sizeClassObj,
      [`os-col-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
      [`os-col-${span}`]: span !== undefined,
      "os-col": true,
    };
  });
  return sizeClassObj;
});
</script>

<style></style>
