<script lang="ts" setup>
import "@/assets/style/layout.scss";

import HeaderView from "./header.vue";
// import HeaderView from "./header 2.vue";
import FooterView from "./footer.vue";
import ContentView from "./content.vue";
import { ElBacktop } from "element-plus"
import cardHeader from "../card/header.vue"
import {computed} from "vue"
import {useRoute} from "vue-router"

const route = useRoute();

const isHome = computed(() => route.path == '/home')

console.log('..........',route.path)

</script>


<template>
  <div class="layout-base theme-default">
    <header-view  :class="[isHome ? 'is-home fixed top-0 w-100% c-white' : 'sticky top-0 bg-white c-dark-200']"></header-view>
    <!-- <card-header></card-header> -->
    <content-view></content-view>
    
    <footer-view></footer-view>
    <!-- <el-backtop></el-backtop> -->
  </div>
</template>
<style scoped lang="scss">
.layout-base {
  width:100%;
  height:100%;
  // height: 100vh;
  position: relative;
  
}
</style>
