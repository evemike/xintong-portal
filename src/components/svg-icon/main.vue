<script lang="ts">
export default {
  name: "svg-icon",
};
</script>

<script setup lang="ts">
import { computed, unref, toRefs } from "vue";
interface Props {
  id?: string;
  prefix?: string;
  name?: string;
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  prefix: "icon",
  color: "#333",
});
//
const { id, prefix, color, name } = toRefs(props);
const symbolId = computed(
  () => "#" + (unref(id) || `${unref(prefix)}-${unref(name)}`)
);
</script>

<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>
