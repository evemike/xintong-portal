<template>
  <div class="layout--header top-0 z-999 h-64px">
    <Card :menus="menuTree" menus-class="pl-20px">
      <template #left>
        <!-- logo -->
        <div v-if="website.logo" class="_logo w-32px pl-20px">
          <img :src="`/image/logo/${transImgName(website.logo)}`" />
        </div>
        <!-- title -->
        <div v-if="website.title" class="_title text-14px font-bold pl-20px">
          {{ t(website.title) }}
        </div>
      </template>
      <template #right>
        <el-select
          v-model="language"
          class="_language pr-20px"
          @change="handleChangeLanguage"
        >
          <el-option label="简体中文" value="zh-cn"></el-option>
          <el-option label="English" value="en"></el-option>
        </el-select>
      </template>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { saveLocal, getLocal } from "@/utils/storage";
import { useI18n } from "vue-i18n";
import { ElSelect, ElOption } from "element-plus";
import ElsMenu, { Card } from "@/components/els-menu";

//
const router = useRouter();
const store = useStore();
//
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
//
</script>

<style lang="scss">
.layout--header {
  
  ._language {
    .el-input {
      width:120px;
      &:hover {
        .el-input__wrapper {
          input{
            color:#fff;
            font-weight: bold;
          }
          background-color: transparent;
          box-shadow: none;
        }
      }
      .el-input__wrapper {
        background-color: transparent;
        box-shadow: none;
      }
    }
  }
}
</style>
