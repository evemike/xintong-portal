<template>
  <!-- 分段 -->
  <template v-if="paragraphs.length > 1">
    <div
      v-for="(p, i) in paragraphs"
      :key="i + p"
      :class="['_paragraph', `_paragraph-${i}`, 'mb-1em', partClass[i] || '',gloablClass]"
    >
      <p
        v-for="(l, j) in getLines(p)"
        :key="i + '-' + j"
        :class="['_line', `_line-${j}`, lineClass[j] || '']"
        v-html="getTextHtml(l, j)"
      ></p>
    </div>
  </template>
  <!-- 单段 -->
  <template v-else-if="getLines(paragraphs[0]).length > 1">
    <p
      v-for="(l, j) in getLines(paragraphs[0])"
      :key="l + j"
      :class="['_line', `_line-${j}`, lineClass[j] || '',gloablClass]"
      v-html="getTextHtml(l, j)"
    ></p>
  </template>
  <!-- 单行 -->
  <template v-else>
    <div :class="gloablClass" v-html="getTextHtml(text, 0)"></div>
  </template>
</template>

<script lang="ts" setup>
import { toRefs, computed, unref, Ref } from "vue";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

interface Props {
  text: string | string[];
  splits?: [paragraph: string, line: string];
  annotation?: {
    class: string | string[];
    line?: number | number[];
    part?: number | number[];
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
const text = computed(() =>
  new Array<string>()
    .concat(props.text || "")
    .map((t) => $t(t, t))
    .join(props.splits[1] || "/n")
);
//
const gloablClass = computed(() => {
  let clz: string[] = [];
  unref(annotation).forEach((d) => {
    const { part, check, line, text } = d;
    const bool =
      part == undefined &&
      check == undefined &&
      line == undefined &&
      text == undefined;
    if (bool) {
      clz = clz.concat(d.class);
    }
  });
  //
  return clz.join(" ");
});
const partClass = computed(() => {
  const res: string[] = [];
  unref(annotation).forEach((d) => {
    const { part } = d;
    const clz = Array.isArray(d.class) ? d.class.join(" ") : d.class;
    if (part != undefined) {
      new Array<number>().concat(part).forEach((n) => {
        if (res[n]) {
          res[n] = `${res[n]} ${clz}`;
        } else {
          res[n] = clz;
        }
      });
    }
  });
  return res;
});
const lineClass = computed(() => {
  const res: string[] = [];
  unref(annotation).forEach((d) => {
    const { line } = d;
    const clz = Array.isArray(d.class) ? d.class.join(" ") : d.class;
    if (line != undefined) {
      new Array<number>().concat(line).forEach((n) => {
        if (res[n]) {
          res[n] = `${res[n]} ${clz}`;
        } else {
          res[n] = clz;
        }
      });
    }
  });
  return res;
});
// 段落
const paragraphs = computed(() => unref(text).split(props.splits[0]));
// 段落内分行
const getLines = (text: string | Ref<string>) => {
  return unref(text).split(props.splits[1]);
};
// 文字修饰
const getTextHtml = (str: string, l: number) => {
  const className: Record<string, string[]> = {};
  unref(annotation).forEach((d) => {
    const { text = "", check, line } = d;

    let bool = false;
    if (check) {
      bool = check(str, l);
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
    } else if (bool) {
      const st: string[] = className[str] || [];
      className[str] = st.concat(d.class || []);
    }
  });
  let res = str;
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
