<script setup lang="ts">
import { MenuItem } from "@/components/els-menu"
import MenuCard from "@/components/els-menu/card.vue"

const menu:MenuItem[] = [{label:"A",path:"/a",card:2,children:[
  {label:"B",path:"/b"}
]}]
</script>

<template>
  <div class="h-100">
    <MenuCard :menu-tree="menu">
      <template #card="scope">
        <div class="h-100">
          {{scope.menu}}
          <!-- <template v-if="scope.menu.card"></template> -->
        </div>
      </template>
    </MenuCard>
  </div>
</template>
