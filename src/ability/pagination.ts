import { ref, Ref, computed, unref } from "vue";
import { isObject, chunk } from "lodash";
//
export interface InterPaginationProps {
  small: boolean;
  background: boolean;
  pageSize: number;
  defaultPageSize?: number;
  total: number;
  pageCount?: number;
  pagerCount: number;
  currentPage: number;
  defaultCurrentPage?: number;
  layout: string;
  pageSizes: number[];
  popperClass: string;
  prevText?: string;
  nextText?: string;
  disabled: boolean;
  hideOnSinglePage: boolean;
}

export type TypePagination = boolean | Partial<InterPaginationProps>;

export default function createPaginationProps(
  option: TypePagination,
  refresh: () => void
) {
  const enabled = typeof option == "boolean" ? option : true;
  const paginationOption = ref<InterPaginationProps>({
    total: 0,
    currentPage: 1,
    small: false,
    background: false,
    pageSize: 10,
    // defaultPageSize:10,
    pagerCount: 7,
    layout: "total,sizes,prev, pager, next", //'prev, pager, next, jumper, ->, total',
    pageSizes: [5, 10, 20, 50, 100,500, 999999],
    popperClass: "pagination-select",
    disabled: false,
    hideOnSinglePage: false,
  });
  // 重置属性值
  if (isObject(option)) {
    for (const k in option) {
      paginationOption.value[k] = option[k];
    }
  }

  // api
  const handleSizeChange = (v: number) => {
    if (v != paginationOption.value.pageSize) {
      paginationOption.value.pageSize = v;
      paginationOption.value.currentPage = 1;
      refresh();
    }
  };

  const handleCurrentChange = (v: number) => {
    if (v != paginationOption.value.currentPage) {
      paginationOption.value.currentPage = v;
      refresh();
    }
  };

  const handlePrevClick = () => {
    refresh();
  };

  const handleNextClick = () => {
    refresh();
  };
  // 伪分页 分片数据
  const chunkData = (list: any[]) => {
    const { pageSize: s } = unref(paginationOption);
    return chunk(list, s);
  };

  // 索引方法
  const indexNumber = (i: number) => {
    const n = i + 1;
    const { currentPage: c, pageSize: s } = unref(paginationOption);
    const res = enabled ? (c - 1) * s + n : n;
    return res;
  };
  //
  return {
    enabled,
    paginationOption,
    handleSizeChange,
    handleCurrentChange,
    handlePrevClick,
    handleNextClick,
    chunkData,
    indexNumber,
  };
}
