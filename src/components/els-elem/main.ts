import { defineComponent, PropType, watch } from "vue";

//
import { Elem, Context, ElemProps } from "./index";

//

import buildElem from "./elems";

export default defineComponent({
  name: "els-elem",
  props: {
    elem: { type: Object as PropType<Elem>, default: (): Elem => ({}) },
    context: {
      type: Object as PropType<Context>,
      default: (): Context => ({}),
    },
    scope: {
      type: Object as PropType<ElemProps["scope"]>,
      default: (): ElemProps["scope"] => ({}),
    },
    parent: {
      type: Object as PropType<ElemProps["parent"]>,
      default: (): ElemProps["parent"] => ({}),
    },
    setup: {
      type: Object as PropType<ElemProps["setup"]>,
      default: (): ElemProps["setup"] => ({}),
    },
    // scopeData: {
    //   type: Object as PropType<Record<string,any>>,
    //   default: (): Record<string,any> => ({}),
    // },
  },
  setup(props, ctx) {
    const f = buildElem(props, ctx);
    const render = () => f();
    return render;
  },
});
