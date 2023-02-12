<template>
  <div :class="['_img relative',pageClass]" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100% object-cover" />
      <svg-icon v-if="bgIcon" :id="bgIcon" />
    </div>
    <img :src="src" class="relative w-100% h-100%" :class="imgClass" />
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
  src?:string;
  imgClass?:string;
  isHover?:boolean
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
  imgClass:"",
})
//
const {pageClass,bgClass,bgUrl,bgIcon} = useBg(props);
//
const {src,imgClass} = toRefs(props)
</script>