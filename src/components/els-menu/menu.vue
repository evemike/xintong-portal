<script lang="ts">
export default {
  name: "els-menu",
};
</script>
<script lang="ts" setup>
import { toRefs, computed } from "vue";
import { useRouter,useRoute } from "vue-router";
import { ElMenu } from "element-plus";
import ElsMenuBase from "./base.vue";
import { MenuItem } from "./inter"
import {treeMap,TreeCallFn} from "@/utils/tree"
import paramsReplace from "@/ability/paramsReplace"
interface Props {
  isMenuItem?: (node: MenuItem) => boolean;
  isMenuSub?: (node: MenuItem) => boolean;
  isMenuGroup?: (node: MenuItem) => boolean;
  getMenuLabel?: (node: MenuItem) => string;
  collapse?: boolean;
  selectChange?: (path: string, paths: string[], item: any) => void;
  menuTree:MenuItem[];
  prefix?:string;
  elMenuProps?:Record<string,any>
}

const props = withDefaults(defineProps<Props>(), {
  collapse: false,
  isMenuItem:({show = true}:MenuItem) => show,
  isMenuSub:({isGroup = false,children = []}:MenuItem) => !isGroup && children.length > 0,
  isMenuGroup:({isGroup = false,children = []}:MenuItem) => isGroup && children.length > 0,
  getMenuLabel:({label}:MenuItem) => label,
  prefix:'/',
  menuTree:() => [],
  elMenuProps:() => ({
    mode:"horizontal"
  })
});

const {
  isMenuItem: isItem,
  isMenuSub: isSub,
  isMenuGroup: isGroup,
  getMenuLabel: getLabel,
  selectChange,
  prefix,
  elMenuProps,
} = props;
const { menuTree,collapse } = toRefs(props);

//
const route = useRoute();
const router = useRouter();
const sourcePath = computed(() => {
  const { path } = route;
  let p = path;
  return p;
});
//
const handleSelect = (path: string, paths: string[], item: any = {}) => {
  // console.log(path, currentRoute.value.path, sourcePath.value);
  if (selectChange) {
    selectChange(path, paths, item);
  } else if (path) {
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
//
const getNodeType = (node: any) => {
  if (isGroup(node)) {
    return "group";
  }
  if (isSub(node)) {
    return "sub";
  }
  if (isItem(node)) {
    return "item";
  }
  return undefined;
};
//
const getNodeAttr = ({component,meta,...t}:any) => t;
// path 
const {parse} = paramsReplace();
const parsePath:TreeCallFn<MenuItem> = (n,l,i,p) => {
    let {path = ''} = n
    const isHtml = /^http/.test(path);
    const isTrue = /^\//.test(path)
    const regD = /:[\w-]+$/
    path = parse(path)
    //
    if(isHtml || isTrue){
        return 
    }
    if(!p){
        n.path = prefix + path;
    }else{
        // 动态路由
        if(regD.test(p.path)){
            n.path = p.path.replace(regD,path)
        }else{
            n.path = p.path + '/' + path;
        }
        
    }
}

</script>

<template>
  <el-menu
    class="els-menu"
    :default-active="sourcePath"
    :collapse="collapse"
    v-bind="elMenuProps"
    @select="handleSelect"
  >
    <template v-for="(node, i) in treeMap(menuTree,parsePath)" :key="`els-menu--${i}`">
      <els-menu-base :node="node" :get-type="getNodeType" :get-node-attr="getNodeAttr"></els-menu-base>
    </template>
  </el-menu>
</template>

<style lang="scss">
.els-menu {
  &:not(.el-menu--collapse) {
    width: 100%;
  }
  &.el-menu,.el-menu-item {
    background:transparent;
  }
}
</style>
