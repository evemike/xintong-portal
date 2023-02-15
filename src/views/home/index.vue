<script lang="ts" setup>
import { ref, computed, unref } from "vue";
import TempHome from "@/template/home/index.vue";
// api
import { getJsonFileData } from "@/api/base/json";

const homeData = ref<Record<string, any>>({});
// const introduceData = ref<Record<string, any>>({});
//
const initHomeData = async () => {
  try {
    homeData.value = await getJsonFileData("home.json");
  } catch (e) {
    console.error(e);
  }
};
// const initIntroduceData = async () => {
//   try {
//     introduceData.value = await getJsonFileData("introduce.json");
//   } catch (e) {
//     console.error(e);
//   }
// };
//
const init = () => {
  Promise.all([initHomeData()]);
};
//
init();
// 图片名称处理
// const transImgName = (name: string) => {
//   if (!name) {
//     return undefined;
//   }
//   let res = name;
//   const reg = /^.*?\.(png|jpg|jpeg|bmp|gif)$/;
//   if (!reg.test(res)) {
//     res = res + ".png";
//   }
//   if (!/^\//.test(res) && !/^http/.test(res)) {
//     res = "/image/home/" + res;
//   }
//   return res;
// };
// 生成首页轮播
const carousel = computed(() => {
  const data = unref(homeData);
  const { CAROUSEL = [] } = data;
  // return CAROUSEL.map((k: string) => transImgName(k));
  console.log('..............',data,CAROUSEL)
  return CAROUSEL;
});
// 生成悬浮图层
const layer = computed(() => {
  const data = unref(homeData);
  const { LAYER } = data;
  return LAYER || undefined;
});
// 生成首页信息
const items = computed(() => {
  const data = unref(homeData);
  // const list = unref(introduceData)?.SHOW ?? [];
  const { CONTENTS = [] } = data;
  return CONTENTS.map((k: string) => ({
    
    // bg: `/image/home/${k}.png`,
    // link: list.includes(k) ? `/:lang/platform/introduce/${k}` : false,
    ...data[k],
  }));
});
</script>

<template>
  <div class="page-home">
    <temp-home :carousel="carousel" :layer="layer" :items="items"></temp-home>
  </div>
</template>

<style lang="scss">
.page-home {
  width: 100%;
  height: 100%;
}
</style>
