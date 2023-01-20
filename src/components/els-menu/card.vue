<script lang="ts">
export default {
  name: "card-menu",
};
</script>
<script setup lang="ts">
import { computed, ref, Transition } from "vue";
import { MenuItem } from "./inter";
import ElsElem, { Elem, Context } from "../els-elem";

interface Props {
  layout?: string[];
  elems?: Record<string, Elem>;
  context?: Context;
  isMenuItem?: (node: MenuItem) => boolean;
  isMenuSub?: (node: MenuItem) => boolean;
  isMenuGroup?: (node: MenuItem) => boolean;
  getMenuLabel?: (node: MenuItem) => string;
  collapse?: boolean;
  selectChange?: (path: string, paths: string[], item: any) => void;
  menuTree: MenuItem[];
  prefix?: string;
  elMenuProps?: Record<string, any>;
  // trigger?:"click"|"hover"
  menuBarAttr?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  layout: () => ["menu"],
  elems: () => ({}),
  context: () => ({}),
  collapse: false,
  isMenuItem: ({ show = true }: MenuItem) => show,
  isMenuSub: ({ isGroup = false, children = [] }: MenuItem) =>
    !isGroup && children.length > 0,
  isMenuGroup: ({ isGroup = false, children = [] }: MenuItem) =>
    isGroup && children.length > 0,
  getMenuLabel: ({ label }: MenuItem) => label,
  prefix: "/",
  menuTree: () => [],
  elMenuProps: () => ({
    mode: "horizontal",
  }),
  menuBarAttr: () => ({}),
});

const context = computed(() => {
  return {};
});

const layout = computed<string[]>(() => {
  const t = props.layout;
  const keys = Object.keys(props.elems);
  //
  const res: string[] = [];
  t.forEach((k) => {
    const b = (k == "menu" || keys.includes(k)) && !res.includes(k);
    if (b) {
      res.push(k);
    }
  });
  return res;
});

const currentKey = ref("");

const currentMenu = ref<MenuItem | undefined>();
//
const showCard = computed(() => {
  const m = currentMenu.value;
  if (!m || !m.children) {
    console.log('---',false)
    return false;
  }
  console.log('---',true)
  return true;
});
//
const test = "";

const getAttrs = (menu: MenuItem) => {
  const { label, path, children, isGroup, isSub, show, ...attr } = menu;
  return attr;
};

const handleSelect = (menu: MenuItem) => {
  currentMenu.value = menu;
};

const handleClick = (menu: MenuItem) => {};

const handleClear = () => {
  currentMenu.value = undefined;
};
</script>

<template>
  <div class="menu-card relative z-10">
    <div class="flex hover-bg-white relative z-2" v-bind="props.menuBarAttr">
      <template v-for="k in layout" :key="k">
        <template v-if="k == 'menu'">
          <template v-for="m in props.menuTree" :key="m.path + m.label">
            <div
              v-bind="getAttrs(m)"
              class="hover-cursor-pointer"
              @mouseenter="handleSelect(m)"
              @click="handleClick(m)"
              @mouseleave="handleClear"
              
            >
              {{ m.label }}
            </div>
          </template>
        </template>
        <template v-else>
          <els-elem :elem="props.elems[k]" :context="props.context"></els-elem>
        </template>
      </template>
    </div>
    <transition name="mc">
      <div v-show="showCard" class="absolute top-0 w-100% bg-red z-1">
        <slot name="card" :menu="currentMenu"></slot>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.mc-enter-active,.mc-leave-active {
  transition: all 1s ease-in-out;
}
.mc-enter-from,.mc-leave-to{
  transform:translateY(-100%)
}

</style>
