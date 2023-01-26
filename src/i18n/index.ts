import { createI18n } from "vue-i18n";
import { getLocal } from "@/utils/storage";
import zhLocale from "element-plus/es/locale/lang/zh-cn";
import enLocale from "element-plus/es/locale/lang/en";
import cn from "./lang/zh-cn";
import en from "./lang/en";
import { getJsonFileData } from "@/api/base/json";
//
const i18n = createI18n({
  legacy: false, // 解决使用useI18n报错问题
  locale: getLocal("i18nLocal") || "zh-cn",
  messages: {
    // "zh-cn": Object.assign({}, cn, zhLocale),
    // en: Object.assign({}, en, enLocale),
  },
});
export default i18n;

export { cn as zhcn, en };

// 懒加载
const loadLanguageAsync = async (lang: string) => {
  const name = `language/${lang}`;
  let def = {};
  switch (lang) {
    case "zh-cn":
      def = {...cn,...zhLocale};
      break;
    case "en":
      def = {...en,...enLocale};
      break;
    default:
      break;
  }
  const d = (await getJsonFileData(name)) || {};
  //
  const data = Object.assign({},def,d);
  //
  i18n.global.setLocaleMessage(lang,data);
  //
  console.log('=========finish=======',i18n.global.getLocaleMessage(lang))
};

export const init = async () => {
  Promise.all([loadLanguageAsync("en"),loadLanguageAsync("zh-cn")]);
}

