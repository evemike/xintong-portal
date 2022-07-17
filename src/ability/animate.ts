// 动画 API
import "@/assets/style/animate.min.scss";
import { ref, computed, watch, Ref, unref } from "vue";

export interface AnimateConfig {
  duration?: number;
  delay?: number;
  iterationCount?: number;
  isAutoClear?: boolean;
}

export interface AnimateResponce {
  animates: Ref<string[]>;
  animateClass: Ref<string>;
  animateStyle: Ref<string>;
  resetAnimate: (config: AnimateConfig) => void;
  trigger: (i: number, autoClearOrFinish?: boolean | (() => void)) => void;
}
// export declare function animateApi (animateIndex:Ref<number>,animateNames:Ref<string[]>,config?:AnimateConfig) : void;
// export declare function animateApi (animateNames:Ref<string[]>,config?:AnimateConfig) : void;

export default function animateApi(animateNames: string[]): AnimateResponce;
export default function animateApi(
  animateNames: Ref<string[]>
): AnimateResponce;
export default function animateApi(
  animateNames: Ref<string[]>,
  animateIndex: Ref<number>
): AnimateResponce;
export default function animateApi(
  animateNames: Ref<string[]>,
  animateIndex: Ref<number>,
  config: AnimateConfig
): AnimateResponce;
export default function animateApi(
  animateNames: string[] | Ref<string[]>,
  animateIndex?: Ref<number>,
  config?: AnimateConfig
) {
  let timeHandle: any;
  let cacheIndex = unref(animateIndex);
  const animateClass = ref("");
  const duration = ref(1000);
  const delay = ref(0);
  const iterationCount = ref(1);
  const isAutoClear = ref(true);
  const isArray = Array.isArray(animateNames);
  // 重置动画配置参数
  const resetAnimate = (config: AnimateConfig) => {
    if (config.duration !== undefined) {
      duration.value = config.duration;
    }
    if (config.delay !== undefined) {
      delay.value = config.delay;
    }
    if (config.iterationCount !== undefined) {
      iterationCount.value = config.iterationCount;
    }
    if (config.isAutoClear !== undefined) {
      isAutoClear.value = config.isAutoClear;
    }
  };

  // 重置动画类
  // function resetAnimateClass (ins:number,autoClear?:boolean) : void;
  // function resetAnimateClass (ins:number,finish?:() => void) : void;
  function resetAnimateClass(
    ins = -1,
    autoClearOrFinish?: boolean | (() => void)
  ) {
    if (ins >= 0) {
      const names = isArray ? animateNames : animateNames.value;
      const an = ins < names.length ? names[ins] : names[0];
      //
      animateClass.value = `animated ${an}`;
      // 是否自动清除动画 在需要无限循环时请配置该参数为 false
      if (isAutoClear.value && autoClearOrFinish !== false) {
        if (timeHandle) {
          clearTimeout(timeHandle);
        }
        timeHandle = setTimeout(() => {
          animateClass.value = "";
          timeHandle = undefined;
          if (autoClearOrFinish && typeof autoClearOrFinish == "function") {
            autoClearOrFinish();
          }
        }, duration.value);
      }
    } else {
      animateClass.value = "";
    }
  }

  // 初始化 配置
  if (config) {
    resetAnimate(config);
  }

  // // 初始化动画类
  // resetAnimateClass();
  // 生成 animate style
  const animateStyle = computed(() => {
    return `animate-duration:${duration.value}ms;animate-delay:${delay.value}ms;animate-iteration-count:${iterationCount.value};`;
  });

  const animates = computed(() => {
    if (!animateClass.value) {
      return [];
    }
    return animateClass.value
      .split("&")
      .map((c, i) => (i > 0 ? "animated " + c : c));
  });

  // 监听动画的变化
  if (animateIndex) {
    watch(
      animateIndex,
      (v) => {
        if (v != cacheIndex) {
          cacheIndex = v;
          resetAnimateClass(animateIndex.value);
        }
      },
      { immediate: true }
    );
  }

  if (!isArray) {
    watch(animateNames, () => {
      resetAnimateClass(animateIndex?.value || 0);
    });
  }

  return {
    animates,
    animateClass,
    animateStyle,
    resetAnimate,
    trigger: resetAnimateClass,
  };
}
