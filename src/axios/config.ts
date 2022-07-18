import { ElMessage } from "element-plus"; // 消息提示
import { AxiosRequestConfig, AxiosResponse, Canceler } from "axios";
import { NProgressOptions } from "nprogress";
import i18n from "@/i18n";

export const nprogressConfig: Partial<NProgressOptions> = {
  showSpinner: false,
};
// axios 的默认配置
export const defaultConfig: AxiosRequestConfig = {
  timeout: 30000, // 请求超时时间
  headers: {
    I18n: i18n.global.locale.value || 'zh'
  },
};

// 放抖节流配置 此处采用 节流 配置 throttle 节流函数使用 lodash 中的函数 throttle
interface RequestCache {
  config: AxiosRequestConfig;
  cancel: Function;
}
//
const requestCache = new Map<string, RequestCache>();
export const throttleExecutor = (
  config: AxiosRequestConfig,
  cancel: Canceler
) => {
  if (!config.url) {
    cancel("请补充请求的地址！");
    return;
  }
  const key = config.url + "" + config.method;
  const c = requestCache.get(key);
  // 判断是否是重复请求
  if (
    c &&
    JSON.stringify(config.params) == JSON.stringify(c.config.params) &&
    JSON.stringify(config.data) == JSON.stringify(c.config.data)
  ) {
    console.error(
      "重复请求 -- 已拦截！",
      "[ url = ",
      config.url,
      " ] ",
      " [method = ",
      config.method + " ]"
    );
    cancel("请不要频繁重复请求！");
  }
  if (!c) {
    requestCache.set(key, { config, cancel });
    // 配置过期自动删除 过期时间 300 豪秒
    setTimeout(() => {
      requestCache.has(key) && requestCache.delete(key);
    }, 30);
  }
};

export const deleteRequestCache = (config: AxiosRequestConfig) => {
  const key = config.url + "" + config.method;
  requestCache.has(key) && requestCache.delete(key);
};

// 依据业务数据状态码判定接口是否调用成功
export const isRequestSuccess = (resp: AxiosResponse): boolean => {
  const data = resp.data;
  // 状态码
  const status = data.status;
  if (status) {
    if (status != 200) {
      ElMessage({
        type: "error",
        message: data.message || `接口调用失败！错误码【${status}】`,
      });
      return false;
    }
  }
  return true;
};

// api url 常用前缀
export const URI = {
  system: "/miot-api",
};
