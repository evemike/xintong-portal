<template>
  <div class="els-menu _card relative z-999">
    <div
      class="_header relative flex justify-between items-center z-9 h-64px"
      :class="[headerClass, currentMenu ? 'is-over' : '']"
    >
      <div class="_left flex items-center" :class="leftClass">
        <slot name="left"></slot>
      </div>

      <div class="_menus flex-1 h-100% flex items-center" :class="menusClass">
        <template v-for="(m, i) in menus" :key="`${m.key || ''}-${i}`">
          <div
            class="_item relative cursor-pointer h-100%"
            :class="[currentMenu == m ? 'is-active' : '', itemClass]"
            @mouseenter="() => handleOver(m)"
            @mouseleave="() => handleOut(m)"
            @click="() => handleGo(m)"
          >
            <span class="_label text-18px font-normal c-white" :class="itemLabelClass">{{
              t(m.label, m.label)
            }}</span>
            <b
              class="_bg absolute bottom-0 left-0 h-5px w-0 bg-amber"
              :class="itemBgClass"
            ></b>
          </div>
        </template>
      </div>
      <div class="_right flex items-center" :class="rightClass">
        <slot name="right"></slot>
      </div>
    </div>
    <div
      v-if="showCard"
      class="_card h-300px absolute z-5 top-64px left-0 w-100%"
      :class="[currentMenu ? 'xyz-in' : 'xyz-out']"
      xyz="fade up-100% duration-10 short-100% ease-liner"
      @mouseenter="() => handleOver()"
      @mouseleave="() => handleOut()"
    >
      <slot name="card" v-bind="{ menu: currentMenu }"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
type Menu = Record<string, any> & {
  key?: string;
  label: string;
  path?: string;
  children?: any[];
};

interface Props {
  menus: Menu[];
  menusClass?: string;
  headerClass?: string;
  leftClass?: string;
  rightClass?: string;
  itemClass?: string;
  itemLabelClass?: string;
  itemBgClass?: string;
  showCard?: boolean;
}

withDefaults(defineProps<Props>(), {
  menusClass: "",
  headerClass: "",
  leftClass: "",
  rightClass: "",
  itemClass: "",
  itemLabelClass: "",
  itemBgClass: "",
  showCard: true,
  menus: () => [],
});

const currentMenu = ref<Menu>();
let temp: Menu | undefined = undefined;
//
const handleOver = (m?: any) => {
  if (m) {
    currentMenu.value = m;
  } else {
    currentMenu.value = temp;
  }
};
const handleOut = (m?: any) => {
  currentMenu.value = undefined;
  if (m) {
    temp = m;
  }
};

const router = useRouter();

const handleGo = (d: any = {}) => {
  console.log('..............',d)
  const { path } = d;
  if (path) {
    const isUrl = /^http/.test(path);
    if (isUrl) {
      window.open(path);
    } else {
      router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped>
.els-menu._card {
  ._header {
    background: #00000088;
    &:hover,
    &.is-over {
      backdrop-filter: blur(10px);
    }
    ._menus {
      ._item {
        padding: 0 20px;
        line-height: 64px;
        vertical-align: middle;
        overflow: hidden;
        ._bg,
        ._label {
          transition: all 0.5s ease-in-out;
        }
        &.is-active {
          ._label {
            font-size: larger;
            font-weight: bold;
            text-shadow: 0 -5px 20px gold;
          }
        }
        &:hover {
          ._bg {
            width: 100%;
            box-shadow: 0 0 20px gold;
          }
        }
      }
    }
  }
  > ._card {
    backdrop-filter: blur(10px);
    background: #00000008;
  }
}
</style>
