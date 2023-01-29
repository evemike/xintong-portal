<template>
  <div :class="['_banner relative', pageClass]">
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, ref } from "vue";
import { useBg } from "./bg";
import { TORA } from "@/utils/intf";
import ElsContent, { ElsContentProps } from "./index";
import { ElCarousel,ElCarouselItem} from "element-plus";
import { useRouter } from "vue-router";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  link?: string | Record<string, any>;
  attr?:Record<string,any>
  currentClass?:string
  data: TORA<ElsContentProps & { link?: string | Record<string, any> }>;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  currentClass:"",
  attr:() => ({}),
  data: () => [],
});
//
//
const { class:pageClass } = toRefs(props);
//
//
const handleLink = (link: string | Record<string, any> | undefined) => {
  if (link) {
    linkTo(link);
  }
};

//
const router = useRouter();
// link
const linkTo = (link: string | Record<string, any>) => {
  if (typeof link === "string" && /^http/.test(link)) {
    //
    window.open(link, "_blank");
  } else {
    router.push(link);
  }
};
//
const currentIndex = ref(0)
</script>
