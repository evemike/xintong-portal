<script lang="ts" setup>
import { KeepAlive } from "vue";
import { RouterView, useRoute } from "vue-router";
import ElsMenu from "@/components/els-menu";
const route = useRoute();
</script>

<template>
  <div class="layout--content">
    <router-view v-slot="{ Component }">
      <keep-alive v-if="route?.meta?.keepAlive">
        <component :is="Component" />
      </keep-alive>
      <component :is="Component" v-else />
    </router-view>
  </div>
</template>
<style scoped lang="scss">
.layout--content {
  width:100%;
}
</style>
