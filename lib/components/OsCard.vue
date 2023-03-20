<template>
  <div
    class="os-card"
    :class="{
      'os-card--bordered': bordered,
      'os-card--hover': hover,
    }"
  >
    <div class="os-card__cover" v-if="slots.cover">
      <slot name="cover"></slot>
    </div>
    <div
      class="os-card__head"
      v-if="props.title != '' || slots.title || slots.extra"
      :style="{ borderBottom: slots.cover ? 'none' : '' }"
    >
      <div class="os-card__title" v-if="slots.title || props.title != ''">
        <slot v-if="slots.title" name="title"></slot>
        <span v-else-if="props.title != ''">{{ props.title }}</span>
      </div>
      <div class="os-card__extra" v-if="slots.extra">
        <slot name="extra"></slot>
      </div>
    </div>
    <div class="os-card__body" :style="bodyStyle">
      <slot v-if="!loading"></slot>
      <slot v-else name="loading">
        <div class="os-card__body--loading">
          <div>
            <span style="width: 95%"></span>
          </div>
          <div>
            <span style="width: 32%"></span>
            <span style="width: 58%"></span>
          </div>
          <div>
            <span style="width: 23%"></span>
            <span style="width: 65%"></span>
          </div>
          <div>
            <span style="width: 59%"></span>
            <span style="width: 32%"></span>
          </div>
          <div>
            <span style="width: 26%"></span>
            <span style="width: 10%"></span>
            <span style="width: 50%"></span>
          </div>
        </div>
      </slot>
    </div>
    <ul class="os-card__actions" v-if="props.actions.length > 0">
      <li
        v-for="item in props.actions"
        :key="item.key"
        :style="{ width: `${100 / props.actions.length}%` }"
      >
        <span>{{ item.action }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useSlots } from "vue";
const slots = useSlots();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  actions: {
    type: Array,
    default: () => [],
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  hover: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  bodyStyle: {
    type: Object,
  },
});
</script>

<style>
.os-card {
  position: relative;
  border-radius: 5px;
  background-color: #fff;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.os-card--hover:hover {
  border-color: #f9fafc;
  -webkit-box-shadow: 1px 0 16px 0 rgba(100, 100, 100, 0.2);
  box-shadow: 1px 0 16px #64646433;
}

.os-card__head {
  padding: 0 12px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #cedeea;
}

.os-card__title {
  display: inline-block;
}

.os-card__extra {
  float: right;
}

.os-card__body {
  padding: 12px;
}

.os-card__body--loading span {
  display: inline-block;
  margin: 5px 1%;
  height: 14px;
  border-radius: 2px;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(rgba(192, 198, 206, 0.12)),
    color-stop(rgba(192, 198, 206, 0.2)),
    to(rgba(192, 198, 206, 0.12))
  );
  background: linear-gradient(
    90deg,
    rgba(192, 198, 206, 0.12),
    rgba(192, 198, 206, 0.2),
    rgba(192, 198, 206, 0.12)
  );
  background-size: 600% 600%;
  -webkit-animation: card-loading 1.4s ease infinite;
  animation: card-loading 1.4s ease infinite;
}

.os-card--bordered {
  border: 1px solid #cedeea;
}

@-webkit-keyframes card-loading {
  0%,
  to {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes card-loading {
  0%,
  to {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.os-card__cover {
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px 5px 0 0;
}

.os-card__cover img {
  object-fit: cover;
  width: 100%;
  height: auto;
  border-radius: 5px 5px 0 0;
}

.os-card__actions {
  margin: 0;
  padding: 0;
  list-style: none;
  background: #fff;
  border-top: 1px solid #cedeea;
  border-radius: 0 0 5px 5px;
  width: 100%;
}

.os-card__actions:before {
  display: table;
  content: "";
}

.os-card__actions:after {
  display: table;
  clear: both;
  content: "";
}

.os-card__actions > li {
  float: left;
  margin: 6px 0;
  color: #3f536e;
  text-align: center;
  padding: 0 6px;
}

.os-card-rtl .os-card__actions > li {
  float: right;
}

.os-card__actions > li > span {
  position: relative;
  display: block;
  min-width: 32px;
  font-size: 12px;
  line-height: 1.5715;
  cursor: pointer;
}

.os-card__actions > li > span:hover {
  color: var(--ant-primary-color);
  transition: color 0.3s;
}

.os-card__actions > li > span a:not(.os-btn),
.os-card__actions > li > span > .anticon {
  display: inline-block;
  width: 100%;
  color: #3f536e;
  line-height: 22px;
  transition: color 0.3s;
}

.os-card__actions > li > span a:not(.os-btn):hover,
.os-card__actions > li > span > .anticon:hover {
  color: var(--ant-primary-color);
}

.os-card__actions > li > span > .anticon {
  font-size: 16px;
  line-height: 22px;
}

.os-card__actions > li:not(:last-child) {
  border-right: 1px solid #cedeea;
}
</style>
