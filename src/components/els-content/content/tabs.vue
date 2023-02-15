<template>
  <div :class="['_tabs relative', pageClass]">
    <div
      v-if="bg"
      class="_bg absolute w-100% h-100% top-0 left-0"
      :class="bgClass"
    >
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <CTEXT v-if="title" v-bind="textAttr" />
    <ElTabs :class="boxClass" v-bind="tabsProps">
      <ElTabPane
        v-for="({ label, ...c }, i) in contents"
        :key="i"
      >
        <template #label>
          <CTEXT v-bind="getLabelAttr(label)" />
        </template>
        <ElsContent
          v-bind="mergeProps(common, { class: commonClass }, c)"
          :is-hover="hoverVal == i"
          @mouseenter="() => handleOver(i)"
          @mouseleave="handleOut()"
        />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, unref, mergeProps, ref, watch } from "vue";
import { useBg } from "../lib/bg";
import { ElTabs, ElTabPane } from "element-plus";
import ElsContent, { ElsContentProps } from "../index";
import CTEXT, { Props as TextProps } from "../base/text.vue";
//
export interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  title?: string | TextProps;
  tabsProps?: Record<string, any>;
  common?: Record<string, any>;
  commonClass?: string;
  boxClass?: string;
  data: (ElsContentProps & { label: string | TextProps })[];
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  title: "",
  commonClass: "",
  boxClass: "",
  hasBox: false,
  common: () => ({}),
  tabsProps: () => ({}),
  data: () => [],
});
//
const { pageClass, bgClass, bgUrl, hoverVal, handleOver, handleOut } =
  useBg(props);
//
const { data, title } = toRefs(props);
// text
const textAttr = computed(() => {
  if (typeof title.value === "string") {
    return { text: title.value };
  }
  return title.value;
});

const getLabelAttr = (label: string | TextProps) => {
  if (typeof label === "string") {
    return { text: label };
  }
  return label;
};
//
const contents = computed(() =>
  new Array<ElsContentProps & { label: string | TextProps }>().concat(data.value)
);
</script>
