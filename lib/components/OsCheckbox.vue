<!-- eslint-disable vue/require-default-prop -->
<template>
  <label
    class="os-checkbox"
    :class="{
      'os-checkbox--focus': focus,
      'os-checkbox--checked': currentValue,
      'os-checkbox--disabled': props.disabled,
    }"
  >
    <span class="os-checkbox__input">
      <span class="os-checkbox__inner"></span>
      <input
        v-if="isGroup"
        v-model="model"
        type="checkbox"
        class="os-checkbox__original"
        :name="props.name"
        :value="props.label"
        :disabled="props.disabled"
        @change="change"
        @focus="focus = true"
        @blur="focus = false"
      />
      <input
        v-else
        type="checkbox"
        class="os-checkbox__original"
        :name="props.name"
        :disabled="props.disabled"
        :checked="currentValue"
        @change="change"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="os-checkbox__label">
      <slot></slot>
    </span>
  </label>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["on-change", "update:checked"]);
const props = defineProps({
  label: [String, Number, Boolean],
  name: String,
  checked: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const model = ref([]);
const focus = ref(false);

const change = (evt) => {
  if (props.disabled) return false;
  const checked = evt.target.checked;
  const value = checked;
  emit("update:checked", value);
  emit("on-change", value);
};

defineExpose({
  model,
  label: props.label,
});
</script>

<style>
.os-checkbox {
  position: relative;
  display: inline-block;
  font-size: 0;
  line-height: 1.5;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
}

.os-checkbox + .os-checkbox {
  margin-left: 16px;
}

.os-checkbox--checked .os-checkbox__inner {
  border-color: #79a1eb;
  background-color: #79a1eb;
}

.os-checkbox--checked .os-checkbox__inner:after {
  -webkit-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}

.os-checkbox--disabled .os-checkbox__inner {
  border-color: #cedeea;
  background-color: #f9fafc;
  cursor: not-allowed;
}

.os-checkbox--disabled .os-checkbox__inner:hover {
  border-color: #cedeea;
}

.os-checkbox--disabled .os-checkbox__inner:after {
  border-color: #c5d9e8;
  cursor: not-allowed;
}

.os-checkbox--disabled .os-checkbox__label {
  color: #b1b1b1;
  cursor: not-allowed;
}

.os-checkbox--focus {
  border-color: #78a4f4;
}

.os-checkbox__input {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  outline: none;
}

.os-checkbox__inner {
  position: relative;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border: 1px solid #c5d9e8;
  border-radius: 5px;
  background-color: #fff;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  cursor: pointer;
  z-index: 1;
}

.os-checkbox__inner:hover {
  border-color: #79a1eb;
}

.os-checkbox__inner:after {
  content: "";
  width: 4px;
  height: 8px;
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
  -webkit-transform: rotate(45deg) scale(0);
  transform: rotate(45deg) scale(0);
  -webkit-transition: -webkit-transform 0.2s;
  transition: -webkit-transform 0.2s;
  transition: transform 0.2s;
  transition: transform 0.2s, -webkit-transform 0.2s;
}

.os-checkbox__original {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  outline: none;
  z-index: -1;
}

.os-checkbox__label {
  font-size: 12px;
  padding-left: 8px;
  vertical-align: middle;
}
</style>
