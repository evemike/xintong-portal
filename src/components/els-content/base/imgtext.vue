<template>
  <div :class="['_imgtext relative', pageClass]" :style="style">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <CTEXT v-if="title" v-bind="textAttr" />
    <CIMG v-if="imgProps" v-bind="imgProps" :is-hover="isHover" />
    <CSVG v-if="svgProps" v-bind="svgProps" :is-hover="isHover" />
    <CTEXT v-if="textProps" v-bind="textProps" :is-hover="isHover" />
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs, watch } from "vue";
import { useBg } from "../lib/bg";
import CIMG from "./img.vue";
import CSVG from "./svg.vue";
import CTEXT from "./text.vue";
//
interface ImgProps {
  class?: string;
  bg?: string | { url?: string; class?: string };
  src?: string;
  imgClass?: string;
}

interface TextProps {
  class?: string;
  bg?: string | { url?: string; class?: string };
  textClass?: string;
  text: string | string[];
  splits?: [paragraph: string, line: string];
  
  annotation?: {
    class: string;
    line?: number | number[];
    part?: number | number[];
    text?: string | string[];
    min?: number;
    max?: number;
  }[];
}

interface SvgProps {
  class?: string;
  bg?: string | { url?: string; class?: string };
  icon?: string;
}

interface Props {
  textProps?: TextProps;
  imgProps?: ImgProps;
  svgProps?: SvgProps;
  class?: string;
  style?:string
  bg?: string | { url?: string; class?: string };
  isHover?: boolean;
  title?: string | TextProps | Record<string,any>;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  title: "",
  style: "",
  bg: "",
});
//
const { title } = toRefs(props)
const { pageClass, bgClass, bgUrl, isHover } = useBg(props);
//
const textAttr = computed(() => {
  if (typeof title.value === "string") {
    return { text: title.value };
  }
  return title.value;
});
//
</script>
