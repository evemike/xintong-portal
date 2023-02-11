<script lang="ts" setup>
import "@/assets/style/layout.scss";

import HeaderView from "./header.vue";
import FooterView from "./footer.vue";
import ContentView from "./content.vue";
import { ElBacktop } from "element-plus"
import cardHeader from "../card/header.vue"
</script>


<template>
  <div class="layout-base theme-default">
    <header-view class="fixed top-0 w-100%"></header-view>
    <!-- <card-header></card-header> -->
    <content-view></content-view>
    
    <!-- <footer-view></footer-view> -->
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
