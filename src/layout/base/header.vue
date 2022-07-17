<template>
  <div class="layout--header">
    <!-- logo -->
    <div class="logo" v-if="website.logo">
      <img :src="`/image/logo/${transImgName(website.logo)}`"/>
    </div>
    <!-- title -->
    <div class="title" v-if="website.title">{{ website.title }}</div>
    <!-- menu -->
    <els-menu :menu-tree="menuTree" prefix="/:lang/platform"></els-menu>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { saveLocal, getLocal } from "@/utils/storage";
import { useI18n } from "vue-i18n";
import ElsMenu from "@/components/els-menu"
const router = useRouter();
const store = useStore();
const options = [
  {
    value: "zh-cn",
    label: "简体中文",
  },
  {
    value: "en",
    label: "English",
  },
];
const { t } = useI18n();
//
const website = computed(() => store.getters.website);
//
const menuTree = getLocal('DYNAMIC_MENUS',true)
// 图片名称处理
const transImgName = (name: string) => {
  const reg = /^.*?\.(png|jpg|jpeg|bmp|gif)$/;
  if (!reg.test(name)) {
    return name + ".png";
  }
  return name;
};
const changeLan = (v: string) => {
  saveLocal("i18nLocal", v);
  const str = router.currentRoute.value.fullPath;
  const s = str.indexOf("/", str.indexOf("/") + 1);
  const r = "/" + v + str.slice(s);
  router.push(r).then(() => {
    location.reload();
  });
};
const handleCommand = (v: string | number | object) => {
  // 清除 token
  store.commit("setToken", "");
  router.push("/");
};
</script>
<style lang="scss">
.layout--header {
  
  position: relative;
}
</style>
