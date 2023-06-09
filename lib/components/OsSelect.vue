<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    ref="_select"
    :class="[
      'os-select',
      {
        'os-select--visible': visible,
        'os-select--disabled': props.disabled,
        'os-select--multiple': props.multiple,
        'os-select--single': !props.multiple,
        'os-select--show-clear': showCloseIcon,
        [`os-select--${props.size}`]: !!props.size,
      },
    ]"
  >
    <!-- S Selection -->
    <div ref="trigger" class="os-select__selection" @click="toggleMenu">
      <span v-for="(item, index) in selectedMultiple" :key="index" class="os-tag">
        <span class="os-tag__text">{{ item.label }}</span>
        <i class="icon icon-x os-tag__close" @click.stop="removeTag(index)"></i>
      </span>
      <span
        v-show="showPlaceholder && !props.filterable"
        class="os-select__placeholder"
        >{{ localePlaceholder }}</span
      >
      <span
        v-show="!showPlaceholder && !props.multiple && !props.filterable"
        class="os-select__selected"
        >{{ selectedSingle }}</span
      >
      <input
        v-if="props.filterable"
        ref="input"
        v-model="query"
        type="text"
        class="os-select__input"
        :placeholder="showPlaceholder ? localePlaceholder : ''"
        @blur="handleBlur"
        @keydown.delete="handleInputDelete"
      />
      <i class="icon ti ti-chevron-down os-select__arrow"></i>
      <i
        v-show="showCloseIcon"
        class="icon ti ti-x os-select__clear"
        @click.stop="clearSingleSelect"
      ></i>
    </div>
    <!-- E Selection -->

    <!-- S Dropdown -->
    <transition name="slide-up">
      <div
        v-show="visible"
        ref="popover"
        class="os-select__dropdown"
        :class="[
          placement
            ? `os-select__dropdown--${props.placement}`
            : 'os-select__dropdown--bottom',
        ]"
      >
        <ul v-show="notFound" class="os-select__not-found">
          <li>{{ localeNotFoundText }}</li>
        </ul>
        <ul v-show="!notFound" ref="options" class="os-select__list">
          <slot></slot>
        </ul>
      </div>
    </transition>
    <!-- E Dropdown -->
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  useSlots,
} from "vue";
import { onClickOutside } from "@vueuse/core";
import OsInput from "./OsInput.vue";
const emit = defineEmits(["input", "on-change", "update:value"]);
const slots = useSlots();
const props = defineProps({
  value: {
    type: [String, Number, Array],
    default: "",
  },
  trigger: {
    type: String,
    default: "click",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
  filterable: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: "normal",
    validator: (val) => ["normal", "small", "large"].indexOf(val) > -1,
  },
  valueWithLabel: {
    type: Boolean,
    default: false,
  },
  notFoundText: {
    type: String,
    default: "Not found",
  },
  placement: {
    type: String,
    default: "bottom",
  },
});

const _select = ref();
const visible = ref(false);
const options = ref([]);
const optionInstances = ref([]);
const selectedSingle = ref("");
const selectedMultiple = ref([]);
const focusIndex = ref(0);
const query = ref("");
const notFound = ref(false);
const model = ref(props.value);
const input = ref();
const popover = ref();

onClickOutside(_select, () => handleClose());

const showPlaceholder = computed(() => {
  if (model.value === "") {
    return true;
  } else if (Array.isArray(model.value) && !model.value.length) {
    return true;
  }
  return false;
});

const showCloseIcon = computed(() => {
  return !props.multiple && props.clearable && !showPlaceholder.value;
});

const localePlaceholder = computed(() => {
  return typeof props.placeholder === "undefined" ? "Seçim yap" : props.placeholder;
});

const localeNotFoundText = computed(() => {
  return typeof props.notFoundText === "undefined"
    ? "Kayıt bulunamadı"
    : props.notFoundText;
});

watch(
  () => props.value,
  (newVal) => {
    model.value = newVal;
    if (newVal === "") {
      query.value = "";
    }
  }
);

watch(model, () => {
  emit("input", model.value);
  emit("update:value", model.value);
  modelToQuery();
  if (props.multiple) {
    updateMultipleSelected();
  } else {
    updateSingleSelected();
  }
});

watch(visible, (newVal) => {
  if (newVal) {
    if (props.multiple && props.filterable) {
      input.value.focus();
    } else if (props.filterable) {
      input.value.select();
    }
  } else {
    if (props.filterable) {
      input.value.blur();
    }
  }
});

watch(query, () => {
  let isHidden = true;
  nextTick(() => {
    const options = slots.default();
    options.forEach((option) => {
      if (!option.hidden) {
        isHidden = false;
      }
    });
    notFound.value = isHidden;
  });
});

onMounted(() => {
  modelToQuery();
  updateOptions();
  document.addEventListener("keydown", handleKeydown);
});

const onSelectSelected = (value) => {
  if (model.value === value) {
    hideMenu();
  } else if (props.multiple) {
    const index = model.value.indexOf(value);
    if (index > -1) {
      removeTag(index);
    } else {
      model.value.push(value);
    }
    if (props.filterable) {
      query.value = "";
      input.value.focus();
    }
  } else {
    model.value = value;
    if (props.filterable) {
      slots.default().forEach((option) => {
        if (option.proxy.value === value) {
          query.value =
            typeof option.proxy.label === "undefined"
              ? option.proxy.searchLabel
              : option.proxy.label;
        }
      });
    }
  }
};

const toggleMenu = () => {
  if (props.disabled) return;
  visible.value = !visible.value;
};

const hideMenu = () => {
  visible.value = false;
  focusIndex.value = 0;
};

const handleClose = () => {
  hideMenu();
};

const handleKeydown = (evt) => {
  if (visible.value) {
    const keyCode = evt.keyCode;

    if (keyCode === 27) {
      // escape
      evt.preventDefault();
      hideMenu();
    } else if (keyCode === 40) {
      // down arrow
      evt.preventDefault();
      navigateOptions("next");
    } else if (keyCode === 38) {
      // up arrow
      evt.preventDefault();
      navigateOptions("prev");
    } else if (keyCode === 13) {
      // enter
      evt.preventDefault();

      let hasFocus = false;

      const _options = slots.default();
      _options.forEach((option) => {
        if (option.isFocus) {
          hasFocus = true;
          option.doSelect();
        }
      });

      if (!hasFocus) {
        selectFirstOption();
      }
    }
  }
};

const selectFirstOption = () => {
  let firstOption;
  slots.default().forEach((option) => {
    if (!firstOption && !option.hidden) {
      firstOption = option;
      option.doSelect();
    }
  });
};

const updateOptions = () => {
  const _options = [];
  slots.default().forEach((option) => {
    _options.push({
      value: option.value,
      label: typeof option.label === "undefined" ? option.innerHTML : option.label,
    });
    optionInstances.value.push(option);
  });

  options.value = _options;
  updateSingleSelected(true);
  updateMultipleSelected(true);
};

const updateSingleSelected = (init = false) => {
  const type = typeof model.value;
  if (type === "string" || type === "number") {
    for (let i = 0; i < options.value.length; i++) {
      if (model.value === options.value[i].value) {
        selectedSingle.value = options.value[i].value;
        emit("update:value", selectedSingle.value);
        break;
      }
    }
  }
  toggleSingleSelected(model.value, init);
};

const updateMultipleSelected = (init = false) => {
  if (props.multiple && Array.isArray(model.value)) {
    const selected = [];
    for (let i = 0; i < model.value.length; i++) {
      const _model = model.value[i];
      for (let j = 0; j < options.value.length; j++) {
        const option = options.value[j];
        if (_model === option.value) {
          selected.push({
            value: option.value,
            label: option.label,
          });
        }
      }
    }
    selectedMultiple.value = selected;
    emit("update:value", selectedMultiple.value);
  }
  toggleMultipleSelected(model.value, init);
};

const clearSingleSelect = () => {
  if (showCloseIcon.value) {
    slots.default().forEach((option) => {
      option.selected = false;
    });
    model.value = "";
    if (props.filterable) {
      query.value = "";
    }
  }
};

const removeTag = (index) => {
  if (props.disabled) return false;
  model.value.splice(index, 1);
  if (props.filterable && visible.value) {
    input.value.focus();
  }
};

const toggleSingleSelected = (value, init = false) => {
  if (props.multiple) return;
  let label = "";
  slots.default().forEach((option) => {
    if (option.value === value) {
      option.selected = true;
      label = typeof option.label === "undefined" ? option.innerHTML : option.label;
    } else {
      option.selected = false;
    }
  });

  hideMenu();

  if (!init) {
    if (props.valueWithLabel) {
      emit("on-change", {
        value,
        label,
      });
    } else {
      emit("on-change", value);
    }
  }
};

const toggleMultipleSelected = (values, init = false) => {
  if (!props.multiple) return;
  const valueLabelArr = [];
  for (let i = 0; i < values.length; i++) {
    valueLabelArr.push({
      value: values[i],
    });
  }

  const _options = slots.default();
  _options.forEach((option) => {
    const index = values.indexOf(option.value);
    if (index > -1) {
      option.selected = true;
      valueLabelArr[index].label =
        typeof option.label === "undefined" ? option.vnode.innerHTML : option.label;
    } else {
      option.selected = false;
    }
  });

  if (!init) {
    if (props.valueWithLabel) {
      emit("on-change", valueLabelArr);
    } else {
      emit("on-change", values);
    }
  }
  emit("update:value", values);
};

const navigateOptions = (direction) => {
  if (direction === "next") {
    const next = focusIndex.value + 1;
    focusIndex.value = focusIndex.value === options.value.length ? 1 : next;
  } else if (direction === "prev") {
    const prev = focusIndex.value - 1;
    focusIndex.value = focusIndex.value <= 1 ? options.value.length : prev;
  }
  let isValid = false;
  let hasValidOption = false; // avoid infinite loops
  const _options = slots.default();
  _options.forEach((option, idx) => {
    if (idx + 1 === focusIndex.value) {
      isValid = !option.disabled && !option.hidden;
      if (isValid) {
        option.isFocus = true;
      }
    } else {
      option.isFocus = false;
    }
    if (!option.hidden && !option.disabled) {
      hasValidOption = true;
    }
  });

  if (!isValid && hasValidOption) {
    navigateOptions(direction);
  }
  resetScrollTop();
};

const resetScrollTop = () => {
  const index = focusIndex.value - 1;
  const bottomOverflowDistance =
    optionInstances.value[index].$el.getBoundingClientRect().bottom -
    popover.value.getBoundingClientRect().bottom;
  if (bottomOverflowDistance) {
    popover.value.scrollTop += bottomOverflowDistance;
  }
};

const handleBlur = () => {
  setTimeout(() => {
    if (!props.multiple && model.value !== "") {
      const _options = slots.default();
      _options.forEach((option) => {
        console.log(option);
        if (option.value === model.value) {
          query.value =
            typeof option.label === "undefined" ? option.searchLabel : option.label;
        }
      });
    } else {
      query.value = "";
    }
  }, 300);
};

const handleInputDelete = () => {
  if (props.multiple && model.value.length && query.value === "") {
    removeTag(model.value.length - 1);
  }
};

const modelToQuery = () => {
  if (!props.multiple && props.filterable && typeof model.value !== "undefined") {
    const _options = slots.default();
    _options.forEach((option) => {
      if (model.value === option.value) {
        query.value = option.value;
      }
    });
  }
};

const onOptionDestroy = (index) => {
  options.value.splice(index, 1);
  optionInstances.value.splice(index, 1);
};

defineExpose({ onOptionDestroy, optionInstances, options, onSelectSelected });

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style>
.os-select {
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 80px;
  color: #3f536e;
  font-size: 12px;
  line-height: 1.5;
  vertical-align: middle;
}

.os-select .os-select__input {
  width: 100%;
  border: none;
  outline: none;
  position: absolute;
  color: #3f536e;
  font-size: 12px;
  left: 0;
  top: 0;
  margin: 0;
  background-color: transparent;
}

.os-select .os-select__input::-webkit-input-placeholder {
  color: #c9c9c9;
}

.os-select .os-select__input:-ms-input-placeholder {
  color: #c9c9c9;
}

.os-select .os-select__input::placeholder {
  color: #c9c9c9;
}

.os-select .os-select__input:disabled {
  cursor: not-allowed;
}

.os-select__selection {
  position: relative;
  display: block;
  padding: 0 24px 0 8px;
  outline: none;
  min-height: 26px;
  line-height: 26px;
  border: 1px solid #c5d9e8;
  border-radius: 4px;
  background-color: #fff;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  cursor: pointer;
  overflow: hidden;
}

.os-select__selection:hover {
  border-color: #79a1eb;
}

.os-select__selection:hover .os-select__arrow,
.os-select__selection:hover .os-select__clear {
  display: inline-block;
}

.os-select__selected {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  display: block;
}

.os-select__arrow {
  display: inline-block;
  position: absolute;
  top: 50%;
  right: 8px;
  margin-top: -5px;
  font-size: 10px;
  cursor: pointer;
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
}

.os-select__clear {
  display: none;
  position: absolute;
  top: 50%;
  right: 8px;
  margin-top: -5px;
  font-size: 10px;
  cursor: pointer;
}

.os-select__placeholder {
  color: #c9c9c9;
}

.os-select__dropdown {
  position: absolute;
  width: 100%;
  padding: 6px 12px;
  max-height: 200px;
  font-size: 12px;
  border-radius: 4px;
  background-color: #fff;
  -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 6px #0003;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1050;
}

.os-select__dropdown .os-select__list {
  list-style: none;
  padding: 0;
  font-size: 0;
}

.os-select__dropdown .os-select__not-found {
  padding: 6px 12px;
}

.os-select__dropdown .os-select__option {
  display: inline-block;
  max-width: 100%;
  text-overflow: ellipsis;
  word-wrap: normal;
  width: 100%;
  padding: 6px 12px;
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  white-space: nowrap;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  overflow: hidden;
  cursor: pointer;
}

.os-select__dropdown .os-select__option--selected {
  font-weight: 700;
  background-color: #f9fafc;
}

.os-select__dropdown .os-select__option:hover,
.os-select__dropdown .os-select__option--focus {
  background-color: #ecf2fc;
}

.os-select__dropdown .os-select__option--disabled {
  color: #c9c9c9;
}

.os-select__dropdown--bottom {
  margin-top: 2px;
}

.os-select__dropdown--top {
  margin-bottom: 2px;
}

.os-select__dropdown--left {
  margin-right: 2px;
}

.os-select__dropdown--right {
  margin-left: 2px;
}

.os-select--visible .os-select__arrow {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.os-select--show-clear .os-select__selection:hover .os-select__arrow {
  opacity: 0;
}

.os-select--disabled .os-select__selection {
  cursor: not-allowed;
  border-color: #cedeea;
  background-color: #eef4f8;
}

.os-select--disabled .os-select__selection:hover {
  border-color: #cedeea;
}

.os-select--disabled .os-select__placeholder,
.os-select--disabled .os-select__selected {
  color: #c9c9c9;
}

.os-select--multiple .os-tag {
  margin: 4px 4px 0 0;
}

.os-select--multiple .os-tag__text {
  font-size: 10px;
}

.os-select--small {
  font-size: 11px;
}

.os-select--small .os-select__selection {
  height: 24px;
  line-height: 24px;
}

.os-select--small .os-select__dropdown .os-select__option {
  font-size: 11px;
}

.os-select--large {
  font-size: 14px;
}

.os-select--large .os-select__selection {
  height: 30px;
  line-height: 28px;
}

.os-select--large .os-select__dropdown .os-select__option {
  font-size: 13px;
}
</style>
