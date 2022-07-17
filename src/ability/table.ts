import { isObject } from "lodash";
import {
  ref,
  computed,
  VNode,
  RendererNode,
  RendererElement,
  unref,
} from "vue";
import { Elem } from "@/components/els-elem";
//
import { ElsFormColumnItem } from "@/components/els-form";
import { TypeSearch } from "@/ability/search";
import createOperateElem, { TypeOperate } from "./operate";
import { isArray, isFunction } from "lodash";

export interface InterTableColumnItem extends Elem {
  search?: boolean | ElsFormColumnItem;
  cls?: string | (InterTableColumnItem | Elem | string)[];
  children?: string | (InterTableColumnItem | Elem | string)[];
  //
  label?: string;
  type?: "selection" | "index" | "expand";
  index?: number | ((index: number) => number);
  columnKey?: string;
  prop?: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: string | boolean;
  renderHeader?: (
    column: InterTableColumnItem,
    $index: number
  ) => VNode<RendererNode, RendererElement, Record<string, any>>;
  sortable?: boolean | string;
  sortMethod?: (a: any, b: any) => number;
  sortBy?: string | string[] | ((row: any, index: number) => string);
  sortOrders?: ("ascending" | "descending" | null)[];
  resizable?: boolean;
  formatter?: (
    row: any,
    column: InterTableColumnItem,
    cellValue: any,
    index: number
  ) => string | VNode<RendererNode, RendererElement, Record<string, any>>;
  showOverflowTooltip?: boolean;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  className?: string;
  labelClassName?: string;
  selectable?: (row: any, index: number) => boolean;
  reserveSelection?: boolean;
  filters?: { text: string; value: string }[];
  filterPlacement?: string;
  filterMultiple?: boolean;
  filterMethod?: (value: any, row: any, column: any) => void;
  filteredValue?: string[];
}

export interface TableProps {
  search?: boolean | TypeSearch;
  column: InterTableColumnItem[];
  // operate?: TypeOperate;
  menu?: TypeOperate;
  menuLabel?: string;
  menuCallBack?: (keyid: string, ...args: any) => void;
  showSelect?: boolean;
  showIndex?: boolean;
}

// 字典项和格式化处理
const formatColumn = (column: InterTableColumnItem[]) => {
  return column.map((col) => {
    const { dict, format, ...ds } = col;
    const name = col.prop;
    let f = format;
    if (dict && isArray(unref(dict))) {
      f = (row: any, name: string) => {
        const v = row[name];
        const d = unref(dict).filter((item: any) => item.value == v)[0] || {};
        const { label, value, ...others } = d;
        return { "v-text": label, ...others };
      };
    }
    // 格式化
    if (f && isFunction(f)) {
      return {
        ...ds,
        cls: [
          {
            tag: "div",
            "v-slot:default": "{ row }",
            setup: () => ({ format: f, name }),
            "v-bind": "format(row,name)",
          },
        ],
      };
    }
    return col;
  });
};

export default function createTableProps(props: TableProps) {
  const { search, column, menu = false, menuLabel, menuCallBack } = props;
  //
  const searchColumn: ElsFormColumnItem[] = column
    .filter((col) => col.search != undefined && col.search != false)
    .map(({ prop, label, search }) => ({
      prop,
      label,
      ...(search === true ? {} : search),
    }));
  let searchOption: TypeSearch = {
    enabled: searchColumn.length > 0,
    column: searchColumn,
  };
  if (search === false) {
    searchOption = {};
  } else if (isObject(search)) {
    searchOption = Object.assign({}, searchOption, search);
  }
  // 处理 操作栏
  const menuConfig = createOperateElem(
    menu,
    { link: true, class: "_table-menu-item" },
    menuCallBack
  );
  // 处理之后的列属性集合
  const tableColumn = menuConfig.enabled
    ? [
        ...formatColumn(column),
        {
          label: menuLabel,
          width: menuConfig.elems.length * 66 + 32,
          cls: [{ tag: "div", "slot-scope": "scope", class:'_table-menus',cls: menuConfig.elems }],
        },
      ]
    : formatColumn(column);
  // api
  // 表格数据
  const data = ref<any[]>([]);

  return { data, searchOption, column: tableColumn };
}
