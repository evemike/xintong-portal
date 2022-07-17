import { ref } from "vue"
import { createStore } from "vuex";
import { saveLocal, getLocal,clearLocal } from "@/utils/storage";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    token: "",
    isAdmin: false,
    userId: "",
    refreshToken: "",
    userInfo: {},
    menus: [], // 需要渲染的菜单数据
    tentTitle: "",
    subEquipWs:undefined,
  },
  getters: {
    token: (state) => state.token ?? getLocal("token"),
    isAdmin: (state) => state.isAdmin ?? getLocal("isAdmin"),
    userId: (state) => state.userId ?? getLocal("userId"),
    refreshToken: (state) => state.refreshToken ?? getLocal("refreshToken"),
    userInfo: (state) => state.userInfo ?? getLocal("userInfo", true),
    getMenus: (state) => state.menus ?? getLocal("menus"),
    subEquipWs: (state) => state.subEquipWs,
  },
  mutations: {
    setToken(state, val: string) {
      state.token = val;
      saveLocal("token", val);
    },
    setIsAdmin(state, val: boolean) {
      state.isAdmin = val;
      saveLocal("isAdmin", val);
    },
    setUserId(state, val: string) {
      state.userId = val;
      saveLocal("userId", val);
    },
    setRefreshToken(state, val: string) {
      state.refreshToken = val;
      saveLocal("refreshToken", val);
    },
    setUserInfo(state, val: any) {
      state.userInfo = val;
      saveLocal("userInfo", val);
    },
    setMenus(state, val) {
      state.menus = val;
      saveLocal("menus", val);
    },
    setTentName(state, val) {
      state.tentTitle = val;
      saveLocal("tentName", val);
    },
    setSubEquipWs(state, val) {
      state.subEquipWs = val;
    },
  },
  actions: {
    // resetToken() {},
    logout({state}) {
      clearLocal();
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});
