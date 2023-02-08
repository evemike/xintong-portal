<template>
  <div class="els-menu _card relative z-999">
    <div class="_header flex items-center z-9 h-64px">
      <slot name="left"></slot>
      <div class="_menus">
        <template v-for="(m, i) in menus" :key="`${m.key || ''}-${i}`">
          <div
            class="_item"
            :class="currentMenu == m ? 'is-active' : ''"
            @mouseenter="() => handleOver(m)"
            @mouseleave="() => handleOut(m)"
            @click="() => {}"
          >
            <span class="_label text-18px font-normal">{{ m.label }}</span>
            <b class="_bg absolute bottom-0 left-0 h-10px w-0"></b>
          </div>
        </template>
      </div>
      <slot name="right"></slot>
    </div>
    <div
      class="_card h-300px absolute z-1 w-100%"
      :class="[currentMenu ? 'xyz-in' : 'xyz-out']"
      xyz="fade up-100% duration-10 short-100% ease-liner"
      @mouseenter="() => handleOver()"
      @mouseleave="() => handleOut()"
    >
      <slot name="card" v-bind:scope="{ menu: currentMenu }"></slot>
    </div>
  </div>
</template>

<script>
import {ref} from "vue"

type Menu = Record<string,any> & {key?:string,label:string,path?:string,children?:any[]};

interface Props {
  menus:Menu[]
}

const props = withDefaults(defineProps<Props>(),{
  menus:() => []
})
const currentMenu = ref<Menu>();
let temp:Menu|undefined = undefined;
//
const handleOver = (m?:any) => {
  if(m){
    currentMenu.value = m;
  }
  else{
    currentMenu.value = temp;
  }
}
const handleOut = (m?:any) => {
  currentMenu.value = undefined;
  if(m){
    temp = m;
  }
}
</script>

<style lang="scss" scoped>
.els-menu._card {
  ._header {
    &:hover {
      backdrop-filter: blur(10px);
    }
    ._menus {
      ._item {
      }
    }
  }
  >._card{

  }
}
</style>
