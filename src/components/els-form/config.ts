import {
  h,
  createVNode,
  resolveComponent,
  Component,
  Ref,
  unref,
  ref,
  inject,
  VNode,
  createTextVNode,
} from "vue";
import {
  ElFormItem,
  ElOption,
  ElRadio,
  ElCheckbox,
  ElInput,
  ElPopover,
  ElAlert,
  ElButton,
} from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import { ElemRender, ElemRenderFunction, Elem } from "../els-elem";
import { get, set, has, kebabCase, isObject } from "lodash";

// 判定 元素是否是 el-form-item
export const isElFormItem = (tag: string | Component) => {
  if (typeof tag == "string") {
    return tag == "el-form-item";
  }
  return kebabCase(tag.name) == "el-form-item";
};
// 判定元素是否是表单元素
const DEFAULT_FORM_ELEM: string[] = [
  "el-input",
  "el-radio",
  "el-radio-group",
  "el-checkbox",
  "el-checkbox-group",
  "el-input-number",
  "el-select",
  "el-cascader",
  "el-switch",
  "el-slider",
  "el-time-picker",
  "el-time-select",
  "el-date-picker",
  "el-rate",
  "el-color-picker",
  "el-transfer",
];
const SELF_FORM_ELEM: string[] = ["els-form-set", "svg-select", "verify-code"];
export const isFormItemElem = (
  tag: string | Component,
  ptag: string | Component = ""
) => {
  const en = typeof tag == "string" ? tag : kebabCase(tag.name) ?? "";
  const pn = typeof ptag == "string" ? ptag : kebabCase(ptag.name) ?? "";
  const e = DEFAULT_FORM_ELEM.includes(en) || SELF_FORM_ELEM.includes(en);
  const p = DEFAULT_FORM_ELEM.includes(pn) || SELF_FORM_ELEM.includes(pn);
  return e && !p;
};

export const isSelfFormItem = (name: string) => SELF_FORM_ELEM.includes(name);

const DEFAULT_ELEM = {
  "el-select": ElOption,
  "el-radio-group": ElRadio,
  "el-checkbox-group": ElCheckbox,
};
export const getDefaultTag = (ptag: string | Component) => {
  const n = typeof ptag == "string" ? ptag : kebabCase(ptag.name);
  //
  if (has(DEFAULT_ELEM, n)) {
    return get(DEFAULT_ELEM, n);
  }
  return ElInput;
};

// 自定义元素渲染
export const elemRender: ElemRender = {
  "el-form-item"(props, ctx) {
    if (ctx.prop) {
      props.prop = ctx.prop;
    }
    return createVNode(ElFormItem, props, ctx.childs);
  },
};

// 渲染表单元素
const DEFAULT_EL_FORM_ITEM_ATTRS = [
  "label",
  "labelWidth",
  "required",
  "rules",
  "error",
  "showMessage",
  "inlineMessage",
  "size",
];
//
const ELEM_WITHE_KEYS: { [key: string]: string[] } = {};
// export const createInfoElem:(info:string | Elem,getVnode:() => VNode) => Elem = () => ({tag:ElPopover,class:'els-form--info-tip',cls:[]})
export const createTipElem: (info: string | VNode) => VNode = (info) => {
  let infoElem: VNode[];
  if (typeof info === "string") {
    infoElem = info
      .split("/br")
      .map((s) =>
        createVNode(ElAlert, { closable: false, type: "info", title: s })
      );
  } else {
    infoElem = [info];
  }
  return createVNode(
    ElPopover,
    {
      class: "els-form--tip-popover",
      popperClass: "els-form--tip-popover-popper",
      trigger: "hover",
      placement: "top",
      width: "auto",
    },
    {
      reference: () => [
        createVNode(ElButton, {
          class: "els-form--tip-button",
          link:true,
          icon: InfoFilled,
        }),
      ],
      default: () => infoElem,
    }
  );
};
//
export const renderFormElem: ElemRenderFunction = (props, ctx) => {
  //
  const { tag = "div", parentTag: ptag = "div", prop = "" } = ctx;
  // const prop = ctx.prop;
  const model = inject<Ref<any>>("ElsFormModelValue") ?? ref({});
  // 当 model 中没有值时，用默认值覆盖 如果没有 默认值，用 undefined 覆盖
  if (!has(unref(model), prop) && (props.value != undefined || props.modelValue != undefined)) {
    const v = props.modelValue || props.value
    delete props.value;
    set(unref(model), prop, v);
  }
  // const tag = ctx.tag;
  const name = typeof tag === "string" ? tag : kebabCase(tag.name);
  // const ptag = ctx.parentTag;
  // const pname = typeof ptag == 'string' ? ptag : kebabCase(ptag.name)
  //
  /* value 重置 */
  props.modelValue = get(unref(model), prop);
  props["onUpdate:modelValue"] = (v: any) => {
    // console.log('----------',v,prop,get(unref(model),prop))
    set(unref(model), prop, v);
  };
  //
  const getVnode = () =>
    typeof tag !== "string"
      ? createVNode(tag, props, ctx.childs)
      : createVNode(resolveComponent(tag), props, ctx.childs);
  /* 需要添加额外的 el-form-item 元素 */

  const isNeedElFormItem =
    ctx.attrSet.root.elFormItem !== false && !isElFormItem(ptag);
  if (isNeedElFormItem) {
    const dAttrs = isObject(ctx.attrSet.root.elFormItem)
    ? ctx.attrSet.root.elFormItem
    : {};
    const attrs: any = { prop,...dAttrs };
    const wh = ["label"].concat(ELEM_WITHE_KEYS[name] ?? []);
    for (const k of DEFAULT_EL_FORM_ITEM_ATTRS) {
      if (props?.[k]) {
        attrs[k] = props[k];
        if (!wh.includes(k)) {
          delete props[k];
        }
      }
    }
    if (attrs.required && attrs.rules === undefined) {
      attrs.rules = [
        { required: true, message: `[ ${attrs.label} ] 是必填参数！` },
      ];
    }
    //
    const child = { default: () => [getVnode()] };
    if (ctx.attrSet.root.tip != undefined) {
      (child as any).label = (p: any) => {
        const labelSuffix: string =
          p.label.split((attrs as any).label)[1] ?? "";
        return [
          createTextVNode((attrs as any).label),
          createTipElem(ctx.attrSet.root.tip as string | VNode),
          createTextVNode(labelSuffix),
        ];
      };
    }
    return createVNode(ElFormItem, attrs, child);
  }
  return getVnode();
};
