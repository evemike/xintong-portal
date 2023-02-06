export type Attr<T = any> = T | Record<string, T>;

import { isPlainObject } from "lodash";

export const useAttr = <T>(attr: Attr<T>, keys: string[] = [], dv = "") => {
  const isObject = isPlainObject(attr);
  // @ts-ignore
  const res:Record<string,any> = isObject ? { ...attr } : { default: attr };
  keys.forEach((k) => {
    if (res[k] == undefined) {
      res[k] = dv;
    }
  });
  return res;
};

export const useClass = (attr:Attr<string>,keys?:string[],dv?:string) => useAttr(attr,keys,dv)
