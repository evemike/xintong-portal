<script lang="ts" setup>
import { toRefs } from "vue";
import { useRouter } from "vue-router";
import { ElImage, ElButton, ElTabs, ElTabPane } from "element-plus";
// import { Right } from "@element-plus/icons-vue";
import SvgIcon from "@/components/svg-icon";
import ContentCard from "./card.vue"
// import { gsap, ScrollTrigger } from "gsap/all";
const router = useRouter();
// props
interface Props {
  header: Record<string, any> | undefined;
  items: Record<string, any>[];
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
});
// items
const { header, items } = toRefs(props);
// tools
const handleGo = (path: string) => {
  if (/^http/.test(path)) {
    window.open(path, "_blank");
  } else {
    router.push(path);
  }
};
</script>

<template>
  <div class="template-introduce">
    <!-- header -->
    <div v-if="header" class="_header" :style="{ background: header.background }">
      <div class="_text">
        <div class="_title">{{ header.title }}</div>
        <div class="_desc">{{ header.desc }}</div>
        <div v-if="header.link" class="_link">
          <el-button @click.stop="() => handleGo(header?.link)">
            {{
              header.linkText
            }}
          </el-button>
        </div>
      </div>
      <div class="_img">
        <el-image fit="cover" :src="header.img"></el-image>
      </div>
    </div>
    <!-- items -->
    <template v-for="(item, i) in items" :key="`items-${i}`">
      <div :class="['_item', `_item-${i}`, `mode-${item.mode}`]">
        <!-- tabs -->
        <div v-if="item.mode == 'tabs'" class="_item-tabs">
          <el-tabs>
            <el-tab-pane v-for="id in item.data" :key="id.title" :label="id.title" :name="id.title">
              <div v-if="id.data && id.mode != 'tabs'" :class="['_tab-data', '_data']">
                <div
                  v-for="(d, j) in id.data"
                  :key="`data-tab-${j}`"
                  :class="['data-item', `data-item-${j}`]"
                >
                  <content-card v-bind="d"></content-card>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!--  -->
        <div v-else class="_item-card">
          <!-- title -->
          <div class="_text _header">
            <div v-if="item.title" class="_title">{{ item.title }}</div>
            <div v-if="item.subhead" class="_subhead">{{ item.subhead }}</div>
            <div v-if="item.desc" class="_desc">{{ item.desc }}</div>
          </div>
          <!-- data -->
          <div v-if="item.data" :class="['_data']">
            <div
              v-for="(d, j) in item.data"
              :key="`data-item-${j}`"
              :class="['data-item', `data-item-${j}`]"
            >
              <content-card :mode="item.mode" v-bind="d"></content-card>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.template-introduce {
  > ._header {
    height: 322px;
    color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    > ._text {
      width: 500px;
      > ._title {
        font-size: 32px;
        font-weight: 500;
      }
      > ._subhead {
      }
      > ._desc {
        margin-top: 22px;
        font-size: 14px;
        line-height: 28px;
      }
      > ._link {
        margin-top: 32px;
        .el-button {
          border: none;
          border-radius: 4px;
          font-size: 14px;
          background: rgba(31, 115, 224, 1);
          color: #fff;
          &:hover {
            color: skyblue;
          }
        }
      }
    }
    > ._img {
      .el-image {
        height: 322px;
      }
    }
  }
  > ._item {
    padding: 56px 0;
    &.mode-card {
      > ._data {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .data-item {
          width: 364px;
          background: #fff;
        }
      }
    }
    > ._text {
      text-align: center;
      > ._title {
        color: rgba(51, 51, 51, 1);
        font-size: 32px;
        font-weight: 500;
      }
      > ._subhead {
      }
      > ._desc {
      }
    }
    > ._data {
      margin-top: 24px;
      .data-item {
        padding: 24px 32px;
        > ._header {
          ._icon {
            width: 33px;
            height: 33px;
          }
        }
        > ._body {
        }
      }
    }
  }
}
</style>
