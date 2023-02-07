<template>
  <div class="els-menu _card relative z-999">
    <div class="_header flex items-center z-9 h-64px">
      <slot name="left"></slot>
      <div class="_menus">
        <template v-for="(m, i) in menus" :key="`${m.key || ''}-${i}`">
          <div class="_item"></div>
        </template>
      </div>

      <slot name="right"></slot>
    </div>
    <div class="_card z-1">
      <slot name="card"></slot>
    </div>
  </div>
</template>

<script>
import {} from "vue"

interface Props {
  menus:(Record<string,any> & {key?:string,label:string,path?:string,children?:any[]})[]
}

const props = withDefaults(defineProps<Props>(),{
  menus:() => []
})
</script>

<style lang="scss">
.els-menu._card {
  ._header {
    &:hover {
      backdrop-filter: blur(10px);
    }
  }
}
</style>
