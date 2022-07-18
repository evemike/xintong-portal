<script lang="ts">
export default {
  name: "els-menu-base",
};
</script>
<script lang="ts" setup>
import { computed } from "vue";
import { ElMenuItemGroup, ElMenuItem, ElSubMenu, ElIcon } from "element-plus";
import { RouteRecordNormalized, RouteRecordRaw } from "vue-router";
import { MenuItem } from "./inter"
import SvgIcon from "../svg-icon";
type Node = RouteRecordNormalized | RouteRecordRaw | MenuItem
interface Props {
  node: Node;
  getType: (node: Node) => string | undefined;
  getNodeAttr:(node : Node) => {icon?:string,label?:string} & Record<string,any>
  path?: string;
}
const props = defineProps<Props>();
const { node, getType, path , getNodeAttr } = props;
const { icon, label,children, ...others } = getNodeAttr(node);
const attr = {
  index: /^(\/|http)/.test(node.path) ? node.path : path + "/" + node.path,
  ...others,
};
const nodeType = getType(node);
//
</script>

<template>
  <el-menu-item-group v-if="nodeType == 'group'" v-bind="attr" :title="label">
    <template v-for="(n, i) in node.children" :key="`els-menu-group--${i}`">
      <els-menu-base
        :node="n"
        :get-type="getType"
        :path="attr.index"
        :get-node-attr="getNodeAttr"
      ></els-menu-base>
    </template>
  </el-menu-item-group>
  <el-sub-menu v-else-if="nodeType == 'sub'" v-bind="attr">
    <template #title>
      <el-icon>
        <svg-icon v-if="icon" :id="icon"></svg-icon>
      </el-icon>
      <span v-if="label">{{ label }}</span>
    </template>
    <template v-for="(n, i) in node.children" :key="`els-menu-sub--${i}`">
      <els-menu-base
        :node="n"
        :get-type="getType"
        :path="attr.index"
        :get-node-attr="getNodeAttr"
      ></els-menu-base>
    </template>
  </el-sub-menu>
  <el-menu-item v-else-if="nodeType == 'item'" v-bind="attr">
    <el-icon>
      <svg-icon v-if="icon" :id="icon"></svg-icon>
    </el-icon>
    <span v-if="label">{{ label }}</span>
  </el-menu-item>
  <template v-else>
    <template v-for="(n, i) in node?.children" :key="`els-menu-item--${i}`">
      <els-menu-base
        :node="n"
        :get-type="getType"
        :path="attr.index"
        :get-node-attr="getNodeAttr"
      ></els-menu-base>
    </template>
  </template>
</template>
