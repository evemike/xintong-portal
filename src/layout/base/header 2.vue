<template>
  <div class="layout--header z-999 flex items-center justify-between">
  <div class="flex items-center">
  <!-- logo -->
  <div v-if="website.logo" class="logo">
      <img :src="`/image/logo/${transImgName(website.logo)}`" />
    </div>
    <!-- title -->
    <div v-if="website.title" class="title w-200px">{{ t(website.title) }}</div>
  </div>
    
    <!-- menu -->
    <els-menu :menu-tree="menuTree" ></els-menu>
    <!-- language -->
    <el-select v-model="language" @change="handleChangeLanguage">
      <el-option label="简体中文" value="zh-cn"></el-option>
      <el-option label="English" value="en"></el-option>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { saveLocal, getLocal } from "@/utils/storage";
import { useI18n } from "vue-i18n";
import { ElSelect, ElOption } from "element-plus";
import ElsMenu from "@/components/els-menu";

//
const router = useRouter();
const store = useStore();
// const options = [
//   {
//     value: "zh-cn",
//     label: "简体中文",
//   },
//   {
//     value: "en",
//     label: "English",
//   },
// ];
const language = ref("");
language.value = getLocal("i18nLocal") || "zh-cn";
const handleChangeLanguage = (v: string) => {
  saveLocal("i18nLocal", v);
  locale.value = v;
  // 刷新或者切换语言
};
const { t, locale } = useI18n();
//
const website = computed(() => store.getters.website);
//
const menuTree = computed(() => store.getters.menuTree || []);
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
  &:hover{
    backdrop-filter: blur(10px);
  }
  .el-menu-item{
    background: transparent;
  }
  > .el-select {
    .el-input {
      .el-input__wrapper {
        background: transparent;
        box-shadow: none !important;
        input {
          color: #fff;
        }
      }
      .el-input__suffix {
        color: #fff;
        opacity: 0;
      }
      &:hover {
        .el-input__suffix {
          opacity: 1;
        }
        .el-input__wrapper{
          box-shadow: 0 0 0 1px #ddd !important;
        }
      }
    }
  }
}
</style>
