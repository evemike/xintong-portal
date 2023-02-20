<template>
  <div :class="['_list relative', pageClass]" @click="handleClick">
    <div
      v-if="bg"
      class="_bg absolute w-100% h-100% top-0 left-0"
      :class="bgClass"
    >
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <CTEXT v-if="title" v-bind="textAttr" />
    <div ref="boxRef" :class="['_list-box', boxClass]">
      <div
        v-for="(c, i) in contents"
        :key="i"
        class="absolute"
        :style="itemsStyle[i]"
      >
        <ElsContent
          v-bind="mergeProps(common, { class: commonClass }, c)"
          :is-hover="hoverVal == i"
          @mouseenter="() => handleOver(i)"
          @mouseleave="handleOut()"
        />
      </div>
    </div>
    <slot :scope="currentData">
      <template v-if="centerData">
        <ElsContent v-bind="centerData" />
      </template>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, unref, mergeProps, ref, watch } from "vue";
import { useBg } from "../lib/bg";
import ElsContent, { ElsContentProps } from "../index";
import CTEXT, { Props as TextProps } from "../base/text.vue";
import { useRouter } from "vue-router";
//
export interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  title?: string | TextProps | Record<string, any>;
  link?: string | Record<string, any>;
  common?: Record<string, any>;
  commonClass?: string;
  hasBox?: boolean;
  boxClass?: string;
  data?: ElsContentProps[];
  centerData?: ElsContentProps;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  title: "",
  commonClass: "",
  boxClass: "",
  hasBox: false,
  common: () => ({}),
  data: () => [],
});
//
const { pageClass, bgClass, bgUrl, hoverVal, handleOver, handleOut } =
  useBg(props);
//
const { data, common, title, link } = toRefs(props);
//
const currentData = ref<any>();
// text
const textAttr = computed(() => {
  if (typeof title.value === "string") {
    return { text: title.value };
  }
  return title.value;
});
//
const boxRef = ref<HTMLDivElement>();
const contents = computed(() => new Array<any>().concat(data.value));
const len = computed(() => unref(contents).length);
const currentIndex = ref(0);
const pos = computed(() => {
  if (len.value == 0) {
    return [];
  }
  if (!boxRef.value) {
    return [];
  }
  const w = boxRef.value.clientWidth;
  const h = boxRef.value.clientHeight;
  //
  const a = w / 2;
  const b = h / 2;
  //
  const t = (90 - 360 / unref(len)) * (Math.PI / 360);

  //
  for (let i = 0; i < len.value; i++) {
    const ti = Math.tan(t * i);
    const x = (a * a * b * b) / (b * b + a * a * ti * ti);
    //
    const y = ti * x;
    console.log("..........", x, y, ti);
  }
  return [];
});
const itemsStyle = computed(() => {
  return [];
});
// 卡片跳转条件 ：link
const handleClick = () => {
  handleLink(unref(link));
};
const handleLink = (link: string | Record<string, any> | undefined) => {
  if (link) {
    linkTo(link);
  }
};
//
const router = useRouter();
// link
const linkTo = (link: string | Record<string, any>) => {
  if (typeof link === "string" && /^http/.test(link)) {
    //
    window.open(link, "_blank");
  } else {
    router.push(link);
  }
};
</script>
