<script lang="ts">
export default {
  name: "els-table",
};
</script>

<script setup lang="ts">
import "./style.scss";
//
import { ref, Ref, unref, computed, useAttrs, onMounted } from "vue";
import ElsElem from "../els-elem";
import { ElPagination, ElTable, ElTableColumn } from "element-plus";
import createSearchElem, { TypeSearch } from "@/ability/search";
import createOperateElem, { TypeOperate, OperateKey } from "@/ability/operate";
import createTableProps, { InterTableColumnItem } from "@/ability/table";
import createPaginationProps, { TypePagination } from "@/ability/pagination";
import { ElTableProps, SortNames } from "./inter";
// import { chunk } from "lodash";

const emits = defineEmits<{
  (e: "operate-click", name: OperateKey | string, payload?: any): void;
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

interface Props extends ElTableProps {
  column: InterTableColumnItem[];
  autoLoad?: boolean;
  showIndex?: boolean;
  showSelect?: boolean;
  pagination?: TypePagination;
  refresh?: (
    params: Record<string, any>
  ) => Promise<{ data: any[]; total?: number }>;
  search?: TypeSearch;
  operate?: TypeOperate; // 表头上的操作栏;
  // 操作列 operateMenu
  menu?: TypeOperate;
  menuLabel?: string;
  // 是否使用前端分页
  autoPage?: boolean; //是否自动分页
}

const props = withDefaults(defineProps<Props>(), {
  search: true,
  autoLoad: true,
  showIndex: true,
  showSelect: false,
  pagination: true,
  stripe: true,
  width: "100%",
  operate: false,
  menuLabel: "操作",
  autoPage: false,
});

const attrs = useAttrs();

const {
  autoLoad,
  autoPage,
  showIndex,
  showSelect,
  pagination,
  menu,
  menuLabel,
  refresh,
  search,
  operate,
  column,
  data = [],
  ...others
} = { ...props, ...attrs };
/*  列数据修改 */
/* 依据参数添加表格列 */
const extCols: InterTableColumnItem[] = [];
if (showSelect) {
  extCols.push({ type: "selection", width: 40 });
}
if (showIndex) {
  extCols.push({
    label: "序号",
    type: "index",
    width: 54,
    index: (i) => indexNumber(i),
  });
}
/* 表格数据 */
// const tableData = ref(data);
const {
  data: tableData,
  searchOption,
  column: columns,
} = createTableProps({
  search,
  column: extCols.concat(column),
  menu,
  menuLabel,
  menuCallBack: (keyid, ...args) => {
    emits("operate-click", keyid, ...args);
  },
});
//
const {
  query,
  enabled: showSearch,
  layout: searchLayout = "inline",
  elem: searchElem = {},
} = createSearchElem(searchOption, { size: others.size }, () => {
  refreshTable(true);
});

const { enabled: showOperate, elem: operateElem } = createOperateElem(operate);

// 分页 数据
const {
  enabled: showPagination,
  paginationOption,
  handleCurrentChange,
  handleSizeChange,
  handleNextClick,
  handlePrevClick,
  indexNumber,
} = createPaginationProps(pagination, () => {
  refreshTable();
});
// 表格刷新方法
const refreshTable = async (isReset = false) => {
  if (isReset && paginationOption.value.currentPage != 1) {
    paginationOption.value.currentPage = 1;
  }
  if (refresh) {
    const params = {
      pageNum: paginationOption.value.currentPage,
      pageSize: paginationOption.value.pageSize,
      ...query.value,
    };
    const { data: list, total } = await refresh(params);
    tableData.value = list;
    paginationOption.value.total = total ?? list.length;
  }
  return [];
};
//
const getData = () => tableData;

const context = computed(() => ({
  tag: ElTableColumn,
}));
/* 导出方法 */
const elTableRef = ref<InstanceType<typeof ElTable>>();
const getElTableRef = () => elTableRef;
/* 自动刷新数据 */
if (autoLoad && refresh) {
  refreshTable();
}
/* 计算表格高度,只有再没有指定 表格高度的情况下生效 */
const elstableRef = ref<HTMLElement>();
const elTableContainerRef = ref<HTMLElement>();
const searchRef = ref<HTMLElement>();
const operateRef = ref<HTMLElement>();
const paginationRef = ref<HTMLDivElement>();
const tableHeight: Ref<string | number> = ref("100%");
onMounted(() => {
  const max = elstableRef.value?.offsetHeight ?? 0;
  const sh =
    showSearch && searchLayout === "block" && searchRef
      ? searchRef.value?.offsetHeight || 0
      : 0;
  const oh =
    showOperate && operateRef ? operateRef.value?.offsetHeight || 0 : 0;
  const ph =
    showPagination && paginationRef
      ? paginationRef.value?.offsetHeight || 0
      : 0;
  const h = max - sh - oh - ph;
  if (h > 0) {
    tableHeight.value = h;
  }
});

defineExpose({
  refreshTable,
  getElTableRef,
  getData,
});
</script>

<template>
  <div ref="elstableRef" class="els-table">
    <div
      v-if="showSearch && searchLayout === 'block'"
      ref="searchRef"
      class="et--search"
    >
      <els-elem :elem="searchElem"></els-elem>
    </div>
    <div
      v-if="showOperate || (showSearch && searchLayout === 'inline')"
      ref="operateRef"
      class="et--operate"
    >
      <els-elem :elem="operateElem"></els-elem>
      <els-elem
        v-if="searchLayout === 'inline'"
        class="_inline-search"
        :elem="searchElem"
      ></els-elem>
    </div>
    <div ref="elTableContainerRef" class="et--table">
      <el-table
        ref="elTableRef"
        v-bind="others"
        :data="tableData"
        :max-height="tableHeight"
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
        @header-click="
          (column, $event) => emits('header-click', column, $event)
        "
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
        @expand-change="
          (row, expanded) => emits('expand-change', row, expanded)
        "
      >
        <template v-for="col in columns" :key="col.label">
          <els-elem :elem="col" :context="context"></els-elem>
        </template>
      </el-table>
    </div>

    <div v-if="showPagination" ref="paginationRef" class="et--pagination">
      <el-pagination
        v-bind="paginationOption"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        @next-click="handleNextClick"
        @prev-click="handlePrevClick"
      ></el-pagination>
    </div>
  </div>
</template>
