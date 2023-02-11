import { toRefs, computed } from "vue";
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

  const bgIcon = computed(() => {
    if (typeof bg.value === "string") {
      const isIcon = /^icon/.test(bg.value);
      return isIcon ? bg.value : "";
    }
    return bg.value?.icon;
  });

  const bgClass = computed(() => {
    if (typeof bg.value === "string") {
      const isUrl = /\.(\w+)$/.test(bg.value);
      return isUrl ? "" : bg.value;
    }
    return bg.value?.class || "";
  });

  const iconClass = computed(() => {
    return typeof bg.value === 'string' ? "" : bg.value.iconClass || "";
  })

  return { pageClass: cs, bgUrl, bgClass,bgIcon,iconClass };
}
