<template>
  <component :is="com" v-bind="props"></component>
</template>

<script lang="ts" setup>
import { computed, toRefs, unref } from "vue";

import ElsText from "@/components/els-text";
import CBase from "./base.vue";
import CCollapse from "./collapse.vue";

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
      return ElsText;
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
