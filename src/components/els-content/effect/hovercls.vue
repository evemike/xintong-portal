<template>
  <div :class="['relative', pageClass]">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <div :class="[mainclass , hover ? inclass : outclass]" @mouseenter="hover = true" @mouseleave="hover = false">
      <els-content v-bind="main"></els-content>
    </div>
    <div
      v-for="({ xyz = '', inclass = '', outclass = '', cla = '', ...c }, i) in data"
      :key="i"
      :class="[cla, hover ? inclass : outclass]"
      :xyz="xyz"
    >
      <els-content v-bind="c"></els-content>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, computed } from "vue";
import { useBg } from "../lib/bg";
import ElsContent, { ElsContentProps } from "../index";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  mainclass?:string;
  inclass?: string;
  outclass?: string;
  main: ElsContentProps;
  data: (ElsContentProps & {
    xyz?: string;
    inclass?: string;
    outclass?: string;
    cla?: string;
  })[];
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  main: () => ({}),
  data: () => [{}, {}],
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data, main,mainclass,inclass,outclass } = toRefs(props);

const hover = ref(false);
</script>
