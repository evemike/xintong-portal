import {} from "vue";
import { tip } from "@/utils/tip";
import i18n from "@/i18n";
//
type CallFunction = (e: MessageEvent) => any;
type Data = string | ArrayBufferLike | Blob | ArrayBufferView;
//
const $t = i18n.global.t;
//
export interface SocketConfig {
  url: string;
  protocols?: string | string[];
  auto?: boolean;
  getKey?: (data: MessageEvent) => string;
}

export class MyWebSocket {
  //
  isSupport = true;
  //
  config: SocketConfig;
  //
  ws: WebSocket | undefined;
  //
  needClose = false;
  private isConnecting = false;
  //
  private callbacks: Record<string, CallFunction[]> = {};
  private cacheData: Data[] = [];
  //
  constructor(config: SocketConfig) {
    this.isSupport = "WebSocket" in window;
    this.config = config;
    const { auto = true } = config;
    if (auto) {
      const ws = this.connect();
      if (ws) {
        ws.onopen = this.onOpen;
        ws.onmessage = this.onMessage;
        ws.onclose = this.onClose;
        ws.onerror = this.onError;
      }
    }
  }
  // 建立连接
  connect() {
    if (this.ws != undefined) {
      return;
    }
    const { url, protocols } = this.config;
    if (!this.isSupport) {
      return tip($t("ERR_WEBSOCKET.NOT_SUPPORT"), "error");
    }
    this.ws = new WebSocket(url, protocols);
    return this.ws;
  }
  // 关闭连接
  close() {
    if (this.testConnect()) {
      this.needClose = true;
      this.ws?.close();
    }
  }
  // 发送消息
  send(data: Data) {
    if (this.testConnect()) {
      this.ws?.send(data);
    }
  }
  // 订阅消息
  subscribe(key: string, calls: CallFunction | CallFunction[], data: Data) {
    const arr: CallFunction[] = this.callbacks[key] || [];
    this.callbacks[key] = new Array<CallFunction>().concat(arr, calls);
    if (this.isConnecting) {
      this.send(data);
    } else {
      this.cacheData.push(data);
    }
  }
  // 取消订阅
  unSubscribe(key: string, data: Data) {
    this.callbacks[key] = [];
    this.send(data);
  }
  // 清除
  clear() {
    this.ws = undefined;
    this.callbacks = {};
    this.needClose = false;
    this.isConnecting = false;
    this.cacheData = [];
  }
  // 测试
  private testConnect = () => {
    if (this.ws) {
      return true;
    }
    tip($t("ERR_WEBSOCKET.NO_CONNECT"), "error");
    return false;
  };
  // 连接建立
  private onOpen = () => {
    this.isConnecting = true;
    // 把缓存的待发送数据发送出去
    for (const data of this.cacheData) {
      this.send(data);
    }
    this.cacheData = [];
  };
  // 消息推送
  private onMessage = (d: MessageEvent) => {
    const { getKey } = this.config;
    //
    if (getKey) {
      const key = getKey(d);
      // 推送给订阅的函数
      const funs = this.callbacks[key] || [];
      for (const f of funs) {
        f(d);
      }
      if (funs.length == 0) {
        console.error($t("ERR_WEBSOCKET.NO_SUB_MSG"), " [key] = ", key);
      }
    }
  };
  // 连接关闭
  private onClose = (e: any) => {
    // 非主动关闭的情况下
    if (!this.needClose) {
      const { auto = true } = this.config;
      if (auto) {
        this.connect();
        return;
      }
    }
    this.clear();
  };
  // 连接报错
  private onError = (e: any) => {
    console.error(e);
    tip($t("ERR_WEBSOCKET.CONNECT_ERROR"), "error");
    this.close();
  };
}
