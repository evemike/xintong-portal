import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/login/login.vue";
import Home from "@/views/home/index.vue";
import page404 from "@/views/error/404.vue";
import page401 from "@/views/error/401.vue";
import i18n from "@/i18n";
import { saveLocal, getLocal } from "@/utils/storage";
import LayoutBase from "@/layout/base/index.vue";
import { getJsonFileData } from "@/api/base/json";
import { isArray } from "lodash";
//
let isAddDynamic = false; // 锁 用来锁定状态，防止重复添加路由
//
const routes: Array<RouteRecordRaw> = [
  {
    path: "/:lang/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/:lang/home",
    component: LayoutBase,
    children: [
      {
        path: "",
        name: "HOME",
        component: Home,
        meta: { label: i18n.global.t("menuPage.home"), icon: "icon-home-blue" },
      },
    ],
  },
  {
    path: "/:lang/platform",
    component: LayoutBase,
    name: "BASE_ROUTER",
    children: [],
  },
  {
    path: "/:lang/404",
    name: "404",
    component: page404,
  },
  {
    path: "/:lang/401",
    name: "401",
    component: page401,
  },
  { path: "/home", redirect: "/:lang/home" },
  {
    path: "/",
    redirect: "/:lang/login",
  },
  {
    path: "/:lang",
    redirect: "/:lang/login",
  },
  {
    path: "/*",
    redirect: "/:lang/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
//
const addRoutes = (data: any[]) => {
  if (isAddDynamic) {
    return;
  }
  for (const d of data) {
    const { component: c, ...t } = d;
    const component = () => import(`/src/views/pages/${c}`);
    router.addRoute("BASE_ROUTER", { ...t, component });
  }
  isAddDynamic = true;
};
// 初始化 本地缓存路由
const initCacheRoutes = () => {
  const data = getLocal("DYNAMIC_ROUTERS", true);
  if (isArray(data)) {
    addRoutes(data);
  }
};
initCacheRoutes();
//路由守护
router.beforeEach((to, from, next) => {
  const { availableLocales, locale } = i18n.global;
  const lang: any = to.params?.lang;
  // 国际化解析规则
  if (lang && lang != locale.value) {
    if (!availableLocales.includes(lang)) {
      // 替换
      const { params, name, query } = to;
      // to.params.lang = locale.value;
      // 解析参数 生成新的路径
      router.push({
        name: name || "",
        params: { ...params, lang: locale.value },
        query,
      });
      return;
    }
    // 修改 本地 locale
    locale.value = lang;
    saveLocal("i18nLocal", lang);
  }
  //
  if (to.fullPath === from.fullPath) {
    return;
  }
  //  console.log("-----------", to, locale.value, from);
  next();
});
export default router;

// 从 JSON 加载 路由对象并添加到 router 中
const initRouter = async () => {
  try {
    const data = await getJsonFileData("router");
    if (isArray(data)) {
      saveLocal("DYNAMIC_ROUTERS", data);
      addRoutes(data);
    }
  } catch (e) {
    console.error(e);
  }
};

initRouter();
