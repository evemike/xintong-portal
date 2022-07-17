<script lang="ts" setup>
import { ref, computed, unref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { ElButton } from "element-plus";
import TempIntroduce from "@/template/introduce/index.vue";
// api
import { getJsonFileData } from "@/api/base/json";

const router = useRouter();
const route = useRoute();
//
const pageName = route.params.name + "";
const pageData = ref<Record<string, any>>({});
// init Data
const initPageData = async () => {
  try {
    const data = await getJsonFileData("introduce");
    const { SHOW: show } = data;
    if (!show.includes(pageName)) {
      return router.go(-1);
    }
    pageData.value = data[pageName];
  } catch (e) {
    console.error(e);
  }
};
//
const init = () => {
  Promise.all([initPageData()]);
};
//
init();
//
const header = computed(() => {
  const d = unref(pageData)?.header || {};
  if (!d.linkText) {
    d.linkText = "进入控制台";
  }
  if (!d.background) {
    d.background = "#014ACA";
  }
  if(!d.img) {
    d.img = pageName
  }
  d.img = '/image/page/introduce/' + transImgName(d.img)
  return d;
});

const items = computed(() => {
  const d = unref(pageData)
  const layout = d.layout || []
  return layout.map((k:string) => ({...(d[k] || {})}))
})

// 图片名称处理
const transImgName = (name: string) => {
  const reg = /^.*?\.(png|jpg|jpeg|bmp|gif)$/;
  if (!reg.test(name)) {
    return name + ".png";
  }
  return name;
};
</script>

<template>
  <div class="page-introduce">
    <temp-introduce :header="header" :items="items" ></temp-introduce>
  </div>
</template>
