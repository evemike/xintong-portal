<template>
  <div :class="['_text relative',pageClass]" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <ElsText :text="text" :splits="splits" :annotation="annotation" />
  </div>
</template>

<script lang="ts" setup>
import { toRefs,computed } from "vue";
import {useBg} from "../lib/bg"
import { TORA } from "@/utils/intf"
import ElsText, { ElsTextProps } from "@/components/els-text";
//
interface Props extends ElsTextProps {
  class?: string;
  bg?: string | { url?: string; class?: string };
  text: string;
  splits: [paragraph: string, line: string];
  annotation: {
    class: string | string[];
    line?: number | number[];
    text: string | string[];
    check?: (t: string, l: number) => boolean;
  }[];
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
const {text,splits,annotation} = toRefs(props)
//
</script>