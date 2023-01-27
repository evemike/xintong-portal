<template>
  <div class="time-line relative" :class="cs">
    <div v-if="bg" :class="['_bg absolute w-100% h-100% top-0 left-0',bgClass]">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <el-timeline>
      <template v-for="([node, content], i) in data" :key="i">
        <el-timeline-item v-bind="node">
          <els-content v-bind="content"></els-content>
        </el-timeline-item>
      </template>
    </el-timeline>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed } from "vue";
import { ElTimeline, ElTimelineItem } from "element-plus";
import ElsContent, { ElsContentProps } from "@/components/els-content";
interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  data: [node: Record<string, any>, content: ElsContentProps][];
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  data: () => [],
});
const { class: cs, bg, data } = toRefs(props);

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

