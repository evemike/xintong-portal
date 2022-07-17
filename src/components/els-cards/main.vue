<script lang="ts">
export default {
  name: "els-cards",
};
</script>
<script lang="ts" setup>
import { toRefs } from "vue";

import createOperateElem, { TypeOperate } from "@/ability/operate";
import createPaginationProps, { TypePagination } from "@/ability/pagination";
import createSearchElem, { TypeSearch } from "@/ability/search";
import createTableProps, { InterTableColumnItem } from "@/ability/table";
//
import ElsElem from "@/components/els-elem";
import { ElPagination } from "element-plus";
//
interface Props {
  column: InterTableColumnItem[];
  search?: TypeSearch;
  operate?: TypeOperate;
  menu?: TypeOperate;
  menuLabel?: string;
  pagination?: TypePagination;
  autoLoad?: boolean;
  itemKey?:(row:any,i:number) => string;
  refresh?: (
    params: Record<string, any>
  ) => Promise<{ data: any[]; total: number }>;
}

const props = withDefaults(defineProps<Props>(), {
  search: true,
  autoLoad: true,
  pagination: true,
  operate: () => ["add"],
  menuLabel: "操作",
  itemKey:(row:any,i:number) => row.id + '-' + i,
});

const emit = defineEmits<{
  (e: "item-click", row: any): void;
}>();
//
const { search, operate, menu, menuLabel, autoLoad, pagination, refresh, itemKey } =
  props;
const { column } = toRefs(props);
// 列表数据刷新 api
console.log(itemKey)
//
const { enabled: showOperate, elem: OperateElem } = createOperateElem(operate);
//
const {
  data,
  searchOption,
  column: tableColumn,
} = createTableProps({
  search,
  column: column.value,
  menu,
  menuLabel,
});
//
const {
  query,
  enabled: showSearch,
  layout: searchLayout,
  elem: searchElem,
} = createSearchElem(searchOption,{}, (...arg:any) => {
  console.log(arg)
  refreshTable(true);
});
// 分页 数据
const {
  enabled: showPage,
  paginationOption,
  handleCurrentChange,
  handleSizeChange,
  handleNextClick,
  handlePrevClick,
} = createPaginationProps(pagination, () => {
  refreshTable();
});

//
//
const refreshTable = async (isReset = false) => {
  if (isReset && paginationOption.value.currentPage != 1) {
    paginationOption.value.currentPage = 1;
  }
  if (refresh) {
    console.log('.....',query,query.value)
    const params = {
      pageNum: paginationOption.value.currentPage,
      pageSize: paginationOption.value.pageSize,
      ...query.value,
    };
    console.log('.....',query,query.value,params,JSON.stringify(params))
    const { data: list, total } = await refresh(params);
    data.value = list;
    paginationOption.value.total = total;
  }
  return [];
};
//
const getData = () => data;
//
if (autoLoad) {
  refreshTable(true);
}

//
defineExpose({
  refreshTable,
  getData,
});
</script>

<template>
  <div class="els-cards">
    <!-- search -->
    <div v-if="showSearch && searchLayout == 'block'" class="els-cards-search">
      <els-elem :elem="searchElem"></els-elem>
    </div>
    <!-- header -->
    <div
      v-if="showOperate || (showSearch && searchLayout != 'block')"
      class="els-cards-header"
    >
      <els-elem :elem="OperateElem"></els-elem>
      <els-elem :elem="searchElem"></els-elem>
    </div>
    <!-- body -->
    <div :class="['els-cards-body',{'no-search':!showSearch},{'no-header':!showOperate},{'no-footer':!showPage}]">
      <template v-for="(d, i) in data" :key="`item-${i}-${d?.id}`">
        <div class="cards-item" @click.stop="emit('item-click', d)">
          <slot :scope="d" name="card">
            <template v-for="ce in tableColumn" :key="`content-${ce.prop ? ce.prop.split(',').map(k => d[k] ?? k).join('-') :''}`">
              <els-elem
                :elem="ce"
                :context="{
                  setup: () => ({ list: data, row: d, index: i, col: ce }),
                }"
              ></els-elem>
            </template>
          </slot>
        </div>
      </template>
    </div>
    <!-- page -->
    <div v-if="showPage" class="els-cards-footer">
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

<style lang="scss">
.els-cards {
  .ablity-search {
    display: flex;
    .els-form--search {
      .el-form {
        display: flex;
        margin-right: 16px;
      }
      .el-form-item {
        margin: 0;
      }
    }
  }

  .els-cards-search {
  }
  .els-cards-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
