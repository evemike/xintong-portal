<template>
  <div class="font-700 text-32px">
    Test

    <template v-for="(d,i) in tempData" :key="i" >
      <ElsContent v-bind="d" />
    </template>

    
  </div>
</template>

<script lang="ts" setup>
import ElsContent from "@/components/els-content"
//
import { getJsonFileData } from "@/api/base/json"
import { ref } from "vue";
//
const tempData = ref([])
const init = async () => {
  const pageData = await getJsonFileData('test')
  console.log('=========ccc=======',pageData)
  tempData.value = pageData.template;
}

init();
//
</script>
