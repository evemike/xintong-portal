<template>
  <TempPage />
</template>

<script lang="ts" setup>
import { ref, computed, unref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import TempPage from "@/template/index.vue"
// api
import { getJsonFileData } from "@/api/base/json";
//
const router = useRouter();
const route = useRoute();
const pageName = route.params.name as string;
//
const pageData = ref<Record<string, any>>({});
// init Data
const initPageData = async () => {
  const pn = unref(pageName);
  try {
    const data = await getJsonFileData(pn);
    const { SHOW: show } = data;
    if (!show.includes(pn)) {
      return router.go(-1);
    }
    pageData.value = data;
  } catch (e) {
    console.error(e);
  }
};

initPageData();
</script>