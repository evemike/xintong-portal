<script lang="ts" setup>
import { computed, unref, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElLink } from "element-plus";
// api
import { getJsonFileData } from "@/api/base/json";
import ElsContent from "@/components/els-content";
const store = useStore();
//
const website = computed(() => store.getters.website);
const pageName = "footer";
//
const pageClass = ref("");
const itemsData = ref<Record<string, any>[]>([]);
const initPageData = async () => {
  const pn = unref(pageName);
  try {
    const data = await getJsonFileData(pn);
    // pageData.value = data;
    const { CONTENTS = [] } = data;
    pageClass.value = data.class ?? "";
    itemsData.value = CONTENTS.map((k: string) => ({
      ...(data[k] || {}),
    }));
  } catch (e) {
    console.error(e);
  }
};

initPageData();
</script>

<template>
  <div v-if="website.footer" :class="['layout--footer',pageClass]">
    <template v-for="(item, i) in itemsData" :key="`${pageName}-${i}`">
      <ElsContent v-bind="item" />
    </template>
  </div>
</template>
