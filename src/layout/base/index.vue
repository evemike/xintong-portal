<script lang="ts" setup>
import "@/assets/style/layout.scss";

import HeaderView from "./header.vue";
import FooterView from "./footer.vue";
import ContentView from "./content.vue";
import {ElBacktop} from "element-plus"
</script>


<template>
  <div class="layout-base theme-chenyujiao">
    <header-view></header-view>
    <content-view></content-view>
    <footer-view></footer-view>
    <el-backtop></el-backtop>
  </div>
</template>
<style scoped lang="scss">
.layout-base {
  // width: 100vw;
  // height: 100vh;
  position: relative;
}
</style>
