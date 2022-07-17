import Main from "./main.vue";

//
Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
};
//
export default Main;

export * as addField from "./addField";

export * from "./inter";

// import { Component,Ref ,VNode} from "vue";
// import { ElemRenderContext , Elem } from "../els-elem";
// import { ElForm , FormItemProp , FormValidationResult,FormValidateCallback} from "element-plus"
// // import type { ValidateFieldsError } from "async-validator";
// export type TypeElForm = InstanceType<typeof ElForm>

// // export type ElFormRuleItem = ElFormContext['']

// export interface FormElemRenderContext extends ElemRenderContext {
//   prop?: string;
//   parentTag?: Component | string;
//   tag:string | Component;
// }

// export interface ElsFormColumnItem extends Elem {
//   prop?:string;
//   required?:boolean;
//   tip?:string | VNode;
//   cls?:ElsFormColumnItem[] | string | Ref<ElsFormColumnItem[]> ;
//   children?:ElsFormColumnItem[] | string | Ref<ElsFormColumnItem[]> ;
// }

// export interface ElsFormConfig {
//   rules?: TypeElForm['$props']['rules'];
//   inline?: boolean;
//   labelPosition?: "left" | "right" | "top";
//   labelWidth?: string | number;
//   labelSuffix?: string;
//   hideRequiredAsterisk?: boolean;
//   showMessage?: boolean;
//   inlineMessage?: boolean;
//   statusIcon?: boolean;
//   validateOnRuleChange?: boolean;
//   size?: "large" | "default" | "small";
//   disabled?: boolean;
// }

// export interface ElsFormExpose extends Pick<TypeElForm,"validate" | "validateField" | "clearValidate" | "resetFields" | "scrollToField"> {
//   elFormRef:Ref<TypeElForm | undefined>,
//   elsFormProps:Set<string>,
//   getRealModel:() => any;
//   validate: (callback?:FormValidateCallback) => FormValidationResult;
//   validateField: (props?: FormItemProp | FormItemProp[], cb?: FormValidateCallback) => FormValidationResult;
//   clearValidate: (props?: FormItemProp | FormItemProp[]) => void;
//   resetFields: () => void
//   scrollToField: (prop: FormItemProp) => void;
// }

// export interface ElsFormProps extends ElsFormConfig {
//   modelValue: Record<string,any>;
//   column: ElsFormColumnItem[];
//   // model?: Record<string,any>;
// }
