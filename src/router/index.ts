import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import Login from "@/views/login/login.vue";
import Home from "@/views/home/index.vue";
import page404 from "@/views/error/404.vue";
import page401 from "@/views/error/401.vue";
import i18n from "@/i18n";
import { saveLocal, getLocal } from "@/utils/storage";
import LayoutBase from "@/layout/base/index.vue";
import Empty from "@/layout/empty/index.vue";
import { getJsonFileData } from "@/api/base/json";
import { isArray } from "lodash";
import { treeFilter, treeMap } from "@/utils/tree";
// vite 先静态加载所有 vue 文件
const PAGES = import.meta.glob("@/views/pages/**/*.vue");
const PATHS = Object.keys(PAGES);
const NAMES = PATHS.map((k) => k.replace(/.*?pages\//, ""));
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});
//
const addRoutes = (data: any[]) => {
  if (isAddDynamic) {
    return;
  }
  treeMap(data, (node, l, ins, pNode) => {
    const { component: c, name, path, redirect, meta } = node;
    const i = NAMES.indexOf(c);
    const component = i != -1 ? PAGES[PATHS[i]] : Empty;
    const d: RouteRecordRaw = { name, path, redirect, meta, component };
    if (pNode && pNode.name) {
      router.addRoute(pNode.name, d);
    } else {
      router.addRoute("BASE_ROUTER", d);
    }
  });
  isAddDynamic = true;
};
// 初始化 本地缓存路由
const initCacheRoutes = () => {
  const data = store.getters.routeData;
  if (isArray(data)) {
    addRoutes(data);
  }
};
initCacheRoutes();
//路由守护
router.beforeEach((to, from) => {
  // console.log(">>>>>>>", to,router.getRoutes());
  const { availableLocales, locale } = i18n.global;
  let lang: any = to.params?.lang;
  // 国际化解析规则
  if (lang && lang != locale.value) {
    if (!availableLocales.includes(lang)) {
      lang = locale.value;
      // 替换
      to.params.lang = lang;
      return router.resolve(to).fullPath;
      // return to.fullPath.replace(/^\/.*?\//,`/${lang}/`);
    }
    // 修改 本地 locale
    locale.value = lang;
    saveLocal("i18nLocal", lang);
  }
  //
  if (to.fullPath === from.fullPath) {
    return false;
  }
  return true;
});
export default router;

// 从 JSON 加载 路由对象并添加到 router 中
const initRouter = async () => {
  try {
    const menu = await getJsonFileData("menu");
    if (isArray(menu)) {
      store.commit("setMenuTree", menu);
      const data = treeFilter(menu, (n) => n.type === "route");
      store.commit("setRouteData", data);
      addRoutes(data);
    }
  } catch (e) {
    console.error(e);
  }
};

initRouter();
