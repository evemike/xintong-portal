<template>
  <div
    :class="['_img relative', pageClass]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <div :class="['_one',oneAttr.class,hover ? oneAttr.inclass : oneAttr.outclass]" :xyz="oneAttr.xyz">
      <els-content v-bind="data[0]"></els-content>
    </div>
    <div :class="['_two',twoAttr.class,hover ? twoAttr.inclass : twoAttr.outclass]" :xyz="twoAttr.xyz">
      <els-content v-bind="data[1]"></els-content>
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
  one?: { xyz?: string; inclass?: string; outclass?: string; class?: string };
  two?: { xyz?: string; inclass?: string; outclass?: string; class?: string };
  data: [ElsContentProps,ElsContentProps];
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  one: () => ({}),
  two: () => ({}),
  data: () => ([{},{}]),
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data, one, two } = toRefs(props);

const hover = ref(false);

//
const oneAttr = computed(() => {
  return {inclass:"",outclass:"",class:"",xyz:'',...one.value}
})

const twoAttr = computed(() => {
  return {inclass:"",outclass:"",class:"",xyz:'',...two.value}
})
</script>
