<template>
  <div :class="['_img relative',pageClass]" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <ElButton :src="src" class="relative w-100% h-100%" :class="imgClass" ></ElButton>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from "element-plus";
import { toRefs } from "vue";
import {useBg} from "../lib/bg"
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  src:string;
  imgClass?:string;
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
  imgClass:"",
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
const {src,imgClass} = toRefs(props)
</script>