import { unref } from "vue";
import { keys } from "lodash";
import { Switch, SwitchObj } from "./intf";
export const has = Object.prototype.hasOwnProperty;

export const getType = (o: any): string => {
  const t: string = Object.prototype.toString.call(o);
  const res = /^\[object (.*)\]$/.exec(t);
  return res === null ? "null" : res[1].toLowerCase();
};

// 判断元素标签是否是 html 元素
const HTML_TAGS = [
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "command",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "head",
  "header",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "meta",
  "meter",
  "nav",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
];
export const isHtmlTag = (tag: string): boolean => HTML_TAGS.includes(tag);

// 取对象深层属性值 key='a.b.c.d' 使用 lodash 函数 get 代替
// export const getObjVal = (key:string,obj:any = {}) : any => {
//   const ks = key.split('.')
//   let o = obj;
//   for(let i=0,l=ks.length;i<l;i++){
//     const k = ks[i];
//     if(has.call(obj,k)){
//       o = o[k]
//     }else{
//       o = undefined;
//       break;
//     }
//   }
//   return o !== obj ? o : undefined;
// }

// 设置对象属性值 支持 key = 'a.b.0.c.d' 使用 lodash 函数 set 代替
// export const setObjVal = (key = '',val:any,obj:any = {}):void => {
//   const ks:string[] = key.split('.');
//   if(ks.length === 0) {return ;}
//   if(ks.length === 1) {obj[key] = val;return ;}
//   const pk:string = ks.pop() || '';
//   let o = obj;
//   ks.forEach(k => {
//     if(!has.call(o,k)){
//       if(/^\d+$/.test(k)){
//         o[k] = []
//       }else{
//         o[k] = {}
//       }
//     }
//     o = o[k]
//   })
//   if(typeof o === 'object'){
//     o[pk] = val;
//   }
// }

// 执行字符串表达式 返回表达式结果
const ExtKeys = ["this"];
export const doEval = (s = "", obj: any = {}, isGetRefValue = false): any => {
  try {
    const keys = Object.keys(obj).filter((k) => !ExtKeys.includes(k));
    const vals = keys.map((k) => (isGetRefValue ? unref(obj[k]) : obj[k]));
    const str = "return " + s;
    return new Function(...keys, str)(...vals);
  } catch (e) {
    console.error(e);
  }
  return undefined;
};

// 获取 vue3 中 ref 对象的值
export const getRefValue = (obj: any): any => {
  if (typeof obj === "object" && obj && obj.__v_isRef === true) {
    return obj.value;
  }
  return obj;
};

export const getMenus = (tree: any) => {
  const fn = (n: any) => n.type === "menu";
  return treeFilter(tree, fn, { children: "children", isSource: "isSource" });
};

// 过滤 fn()
export const treeFilter = (
  tree = [],
  fn: Function,
  cfg = { children: "children", isSource: "isSource" }
) => {
  const ck = cfg.children || "children";
  const f = (n: any, l: any, i: any, pn: any, ins: any) => {
    const bool = fn(n, l, i, pn, ins);
    if (!bool) {
      const it = l.indexOf(n);
      l.splice(it, 1);
      if (pn && pn[ck] && pn[ck].length == 0) {
        delete pn[ck];
      }
    }
  };
  return treeMap(tree, f, cfg);
};
export const treeMap = (
  tree = [],
  fn: Function,
  cfg = { isSource: "isSource", children: "children" }
): any => {
  const isSource = cfg.isSource || false;
  const s = isSource ? tree : clone(tree);
  const ck = cfg.children || "children";
  // 节点遍历方法
  const f = (list: any, pna: any, ins: any) => {
    [...list].forEach((n, i) => {
      // 判断节点是否存在！
      if (n) {
        fn(n, list, i, ins); // 调用
        const c = n[ck];
        if (c && c.length > 0) {
          f(c, n, i);
        }
      }
    });
  };
  f(s, undefined, undefined);
  return s;
};
// 对象深度克隆
export const clone = (obj = {}) => {
  const f = (o: any) => {
    const t = Array.isArray(o);
    const r: any = t ? [] : {};
    if (t) {
      o.forEach((v: any) => {
        const t = getType(v);
        if (t == "object" || t == "array") {
          (r as any).push(f(v));
        } else {
          (r as any).push(v);
        }
      });
    } else if (!t && typeof o === "object") {
      Object.keys(o).forEach((k) => {
        const v = o[k];
        const t = getType(v);
        if (t == "object" || t == "array") {
          r[k] = f(v);
        } else {
          r[k] = v;
        }
      });
    }
    //
    return r;
  };

  return f(obj);
};

const props = {
  id: "id",
  index: "path",
  icon: "icon",
  title: "menuLabel",
  disabled: "disabled",
  children: "children",
  show: "show",
};

type PropsType = typeof props;

type PropsKeys = keyof PropsType;
// 创建 菜单的抽象数据
export const buildMenus = (data: any) => {
  // 过滤掉 不显示的元素
  data = treeFilter(data, (n: any) => n.show !== false);
  //
  // const ks:(keyof typeof props)[] = Object.keys(props);
  const ks = keys(props);
  const fn = (item: any) => {
    const obj: any = {};
    ks.forEach((k) => {
      const v: any = props[k as PropsKeys];
      const t = typeof v;
      if (t === "string" && Object.prototype.hasOwnProperty.call(item, v)) {
        obj[k] = item[v];
      } else if (t === "function") {
        obj[k] = v(item);
      }
    });
    return obj;
  };
  //  节点属性重置
  const tree = treeReset(data, fn);
  //
  const mf = (n: any, list: [], i: any, pn: any, ins: Number) => {
    const { index, title, children = [] } = n;
    // 规则一
    if (title == undefined) {
      list.splice(i, 1, ...(children as never[]));
    }
    // 规则五 + 六
    if (index && index.charAt(0) !== "/") {
      if (pn) {
        n.index = pn.index + "/" + n.index;
      } else {
        n.index = "/" + n.index;
      }
    }
  };
  // 依据规则修改节点
  const menus = treeMap(tree, mf);
  // 添加元素标签 ， 构造元素内容
  return treeReset(menus, (n: any) => {
    const obj = { ...n };
    if (!obj.tag) {
      if (Array.isArray(obj.children) && obj.children.length > 0) {
        obj.tag = "el-submenu";
        obj.children = [...createTitle(obj), ...obj.children];
      } else {
        obj.tag = "el-menu-item";
        obj.cls = createTitle(obj);
      }
    }
    return obj;
  });
};
export const createTitle = (node: any) => {
  const cls = [];
  if (node.icon) {
    cls.push({ tag: "i", class: node.icon });
  }
  if (node.title) {
    cls.push({ tag: "span", slot: "title", cls: node.title });
  }
  return cls;
};

export const treeReset = (
  tree = [],
  fn: Function,
  cfg = { sourceChildren: "sourceChildren", children: "children" }
) => {
  // menus 真实 children Name
  const csk = cfg.sourceChildren || cfg.children || "children";
  const ctk = cfg.children || "children";
  const f = (n: any, l: any, i: any, pn: Function, ins: any) => {
    const o = fn(n, l, i, pn, ins);
    if (!o) {
      l.splice(l.indexOf(n), 1);
      return;
    }
    const c = n[csk];
    const ks = Object.keys(n);
    ks.forEach((k) => delete n[k]); // 清除原对象所有数据
    const oks = Object.keys(o);
    oks.forEach((k) => (n[k] = o[k])); // 重新设置原对象属性
    if (!o[ctk] && c && c.length > 0) {
      n[ctk] = c; // 重新设定原对象 children 属性
    }
  };
  return treeMap(tree, f);
};

// 解析 token
export const parseToken = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replaceAll("-", "+").replaceAll("_", "/");
  const obj = JSON.parse(window.atob(base64));
  return obj;
};

export const isAdmin = (userInfo: { scopes: string[] }) => {
  return userInfo.scopes[0] == "SYS_ADMIN";
};

// 获取public静态资源
export const getAssetsFile = (url: string) => {
  return new URL(`../../public/image/${url}`, import.meta.url).href
}
