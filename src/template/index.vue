<template>
  <div class="page-temp relative w-100% h-100%" :class="cs">
    <div v-if="bg" :class="['_bg absolute w-100% h-100% top-0 left-0', bgClass]">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <template v-for="([type, d = {}], i) in data" :key="i">
      <component :is="com(type)" v-bind="d"></component>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { unref, toRefs, computed } from "vue";
//
// import
import TimeLine from "./time-line/index.vue";

//
interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  data?: [type: string, data: Record<string, any>][];
}
const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  data: () => [],
});

const { class: cs, bg, data } = toRefs(props);
//
const com = (type: string) => {
  switch (unref(type)) {
    case "timeline":
      return TimeLine;

    default:
      return TimeLine;
  }
};

// background
const bgUrl = computed(() => {
  if (typeof bg.value === "string") {
    const isUrl = /\.(\w+)$/.test(bg.value);
    return isUrl ? bg.value : "";
  }
  //
  return bg.value?.url || "";
});

const bgClass = computed(() => {
  if (typeof bg.value === "string") {
    const isUrl = /\.(\w+)$/.test(bg.value);
    return isUrl ? "" : bg.value;
  }
  return bg.value?.class || "";
});
</script>
