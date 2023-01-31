<template>
  <XyzTransitionGroup v-if="isArray" v-bind="attr">
    <template v-for="(c,i) in data" :key="i">
      <ElsContent v-bind="c" />
    </template>
  </XyzTransitionGroup>
  <XyzTransition v-else v-bind="attr">
    <ElsContent v-bind="data" />
  </XyzTransition>
</template>

<script lang="ts" setup>
import { toRefs ,computed} from "vue";
import {useBg} from "../lib/bg"
import ElsContent, { ElsContentProps } from "../index";
import { TORA } from "@/utils/intf";

//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  data:TORA<ElsContentProps>
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
  hoverClass:"",
  data:() => ({})
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
const {data,...attr} = toRefs(props)
//
const isArray = computed(() => Array.isArray(data.value))
</script>