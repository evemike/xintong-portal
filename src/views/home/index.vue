<script lang="ts" setup>
import { ref, computed, unref } from "vue";
import TempHome from "@/template/home/index.vue";
// api
import { getJsonFileData } from "@/api/base/json";

const homeData = ref<Record<string, any>>({});
const introduceData = ref<Record<string, any>>({});
//
const initHomeData = async () => {
  try {
    homeData.value = await getJsonFileData("home.json");
  } catch (e) {
    console.error(e);
  }
};
const initIntroduceData = async () => {
  try {
    introduceData.value = await getJsonFileData("introduce.json");
  } catch (e) {
    console.error(e);
  }
};
//
const init = () => {
  Promise.all([initHomeData(), initIntroduceData()]);
};
//
init();
// 图片名称处理
const transImgName = (name: string) => {
  const reg = /^.*?\.(png|jpg|jpeg|bmp|gif)$/;
  if (!reg.test(name)) {
    return name + ".png";
  }
  return name;
};
// 生成首页轮播
const carousel = computed(() => {
  const data = unref(homeData);
  const { CAROUSEL = [] } = data;
  return CAROUSEL.map((k: string) => `/image/home/${transImgName(k)}`);
});
// 生成首页信息
const items = computed(() => {
  const data = unref(homeData);
  const list = unref(introduceData)?.SHOW ?? [];
  const { CONTENTS = [] } = data;
  return CONTENTS.map((k: string) => ({
    ...data[k],
    img: `/image/home/${k}.png`,
    link: list.includes(k) ? `/:lang/platform/introduce/${k}` : false,
  }));
});
</script>

<template>
  <div class="page-home">
    <temp-home :carousel="carousel" :items="items"></temp-home>
  </div>
</template>

<style lang="scss">
.page-home {
  width: 100%;
  height: 100%;
}
</style>
