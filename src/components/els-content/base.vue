<template>
  <div class="els-content relative" :class="cs">
    <div class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <div class="relative _content w-100% h-100%">
      <template v-if="imgUrls.length > 0">
        <template v-if="imgBox === false">
          <template v-for="(s, i) in imgUrls" :key="s.url + i">
            <img :class="s.class || ''" :src="s.url" />
          </template>
        </template>
        <div v-else :class="['_imgs', imgBox]">
          <template v-for="(s, i) in imgUrls" :key="s.url + i">
            <img :class="['h-100%', s.class || '']" :src="s.url" />
          </template>
        </div>
      </template>
      <!-- text -->
      <ElsText v-bind="textAttr"></ElsText>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";

import ElsText, { ElsTextProps } from "@/components/els-text";

interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  imgs?:
    | string
    | string[]
    | { data: { url: string; class: string }[]; box?: boolean | string };
  text?: string | ElsTextProps;
}

const props = withDefaults(defineProps<Props>(), {
  class: "w-100% h-200px",
  bg: "transparent",
  imgs: "",
  text: "",
});

const { class: cs, bg, imgs, text } = toRefs(props);

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

// imgs
const imgBox = computed<boolean | string>(() => {
  if (
    typeof imgs.value === "string" ||
    Array.isArray(imgs.value) ||
    imgs.value.box === undefined
  ) {
    return "";
  }

  return imgs.value.box;
});

const imgUrls = computed<{ url: string; class?: string }[]>(() => {
  const isA = Array.isArray(imgs.value);
  if (!imgs.value) {
    return [];
  }
  if (typeof imgs.value === "string") {
    return [{ url: imgs.value }];
  }
  if (Array.isArray(imgs.value)) {
    return imgs.value.map((s) => ({ url: s }));
  }
  return imgs.value?.data || [];
  //
});

// text
const textAttr = computed(() => {
  if (typeof text.value === "string") {
    return { text: text.value };
  }
  return text.value;
});
</script>

<script lang="ts">
export default {
  name: "els-content-base",
};
</script>
