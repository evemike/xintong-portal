<template>
  <div :class="['_empty',pageClass]" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="[bgClass,isHover ? inclass : outclass]">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100% object-cover" />
      <svg-icon v-if="bgIcon" :id="bgIcon" />
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
  src?:string;
  isHover?:boolean
  inclass?:string;
  outclass?:string;
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  inclass:"",
  outclass:"",
  bg:"",
})
//
const {pageClass,bgClass,bgUrl,bgIcon,isHover} = useBg(props);
//
</script>