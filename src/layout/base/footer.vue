<script lang="ts" setup>
import { computed } from "vue"
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElLink } from "element-plus";
const store = useStore();
//
const website = computed(() => store.getters.website);

const getProps = (d: any = {}) => {
  const { data, title, ...t } = d;
  if (!t.path) { t.class = "no-path" }
  if (/^http/.test(t.path)) { t.target = '_blank' }
  return t;
}
</script>

<template>
  <div class="layout--footer" v-if="website.footer">
    <div class="f-links">
      <template v-for="item in website.footer.layout" :key="item">
        <div v-if="website.footer[item]" class="f-item">
          <el-link v-bind="getProps(website.footer[item])">{{ website.footer[item].title }}</el-link>
          <div class="_item-list">
            <div v-for="(d, i) in website.footer[item].data" :key="d.title + i">
              <el-link v-bind="getProps(d)">{{ d.title }}</el-link>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- 底部声明 -->
    <div class="f-bottom" v-if="website.footer.bottom">{{ website.footer.bottom }}</div>
  </div>
</template>
