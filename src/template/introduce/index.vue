<script lang="ts" setup>
import { toRefs } from "vue";
import { useRouter } from "vue-router";
import { ElImage, ElButton, ElTabs, ElTabPane } from "element-plus";
// import { Right } from "@element-plus/icons-vue";
import SvgIcon from "@/components/svg-icon";
import ContentCard from "./card.vue";
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
    <div
      v-if="header"
      class="_header"
      :style="{ background: header.background }"
    >
      <div class="_text">
        <div class="_title">{{ header.title }}</div>
        <div class="_desc">{{ header.desc }}</div>
        <div v-if="header.link" class="_link">
          <el-button @click.stop="() => handleGo(header?.link)">
            {{ header.linkText }}
          </el-button>
        </div>
      </div>
      <div class="_img">
        <el-image fit="cover" :src="header.img"></el-image>
      </div>
    </div>
    <!-- items -->
    <template v-for="(item, i) in items" :key="`items-${i}`">
      <div :class="['_panel', `_item-${i}`, `mode-${item.mode}`]">
        <!-- tabs -->
        <div v-if="item.mode == 'tabs'" class="item-tabs panel-item">
          <!-- title -->
          <div class="_header">
            <div v-if="item.title" class="title">{{ item.title }}</div>
            <div v-if="item.subhead" class="subhead">{{ item.subhead }}</div>
            <div v-if="item.desc" class="desc">{{ item.desc }}</div>
          </div>
          <el-tabs :model-value="item.data[0].title">
            <el-tab-pane
              v-for="id in item.data"
              :key="id.title"
              :label="id.title"
              :name="id.title"
            >
              <div
                v-if="id.data && id.mode != 'tabs'"
                :class="['_tab-data', 'cards']"
              >
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
        <div v-else class="item-card panel-item">
          <!-- title -->
          <div class="_header">
            <div v-if="item.title" class="title">{{ item.title }}</div>
            <div v-if="item.subhead" class="subhead">{{ item.subhead }}</div>
            <div v-if="item.desc" class="desc">{{ item.desc }}</div>
          </div>
          <!-- data -->
          <div v-if="item.data" :class="['cards']">
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
    justify-content: space-between;
    align-items: center;
    padding: 0 10%;
    // min-width:1140px;
    > ._text {
      width: 600px;
      > ._title {
        font-size: 32px;
        font-weight: 600;
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
  > ._panel {
    padding: 56px 0;
    background: #f0f2f5;
    padding: 56px 10%;
    // min-width:1140px;
    color: #333;
    background: #fff;
    &:nth-child(2n) {
      background: #f0f2f5;
    }
    &.mode-list{
      .panel-item{
        .cards{
          display:block;
          >div{
            &:not(:first-child){
              margin-top:20px;
            }
          }
        }
      }
    }
    .item-card {
      .cards {
        padding-top: 24px;
      }
    }
    .item-tabs {
      .el-tabs {
        margin-top: 24px;
      }
      .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
      }
      .el-tabs__item {
        font-size: 18px;
        &.is-active {
          font-weight: 600;
        }
      }
    }
    .panel-item {
      > ._header {
        .title {
          font-size: 32px;
          font-weight: 600;
          text-align: center;
        }
        .desc {
          margin-top: 22px;
          font-size: 14px;
          line-height: 28px;
        }
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(364px, 1fr));
        gap: 24px;
        // justify-content: space-between;
        height: 100%;
        > div {
          min-width: 364px;
        }
      }
    }
  }
}
</style>
