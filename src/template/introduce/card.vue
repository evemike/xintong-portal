<script lang="ts" setup>
import { toRefs } from "vue"
import SvgIcon from "@/components/svg-icon"

interface Props {
    icon: string,
    title: string,
    subhead: string,
    desc: string,
    content: string[],
    mode: string
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
    > ._header {
        display: flex;
        align-items: center;
        .h-icon {
            width: 38px;
            height: 38px;
        }
        .h-text {
            .title {
                font-size: 16px;
                font-weight: 500;
            }
            .subhead {
                font-size: 16px;
            }
            .desc {
                font-size: 14px;
                line-height: 26px;
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
        width:364px;
    }
    &.mode-list {
        width:100%;
        > ._content {
            .c-item {
                display: block;
                &::before {
                    content: "";
                    width: 4px;
                    height: 4px;
                    background: #0091ff;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>