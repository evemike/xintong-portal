<template>
  <div :class="['_link relative', pageClass]" @click="handleClick">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <ElsText v-if="title" v-bind="textAttr" />
    <template v-for="({link,...c}, i) in contents" :key="i">
      <div class="_link-item relative w-100% h-100%" @click="() => handleLink(link)">
        <ElsContent v-bind="c" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, unref } from "vue";
import { useBg } from "./bg";
import { TORA } from "@/utils/intf";
import ElsContent, { ElsContentProps } from "./index";
import ElsText, { ElsTextProps } from "@/components/els-text";
import { useRouter } from "vue-router";
//
interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  title?: string | ElsTextProps;
  link?: string | Record<string, any>;
  data: TORA<ElsContentProps & { link?: string | Record<string, any> }>;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  title: "",
  link: "",
  data: () => [],
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data, title, link } = toRefs(props);
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
  handleLink(unref(link))
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
