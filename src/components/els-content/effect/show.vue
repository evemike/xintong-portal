<template>
  <div
    ref="boxRef"
    :class="['relative', pageClass, visible ? inClass : outClass]"
    :xyz="xyz"
  >
    <div v-if="bg" class="absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <els-content v-bind="data"></els-content>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, onMounted, computed } from "vue";
import { useBg } from "../lib/bg";
import ElsContent, { ElsContentProps } from "../index";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  xyz?: string;
  inClass: string;
  outClass: string;
  data: ElsContentProps;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  xyz: "",
  inClass: "",
  outClass: "",
  data: () => ({}),
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data, inClass, outClass, xyz } = toRefs(props);
//
const boxRef = ref<HTMLDivElement>();
//
const visible = ref(false);

const isVisible = () => {
  if (boxRef.value) {
    const { top, bottom, left, right } = boxRef.value.getBoundingClientRect();
    const ih = window.innerHeight;
    const iw = window.innerWidth;
    if (bottom >= 0 && top < ih && right >= 0 && left < iw) {
      return true;
    }
  }
  return false;
};

onMounted(() => {
  visible.value = isVisible();
  //
  window.addEventListener("scroll", () => (visible.value = isVisible()));
  window.addEventListener("resize", () => (visible.value = isVisible()));
});
</script>
