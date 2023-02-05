<template>
  <component :is="com" v-bind="attr"></component>
</template>

<script lang="ts" setup>
import { computed, toRefs, unref } from "vue";

// base
import CIMG from "./base/img.vue";
import CTEXT from "./base/text.vue";
// content
import CCAROUSEL from "./content/carousel.vue";
import CLINK from "./content/link.vue";
import CLIST from "./content/list.vue";
// effect
import CHOVER from "./effect/hover.vue";
import CHOVERBG from "./effect/hoverbg.vue";
import CHOVER2 from "./effect/hover2.vue";
import CHOVERS from "./effect/hovers.vue";
import CSHOW from "./effect/show.vue";
import CXYZBG from "./effect/xyzbg.vue";
import CHOVERCLD from "./effect/hovercld.vue"
import CHOVERCLS from "./effect/hovercls.vue"
//
interface Props {
  name?: string;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  name: "base",
});

const { name, ...attr } = toRefs(props);

const com = computed(() => {
  switch (unref(name)) {
    //
    case "img":
      return CIMG;
    case "text":
      return CTEXT;
    //
    case "carousel":
      return CCAROUSEL;
    case "link":
      return CLINK;
    case "list":
      return CLIST;
    //
    case "hover":
      return CHOVER;
    case "hoverbg":
      return CHOVERBG;
    case "hover2":
      return CHOVER2;
    case "hovers":
      return CHOVERS;
    case "hovercld":
      return CHOVERCLD;
    case "hovercls":
      return CHOVERCLS;
    case "show":
      return CSHOW;
    case "xyzbg":
      return CXYZBG;
    //
    default:
      return "div";
  }
});
</script>

<script lang="ts">
export default {
  name: "els-content",
};
</script>
