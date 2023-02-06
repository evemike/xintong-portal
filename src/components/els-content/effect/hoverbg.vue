<template>
  <div
    :class="['_hoverbg relative', pageClass,hover ? incss.c : outcss.c]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div
      v-if="bg"
      class="_bg absolute"
      :class="[bgClass, hover ? incss.bg : outcss.bg]"
      :xyz="xyz"
    >
      <img v-if="bgUrl" :src="bgUrl" class="w-100% h-100%" />
    </div>
    <els-content v-bind="data" :class="[hover ? incss.con : outcss.con]"></els-content>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref ,computed} from "vue";
import { useBg } from "../lib/bg";
import { useClass,Attr } from "../lib/attrs"
import ElsContent, { ElsContentProps } from "../index";
//
interface Props {
  class?: string;
  bg?: string | { url?: string; class?: string };
  xyz?: string;
  inclass?: Attr<string>;
  outclass?: Attr<string>;
  data?: ElsContentProps;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  bg: "",
  xyz: "",
  inclass: "",
  outclass: "",
  data: () => ({}),
});
//
const { pageClass, bgClass, bgUrl } = useBg(props);
//
const { data, inclass, outclass, xyz } = toRefs(props);

//
const keys = ["c","bg","con"]
//
const incss = computed(() => useClass(inclass.value,keys));
const outcss = computed(() => useClass(outclass.value,keys));

const hover = ref(false);
</script>
