<template>
  <div :class="['_link relative', pageClass]">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <ElCarousel>
      <ElCarouselItem v-for="(c,i) in  contents" :key="i">
        <ElsContent v-bind="c" @click="() => handleLink(c.link)" />
      </ElCarouselItem>
    </ElCarousel>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, unref } from "vue";
import { useBg } from "./bg";
import { TORA } from "@/utils/intf";
import ElsContent, { ElsContentProps } from "./index";
import { ElCarousel,ElCarouselItem} from "element-plus";
import { useRouter } from "vue-router";
//
interface Props {
  class?: string | string[];
  bg?: string | { url?: string; class?: string };
  link?: string | Record<string, any>;
  data: TORA<ElsContentProps & { link?: string | Record<string, any> }>;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  data: () => [],
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data } = toRefs(props);
//
const contents = computed(() => new Array<any>().concat(data.value));
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
</script>
