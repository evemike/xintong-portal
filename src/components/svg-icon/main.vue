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
  color: "",
});
//
const { id, prefix, color, name } = toRefs(props);
const symbolId = computed(
  () => "#" + (unref(id) || `${unref(prefix)}-${unref(name)}`)
);
</script>

<template>
  <i class="svg-icon">
    <svg aria-hidden="true" fill="currentColor" width="1em" height="1em">
      <use :href="symbolId" :fill="color" />
    </svg>
  </i>
</template>

<style scoped>
.svg-icon {
  fill: currentColor;
  width: 1em;
  height: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.svg-icon svg {
  width: 1em;
  height: 1em;
}
</style>
