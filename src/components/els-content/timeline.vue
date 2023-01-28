<template>
  <div :class="['_timeline relative',pageClass]" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs,computed } from "vue";
import {useBg} from "./bg"
import { TORA } from "@/utils/intf"
import ElsContent,{ElsContentProps} from "./index"
//
interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  data: [node: Record<string, any>, content: ElsContentProps][];
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
//
</script>