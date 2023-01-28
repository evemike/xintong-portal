<template>
  <div :class="['_img relative',pageClass]" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <img :src="src" class="relative w-100% h-100%" />
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import {useBg} from "./bg"
//
interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  src:string
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
const {src} = toRefs(props)
</script>