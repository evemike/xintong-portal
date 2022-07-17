<script lang="ts">
export default {
  name: "els-menu",
};
</script>
<script lang="ts" setup>
import { toRefs, computed } from "vue";
import { useRouter, RouteRecordNormalized, RouteRecordRaw } from "vue-router";
import { ElMenu } from "element-plus";
import ElsMenuBase from "./base.vue";
import { isMenuItem, isMenuSub, isMenuGroup, getMenuLabel } from "./utils";
interface Props {
  isMenuItem?: (node: RouteRecordNormalized | RouteRecordRaw) => boolean;
  isMenuSub?: (node: RouteRecordNormalized | RouteRecordRaw) => boolean;
  isMenuGroup?: (node: RouteRecordNormalized | RouteRecordRaw) => boolean;
  getMenuLabel?: (node: RouteRecordNormalized | RouteRecordRaw) => string;
  collapse?: boolean;
  selectChange?: (path: string, paths: string[], item: any) => void;
}

const props = withDefaults(defineProps<Props>(), {
  collapse: false,
  isMenuItem,
  isMenuSub,
  isMenuGroup,
  getMenuLabel,
});

const {
  isMenuItem: isItem,
  isMenuSub: isSub,
  isMenuGroup: isGroup,
  getMenuLabel: getLabel,
  selectChange,
} = props;
const { collapse } = toRefs(props);

const router = useRouter();
const currentRoute = router.currentRoute;
console.log(currentRoute);
const routes = router.getRoutes();
//
const nodes: RouteRecordNormalized[] = [];
//
routes.forEach((node) => {
  if (isItem(node)) {
    nodes.push(node);
  }
});
//
const menus: RouteRecordNormalized[] = [];
const paths = nodes
  .filter((node) => node.children.length > 0)
  .map((node) => node.path);
const pathLen = paths.length;
nodes.forEach((node) => {
  const path = node.path;
  let isRoot = true;
  for (let i = 0; i < pathLen; i++) {
    const p = paths[i];
    if (p != path && path.includes(p)) {
      isRoot = false;
      break;
    }
  }
  if (isRoot) {
    menus.push(node);
  }
});

// console.log("=========", nodes, menus);
const sourcePath = computed(() => {
  const { path, params } = currentRoute.value;
  let p = path;
  Object.keys(params).forEach((k) => {
    const v: string = params[k] + "";
    p = p.replace(v, ":" + k);
  });
  return p;
});

const handleSelect = (path: string, paths: string[], item: any = {}) => {
  // console.log(path, currentRoute.value.path, sourcePath.value);
  if (selectChange) {
    selectChange(path, paths, item);
  } else if (path != sourcePath.value) {
    if (/^\//.test(path)) {
      router.push({
        path,
        query: item.query || {},
        params: item.params || {},
      });
    }
    if (/^http/.test(path)) {
      window.open(path, item.target || "_blank");
    }
  }
};

const getNodeType = (node: RouteRecordNormalized | RouteRecordRaw) => {
  if (isGroup(node)) {
    return "group";
  }
  if (isSub(node)) {
    return "sub";
  }
  if (isItem(node)) {
    return "item";
  }
  const { type } = node.meta || {};
  if (type) {
    return String(type);
  }
  return undefined;
};
</script>

<template>
  <el-menu
    class="els-menu"
    :default-active="sourcePath"
    :collapse="collapse"
    @select="handleSelect"
  >
    <template v-for="(node, i) in menus" :key="`els-menu--${i}`">
      <els-menu-base :node="node" :get-type="getNodeType"></els-menu-base>
    </template>
  </el-menu>
</template>

<style lang="scss">
.els-menu {
  height: 100%;
  &:not(.el-menu--collapse) {
    width: 100%;
  }
  .el-menu-item {
    height: 40px;
  }
}
</style>
