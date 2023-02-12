<template>
  <div :key="pageName" class="_common-page relative w-100% h-100%">
    <template v-for="(item, i) in itemsData" :key="`${pageName}-${i}`">
      <ElsContent v-bind="item" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, unref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
// api
import { getJsonFileData } from "@/api/base/json";
import ElsContent from "@/components/els-content";
//
const router = useRouter();
const route = useRoute();
const pageName = computed(() => route.params.name as string);
//
// const pageData = ref<Record<string, any>>({});
const itemsData = ref<Record<string,any>[]>([])
// init Data
const initPageData = async () => {
  const pn = unref(pageName);
  try {
    const data = await getJsonFileData(pn);
    const { SHOW: show } = data;
    if (show === false) {
      return router.go(-1);
    }
    // pageData.value = data;
    const { CONTENTS = [] } = data;
    itemsData.value = CONTENTS.map((k: string) => ({
    ...(data[k] || {}),
  }));
  } catch (e) {
    console.error(e);
  }
};

// const items = computed(() => {
//   const data = unref(pageData);
//   const { CONTENTS = [] } = data;
//   return CONTENTS.map((k: string) => ({
//     ...(data[k] || {}),
//   }));
// });

initPageData();

watch(pageName, () => {
  initPageData();
  //
});
</script>
