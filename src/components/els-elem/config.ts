import {
  unref,
  renderSlot,
  createElementVNode,
  h,
  createVNode,
  resolveDynamicComponent,
  RendererNode,
  RendererElement,
  Ref,
  RenderFunction,
  CreateComponentPublicInstance,
  VNode,
  SetupContext,
  KeepAlive,
  Teleport,
  Transition,
  TransitionGroup,
  openBlock,
  createBlock,
  Fragment,
  Component,
} from "vue";
import { has, getType, doEval } from "@/utils/util";
import {
  ElemRender,
  ElemChilds,
  ElemRenderContext,
  SetupResp,
  Elem,
  ElemProps,
  Context,
  Hooks,
  Scope,
  ElemAttrSet,
} from "./index";
import { upperFirst } from "lodash";

const REG_IS_VUE = /^v-/;
const REG_SLOT = /^v-slot:?(\w+)?$/;
const REG_BIND = /^\s?(v-bind)?(:(\w+))?\s?$/;
const REG_ON = /^\s?(v-on:|@)(\w+)\s?$/;
export const createAttrs = (elem: Elem, scope: Scope) => {
  const keys = Object.keys(elem);
  const res = {};
  //
  keys.forEach((k) => {
    const v = elem[k];
    const b = REG_IS_VUE.test(k) || REG_BIND.test(k) || REG_ON.test(k);
    //
    let key = k;
    let val = v;
    // slot
    if (REG_SLOT.test(k)) {
      res["slot-scope"] = val;
      res["slot"] = REG_SLOT.exec(k)?.[1] ?? "default";
    } else if (b) {
      if (getType(val) == "string") {
        val = doEval(v, scope);
      }
      const type = getType(val);
      const bk = REG_BIND.exec(k);
      const ek = REG_ON.exec(k);
      //
      if (bk) {
        // v-bind
        if (bk[1] && bk[2] == undefined) {
          switch (type) {
            case "object":
              Object.keys(val).forEach((tk) => {
                res[tk] = val[tk];
              });
              break;
            case "map":
              for (const [tk, tv] of val) {
                res[tk] = tv;
              }
              break;
          }
        }
        // key
        if (bk[3]) {
          key = bk[3];
          //
          res[key] = val;
        }
      } else if (ek) {
        if (ek[2]) {
          key = "on" + ek[2].replace(ek[2][0], ek[2][0].toUpperCase());
          res[key] = val;
        }
      } else {
        res[key] = val;
      }
    } else {
      res[k] = v;
    }
  });
  //
  // console.log('createAttrs ====> ',elem,res)
  return res;
};
// 这里面的keys 默认会放入到 root 中，如果希望放入 props 中并且不做过多处理，请使用 contextKeys 来处理~
const SPELCIAL_KEYS = [
  "tag",
  "setup",
  "hooks",
  "cls",
  "children",
  "contextKeys",
  "excludeKeys",
  "this",
  "slot-scope",
];
// 初步解析 elem 数据 和 context 数据 并返回 指令集 directive，props 集合，root 数据集合 不包含在 props 中的数据，
export const parseElem = (elem: Elem, context: Context) => {
  const keys = Object.keys(elem);
  const res: ElemAttrSet = { root: {}, directive: {}, props: {} }; // root | directive | props

  keys.forEach((k) => {
    const v = elem[k];
    const b = REG_IS_VUE.test(k) || REG_BIND.test(k) || REG_ON.test(k);
    // 需要包含在 props 中的keys 集合
    const ctxKeys: string[] = new Array<string>().concat(
      elem.contextKeys || [],
      context.contextKeys || []
    );
    // 需要排除在 props 中的 keys 集合
    const extKeys: string[] = new Array<string>().concat(
      elem.excludeKeys || [],
      context.excludeKeys || []
    );
    //
    const cb = ctxKeys.includes(k);
    if (REG_SLOT.test(k)) {
      res.root["slot-scope"] = v;
      res.root["slot"] = REG_SLOT.exec(k)?.[1] ?? "default";
    } else if (b) {
      res.directive[k] = v;
    }
    //
    else if (SPELCIAL_KEYS.includes(k) && !cb) {
      res.root[k] = v;
    } else if (!extKeys.includes(k) || cb) {
      res.props[k] = v;
    } else {
      res.root[k] = v;
    }
  });
  return res;
};

export const parseDirective = (
  directive: Record<string, any>,
  scope: Scope
) => {
  const keys = Object.keys(directive);
  const res: Record<string, any> = { "v-bind": {}, "v-on": {} };
  //
  keys.forEach((k) => {
    let v = directive[k];
    if (typeof v === "string") {
      v = doEval(v, scope, true);
    } else {
      v = unref(v);
    }
    const tv = getType(v);
    // v-bind
    if (REG_BIND.test(k)) {
      // const r = res['v-bind']
      const bk = REG_BIND.exec(k) ?? [];
      //
      if (bk[1] && bk[2] == undefined) {
        switch (tv) {
          case "object":
            Object.keys(v).forEach((tk) => {
              if (REG_IS_VUE.test(tk)) {
                res[tk] = v[tk];
              } else {
                res["v-bind"][tk] = v[tk];
              }
            });
            break;
          case "map":
            for (const [tk, tv] of v) {
              if (REG_IS_VUE.test(tk)) {
                res[tk] = tv;
              } else {
                res["v-bind"][tk] = tv;
              }
            }
            break;
        }
      }
      //
      if (bk[3]) {
        res["v-bind"][bk[3]] = v;
      }
    }
    // v-on
    else if (REG_ON.test(k)) {
      const ek = REG_ON.exec(k) ?? [];
      if (ek[2]) {
        const tk = "on" + upperFirst(ek[2]);
        res["v-on"][tk] =
          typeof v === "function"
            ? (...args: any[]) => v.apply(scope, [...args, scope])
            : v;
      }
    }
    //
    else {
      res[k] = v;
    }
  });
  // console.log('==== parse directive ==== ',res,directive,scope)
  return res;
};

export const getSlotName = (elem: Elem): string => {
  const keys = Object.keys(elem);
  for (let i = 0, len = keys.length; i < len; i++) {
    const k = keys[i];
    if (k === "slot") {
      return elem[k] ?? "default";
    }
    if (REG_SLOT.test(k)) {
      return REG_SLOT.exec(k)?.[1] ?? "default";
    }
  }
  return "default";
};

export const getSlotScopeValue = (elem: Elem): string => {
  const keys = Object.keys(elem);
  for (let i = 0, len = keys.length; i < len; i++) {
    const k = keys[i];
    if (k === "slot-scope" || REG_SLOT.test(k)) {
      return typeof elem[k] === "string" ? elem[k] : "";
    }
  }
  return "";
};
// 针对特殊的 元素的处理方式
const SPECIAL_TAGS = ["template", "slot", "component"];
export const isSpecialElem = (tag: string): boolean =>
  SPECIAL_TAGS.includes(tag);

//
const EXT_KEYS = [
  "tag",
  "setup",
  "hooks",
  "cls",
  "children",
  "contextKeys",
  "excludeKeys",
  "this",
  "v-if",
  "v-else",
  "v-on",
  "v-bind",
  "v-else-if",
];
export const getContext = (
  attrs: Record<string, any>,
  scope: Scope,
  ext: string[] = []
): Record<string, any> => {
  // 白名单
  const white: string[] = [].concat(
    attrs.contextKeys || [],
    scope?.["contextKeys"] || []
  );
  // 黑名单
  const black: string[] = EXT_KEYS.concat(
    attrs.excludeKeys || [],
    scope?.["excludeKeys"] || [],
    scope.context?.["excludeKeys"] || [],
    ext
  );
  //
  const res: any = {};
  if (white && Array.isArray(white) && white.length > 0) {
    white.forEach((k) => {
      const key = k;
      const val = attrs[key];
      if (val != undefined) {
        res[key] = unref(val);
      }
    });
    return res;
  }
  //
  for (const k in attrs) {
    if (black.includes(k)) continue;
    res[k] = unref(attrs[k]);
  }
  return res;
};

// 赋值方法 支持不完全对象解构赋值 {k:key,k,k:key} /^\s?{.*}\s?$/
const REG = /^\s*(\w+)\s*(:\s*(\w+))?\s*$/;
export const getProps = (key: string, scope: any): any => {
  const res: any = {};
  if (key && scope) {
    if (!/^\s*{.*}\s*$/.test(key)) {
      res[key] = scope;
    } else {
      const ks = key.replace(/[\{\}]/g, "").split(",");
      ks.forEach((k) => {
        const keys = REG.exec(k) || [];
        const sk = keys[1];
        const tk = keys[3] || sk;
        //
        if (has.call(scope, sk)) {
          res[tk] = scope[sk];
        }
      });
    }
  }
  // console.log('getProps ====> ',key,scope,res)
  return res;
};

// 特殊元素的渲染
export const specialRender: ElemRender = {
  template(props, ctx: ElemRenderContext) {
    // 尝试解析 v-for 指令
    /*  */
    // return createVNode(Fragment, null, ctx.childs);
    return createVNode("div", null, ctx.childs);
  },
  slot(props, ctx: ElemRenderContext) {
    const name = props.name || "default";
    delete props.name;
    // console.log(this.$_attrs)
    const childs = ctx.childs?.default ?? undefined;
    return renderSlot(ctx.context.slots ?? ctx.slots, name, props, () =>
      childs ? childs() : []
    );
  },
  component(props, ctx: ElemRenderContext) {
    const name: string = props.is;
    delete props.is;
    const c: any = resolveDynamicComponent(name);
    return createVNode(c, props, ctx.childs);
  },
  "keep-alive": function (props, ctx: ElemRenderContext) {
    return createVNode(KeepAlive, props, ctx.childs);
  },
  transition(props, ctx: ElemRenderContext) {
    return createVNode(Transition, props, ctx.childs);
  },
  teleport(props) {
    return createVNode(Teleport as any, props);
  },
  "transition-group": function (props, ctx: ElemRenderContext) {
    return createVNode(TransitionGroup, props, ctx.childs);
  },
};

// 插值语法计算 str 字符串表达式 scope 作用域
const REG_CHAZHI = /^\s?\{\{(.*?)\}\}\s?$/;
export const getChazhi = (str: string, scope: Scope): string => {
  if (!str) {
    return "";
  }
  let res = str;
  if (REG_CHAZHI.test(str)) {
    const [t = "", v] = REG_CHAZHI.exec(str) || [];
    let val = doEval(v, scope, true) ?? "";
    if (typeof val === "object") {
      try {
        val = JSON.stringify(val);
      } catch (e) {
        val = String(val);
      }
    }
    if (typeof val !== "string") {
      val = String(val);
    }
    //
    res = res.replace(t, val);
  }
  // console.log("getChazhi ====> ",str,scope,res,REG_CHAZHI.test(str))
  return res;
};
