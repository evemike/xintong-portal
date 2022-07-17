<script lang="ts" setup>
import { toRefs, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { ElCarousel, ElCarouselItem, ElIcon, ElImage } from "element-plus";
import { Right } from "@element-plus/icons-vue";
import { gsap, ScrollTrigger } from "gsap/all";
//
const router = useRouter();
//
interface Props {
  carousel: string[];
  items: Record<string, any>[];
}
const props = withDefaults(defineProps<Props>(), {
  carousel: () => [],
  items: () => [],
});
//
const { carousel, items } = toRefs(props);
// 添加动画

onUpdated(() => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray("._item").forEach((e: any, i: number) => {
    gsap.fromTo(
      e.children[0],
      {
        opacity: 0,
        ...(i % 2 == 0 ? { x: -100 } : { y: 100 }),
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 2,
        scrollTrigger: {
          trigger: e,
          start: "top 70%",
          end: "bottom bottom",
          // markers: true,
          toggleActions: "restart none none reverse",
        },
      }
    );

    gsap.fromTo(
      e.children[1],
      {
        opacity: 0,
        ...(i % 2 == 0 ? { y: 100 } : { x: 100 }),
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 2,
        scrollTrigger: {
          trigger: e,
          start: "top 70%",
          end: "bottom bottom",
          // markers: true,
          toggleActions: "restart none none reverse",
        },
      }
    );
  });
});
// 跳转
const handleGo = (path: string) => {
  if (/^http/.test(path)) {
    window.open(path, "_blank");
  } else {
    router.push(path);
  }
};
</script>

<template>
  <div class="template--home">
    <!-- banner 走马灯 -->
    <div v-if="carousel.length > 0" class="_carousel">
      <el-carousel>
        <template v-for="img in carousel" :key="img">
          <el-carousel-item>
            <el-image :src="img" fit="cover"></el-image>
          </el-carousel-item>
        </template>
      </el-carousel>
    </div>
    <!-- items -->
    <div class="_items">
      <div
        v-for="(item, i) in items"
        :key="`_item-a-${i}`"
        :class="['_item', `_item-${i}`]"
        :style="{ background: item.background || '#fff' }"
      >
        <div v-if="i % 2 == 0" class="_img left">
          <img v-if="item.img" :src="item.img" />
        </div>
        <div :class="['_text', { 'is-white': i % 2 == 0 }]">
          <!-- title -->
          <div class="_title">{{ item.title }}</div>
          <!-- desc -->
          <div class="_desc">{{ item.desc }}</div>
          <!-- link -->
          <div
            v-if="item.link"
            class="_link"
            @click.stop="() => handleGo(item.link)"
          >
            <span>了解更多</span><el-icon><right /></el-icon>
          </div>
        </div>
        <div v-if="i % 2 != 0" class="_img right">
          <img v-if="item.img" :src="item.img" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@keyframes goto {
  from {
    padding-left: 0px;
  }
  to {
    padding-left: 16px;
  }
}

.template--home {
  position: relative;
  width: 100%;
  // overflow: auto;
  > ._carousel {
    height: 472px;
    > .el-carousel {
      .el-carousel__container {
        height: 472px;
      }
      .el-image {
        width: 100%;
        height: 472px;
      }
    }
  }
  > ._items {
    position: relative;
    width: 100%;
    > ._item {
      position: relative;
      width: 100%;
      height: 536px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      > ._img {
        &.left {
          margin-left: 150px;
        }
        &.right {
          margin-right: 110px;
        }
        // width:740px;
        height: 536px;
        img {
          // width:100%;
          height: 100%;
        }
      }
      > ._text {
        max-width: 334px;
        color: rgba(51, 51, 51, 0.85);
        &.is-white {
          color: rgba(255, 255, 255, 0.85);
        }
        ._title {
          font-size: 32px;
          font-weight: 500;
        }
        ._desc {
          margin-top: 30px;
          font-size: 14px;
          line-height: 28px;
          font-weight: 400;
        }
        ._link {
          margin-top: 32px;
          font-size: 14px;
          font-weight: 400;
          color: #00a5ff;
          display: flex;
          align-items: center;
          cursor: pointer;
          border-radius: 5px;
          padding: 4px 0;
          &:hover {
            // box-shadow:0 0 5px 0 #eee;
            .el-icon {
              animation: goto 1s infinite;
            }
          }
          .el-icon {
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
