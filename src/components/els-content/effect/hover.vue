<template>
  <div :class="['_img relative',pageClass,hover ? inClass : outClass]" :xyz="xyz" @mouseenter="hover=true" @mouseleave="hover=false">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <els-content v-bind="data"></els-content>
  </div>
</template>

<script lang="ts" setup>
import { toRefs ,ref} from "vue";
import {useBg} from "../lib/bg"
import ElsContent, { ElsContentProps } from "../index";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  xyz?:string
  inClass?:string
  outClass?:string
  data?:ElsContentProps
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
  xyz:"",
  inClass:'',
  outClass:'',
  data:() => ({})
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
const {data,inClass,outClass,xyz} = toRefs(props)

const hover = ref(false)
</script>