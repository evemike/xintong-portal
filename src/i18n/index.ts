import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import { getLocal, saveLocal } from "@/utils/storage";
import zhLocale from "element-plus/es/locale/lang/zh-cn";
import enLocale from "element-plus/es/locale/lang/en";
import cn from "./lang/zh-cn";
import en from "./lang/en";
import { getJsonFileData } from "@/api/base/json";
//
const i18n = createI18n({
  legacy: false, // 解决使用useI18n报错问题
  locale: getLocal("i18nLocal") || "zh-cn",
  messages: getLocal("i18nLocalData", true) || {},
});
export default i18n;

export { cn as zhcn, en };

// 懒加载
const loadLanguageAsync = async (lang: string) => {
  const name = `language/${lang}`;
  let def = {};
  switch (lang) {
    case "zh-cn":
      def = { ...cn, ...zhLocale };
      break;
    case "en":
      def = { ...en, ...enLocale };
      break;
    default:
      break;
  }
  const d = (await getJsonFileData(name)) || {};
  //
  const data = Object.assign({}, def, d);
  //
  const ld: any = getLocal("i18nLocalData", true) || {};
  ld[lang] = data;

  saveLocal("i18nLocalData", JSON.stringify(ld));
  //
  i18n.global.setLocaleMessage(lang, data);
  //
};

export const init = async () => {
  if (getLocal("i18nLocalData") == null) {
    Promise.all([loadLanguageAsync("en"), loadLanguageAsync("zh-cn")]);
  } else {
    nextTick(() => {
      setTimeout(() => {
        Promise.all([loadLanguageAsync("en"), loadLanguageAsync("zh-cn")]);
      }, 0);
    });
  }
};
