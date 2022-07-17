import Base from "./base.vue";
import Main from "./main.vue";

//
Main.install = function (Vue: any) {
  Vue.component(Base.name, Base);
  Vue.component(Main.name, Main);
};

export default Main;

export { Base, Main };
//
export * from "./inter"
import { VNode, RendererNode, RendererElement, CSSProperties, Ref } from "vue";
import { ElTable } from "element-plus";
import { Elem } from "../els-elem";
import { ElsFormConfig, ElsFormColumnItem } from "../els-form";
import { TypeOperate } from "@/ability/operate";

export type Filters = { text: string; value: string }[];


export type TypeElTable = InstanceType<typeof ElTable>;

export interface RefreshData {
  // (query: Record<string,any>): Promise<{ data: any[]; total: number }>;
  (query?: Record<string, any>, pageNum?: number, pageSize?: number): Promise<{
    data: any[];
    total: number;
  }>;
}

// export interface SearchElem extends Elem {}

// export interface SearchOption {
//   enabled: boolean; // 是否开启搜索
//   type?: "mini" | "default"; // 类型
//   noLabel?: boolean; // 是否显示 label
//   formConfig?: ElsFormConfig; // 表单配置项
//   column?: ElsFormColumnItem[]; // 表单构造数据
// }
// export interface ColumnItem extends Elem {
//   // tag?: string | Component;
//   search?: boolean | ElsFormColumnItem;
//   cls?: string | ColumnItem[] | Elem[];
//   children?: string | ColumnItem[] | Elem[];
//   //
//   label?: string;
//   type?: columnType;
//   index?: number | ((index: number) => number);
//   columnKey?: string;
//   prop?: string;
//   width?: string | number;
//   minWidth?: string | number;
//   fixed?: string | boolean;
//   renderHeader?: (
//     column: ColumnItem,
//     $index: number
//   ) => VNode<RendererNode, RendererElement, Record<string, any>>;
//   sortable?: boolean | string;
//   sortMethod?: (a: any, b: any) => number;
//   sortBy?: string | string[] | ((row: any, index: number) => string);
//   sortOrders?: SortNames[];
//   resizable?: boolean;
//   formatter?: (
//     row: any,
//     column: ColumnItem,
//     cellValue: any,
//     index: number
//   ) => string | VNode<RendererNode, RendererElement, Record<string, any>>;
//   showOverflowTooltip?: boolean;
//   align?: Align;
//   headerAlign?: Align;
//   className?: string;
//   labelClassName?: string;
//   selectable?: (row: any, index: number) => boolean;
//   reserveSelection?: boolean;
//   filters?: Filters;
//   filterPlacement?: string;
//   filterMultiple?: boolean;
//   filterMethod?: (value: any, row: any, column: any) => void;
//   filteredValue?: string[];
// }

// export type EmitEventNames =
//   | "select"
//   | "select-all"
//   | "selection-change"
//   | "cell-mouse-enter"
//   | "cell-mouse-leave"
//   | "cell-click"
//   | "cell-dblclick"
//   | "cell-contextmenu"
//   | "row-click"
//   | "row-dblclick"
//   | "row-contextmenu"
//   | "header-click"
//   | "header-contextmenu"
//   | "header-dragend"
//   | "sort-change"
//   | "filter-change"
//   | "current-change"
//   | "expand-change";

// export interface TableEmits {
//   (e: EmitEventNames, ...playload: any[]): void;
// }

// export interface TableProps {
//   data?: any[];
//   size?: "large" | "default" | "small";
//   width?: string | number;
//   height?: string | number;
//   maxHeight?: string | number;
//   fit?: boolean;
//   stripe?: boolean;
//   border?: boolean;
//   showHeader?: boolean;
//   showSummary?: boolean;
//   sumText?: string;
//   summaryMethod?: (data: { columns: any; data: any }) => string[];
//   rowClassName?: string | ((data: { row: any; rowIndex: number }) => string);
//   rowStyle?:
//     | CSSProperties
//     | ((data: { row: any; rowIndex: number }) => CSSProperties);
//   cellClassName?:
//     | string
//     | ((data: {
//         row: any;
//         rowIndex: number;
//         column: any;
//         columnIndex: number;
//       }) => string);
//   cellStyle?:
//     | CSSProperties
//     | ((data: {
//         row: any;
//         rowIndex: number;
//         column: any;
//         columnIndex: number;
//       }) => CSSProperties);
//   headerRowClassName?:
//     | string
//     | ((data: { row: any; rowIndex: number }) => string);
//   headerRowStyle?:
//     | CSSProperties
//     | ((data: { row: any; rowIndex: number }) => CSSProperties);
//   headerCellClassName?:
//     | string
//     | ((data: {
//         row: any;
//         rowIndex: number;
//         column: any;
//         columnIndex: number;
//       }) => string);
//   headerCellStyle?:
//     | CSSProperties
//     | ((data: {
//         row: any;
//         rowIndex: number;
//         column: any;
//         columnIndex: number;
//       }) => CSSProperties);
//   highlightCurrentRow?: boolean;
//   rowKey?: string | ((row: any) => string);
//   currentRowKey?: string | number;
//   emptyText?: string;
//   expandRowKeys?: any[];
//   defaultExpandAll?: boolean;
//   defaultSort?: {
//     order: "ascending" | "descending";
//     prop: string;
//     init?: any;
//     silent?: any;
//   };
//   tooltipEffect?: "dark" | "light";
//   spanMethod?: (data: {
//     row: any;
//     rowIndex: number;
//     column: any;
//     columnIndex: number;
//   }) => number[] | { rowspan: number; colspan: number };
//   selectOnIndeterminate?: boolean;
//   indent?: number;
//   treeProps?: { hasChildren?: string; children?: string };
//   lazy?: boolean;
//   load?: (row: any, treeNode: any, resolve: (data: any[]) => void) => void;
//   style?: CSSProperties;
//   className?: string;
// }

// export interface BaseProps extends TableProps {
//   column: ColumnItem[];
// }

// export interface InterProps extends BaseProps {
//   column: ColumnItem[];
//   autoLoad?: boolean;
//   showIndex?: boolean;
//   showSelect?: boolean;
//   pagination?: boolean | PaginationProps | Ref<PaginationProps>;
//   refresh?: RefreshData;
//   search?: boolean | SearchOption;
//   operate?: TypeOperate;
//   // 操作列 operateMenu
//   menu?: OperateElem[];
// }

// export interface PaginationProps {
//   small?: boolean;
//   background?: boolean;
//   pageSize?: number;
//   defaultPageSize?: number;
//   total: number;
//   pageCount?: number;
//   pagerCount?: number;
//   currentPage: number;
//   defaultCurrentPage?: number;
//   layout?: string;
//   pageSizes?: number[];
//   popperClass?: string;
//   prevText?: string;
//   nextText?: string;
//   disabled?: boolean;
//   hideOnSinglePage?: boolean;
// }

/* 操作栏 */
// export type OperateKeys =
//   | "add"
//   | "edit"
//   | "view"
//   | "delete"
//   | "deletes"
//   | "import"
//   | "upload"
//   | "export"
//   | "download"
//   | "search"
//   | "reset";
// export type OperateElem =
//   | (Elem & { handle?: (...args: any) => void; handleName?: string })
//   | OperateKeys;
