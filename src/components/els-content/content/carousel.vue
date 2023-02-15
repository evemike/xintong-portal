<template>
  <div :class="['_banner relative', pageClass]">
    <div v-if="bg" class="_bg absolute w-100% h-100% top-0 left-0" :class="bgClass">
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <ElCarousel v-bind="attr" @change="(v) => currentIndex = v">
      <ElCarouselItem v-for="({link,...c},i) in  contents" :key="i">
        <div :class="['_banner-item relative w-100% h-100%',currentIndex === i ?? `is-current ${currentClass}`]" @click="() => handleLink(link)" >
          <ElsContent v-bind="c"  />
        </div>
      </ElCarouselItem>
    </ElCarousel>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, ref } from "vue";
import { useBg } from "../lib/bg";
import { TORA } from "@/utils/intf";
import ElsContent, { ElsContentProps } from "../index";
import { ElCarousel,ElCarouselItem} from "element-plus";
import { useRouter } from "vue-router";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  link?: string | Record<string, any>;
  attr?:Record<string,any>
  currentClass?:string
  data?: TORA<ElsContentProps & { link?: string | Record<string, any> }>;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  currentClass:"",
  attr:() => ({}),
  data: () => [],
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { attr,data ,currentClass} = toRefs(props);
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
//
const currentIndex = ref(0)
</script>
