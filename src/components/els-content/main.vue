<template>
  <component :is="com" v-bind="props"></component>
</template>

<script lang="ts" setup>
import { computed, toRefs, unref } from "vue";

import CBase from "./base.vue";
import CCollapse from "./collapse.vue";
import CIMG from "./img.vue";
import CSVG from "./svg.vue"
import CLINK from "./link.vue"
import CTEXT from "./text.vue"
interface Props {
  type?: string;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  type: "base",
});

const { type } = toRefs(props);

const com = computed(() => {
  switch (unref(type)) {
    case "collapse":
      return CCollapse;
    case "text":
      return CTEXT;
    case "img":
      return CIMG;
    case "svg":
      return CSVG;
    case "link":
      return CLINK;
    default:
      return CBase;
  }
});
</script>

<script lang="ts">
export default {
  name: "els-content",
};
</script>
