import { toRefs, computed, ref, unref, watch } from "vue";
import { ContentBaseProps } from "../index";

//
export function useBg<T extends ContentBaseProps>(props: T) {
  const { bg, class: cs, isHover: hover } = toRefs(props);
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
    return typeof bg.value === "string" ? "" : bg.value.iconClass || "";
  });

  const isHover = ref(false);
  const hoverVal = ref<any>()
  //
  const handleOver = (v?:any) => {
    if (hover == undefined) {
      isHover.value = true;
      hoverVal.value = v;
    }
  };
  const handleOut = () => {
    if (unref(hover) == undefined) {
      isHover.value = false;
      hoverVal.value = undefined;
    }
  };

  // @ts-ignore
  if (hover != undefined) {
    watch(hover, (v) => {
      isHover.value = v;
    });
  }

  return {
    pageClass: cs,
    bgUrl,
    bgClass,
    bgIcon,
    iconClass,
    isHover,
    hoverVal,
    handleOver,
    handleOut,
  };
}
