<template>
  <div :class="['relative',pageClass]">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass" :xyz="xyz">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
      <CSVG v-if="bgIcon" :icon="bgIcon" :class="iconClass" />
    </div>
    <els-content v-bind="data"></els-content>
  </div>
</template>

<script lang="ts" setup>
import { toRefs ,ref} from "vue";
import {useBg} from "../lib/bg"
import ElsContent, { ElsContentProps } from "../index";
import CSVG from "../base/svg.vue"
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
const {pageClass,bgClass,bgUrl,bgIcon,iconClass} = useBg(props);
//
const {data,xyz,inClass,outClass} = toRefs(props)

</script>