<template>
  <el-icon :class="['_svg relative',pageClass]" >
    <svg-icon :id="icon" />
  </el-icon>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import {useBg} from "../lib/bg"
import {ElIcon} from "element-plus"
import SvgIcon from "@/components/svg-icon"
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  icon:string
}

const props = withDefaults(defineProps<Props>(),{
  class:"",
  bg:"",
  icon:"",
})
//
const {pageClass,bgClass,bgUrl} = useBg(props);
//
const {icon} = toRefs(props)
</script>