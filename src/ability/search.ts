// 生成 form 表单数据和按钮
// 过滤 条件 filter = (d) => boolean 获取原始数据
// 字段映射 {k:kv}
// 补充属性 全局补充属性 单个补充属性
import { ref, Ref } from "vue";
import { isArray, clone } from "lodash";
import { Elem } from "../components/els-elem";
import ElsForm, { ElsFormColumnItem } from "@/components/els-form";
import createOperateElem, { TypeOperate } from "./operate";
import { getOption } from "@/utils/option";

export interface InterSearch {
  enabled?: boolean;
  layout?: "block" | "inline" | "hide";
  column?: ElsFormColumnItem[];
  button?: TypeOperate;
  handle?: (query: Record<string, any>) => void;
  elsFormConfig?: Record<string, any>;
  size?: "small" | "normal" | "larger";
}

export interface SearchRes {
  enabled: boolean;
  option: InterSearch;
  query: Ref<Record<string, any>>;
  layout: InterSearch["layout"];
  elem: Elem;
  formElem?: Elem;
  buttonElem?: Elem;
}

export type TypeSearch = boolean | ElsFormColumnItem[] | InterSearch;

export default function createSearchElem(
  search: TypeSearch,
  defaultAttr: Record<string, any> = {},
  searchHandle?: (query: Record<string, any>) => void
) {
  //
  const query = ref<Record<string, any>>({});
  //
  const option = getOption<TypeSearch, InterSearch>(
    search,
    { layout: "inline" },
    { data: "column" }
  );
  //
  const elem: Elem = {
    tag: "div",
    class: "ablity-search",
    cls: [],
  };
  //
  const res: SearchRes = {
    query,
    option,
    enabled: option.enabled || false,
    layout: option.layout,
    elem,
  };
  //
  if (option.enabled === true) {
    //
    const form: Elem = {
      tag: ElsForm,
      class: "els-form--search",
      modelValue: query,
      inline: option.layout == "inline",
      column: option.column?.map((col) => ({ ...defaultAttr, ...col })) || [],
      "v-bind": option.elsFormConfig || {},
    };
    //
    elem.cls = [form];
    res.formElem = form;
    //
    if (option.button == undefined || option.button === true) {
      option.button = {
        enabled: true,
        elems: ["search", "reset"],
        handle: (keyid: string) => {
          if (keyid === "reset") {
            query.value = {};
          }
          option.handle && option.handle(query.value);
        },
      };
    }
    const { enabled, elems } = createOperateElem(
      option.button,
      {},
      searchHandle
    );
    //
    if (enabled) {
      const button: Elem = {
        tag: "div",
        class: "search--button",
        cls: elems,
      };
      //
      elem.cls = [form, button];
    }
  }
  return res;

  // if (search === false) {
  //   return { enabled: false, query };
  // }
  // // 初始化数据
  // const searchOption: InterSearch =
  //   isArray(search) || search === true ? { enabled: true } : clone(search);
  // if (isArray(search)) {
  //   searchOption.column = search;
  //   if (search.length == 0) {
  //     searchOption.enabled = false;
  //   }
  // }
  // // console.log('.........',searchOption)
  // //
  // const layout = searchOption.layout || "inline";
  // // 初始化 button
  // if (
  //   (searchOption.button == undefined || searchOption.button === true) &&
  //   searchOption.enabled
  // ) {
  //   searchOption.button = {
  //     enabled: true,
  //     elems: ["search", "reset"],
  //     handle: (keyid) => {
  //       switch (keyid) {
  //         case "search":
  //           searchOption.handle && searchOption.handle(query.value);
  //           break;
  //         case "reset":
  //           query.value = {};
  //           searchOption.handle && searchOption.handle(query.value);
  //           break;
  //         default:
  //           break;
  //       }
  //     },
  //   };
  // }
  // const operateButton = createOperateElem(
  //   searchOption.button ?? false,
  //   {},
  //   searchHandle
  // );
  // //
  // // 初始化 search from
  // const searchForm: Elem = {
  //   tag: ElsForm,
  //   class: "els-form--search",
  //   modelValue: query,
  //   inline: layout == "inline",
  //   column:
  //     searchOption.column?.map((col) => ({ ...defaultAttr, ...col })) || [],
  //   "v-bind": searchOption.elsFormConfig || {},
  // };
  // const searchButton: Elem = operateButton.enabled
  //   ? {
  //       tag: "div",
  //       class: "search--button",
  //       cls: operateButton.elems,
  //     }
  //   : {};
  // //
  // const searchElem: Elem = {
  //   tag: "div",
  //   class: "ablity-search",
  //   cls: [searchForm, searchButton],
  // };
  // //
  // return {
  //   query,
  //   enabled: searchOption.enabled,
  //   layout,
  //   searchOption,
  //   operateButton,
  //   elem: searchElem,
  //   formElem: searchForm,
  //   buttonElem: searchButton,
  // };
}
