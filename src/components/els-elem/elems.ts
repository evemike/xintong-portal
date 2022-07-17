import {
  h,
  ref,
  toRef,
  isRef,
  reactive,
  isReactive,
  toRefs,
  watch,
  unref,
  VNode,
  SetupContext,
  computed,
  createTextVNode,
  createVNode,
  resolveComponent,
} from "vue";
import {
  ElemRenderContext,
  SetupResp,
  Elem,
  ElemProps,
  Context,
} from "./index";

import {
  getProps,
  getChazhi,
  specialRender,
  getSlotScopeValue,
  getSlotName,
  parseElem,
  parseDirective,
} from "./config";
// 
import { kebabCase, assign, mapValues } from "lodash";
import { isHtmlTag } from "@/utils/util";
export default function createElem(props: ElemProps, ctx: SetupContext) {
  //
  // const { elem:elemRef} = toRefs(props)
  const { elem, context, parent = {}, setup = {} } = props;
  //
  const _setup: SetupResp = {
    ...setup,
    ...(context.setup?.(props, ctx) ?? {}),
    ...(elem.setup?.(props, ctx) ?? {}),
  };
  const _base = {
    elem,
    context,
    ..._setup,
  };
  //
  let _scope: Record<string, any> = {};
  // 解析 数据 ，构造 属性数据集合
  // const attr = computed(() => parseElem(elemRef.value, context));
  // const attrs = attr.value;
  const attrs = parseElem(elem, context);
  // 解析孩子节点
  // const clds = ref<{[key: string]: [f: (params?: any, scope?: any) => VNode | undefined,c: string | Elem][]}>()
  const child = computed(() => {
    const cls: {
      [key: string]: [
        f: (params?: any, scope?: any) => VNode | undefined,
        c: string | Elem
      ][];
    } = {};
    new Array<string | Elem>()
      .concat(unref(attrs.root.children ?? []), unref(attrs.root.cls ?? []))
      .forEach((c) => {
        const isString = typeof c === "string";
        const k = !isString ? getSlotName(c) : "default";
        if (!cls[k]) {
          cls[k] = [];
        }
        cls[k].push([
          isString
            ? (s) => createTextVNode(getChazhi(c, { ..._base, ...s }))
            : createElem(
                { parent: elem, elem: c, context, setup: _setup },
                ctx
              ),
          c,
        ]);
      });
    return cls;
  });
  //
  // console.log(child.value)
  // const childs: { [key: string]: (p: any,scope?:any) => (VNode)[] } = {};
  // Object.keys(cld).forEach((k) => {
  //   childs[k] = (p: any) => cld[k].map((cf) => cf(p));
  // });
  //
  const createChilds = (
    scope: Record<string, any>,
    extVNode: Record<string, VNode[]> = { default: [] }
  ) => {
    const clds: {
      [key: string]: (p: any, scope: any) => (VNode | undefined)[];
    } = { default: () => [...(extVNode.default || [])] };
    Object.keys(child.value).forEach((k) => {
      clds[k] = (p: any) =>
        child.value[k]
          .map(([f, c]) => {
            return typeof c === "string"
              ? f(scope)
              : f(getProps(getSlotScopeValue(c), p), scope);
          })
          .concat(extVNode?.[k] ?? []);
    });
    return clds;
  };

  // 构建节点的方法 分离 render 和 初始化的关键步骤，本方法将在 render 期间执行
  const build = (params: any = {}, scope = {}) => {
    _scope = {
      ...scope,
      ...params,
    };
    //
    const directives = parseDirective(attrs.directive, {
      ..._base,
      ..._scope,
    });
    //
    if (!(directives["v-if"] ?? true)) {
      return undefined;
    }
    //
    const tag = unref(attrs.root.tag ?? _setup.tag ?? context.tag ?? "div");
    const tagname = typeof tag === "string" ? tag : kebabCase(tag.name);
    // const props: Context = { ...attrs.props, ...directives["v-bind"],...directives["v-on"] };
    const prop: Context = assign(
      mapValues(attrs.props, (v) => unref(v)),
      directives["v-bind"],
      directives["v-on"]
    );
    //
    const extVNode: Record<string, VNode[]> = { default: [] };
    if (directives["v-text"]) {
      extVNode.default.push(createTextVNode(directives["v-text"]));
    }
    if (directives["v-html"]) {
      prop.innerHTML = directives["v-html"];
    }
    const childs = createChilds(_scope, extVNode);
    //
    const _ctx: ElemRenderContext = {
      ..._base,
      ..._scope,
      ...ctx,
      parent,
      tag,
      tagname,
      attrSet: attrs,
      childs,
    };
    // console.log("====> ", tagname, prop, _ctx, params, childs);
    // 优先判断 setup 中返回的 render 函数
    if (_base.render && typeof _base.render == "function") {
      return _base.render(prop, _ctx);
    }
    // 判断是否有自定义的渲染规则
    if (context.elemRender?.[tagname])
      return context.elemRender[tagname](prop, _ctx);
    // 判断是否需要执行特殊渲染 template slot component
    if (specialRender[tagname]) return specialRender[tagname](prop, _ctx);
    //
    if (typeof tag != "string") {
      return createVNode(tag, prop, childs);
    }
    // 默认渲染规则
    return createVNode(
      isHtmlTag(tagname) ? tagname : resolveComponent(tagname),
      prop,
      childs
    );
  };

  return build;
}
