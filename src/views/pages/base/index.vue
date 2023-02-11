<template>
  <div class="_common-page relative w-100% h-100%">
    <template v-for="(item,i) in items" :key="i">
      <ElsContent v-bind="item" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
// api
import { getJsonFileData } from "@/api/base/json";
import ElsContent from "@/components/els-content";
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

const items = computed(() => {
  const data = unref(pageData);
  const { CONTENTS = [] } = data;
  return CONTENTS.map((k: string) => ({
    ...(data[k] || {}),
  }));
});

initPageData();
</script>