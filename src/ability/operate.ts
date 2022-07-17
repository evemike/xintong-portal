import { ElButton } from "element-plus";
import {
  Plus,
  EditPen,
  View,
  Delete,
  Upload,
  Download,
  Search,
  Refresh,
} from "@element-plus/icons-vue";
import { Elem } from "../components/els-elem";
import { isArray, isObject, isString } from "lodash";
import i18n from "@/i18n";

//
const $t = i18n.global.t;
// 默认的按钮集合
const DEFAULT_OPERATES = {
  add: { icon: Plus, cls: $t("ELS_OPERATE.add"), type: "primary" },
  edit: { icon: EditPen, cls: $t("ELS_OPERATE.edit") },
  view: { icon: View, cls: $t("ELS_OPERATE.view") },
  delete: { icon: Delete, cls: $t("ELS_OPERATE.delete"), type: "danger" },
  deletes: { icon: Delete, cls: $t("ELS_OPERATE.deletes"), type: "danger" },
  import: { icon: Upload, cls: $t("ELS_OPERATE.import") },
  upload: { icon: Upload, cls: $t("ELS_OPERATE.upload") },
  export: { icon: Download, cls: $t("ELS_OPERATE.export") },
  download: { icon: Download, cls: $t("ELS_OPERATE.download") },
  search: { icon: Search, cls: $t("ELS_OPERATE.search"), type: "primary" },
  reset: { icon: Refresh, cls: $t("ELS_OPERATE.reset") },
};

type OperateItemElem = Elem & { keyid: string };

export type OperateKey = keyof typeof DEFAULT_OPERATES;

type OperateLayout = Record<string, string[]> | string[];

export type TypeOperateElem = OperateKey | [OperateKey, Elem] | OperateItemElem;

export interface InterOperate extends Record<string,any> {
  enabled?: boolean;
  class?: string;
  elems?: TypeOperateElem[];
  layout?: OperateLayout; // 布局，数组是用来排序的
  handle?: (keyid: string, ...args: any) => void;
}
export type TypeOperate = boolean | TypeOperateElem[] | InterOperate;

export const getElem = (
  cols: TypeOperateElem[],
  handle: (...args: any) => void,
  defaultAttr: Record<string, any> = {}
) =>
  cols.map((col) => {
    if (isString(col)) {
      const keyid = col;
      return {
        ...DEFAULT_OPERATES[keyid],
        tag: ElButton,
        "@click": (...args: any) => handle(keyid, ...args),
        ...defaultAttr,
      };
    } else if (isArray(col)) {
      const [keyid, attr] = col;
      return {
        ...DEFAULT_OPERATES[keyid],
        tag: ElButton,
        "@click": (...args: any) => handle(keyid, ...args),
        ...defaultAttr,
        ...attr,
      };
    }
    const { keyid, ...attr } = col;
    return {
      tag: ElButton,
      "@click": (...args: any) => handle(keyid, ...args),
      ...defaultAttr,
      ...attr,
    };
  });
//     return cols.map(item => typeof item == 'string' ? {tag:ElButton,'@click':(...args:any) => {},...DEFAULT_OPERATES[item]} : {tag:ElButton,...item})
// }

export const getElems = (
  keyids: string[],
  cols: TypeOperateElem[],
  handle: (...args: any) => void,
  defaultAttr?: Record<string, any>
) => {
  const res: Elem[] = [];
  for (const k of keyids) {
    const col = getElem(
      cols.filter((item) => {
        let keyid = "";
        if (isString(item)) {
          keyid = item;
        } else if (isArray(item)) {
          keyid = item[0];
        } else {
          keyid = item.keyid;
        }
        return keyid == k;
      }),
      handle,
      defaultAttr
    );
    if (col && col[0]) {
      res.push(col[0]);
    }
  }
  return res;
};

export default function createOperateElem(
  operate: TypeOperate,
  defaultAttr: Record<string, any> = {},
  operateHandle?: ((...args: any) => void) | any[] // 调用指令或者 调用默认参数
) {
  let cols: TypeOperateElem[] = [];
  let layout: OperateLayout | undefined;
  let enabled: boolean = typeof operate == "boolean" ? operate : true;
  const handle = typeof operateHandle == "function" ? [operateHandle] : [];
  const className = ["_operate"];
  if (isArray(operate)) {
    cols = operate;
  } else if (isObject(operate) && operate.elems) {
    enabled = operate.enabled || true;
    cols = operate.elems;
    if (operate.layout) {
      layout = operate.layout;
    }
    if (operate.handle) {
      handle.unshift(operate.handle);
    }
    if (operate.class) {
      className.push(operate.class);
    }
  }
  const clickHandle = (keyid: string, ...args: any) => {
    const params = isArray(operateHandle) ? operateHandle.concat(args) : args;
    for (const f of handle) {
      f(keyid, ...params);
    }
  };
  let childs: Elem[] = [];
  if (layout) {
    if (isArray(layout)) {
      childs = getElems(layout, cols, clickHandle, defaultAttr);
    } else {
      for (const k in layout) {
        const ids = layout[k];
        childs.push({
          tag: "div",
          class: `_layout-${k}`,
          cls: getElems(ids, cols, clickHandle, defaultAttr),
        });
      }
    }
  } else {
    childs = getElem(cols, clickHandle, defaultAttr);
  }

  const operateElem = { tag: "div", class: className, cls: childs };

  // return {tag:'div',class:classNames,cls:childs}
  return {
    enabled,
    elem: operateElem,
    elems: childs,
    layout,
  };
}
