<template>
  <!-- 分段 -->
  <template v-if="paragraphs.length > 1">
    <p
      v-for="(p, i) in paragraphs"
      :key="i + p"
      :class="['_paragraph', `_paragraph-${i}`, 'mb-1em']"
    >
      <span
        v-for="(l, j) in getLines(p)"
        :key="i + '-' + j"
        :class="['_line', `_line-${j}`, 'inline-block']"
      >
        <span v-html="getTextHtml(l, j)"></span>
      </span>
    </p>
  </template>
  <!-- 单段 -->
  <template v-else-if="getLines(paragraphs[0]).length > 1">
    <span
      v-for="(l, j) in getLines(paragraphs[0])"
      :key="l + j"
      :class="['_line', `_line-${j}`, 'inline-block']"
    >
      <span v-html="getTextHtml(l, j)"></span>
    </span>
  </template>
  <!-- 单行 -->
  <template v-else>
    <div v-html="getTextHtml(text, 0)"></div>
  </template>
</template>

<script lang="ts" setup>
import { toRefs, computed, unref, Ref } from "vue";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

interface Props {
  text: string;
  splits?: [paragraph: string, line: string];
  annotation?: {
    class: string | string[];
    line?: number | number[];
    text?: string | string[];
    check?: (t: string, l: number) => boolean;
  }[];
}

const props = withDefaults(defineProps<Props>(), {
  text: "",
  splits: () => ["/r", "/n"],
  annotation: () => [],
});

const { annotation } = toRefs(props);
const text = computed(() => $t(unref(props.text), unref(props.text)));

// 段落
const paragraphs = computed(() => unref(text).split(props.splits[0]));
// 段落内分行
const getLines = (text: string | Ref<string>) => unref(text).split(props.splits[1]);
// 文字修饰
const getTextHtml = (str: string, l: number) => {
  const className: Record<string, string[]> = {};
  unref(annotation).forEach((d) => {
    const { text = "", check, line } = d;

    let bool = true;
    if (check) {
      bool = check(str, l);
    }
    if (line) {
      const lines = new Array<number>().concat(line || []);
      bool = lines.includes(l);
    }
    //
    if (!bool) {
      return;
    }
    //
    if (text) {
      const ts = new Array<string>().concat(text);
      ts.forEach((t) => {
        const s = $t(t, t);
        if (str.includes(s)) {
          const st: string[] = className[s] || [];
          className[s] = st.concat(d.class || []);
        }
      });
    } else {
      const st: string[] = className[str] || [];
      className[str] = st.concat(d.class || []);
    }
  });
  let res = str;
  console.log('..................',className);
  Object.keys(className).forEach((s) => {
    const cn = className[s].join(" ");
    res = res.replaceAll(s, `<span class="${cn}">${s}</span>`);
  });
  return res;
};
</script>

<script lang="ts">
export default {
  name: "els-text",
};
</script>
