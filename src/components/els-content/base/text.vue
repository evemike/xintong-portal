<template>
  <div :class="['relative',pageClass]" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <div :class="[textClass,{'absolute':bgUrl},'w-100% z-index:99']" >
      <ElsText :text="text" :splits="splits" :annotation="annotation" />
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { toRefs,computed } from "vue";
import {useBg} from "../lib/bg"
import { TORA } from "@/utils/intf"
import ElsText, { ElsTextProps } from "@/components/els-text";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  text?: string;
  textClass?:string;
  splits?: [paragraph: string, line: string];
  annotation?: {
    class: string | string[];
    line?: number | number[];
    text: string | string[];
    check?: (t: string, l: number) => boolean;
  }[];
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  textClass:"",
  bg:"",
  text:"",
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
const {text,splits,annotation} = toRefs(props)
//
</script>