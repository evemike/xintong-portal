import store from "@/store/index";
import router from "@/router";
import axios from "axios";
import { ElMessage } from "element-plus";
//
import NProgress from "nprogress";
import "nprogress/nprogress.css";
//
import {
  nprogressConfig,
  defaultConfig,
  throttleExecutor,
  isRequestSuccess,
} from "./config";
// import { saveLocal, getLocal } from "@/utils/storage";

//
// nprogress 配置
NProgress.configure(nprogressConfig);
//
const http = axios.create(defaultConfig);
//
// 拦截 request 请求
http.interceptors.request.use((config) => {
  // 开启 ngprogress
  NProgress.start();
  // 添加自定义请求头
  if (!config.headers) {
    config.headers = {} as any;
  }
  if ((config.headers as any)?.Authorization == undefined) {
    (config.headers as any).Authorization = `Bearer ${store.getters.token}`;
  }
  for (const k in config.headers) {
    const v = config.headers[k];
    if (v === false) {
      delete config.headers[k];
    }
  }
  // 增加节流功能
  config.cancelToken = new axios.CancelToken((c) => {
    throttleExecutor(config, c);
  });
  //
  return config;
});

// 拦截 response
http.interceptors.response.use(
  (resp) => {
    // 关闭 ngprogress
    NProgress.done();
    // 解析接口状态 返回为 true 则正常返回 数据 若为 false 则返回 异常
    if (!isRequestSuccess(resp)) {
      return Promise.reject(resp);
    }
    // 拦截规则
    return resp;
  },
  (error) => {
    // 关闭 ngprogress
    NProgress.done();
    //
    const resp = error.response;
    const data = resp?.data || {};
    let isJump = false;
    // console.error(resp);
    //
    const msg = `[ ${data?.status ?? resp?.status} ] [ ${data?.errorCode} ] [${
      data?.message ?? resp?.statusText
    }] [${resp?.request?.responseURL}] `;

    if (msg.includes("/auth/token")) {
      isJump = false;
    }
    switch (resp?.status) {
      case 404:
        // 跳 400 页面
        isJump && router.push("/404");
        break;
      case 401:
        isJump && router.push("/401");
        // 跳 401 页面
        break;
      case 403:
        break;
      case 500:
        break;
      case 503:
        break;
      default:
        break;
    }
    // 报错提示
    // if (msg) {
    //   ElMessage({
    //     type: "error",
    //     message: data.message || `接口调用失败！错误码【${data.status}】`,
    //   });
    // }
    // 需不需要重试
    // 返回错误信息
    return Promise.reject(resp);
  }
);

//

export default http;
