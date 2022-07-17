<template>
  <div class="layout--header">

  </div>
</template>
<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { saveLocal, getLocal } from "@/utils/storage";
import { useI18n } from "vue-i18n";

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
  background: #2150e0;
  border-radius: 0px 0px 12px 12px;
  position: relative;
}
</style>
