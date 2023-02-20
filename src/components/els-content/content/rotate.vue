<template>
  <div :class="['_list relative', pageClass]" @click="handleClick">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <CTEXT v-if="title" v-bind="textAttr" />
    <div ref="boxRef" :class="['_list-box relative flex items-center justify-center', boxClass]">
      <div
        v-for="(c, i) in contents"
        :key="i"
        class="_rotate--item absolute inline-block top-0 left-0"
        :class="[currentIndex % len == i ? currentClass : '']"
        :style="itemsStyle[i]"
      >
        <ElsContent
          v-bind="mergeProps(common, { class: commonClass }, c)"
          :is-hover="hoverVal == i"
          @mouseenter="() => handleOver(i)"
          @mouseleave="handleOut()"
        />
      </div>
      <slot :scope="currentData">
        <template v-if="centerData">
          <ElsContent v-bind="centerData" />
        </template>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, unref, mergeProps, ref, onMounted, nextTick } from "vue";
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
  currentClass?:string;
  data?: ElsContentProps[];
  centerData?: ElsContentProps;
  stopWhenHover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  title: "",
  commonClass: "",
  boxClass: "",
  currentClass: "",
  hasBox: false,
  common: () => ({}),
  data: () => [],
});
//
const { pageClass, bgClass, bgUrl, hoverVal, handleOver, handleOut } = useBg(props);
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
const getPoint = ({ a, b, p = 30, cx = 0, cy = 0 }: Record<string, number>) => {
  const data: [number, number][] = [];
  for (let i = 0; i < 360; i = i + p) {
    const x = a * Math.cos((Math.PI * 2 * i) / 360);
    const y = b * Math.sin((Math.PI * 2 * i) / 360);
    data.push([x + cx, y + cy]);
  }
  console.log(a, b, p, cx, cy, data);
  return data;
};
//
const boxRef = ref<HTMLDivElement>();
const contents = computed(() => new Array<any>().concat(data.value));
const len = computed(() => unref(contents).length);
const currentIndex = ref(0);
const pos = ref<[number, number][]>([]);

const initPos = () => {
  if (len.value == 0 || !boxRef.value) {
    return [];
  }
  const w = boxRef.value.offsetWidth;
  const h = boxRef.value.offsetHeight;
  //
  const a = w / 2;
  const b = h / 2;
  //
  const t = 360 / unref(len);
  //
  pos.value = getPoint({ a, b, p: t, cx: a, cy: b });
};
const itemsStyle = computed(() => {
  if (pos.value.length == 0) {
    return [];
  }
  const p = pos.value;
  const t = currentIndex.value;
  const l = len.value;
  const res: string[] = [];
  //
  for (let i = 0; i < l; i++) {
    const j = (t + i) % l;
    const [x, y] = p[j];
    res.push(`left:${x}px;top:${y}px`);
  }
  return res;
});

onMounted(() => {
  setTimeout(() => {
    nextTick(() => {
      setTimeout(() => {
        initPos();
      }, 0);
    });
  }, 0);
});

setInterval(() => {
  currentIndex.value = currentIndex.value + 1;
}, 4000);
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

<style lang="scss">
._rotate--item {
  transition: all 0.5s ease-in-out;
}
</style>
