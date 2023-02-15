<script lang="ts" setup>
import { toRefs, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { ElCarousel, ElCarouselItem, ElIcon, ElImage } from "element-plus";
import { Right } from "@element-plus/icons-vue";
import SvgIcon from "@/components/svg-icon";
import { useI18n } from "vue-i18n";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ElsContent from "@/components/els-content";
//
const router = useRouter();
//
interface Props {
  carousel: string[];
  items: Record<string, any>[];
  layer: Record<string, any>;
}
const props = withDefaults(defineProps<Props>(), {
  carousel: () => [],
  items: () => [],
  layer: () => ({}),
});
//
// const { carousel, items, layer } = toRefs(props);
//
const { t } = useI18n();
// // 添加动画
onUpdated(() => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".home_item").forEach((e: any, i: number) => {
    const scrollTrigger = {
      trigger: e,
      start: "top 75%",
      end: "bottom bottom",
      // markers: true,
      toggleActions: "restart none none reverse",
    };
    //
    console.log(".........", e.children);
    if (!e.children || e.children.length <= 0) {
      return;
    }
    for (const c of e.children) {

      gsap.fromTo(
        c,
        {
          opacity: 0,
          ...(i % 2 == 0 ? { x: -100 } : { y: 100 }),
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 2,
          scrollTrigger,
        }
      );
    }
    
    // gsap.fromTo(
    //   e.children[0],
    //   {
    //     opacity: 0,
    //     ...(i % 2 == 0 ? { x: -100 } : { y: 100 }),
    //   },
    //   {
    //     x: 0,
    //     y: 0,
    //     opacity: 1,
    //     duration: 2,
    //     scrollTrigger,
    //   }
    // );
    // //
    // gsap.fromTo(
    //   e.children[1],
    //   {
    //     opacity: 0,
    //     ...(i % 2 == 0 ? { y: 100 } : { x: 100 }),
    //   },
    //   {
    //     x: 0,
    //     y: 0,
    //     opacity: 1,
    //     duration: 2,
    //     scrollTrigger,
    //   }
    // );
  });
});
// 跳转
const handleGo = (path: string) => {
  if (!path) {
    return;
  }
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
        <template v-for="(data, i) in carousel" :key="i">
          <el-carousel-item class="">
            <els-content v-bind="data"></els-content>
          </el-carousel-item>
        </template>
      </el-carousel>
      <!-- layer -->
      <els-content v-if="layer" class="_layer" v-bind="layer"></els-content>
    </div>
    <!-- items -->
    <div class="home_items">
      <template v-for="(item, i) in items" :key="`home_item-${i}`">
        <els-content :class="['home_item', `home_item-${i}`]" v-bind="item">
        </els-content>
      </template>
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
    position: relative;
    height: 400px;
    > .el-carousel {
      height: 100%;
      .el-carousel__container {
        height: 100%;
        .el-carousel__item {
          height: 100%;
          .el-image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    > ._layer {
      // padding: 16px 32px;
      position: absolute;
      bottom: 0;
      left:0;
      color: #fff;
      // border-radius: 8px;
      overflow: hidden;
      // backdrop-filter: blur(10px);
      .title {
        font-size: 28px;
        font-weight: 400;
      }
      .icons {
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px;
        .icons-item {
          margin: 10px;
          width: 100px;
          height: 100px;
          transition: all 0.1s ease-in-out;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          &.is-link {
            &:hover {
              cursor: pointer;
              width: 80px;
              height: 80px;
              margin-top: 0;
            }
          }
          > img {
            width: calc(100% - 2em);
            height: calc(100% - 2em);
          }
        }
      }
    }
  }
  > .home_items {
    position: relative;
    width: 100%;
    > .home_item {
      // position: relative;
      // width: 100%;
      // min-height: 536px;
      // display: flex;
      // align-items: center;
      // justify-content: space-around;
      // > ._img {
      //   &.left {
      //     margin-left: 150px;
      //   }
      //   &.right {
      //     margin-right: 110px;
      //   }
      //   // width:740px;
      //   height: 536px;
      //   img {
      //     // width:100%;
      //     height: 100%;
      //   }
      // }
      // > ._text {
      //   max-width: 334px;
      //   color: rgba(51, 51, 51, 0.85);
      //   &.is-white {
      //     color: rgba(255, 255, 255, 0.85);
      //   }
      //   ._title {
      //     font-size: 32px;
      //     font-weight: 500;
      //   }
      //   ._desc {
      //     margin-top: 30px;
      //     font-size: 14px;
      //     line-height: 28px;
      //     font-weight: 400;
      //   }
      //   ._link {
      //     margin-top: 32px;
      //     font-size: 14px;
      //     font-weight: 400;
      //     color: #00a5ff;
      //     display: flex;
      //     align-items: center;
      //     cursor: pointer;
      //     border-radius: 5px;
      //     padding: 4px 0;
      //     &:hover {
      //       // box-shadow:0 0 5px 0 #eee;
      //       .el-icon {
      //         animation: goto 1s infinite;
      //       }
      //     }
      //     .el-icon {
      //       margin-left: 8px;
      //     }
      //   }
      // }
    }
  }
}
</style>
