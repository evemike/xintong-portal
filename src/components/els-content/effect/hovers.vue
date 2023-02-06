<template>
  <div :class="['relative', pageClass]">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <div
      v-for="(d, i) in data"
      :key="i"
      :class="[common?.class, currentIndex == i ? common?.inclass : common?.outclass]"
      @mouseenter="currentIndex = i"
      @mouseleave="currentIndex = -1"
    >
      <els-content v-bind="getAttrs(d)"></els-content>
    </div>
    <els-content v-if="currentContent" v-bind="currentContent"></els-content>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, computed } from "vue";
import { useBg } from "../lib/bg";
import { useClass,Attr } from "../lib/attrs"
import ElsContent, { ElsContentProps } from "../index";
import { omit, pick } from "lodash";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  inclass:Attr<string>
  outclass:Attr<string>
  include?: string[];
  common?:{
    class?:string;
    inclass?:string;
    outclass?:string;
  },
  data?: ElsContentProps[];
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  common:() => ({}),
  include: () => [],
  data: () => [{}, {}],
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data, include ,common,inclass,outclass} = toRefs(props);
//
const keys = ["c",'bg','list','item','con']
const incss = computed(() => useClass(inclass.value,keys));
const outcss = computed(() => useClass(outclass.value,keys));
//
const getAttrs = (d: any) => omit(d, [...include.value,'contentData']);
const currentIndex = ref<number>(-1);
const currentContent = computed(() => {
  if (currentIndex.value > -1 && currentIndex.value < data.value.length) {
    const d = data.value[currentIndex.value];
    const t = pick(d, include.value);
    return {...t,...(d.contentData || {})};
  }
  return undefined;
});
</script>
