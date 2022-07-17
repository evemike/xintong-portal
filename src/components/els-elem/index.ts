import Main from "./main";

//
Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
};

export default Main;

import {
  Ref,
  RendererNode,
  RendererElement,
  VNode,
  SetupContext,
  Component,
  CSSProperties
} from "vue";

export type ElemRenderFunction = <T extends ElemRenderContext>(
  props: Record<string,any>,
  ctx: T
) => VNode<RendererNode, RendererElement, Record<string,any>> | undefined;

export interface ElemChilds {
  [key: string]: (p?: any,scope?:any) => (VNode<RendererNode, RendererElement, Record<string,any>> | undefined)[];
}

export interface ElemRenderContext extends Record<string,any>, SetupContext {
  elem: Elem;
  parent: Elem;
  context: Context;
  attrSet:ElemAttrSet;
  tag: Elem['tag'];
  tagname:string;
  createChilds?: () => ElemChilds;
  childs?:ElemChilds,
  
}

export interface ElemRender {
  [key: string]: ElemRenderFunction;
}

export interface SetupResp extends Record<string,any>{
  // render?: ElemRenderFunction;
  tag?:Elem['tag'] ;
  render?: ElemRenderFunction;
}

// elem 接口
export interface Elem extends Record<string,any> {
  tag?: string | Component;
  style?: string | CSSProperties;
  setup?: (props: ElemProps, ctx: Context) => SetupResp | void;
  cls?: string | (Elem | string)[] | Ref<Elem[] | string[]>;
  children?: string | (Elem | string)[] | Ref<Elem[] | string[]>; 
  slot?: string;
  contextKeys?:string[] ;
  excludeKeys?:string[] ;
}



export interface ElemProps {
  elem: Elem;
  context: Context;
  scope?: Record<string,any>;
  setup?: Record<string,any>;
  parent: Elem;
}
// context 接口
export interface Context extends Elem {
  $slot?: any;
  elemRender?: ElemRender;
}

// export interface ElemAttr {
//   root:{[K in keyof Elem]?:Elem[K]},
//   directive:{[K in keyof Elem]?:Elem[K]},
//   props:{[K in keyof Elem]?:Elem[K]},
// }

// 元素属性集
export interface ElemAttrSet {
  root:{[K in keyof Elem]?:Elem[K]},
  directive:{[K in keyof Elem]?:Elem[K]},
  props:{[K in keyof Elem]?:Elem[K]},
}

// export interface Props {
//   elem: Elem;
//   context: Context;
//   scope: Record<string,any>;
//   parent: Elem;
//   scopeData?: Record<string,any>;
// }

// export interface ElemAttrs extends Elem {}

export interface Hooks extends Record<string,any> {
  beforeMount?: (() => void)[];
  mounted?: (() => void)[];
  beforeUnmount?: (() => void)[];
  unMounted?: (() => void)[];
  beforeUpdate?: (() => void)[];
  updated?: (() => void)[];
  activated?: (() => void)[];
  deactivated?: (() => void)[];
  errorCaptured?: (() => void)[];
}
// 作用域
export interface Scope extends Record<string,any> {
  elem?: Elem;
  context?: Context;
  // scope?: Record<string,any>;
}


export * from "./inter"