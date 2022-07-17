<!--
<script lang="ts">
export default {
  name: "els-table",
};
</script>

<script setup lang="ts">
import "./style.scss";
import ElsTableBase from "./base.vue";
import ElsForm from "../els-form";
import ElsElem from "../els-elem";
//
import {
  ref,
  shallowRef,
  Ref,
  unref,
  computed,
  useAttrs,
  onMounted,
} from "vue";
import { ElPagination, ElButton } from "element-plus";
// import { Search, Refresh } from "@element-plus/icons-vue";
import { ElsFormColumnItem, ElsFormConfig } from "../els-form";
import { normalButtons } from "./config";
import createOperateElem, { TypeOperate } from "@/ability/operate";
import {
  SortNames,
  RefreshData,
  ColumnItem,
  BaseProps,
  PaginationProps,
  OperateElem,
} from "./index";
import { chunk } from "lodash";

export interface SearchOption {
  enabled: boolean; // 是否开启搜索
  type?: "mini" | "default"; // 类型
  noLabel?: boolean; // 是否显示 label
  formConfig?: ElsFormConfig; // 表单配置项
  column?: ElsFormColumnItem[]; // 表单构造数据
}
const emits = defineEmits<{
  (e: "operate-click", name: OperateElem | string, payload?: any): void;
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

interface Props extends BaseProps {
  column: ColumnItem[];
  autoLoad?: boolean;
  showIndex?: boolean;
  showSelect?: boolean;
  pagination?: boolean | PaginationProps | Ref<PaginationProps>;
  refresh?: RefreshData;
  search?: boolean | SearchOption;
  operate?: TypeOperate // 表头上的操作栏;
  // 操作列 operateMenu
  menu?: OperateElem[];
}

const props = withDefaults(defineProps<Props>(), {
  search: () => ({ type: "mini", enabled: true, noLabel: true }),
  autoLoad: true,
  showIndex: true,
  showSelect: false,
  pagination: true,
  stripe: true,
  width: "100%",
  operate:false,
});

const attrs = useAttrs();

const {
  autoLoad,
  showIndex,
  showSelect,
  pagination,
  menu,
  refresh,
  search,
  operate,
  column,
  data = [],
  height,
  ...others
} = { ...props, ...attrs };

/* 表格数据 */
const tableData = ref(data);

/*  列数据修改 */
/* 依据参数添加表格列 */
const extCols: ColumnItem[] = [];
if (showSelect) {
  extCols.push({ type: "selection", width: 40 });
}
if (showIndex) {
  extCols.push({
    label: "序号",
    type: "index",
    width: 54,
    index: (i) =>
      (paginationOptions.value.currentPage - 1) *
        (paginationOptions.value.pageSize ?? 10) +
      i +
      1,
  });
}

/* 操作列   */
const menuCols: ColumnItem[] = [];
if (menu != undefined) {
  const menus = menu.map((c) => {
    const e = typeof c === "string" ? normalButtons[c] : c;
    return {
      link:true,
      size: others.size ?? "default",
      ...e,
      "@click": (...args: any[]) =>
        e?.handle?.(...args) ??
        emits(
          "operate-click",
          typeof c == "string" ? c : c.handleName || c,
          ...args
        ),
    };
  });
  menuCols.push({
    label: "操作",
    width: menus.length * 66 + 32,
    minWidth: menus.length * 66 + 32,
    cls: [
      {
        tag: "div",
        class: "els-table--col-menus",
        "slot-scope": "scope",
        cls: menus,
      },
    ],
  });
}
// 合并 列
const columns = extCols.concat(
  column.map((col) => {
    const { dict, format, ...ds } = col;
    const name = col.prop;
    let f = format;
    // 字典项
    if (dict && Array.isArray(unref(dict))) {
      f = (row: any, name: string) => {
        const v = row[name];
        const d = unref(dict).filter((item: any) => item.value == v)[0] || {};
        const { label, value, ...others } = d;
        return { "v-text": label, ...others };
      };
    }
    // 格式化
    if (f && typeof f == "function") {
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
  }),
  menuCols
);

/* search 搜索栏 */
const showSearch =
  search !== undefined &&
  (typeof search == "boolean" ? search === true : search.enabled === true);
const searchOption: SearchOption = {
  enabled: showSearch,
  type: "default",
  noLabel: false,
  formConfig: {},
  ...(search && typeof search !== "boolean" ? search : {}),
};
const searchType = searchOption.type;
const searchData = ref<Record<string, any>>({});
const searchColumn = computed((): ElsFormColumnItem[] => {
  if (!showSearch) {
    return [];
  }

  const size = others.size ?? "default";
  let res: ElsFormColumnItem[] = [];
  if (searchOption.column == undefined) {
    res = column
      .filter((col) => col.search === true || col.search != undefined)
      .map(({ prop, label, search = {} }) => ({
        prop,
        label,
        size,
        placeholder: label,
        ...(typeof search == "boolean" ? {} : search),
        ...(searchOption.noLabel ? { label: "" } : {}),
      }));
  } else {
    res = searchOption.column;
  }
  res.push({
    tag: "div",
    class: "search-button",
    cls: [
      {
        ...normalButtons.search,
        type: "primary",
     // plain: true,
        size,
        "@click": () => refreshTable(1, undefined, searchData.value),
      },
      {
        ...normalButtons.reset,
        size,
        "@click": () => {
          searchData.value = {};
          refreshTable(1);
        },
      },
    ],
  });
  return res;
});

/* operate 操作栏 header 部分  ["add"] [["add"],["edit"],[good]]*/
const {enabled:showOperate,elem:operateElem} = createOperateElem(operate)
// const showOperate = operate !== undefined;
// const operateColumn = computed(() => {
//   const size = others.size ?? "default";
//   const getElem = (n: OperateElem) => ({
//     ...(typeof n === "string" ? normalButtons[n] : n),
//     size,
//     "@click": () => {
//       emits("operate-click", typeof n === "string" ? n : n.handleName || n);
//     },
//   });
//   if (Array.isArray(operate)) {
//     const cl = operate.map((o) => getElem(o));
//     return { left: cl, center: undefined, right: undefined };
//   }
//   const cl = operate?.left?.map((o) => getElem(o)) ?? [];
//   const cc = operate?.center?.map((o) => getElem(o)) ?? [];
//   const cr = operate?.right?.map((o) => getElem(o)) ?? [];
//   return { left: cl, center: cc, right: cr };
// });

/* pagination 分页栏 */
const showPagination = pagination !== false;
const paginationOptions = ref<{
  [key in keyof PaginationProps]: PaginationProps[key];
}>({
  total: tableData.value.length ?? 0,
  currentPage: 1,
  pageSize: 10,
  layout: "total, sizes, prev, pager, next",
});
if (pagination && typeof pagination != "boolean") {
  paginationOptions.value = unref(pagination);
}
// 页码切换
const pageNumChange = async (n: number) => {
  try {
    await refreshTable(n, paginationOptions.value.pageSize);
    paginationOptions.value.currentPage = n;
  } catch (e) {
    console.error("pageNumChange", e);
  }
};
// 页面 size 变化
const pageSizeChange = async (n: number) => {
  try {
    // await refreshTable(paginationOptions.value.currentPage, n);
    await refreshTable(1, n);
    paginationOptions.value.pageSize = n;
    paginationOptions.value.currentPage = 1;
  } catch (e) {
    console.error("pageSizeChange", e);
  }
};

/* 表格数据刷新 */
const refreshTable = async (
  pageNum = 1,
  pageSize = paginationOptions.value.pageSize,
  query?: Record<string, any>
) => {
  if (refresh == undefined) {
    return Promise.resolve();
  }
  try {
    let res: { data: any[]; total: number };
    if (showPagination) {
      res = await refresh(query, pageNum, pageSize);
    } else {
      res = await refresh(query);
    }
    const { data, total } = res;
    //
    tableData.value = data;
    paginationOptions.value.total = total ?? data.length;
  } catch (e) {
    console.error("表格数据刷新失败！");
    console.error(e);
    console.error("=================");
  }
  return Promise.resolve();
};

/* 表格数据 支持伪分页 */
const tableList = computed(() => {
  const d = tableData.value;
  const m = paginationOptions.value.pageSize ?? 10;

  //
  if (d.length <= m) {
    return d;
  }
  //
  const n = paginationOptions.value.currentPage;
  //
  return chunk(d, m)[n - 1];
});
//
const getData = () => elsTableBaseRef.value?.elTableRef?.data || [];

/* 导出方法 */
const elsTableBaseRef = ref<InstanceType<typeof ElsTableBase>>();
defineExpose({
  refreshTable,
  pageNumChange,
  pageSizeChange,
  elsTableBaseRef,
  getData,
  // elTableRef: elsTableBaseRef.value.elTableRef,
  // clearSelection: elsTableBaseRef.clearSelection,
  // toggleRowSelection: elsTableBaseRef.toggleRowSelection,
  // toggleAllSelection: elsTableBaseRef.toggleAllSelection,
  // toggleRowExpansion: elsTableBaseRef.toggleRowExpansion,
  // setCurrentRow: elsTableBaseRef.setCurrentRow,
  // clearSort: elsTableBaseRef.clearSort,
  // clearFilter: elsTableBaseRef.clearFilter,
  // doLayout: elsTableBaseRef.doLayout,
  // sort: elsTableBaseRef.sort,
});

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
const tableHeight: Ref<string | number> = ref(height ?? "100%");
onMounted(() => {
  if (height == undefined) {
    const max = elstableRef.value?.offsetHeight ?? 0;
    const sh =
      showSearch && searchType === "default" && searchRef
        ? searchRef.value?.offsetHeight || 0
        : 0;
    const oh =
      showOperate && operateRef ? operateRef.value?.offsetHeight || 0 : 0;
    const ph =
      showPagination && paginationRef
        ? paginationRef.value?.offsetHeight || 0
        : 0;
    const h = max - sh - oh - ph;
    console.log(max, sh, oh, ph, h);
    if (h > 0) {
      tableHeight.value = h;
    }
  }
});
</script>

<template>
  <div ref="elstableRef" class="els-table">
    <div
      v-if="showSearch && searchType === 'default'"
      ref="searchRef"
      class="et--search"
    >
      <els-form
        v-model="searchData"
        :column="searchColumn"
        inline
        label-width="50px"
        v-bind="searchOption.formConfig"
      ></els-form>
    </div>
    <div
      v-if="showOperate || (showSearch && searchType === 'mini')"
      ref="operateRef"
      class="et--operate"
    >
      <els-elem :elem="operateElem"></els-elem>
    </div>
    <div ref="elTableContainerRef" class="et--table">
      <els-table-base
        ref="elsTableBaseRef"
        v-bind="others"
        :data="tableList"
        :column="columns"
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
      ></els-table-base>
    </div>

    <div v-if="showPagination" ref="paginationRef" class="et--pagination">
      <el-pagination
        v-bind="paginationOptions"
        @current-change="pageNumChange"
        @size-change="pageSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>
