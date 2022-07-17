import {Component,CSSProperties,Ref,VNode,DefineComponent,VueElementConstructor,Fragment,Teleport,Suspense,FunctionalComponent,ConcreteComponent} from "vue"


export type TypeOrRef<T> = T | Ref<T>

export type TypeOrArr<T> = T | T[]

export type TypeInfer<T> = T extends {setup?:infer U} ? U : T

export type TypeElsElemItemTag = string | DefineComponent | VueElementConstructor | typeof Fragment | typeof Teleport | typeof Suspense | FunctionalComponent | ConcreteComponent;

export type TypeElsElemRenderFunc = <T,K> (props:T,context:K) => VNode[]

export type TypeElsElemItemSetup = <T,K>(props:T,ctx:K) => void | Record<string,any> & {tag?:TypeElsElemItemTag,render?:TypeElsElemRenderFunc}

export type TypeElsElemChildren = TypeOrArr<string> | InterElsElemItem[] | TypeOrRef<string[] | InterElsElemItem[]>;
// export interface InterElsElemItemSetupResp extends Record<string,any>{
//     // render?: ElemRenderFunction;
//     tag?:TypeElsElemItemTag
//     render?: ElemRenderFunction;
// }

export interface InterElsElemProps {
    elem: InterElsElemItem;
    context?: InterElsElemContext;
}

export interface InterElsElemSetupProps {
    elem: InterElsElemItem;
    parent: InterElsElemItem;
    context: InterElsElemContext;
    scope?: Record<string,any>;
    setupData?: ReturnType<TypeElsElemItemSetup>
}

export interface InterElsElemItem extends Record<string,any> {
    tag?: TypeElsElemItemTag;
    style?: string | CSSProperties;
    setup?: TypeElsElemItemSetup;
    cls?: TypeElsElemChildren;
    children?: TypeElsElemChildren;
    slot?: string;
    contextKeys?:string[] ;
    excludeKeys?:string[] ;
}

export interface InterElsElemContext extends Pick<InterElsElemItem,"tag" | "style" | "setup" | "contextKeys" | "excludeKeys"> {
    slots?:Record<string,TypeElsElemRenderFunc>
    elemRender?:Record<string,TypeElsElemRenderFunc>
}