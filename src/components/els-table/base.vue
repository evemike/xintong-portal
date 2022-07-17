<script lang="ts">
export default {
  name: "els-table-base",
};
</script>
<script setup lang="ts">
import { ref, toRefs, computed, useAttrs, CSSProperties } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import ElsElem from "../els-elem";
import { SortNames, ElsTableProps } from "./index";

type ColumnItem = ElsTableProps['column']
//
const emits = defineEmits<{
  (e: "select", selection: any, row: any): void;
  (e: "select-all", selection: any): void;
  (e: "selection-change", selection: any): void;
  (e: "cell-mouse-enter", row: any, column: any, cell: any, $event: any): void;
  (e: "cell-mouse-leave", row: any, column: any, cell: any, $event: any): void;
  (e: "cell-click", row: any, column: any, cell: any, $event: any): void;
  (e: "cell-dblclick", row: any, column: any, cell: any, $event: any): void;
  (e: "cell-contextmenu", row: any, column: any, cell: any, $event: any): void;
  (e: "row-click", row: any, column: any, $event: any): void;
  (e: "row-contextmenu", row: any, column: any, $event: any): void;
  (e: "row-dblclick", row: any, column: any, $event: any): void;
  (e: "header-click", column: any, $event: any): void;
  (e: "header-contextmenu", column: any, $event: any): void;
  (
    e: "header-dragend",
    newWidth: string | number,
    oldWidth: string | number,
    column: any,
    $event: any
  ): void;
  (
    e: "sort-change",
    data: { column: any; prop: string; order: SortNames }
  ): void;
  (e: "filter-change", filters: any): void;
  (e: "current-change", currentRow: any, oldCurrentRow: any): void;
  (e: "expand-change", row: any, expanded?: any): void;
}>();
/* props */

interface Props {
  column: ColumnItem[];
  data?: any[];
  size?: "large" | "default" | "small";
  width?: string | number;
  // height?: string | number;
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

const props = withDefaults(defineProps<Props>(), {
  stripe: true,
  border: false,
  fit: true,
  showHeader: true,
  highlightCurrentRow: false,
  emptyText: "无数据",
  defaultExpandAll: false,
  tooltipEffect: "dark",
  showSummary: false,
});
// const props = defineProps<Props>();
// const attrs = useAttrs();
//
const {
  column,
  data,
  maxHeight,
  stripe,
  border,
  size,
  fit,
  showHeader,
  highlightCurrentRow,
  currentRowKey,
  rowClassName,
  rowStyle,
  cellClassName,
  cellStyle,
  headerRowClassName,
  headerRowStyle,
  headerCellClassName,
  headerCellStyle,
  rowKey,
  emptyText,
  defaultExpandAll,
  expandRowKeys,
  defaultSort,
  tooltipEffect,
  showSummary,
  sumText,
  summaryMethod,
  spanMethod,
  selectOnIndeterminate,
  indent,
  lazy,
  load,
  treeProps,
} = toRefs(props);

/*

    :data="data"
    :height="height"
    :max-height="maxHeight"
    :stripe="stripe"
    :border="border"
    :size="size"
    :fit="fit"
    :show-header="showHeader"
    :highlight-current-row="highlightCurrentRow"
    :current-row-key="currentRowKey"
    :row-class-name="rowClassName"
    :row-style="rowStyle"
    :cell-class-name="cellClassName"
    :cell-style="cellStyle"
    :header-row-class-name="headerRowClassName"
    :header-row-style="headerRowStyle"
    :header-cell-class-name="headerCellClassName"
    :header-cell-style="headerCellStyle"
    :row-key="rowKey"
    :empty-text="emptyText"
    :default-expand-all="defaultExpandAll"
    :expand-row-keys="expandRowKeys"
    :default-sort="defaultSort"
    :tooltip-effect="tooltipEffect"
    :show-summary="showSummary"
    :sum-text="sumText"
    :summary-method="summaryMethod"
    :span-method="spanMethod"
    :select-on-indeterminate="selectOnIndeterminate"
    :indent="indent"
    :lazy="lazy"
    :load="load"
    :tree-props="treeProps"
*/
//
const elTableRef = ref<InstanceType<typeof ElTable>>();

const context = computed(() => ({
  tag: ElTableColumn,
}));

defineExpose({
  elTableRef,
  clearSelection: elTableRef.value?.clearSelection,
  toggleRowSelection: elTableRef.value?.toggleRowSelection,
  toggleAllSelection: elTableRef.value?.toggleAllSelection,
  toggleRowExpansion: elTableRef.value?.toggleRowExpansion,
  setCurrentRow: elTableRef.value?.setCurrentRow,
  clearSort: elTableRef.value?.clearSort,
  clearFilter: elTableRef.value?.clearFilter,
  doLayout: elTableRef.value?.doLayout,
  sort: elTableRef.value?.sort,
});

const test = (...args: any) => console.log(args);
</script>

<template>
  <el-table
    ref="elTableRef"
    class="els-table-base"
    :data="data"
    :max-height="maxHeight"
    :stripe="stripe"
    :border="border"
    :size="size"
    :fit="fit"
    :show-header="showHeader"
    :highlight-current-row="highlightCurrentRow"
    :current-row-key="currentRowKey"
    :row-class-name="rowClassName"
    :row-style="rowStyle"
    :cell-class-name="cellClassName"
    :cell-style="cellStyle"
    :header-row-class-name="headerRowClassName"
    :header-row-style="headerRowStyle"
    :header-cell-class-name="headerCellClassName"
    :header-cell-style="headerCellStyle"
    :row-key="rowKey"
    :empty-text="emptyText"
    :default-expand-all="defaultExpandAll"
    :expand-row-keys="expandRowKeys"
    :default-sort="defaultSort"
    :tooltip-effect="tooltipEffect"
    :show-summary="showSummary"
    :sum-text="sumText"
    :summary-method="summaryMethod"
    :span-method="spanMethod"
    :select-on-indeterminate="selectOnIndeterminate"
    :indent="indent"
    :lazy="lazy"
    :load="load"
    :tree-props="treeProps"
    @select="(selection, row) => emits('select', selection, row)"
    @select-all="(selection) => emits('select-all', selection)"
    @selection-change="(selection) => emits('selection-change', selection)"
    @cell-mouse-enter="
      (row, column, cell, $event) =>
        emits('cell-mouse-enter', row, column, cell, $event)
    "
    @cell-mouse-leave="
      (row, column, cell, $event) =>
        emits('cell-mouse-leave', row, column, cell, $event)
    "
    @cell-click="
      (row, column, cell, $event) =>
        emits('cell-click', row, column, cell, $event)
    "
    @cell-dblclick="
      (row, column, cell, $event) =>
        emits('cell-dblclick', row, column, cell, $event)
    "
    @cell-contextmenu="
      (row, column, cell, $event) =>
        emits('cell-contextmenu', row, column, cell, $event)
    "
    @row-click="
      (row, column, $event) => emits('row-click', row, column, $event)
    "
    @row-dblclick="
      (row, column, $event) => emits('row-dblclick', row, column, $event)
    "
    @row-contextmenu="
      (row, column, $event) => emits('row-contextmenu', row, column, $event)
    "
    @header-click="(column, $event) => emits('header-click', column, $event)"
    @header-contextmenu="
      (column, $event) => emits('header-contextmenu', column, $event)
    "
    @header-dragend="
      (newWidth, oldWidth, column, $event) =>
        emits('header-dragend', newWidth, oldWidth, column, $event)
    "
    @sort-change="(data) => emits('sort-change', data)"
    @filter-change="(filters) => emits('filter-change', filters)"
    @current-change="
      (currentRow, oldCurrentRow) =>
        emits('current-change', currentRow, oldCurrentRow)
    "
    @expand-change="(row, expanded) => emits('expand-change', row, expanded)"
  >
    <template v-for="col in column" :key="col.label">
      <els-elem :elem="col" :context="context"></els-elem>
    </template>
  </el-table>
</template>
