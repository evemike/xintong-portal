<template>
  <div :class="['_link relative',pageClass]" >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <ElsText v-if="title" v-bind="textAttr" />
    <template v-for="(c,i) in contents" :key="i">
      <ElsContent v-bind="c" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { toRefs,computed } from "vue";
import {useBg} from "./bg"
import { TORA } from "@/utils/intf"
import ElsContent from "./index"
import ElsText, { ElsTextProps } from "@/components/els-text";
//
interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  title?:string | ElsTextProps;
  data:TORA<any>
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
  title:"",
  data:() => []
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
const {data,title} = toRefs(props);
// text
const textAttr = computed(() => {
  if (typeof title.value === "string") {
    return { text: title.value };
  }
  return title.value;
});
//
const contents = computed(() => new Array<any>().concat(data.value))
</script>