<template>
  <div :class="['relative', pageClass]">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <div :class="['relative  transition-all', `roate-${ca}`]">
      <div
        v-for="(
          { xyz = '', inclass = '', outclass = '', class: cs = '', ...c }, i
        ) in data"
        :key="i"
        :class="[cs, ci == i ? inclass : outclass]"
        :xyz="xyz"
        @mouseenter="() => handleMouseEnter(i)"
        @mouseleave="() => handleMouseLeave()"
      >
        <els-content v-bind="c"></els-content>
      </div>
    </div>

    <div class="">
      <els-content v-if="hd" v-bind="hd"></els-content>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, computed, onBeforeUnmount } from "vue";
import { useBg } from "../lib/bg";
import ElsContent, { ElsContentProps } from "../index";
import { get, has } from "lodash";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  auto?: boolean;
  duration?: number;
  data: (ElsContentProps & {
    xyz?: string;
    inclass?: string;
    outclass?: string;
    class?: string;
  })[];
  contentProps?: ([string, string] | string)[];
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  auto: true,
  duration: 3000,
  contentProps: () => ["data"],
  main: () => ({}),
  data: () => [{}, {}],
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { duration, contentProps } = props;
const { data, auto } = toRefs(props);
//
const ci = ref(0);
//
const hd = computed<ElsContentProps>(() => {
  const d = data.value[ci.value];
  const res:ElsContentProps = {};
  contentProps.forEach((k) => {
    let key: string, val: string;
    if (typeof k === "string") {
      key = k;
      val = k;
    } else {
      key = k[0];
      val = k[1];
    }

    res[val] = d[key];
  });
  return res;
});
//
let ti = -1;
const handleMouseEnter = (i: number) => {
  ti = ci.value;
  ci.value = i;
};
const handleMouseLeave = () => {
  // hd.value = undefined;
  ci.value = ti;
  ti = -1;
};
// 自动旋转
const dl = data.value.length;
const angle = Math.floor(360 / dl); // 固定旋转角度
const ca = ref(0);
//
const loop = () => {
  if (ci.value + 1 > dl) {
    ci.value = 0;
  }
  ca.value = ci.value * angle;
};
//
const timeHandle = setInterval(() => {
  if (ti == -1) {
    loop();
  }
}, duration);
// 清除计数器
onBeforeUnmount(() => {
  if (timeHandle != undefined) {
    window.clearInterval(timeHandle);
  }
});
</script>
