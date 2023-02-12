<template>
  <!-- 分段 -->
  <template v-if="paragraphs.length > 1">
    <div
      v-for="(p, i) in paragraphs"
      :key="i + p"
      :class="[
        '_paragraph',
        `_paragraph-${i}`,
        'mb-1em',
        partClass[i] || '',
        gloablClass,
      ]"
    >
      <p
        v-for="(l, j) in getLines(p)"
        :key="i + '-' + j"
        :class="['_line', `_line-${j}`, lineClass[j] || '']"
        v-html="getTextHtml(l, j).value"
      ></p>
    </div>
  </template>
  <!-- 单段 -->
  <template v-else-if="getLines(paragraphs[0]).length > 1">
    <p
      v-for="(l, j) in getLines(paragraphs[0])"
      :key="l + j"
      :class="['_line', `_line-${j}`, lineClass[j] || '', gloablClass]"
      v-html="getTextHtml(l, j).value"
    ></p>
  </template>
  <!-- 单行 -->
  <template v-else>
    <div :class="gloablClass" v-html="getTextHtml(text, 0).value"></div>
  </template>
</template>

<script lang="ts" setup>
import { toRefs, computed, unref, Ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

interface Props {
  text: string | string[];
  splits?: [paragraph: string, line: string];
  isHover?: boolean;
  annotation?: {
    class: string;
    line?: number | number[];
    part?: number | number[];
    text?: string | string[];
    min?: number;
    max?: number;
    inclass?: string;
    outclass?: string;
  }[];
}

const props = withDefaults(defineProps<Props>(), {
  text: "",
  splits: () => ["/r", "/n"],
  annotation: () => [],
});

const { annotation, isHover } = toRefs(props);

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
    const { part, line, text } = d;
    const bool = part == undefined && line == undefined && text == undefined;
    if (bool) {
      clz = clz.concat(d.class);
      if (unref(isHover) === true && d.inclass) {
        clz = clz.concat(d.inclass);
      }
      if (unref(isHover) === false && d.outclass) {
        clz = clz.concat(d.outclass);
      }
    }
  });
  //
  return clz.join(" ");
});
const partClass = computed(() => {
  const res: string[] = [];
  unref(annotation).forEach((d) => {
    const { part, text } = d;
    if (text != undefined) {
      return;
    }
    let clz: string[] | string = [d.class];
    if (unref(isHover) === true && d.inclass) {
      clz = clz.concat(d.inclass);
    }
    if (unref(isHover) === false && d.outclass) {
      clz = clz.concat(d.outclass);
    }
    clz = clz.join(" ");
    if (part != undefined) {
      new Array<number>().concat(part).forEach((n) => {
        if (res[n]) {
          res[n] = `${res[n]} ${clz}`;
        } else {
          res[n] = clz as string;
        }
      });
    }
  });
  return res;
});
const lineClass = computed(() => {
  const res: string[] = [];
  unref(annotation).forEach((d) => {
    const { line, text } = d;
    if (text != undefined) {
      return;
    }
    let clz: string[] | string = [d.class];
    if (unref(isHover) === true && d.inclass) {
      clz = clz.concat(d.inclass);
    }
    if (unref(isHover) === false && d.outclass) {
      clz = clz.concat(d.outclass);
    }
    clz = clz.join(" ");
    if (line != undefined) {
      new Array<number>().concat(line).forEach((n) => {
        if (res[n]) {
          res[n] = `${res[n]} ${clz}`;
        } else {
          res[n] = clz as string;
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
  const classData: Record<string, any> = {};
  const className: Record<string, string[]> = {};
  unref(annotation).forEach((d) => {
    const { text = "", line, min, max } = d;
    //
    let bool = false;
    if (text) {
      bool = true;
    }
    if (line != undefined && bool) {
      bool = line == l;
    }
    if (!bool) {
      return;
    }
    //

    const ts = new Array<string>().concat(text);
    ts.forEach((t) => {
      const s = $t(t, t);
      if (str.includes(s)) {
        const sd: any[] = classData[s] || [];
        classData[s] = sd.concat(d);
        const st: string[] = className[s] || [];

        className[s] = st.concat(st);
      }
    });
  });

  return computed(() => {
    let res = str;
    Object.keys(classData).forEach((s: string) => {
      const ds: any[] = classData[s];
      let clz: string[] = ds.map((d) => d.class);
      if (unref(isHover) === true) {
        clz = clz.concat(ds.filter((d) => d.inclass).map((d) => d.inclass));
      }
      if (unref(isHover) === false) {
        clz = clz.concat(ds.filter((d) => d.outclass).map((d) => d.outclass));
      }
      const cn = clz.join(" ");
      res = res.replaceAll(s, `<span class="${cn}">${s}</span>`);
    });

    return res;
  });
};
</script>

<script lang="ts">
export default {
  name: "els-text",
};
</script>
