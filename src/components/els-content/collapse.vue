<template>
  <div class="_collapse relative" :class="cs">
    <div class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <!-- title-text -->
    <el-collapse v-bind="attr">
      <template v-for="([title,content],i) in data" :key="i">
        <el-collapse-item :name="i">
          <template #title>
            <els-text v-bind="title"></els-text>
          </template>
          <els-content v-bind="content"></els-content>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";
import {ElCollapse,ElCollapseItem} from "element-plus"
import ElsText, { ElsTextProps } from "@/components/els-text";
import ElsContent from "@/components/els-content"

interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  attr?:Record<string,any>;
  data:([title:string|ElsTextProps,content:Record<string,any>])[];
}

const props = withDefaults(defineProps<Props>(), {
  class: "w-100% h-200px",
  bg: "transparent",
  attr:() => ({}),
  data:() => [],
  imgs: "",
  text: "",
  type:"base"
});

const { class: cs, bg,data,attr} = toRefs(props);

// background
const bgUrl = computed(() => {
  if (typeof bg.value === "string") {
    const isUrl = /\.(\w+)$/.test(bg.value);
    return isUrl ? bg.value : "";
  }
  //
  return bg.value?.url || "";
});

const bgClass = computed(() => {
  if (typeof bg.value === "string") {
    const isUrl = /\.(\w+)$/.test(bg.value);
    return isUrl ? "" : bg.value;
  }
  return bg.value?.class || "";
});

</script>

<script lang="ts">
export default {
  name: "els-content-collapse",
};
</script>
