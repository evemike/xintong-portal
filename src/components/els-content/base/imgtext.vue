<template>
  <div :class="['_img relative', pageClass]">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <CIMG v-if="imgProps" v-bind="imgProps" />
    <CSVG v-if="svgProps" v-bind="svgProps" />
    <CTEXT v-if="textProps" v-bind="textProps" />
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
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
  text?: string;
  textClass?: string;
  splits?: [paragraph: string, line: string];
  annotation?: {
    class: string | string[];
    line?: number | number[];
    text: string | string[];
    check?: (t: string, l: number) => boolean;
  }[];
}

interface SvgProps {
  class?: string;
  bg?: string | { url?: string; class?: string };
  icon?:string
}

interface Props {
  textProps?: TextProps;
  imgProps?: ImgProps;
  svgProps?:SvgProps
  class?: string;
  bg?: string | { url?: string; class?: string };
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
</script>
