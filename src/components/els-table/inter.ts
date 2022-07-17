import { TypeSearch } from "@/ability/search"
import { TypeOperate } from "@/ability/operate";
import { InterTableColumnItem } from "@/ability/table";
import { TypePagination } from "@/ability/pagination";

import { VNode, RendererNode, RendererElement, CSSProperties, Ref } from "vue";
export type Align = "left" | "center" | "right";
export type SortNames = "ascending" | "descending" | null;
export type columnType = "selection" | "index" | "expand";

export interface ElTableProps {
  data?: any[];
  size?: "large" | "default" | "small";
  width?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  fit?: boolean;
  stripe?: boolean;
  border?: boolean;
  showHeader?: boolean;
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?: (data: { columns: any; data: any }) => string[];
  rowClassName?: string | ((data: { row: any; rowIndex: number }) => string);
  rowStyle?:
    | CSSProperties
    | ((data: { row: any; rowIndex: number }) => CSSProperties);
  cellClassName?:
    | string
    | ((data: {
        row: any;
        rowIndex: number;
        column: any;
        columnIndex: number;
      }) => string);
  cellStyle?:
    | CSSProperties
    | ((data: {
        row: any;
        rowIndex: number;
        column: any;
        columnIndex: number;
      }) => CSSProperties);
  headerRowClassName?:
    | string
    | ((data: { row: any; rowIndex: number }) => string);
  headerRowStyle?:
    | CSSProperties
    | ((data: { row: any; rowIndex: number }) => CSSProperties);
  headerCellClassName?:
    | string
    | ((data: {
        row: any;
        rowIndex: number;
        column: any;
        columnIndex: number;
      }) => string);
  headerCellStyle?:
    | CSSProperties
    | ((data: {
        row: any;
        rowIndex: number;
        column: any;
        columnIndex: number;
      }) => CSSProperties);
  highlightCurrentRow?: boolean;
  rowKey?: string | ((row: any) => string);
  currentRowKey?: string | number;
  emptyText?: string;
  expandRowKeys?: any[];
  defaultExpandAll?: boolean;
  defaultSort?: {
    order: "ascending" | "descending";
    prop: string;
    init?: any;
    silent?: any;
  };
  tooltipEffect?: "dark" | "light";
  spanMethod?: (data: {
    row: any;
    rowIndex: number;
    column: any;
    columnIndex: number;
  }) => number[] | { rowspan: number; colspan: number };
  selectOnIndeterminate?: boolean;
  indent?: number;
  treeProps?: { hasChildren?: string; children?: string };
  lazy?: boolean;
  load?: (row: any, treeNode: any, resolve: (data: any[]) => void) => void;
  style?: CSSProperties;
  className?: string;
}


export interface ElsTableProps extends ElTableProps {
  column: InterTableColumnItem[];
  autoLoad?: boolean;
  showIndex?: boolean;
  showSelect?: boolean;
  pagination?: TypePagination;
  refresh?: (params:Record<string,any>) => Promise<{data:any[],total?:number}>;
  search?: TypeSearch;
  operate?: TypeOperate; // 表头上的操作栏;
  // 操作列 operateMenu
  menu?: TypeOperate;
  menuLabel?: string;
  // 是否使用前端分页
  autoPage?: boolean; //是否自动分页
}


