/* eslint-disable prettier/prettier */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "./assets/style/them-body.scss"; //引入element-plus样式
import "./assets/style/theme.scss"
import "./assets/style/ablitity.scss"
import i18n from "./i18n";
import zhLocale from "element-plus/es/locale/lang/zh-cn";
import enLocale from "element-plus/es/locale/lang/en";
import 'virtual:svg-icons-register'
/*  */

const app = createApp(App);

let locale = "";
//控制 element-plus 组件语言
if (i18n.global.locale.value === "zh-cn") {
  locale = zhLocale as unknown as string;
} else {
  locale = enLocale as unknown as string;
}
app.use(i18n).use(store)
  .use(router)
  .use(ElementPlus, { locale })
  .mount("#app");
