<template>
  <div
    :class="['relative', pageClass]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <div v-for="({xyz='',inclass='',outclass='',class:cs='',...c},i) in data" :key="i" :class="[cs,hover ? inclass : outclass]" :xyz="xyz">
      <els-content v-bind="c"></els-content>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref,computed } from "vue";
import { useBg } from "../lib/bg";
import ElsContent, { ElsContentProps } from "../index";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  data: (ElsContentProps & { xyz?: string; inclass?: string; outclass?: string; class?: string })[];
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  data: () => ([{},{}]),
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data } = toRefs(props);

const hover = ref(false);

</script>
