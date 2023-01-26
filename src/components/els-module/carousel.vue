<script lang="ts" setup>
import { ElCarousel, ElCarouselItem, ElIcon, ElImage } from "element-plus";

interface Props {
  data:Record<string,any>[]
}

const props = withDefaults(defineProps<Props>(),{
  data:() => []
})
</script>

<template>
  <el-carousel> 
    <template v-for="d in data"></template>
  </el-carousel>
</template>
