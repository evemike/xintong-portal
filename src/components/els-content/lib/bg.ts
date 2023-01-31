import { toRefs,computed } from "vue";
import { ContentBaseProps } from "../index";

//
export function useBg<T extends ContentBaseProps>(props: T) {
  const { bg, class: cs } = toRefs(props);
  //
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


  return {pageClass:cs,bgUrl,bgClass}
}
