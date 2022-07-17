import { ElTableColumn, ElButton } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  EditPen,
  View,
  Delete,
  Download,
  Upload,
} from "@element-plus/icons-vue";
import { ElsFormColumnItem } from "../els-form";
import { OperateKey } from "@/ability/operate";
import { InterTableColumnItem } from "@/ability/table";
export const defaultColumnItem: InterTableColumnItem = {
  tag: ElTableColumn,
  label: "表格列",
};

export const normalButtons: { [key in OperateKey]: ElsFormColumnItem } = {
  add: { tag: ElButton, icon: Plus, cls: "新增", type: "primary" },
  edit: { tag: ElButton, icon: EditPen, cls: "编辑" },
  view: { tag: ElButton, icon: View, cls: "查看" },
  delete: { tag: ElButton, icon: Delete, cls: "删除" },
  deletes: { tag: ElButton, icon: Delete, cls: "批量删除" },
  import: { tag: ElButton, icon: Upload, cls: "导入" },
  upload: { tag: ElButton, icon: Upload, cls: "上传" },
  export: { tag: ElButton, icon: Download, cls: "导出" },
  download: { tag: ElButton, icon: Download, cls: "下载" },
  search: { tag: ElButton, icon: Search, cls: "搜索" },
  reset: { tag: ElButton, icon: Refresh, cls: "重置" },
};
