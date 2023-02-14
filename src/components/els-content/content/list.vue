<template>
  <div :class="['_list relative', pageClass]" @click="handleClick">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <CTEXT v-if="title" v-bind="textAttr" />
    <div v-if="hasBox" :class="['_list-box', boxClass]">
      <template v-for="(c, i) in contents" :key="i">
        <ElsContent
          v-bind="mergeProps(common, { class: commonClass }, c)"
          :is-hover="hoverVal == i"
          @mouseenter="() => handleOver(i)"
          @mouseleave="handleOut()"
        />
      </template>
    </div>
    <template v-else>
      <template v-for="(c, i) in contents" :key="i">
        <ElsContent
          v-bind="mergeProps(common, { class: commonClass }, c)"
          :is-hover="hoverVal == i"
          @mouseenter="() => handleOver(i)"
          @mouseleave="handleOut()"
        />
      </template>
    </template>
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
  title?: string | TextProps;
  link?: string | Record<string, any>;
  common?: Record<string, any>;
  commonClass?: string;
  hasBox?: boolean;
  boxClass?: string;
  data: ElsContentProps[];
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
const { pageClass, bgClass, bgUrl, hoverVal, handleOver, handleOut } = useBg(props);
//
const { data, common, title, link } = toRefs(props);
//

// text
const textAttr = computed(() => {
  if (typeof title.value === "string") {
    return { text: title.value };
  }
  return title.value;
});
//
const contents = computed(() => new Array<any>().concat(data.value));
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
