<template>
  <div :class="['_img relative',pageClass]" :style="style" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100% object-cover" />
      <svg-icon v-if="bgIcon" :id="bgIcon" />
    </div>
    <template v-if="(typeof src === 'string')">
      <img :src="src" class="relative w-100% h-100%" :class="imgClass" />
    </template>
    <div v-if="Array.isArray(src)" :class="boxClass">
      <template  v-for="s in src" :key="Array.isArray(s) ? s[0] : s" >
        <img :src="Array.isArray(s) ? s[0] : s" :class="[imgClass,Array.isArray(s) ? s[1] : '']" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import {useBg} from "../lib/bg"
import SvgIcon from "@/components/svg-icon";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  src?:string|(string|[string,string])[];
  boxClass?:string;
  imgClass?:string;
  style?:string
  isHover?:boolean
}

const props = withDefaults(defineProps<Props>(),{
  style:"",
  class:"",
  bg:"",
  imgClass:"",
  boxClass:"",
})
//
const {pageClass,bgClass,bgUrl,bgIcon} = useBg(props);
//
const {src,imgClass} = toRefs(props)
</script>