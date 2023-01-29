<template>
  <div
    :class="['_switch relative', pageClass]"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <TransitionGroup name="switch">
      <!-- main -->
      <div v-show="!mainHide && !show" :class="['relative w-100% h-100%']">
        <ElsContent v-bind="data[0]" />
      </div>
      <!-- hide -->
      <div v-show="show" :class="['absolute w-100% h-100% translate-y--100%', hideClass]">
        <ElsContent v-bind="data[1]" />
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, ref } from "vue";
import { useBg } from "./bg";
import ElsContent, { ElsContentProps } from "./index";

//
interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  mainHide?: boolean;
  hideClass?: string;
  data: [ElsContentProps, ElsContentProps];
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  mainHide: false,
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data, mainHide, hideClass } = toRefs(props);
//
const show = ref(false);
//
</script>

<style scoped>
.switch-move,
.switch-enter-active,
.switch-leave-active {
  transition: all 0.5s ease;
}
.switch-leave-from,
.switch-enter-to {
  transform: translateX(0);
  transform: translateY(0);
  opacity: 1;
}

.switch-leave-active {
  position: absolute;
}
</style>
