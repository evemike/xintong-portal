<script lang="ts" setup>
import { toRefs } from "vue"
import SvgIcon from "@/components/svg-icon"

interface Props {
    icon?: string,
    title?: string,
    subhead?: string,
    desc?: string,
    content?: string[],
    mode?: string
}

const props = withDefaults(defineProps<Props>(), {
    mode: "card",
    content: () => []
})
//
const { mode, icon, title, subhead, desc, content } = toRefs(props)

</script>

<template>
    <div :class="['_content-card', `mode-${mode}`]">
        <!-- header -->
        <div class="_header">
            <!-- icon -->
            <div class="h-icon" v-if="icon">
                <svg-icon :id="icon"></svg-icon>
            </div>
            <!-- text -->
            <div class="h-text">
                <div v-if="title" class="title">{{ title }}</div>
                <div v-if="subhead" class="subhead">{{ subhead }}</div>
                <div v-if="desc" class="desc">{{ desc }}</div>
            </div>
        </div>
        <!-- content -->
        <div class="_content">
            <template v-for="c in content" :key="c">
                <div class="c-item">{{ c }}</div>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
._content-card {
    background-color: #fff;
    padding:24px;
    height:100%;
    box-sizing: border-box;
    > ._header {
        display: flex;
        align-items: center;
        padding-bottom:24px;
        .h-icon {
            width: 38px;
            min-width: 38px;
            height: 38px;
            min-height: 38px;
            margin-right:16px;
            svg{
                width:100%;
                height:100%;
            }
        }
        .h-text {
            .title {
                font-size: 16px;
                font-weight: 600;
            }
            .subhead {
                font-size: 16px;
            }
            .desc {
                font-size: 14px;
                line-height: 28px;
            }
        }
    }
    > ._content {
        .c-item {
            color: rgba(51, 51, 51, 0.65);
            font-size: 14px;
        }
    }

    &.mode-card {
        min-width:364px;
    }
    &.mode-list {
        width:100%;
        > ._header{
          border-bottom:1px solid #ddd;
        }
        > ._content {
            padding-top:24px;
            .c-item {
                display: block;
                &::before {
                    content: "";
                    width: 4px;
                    height: 4px;
                    background: #0091ff;
                    border-radius: 4px;
                    display:inline-block;
                    margin-right:8px;
                    margin-bottom:3px;
                }
            }
        }
    }
}
</style>
