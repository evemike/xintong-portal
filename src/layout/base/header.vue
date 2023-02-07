<template>
  <div class="layout--header relative bg-transparent z-999">
    <div class="_header flex h-64px relative items-center z-9">
      <!-- logo -->
      <div v-if="website.logo" class="_logo w-32px">
        <img :src="`/image/logo/${transImgName(website.logo)}`" />
      </div>
      <!-- title -->
      <div v-if="website.title" class="_title text-20px font-bold">
        {{ t(website.title) }}
      </div>
      <!-- menu -->
      <div class="els-menu relative flex h-64px items-center">
        <template v-for="(m, i) in menuTree" :key="i">
          <div
            class="_menu-item relative h-100%"
            :class="currentMenu == m ? 'is-active' : ''"
            @mouseenter="() => handleOver(m)"
            @mouseleave="() => handleOut(m)"
          >
            <span class="_text text-18px font-normal">{{ t(m.label, m.label) }}</span>
            <b class="_bg bottom-0 left-0 h-10px w-0 bg-red"></b>
          </div>
        </template>
      </div>
      
      <!-- <els-menu :menu-tree="menuTree" prefix="/platform"></els-menu> -->
      <!-- language -->
      <el-select v-model="language" @change="handleChangeLanguage">
        <el-option label="简体中文" value="zh-cn"></el-option>
        <el-option label="English" value="en"></el-option>
      </el-select>
    </div>
    <div></div>
    <div
        class="_card absolute h-300px top-64px w-100% bg-red z--5"
        :class="[currentMenu ? 'xyz-in' : 'xyz-out']"
        xyz="fade up-100% duration-10 short-100% ease-liner"
        @mouseenter="() => handleOver()"
        @mouseleave="() => handleOut()"
      ></div>
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
const currentMenu = ref<Record<string, any> | undefined>();
let tempmenu:any = undefined;
//
const handleOver = (m:any = tempmenu) => {
  currentMenu.value = m;
}
const handleOut = (m?:any) => {
  currentMenu.value = undefined;
  if(m){
    tempmenu = m;
  }
}
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
