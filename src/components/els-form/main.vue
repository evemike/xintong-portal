<script lang="ts">
export default {
  name: "els-form",
};
</script>
<script setup lang="ts">
import "./style.scss";
import { ref, toRefs, computed, provide, inject, useSlots } from "vue";

import {
  ElForm,
  ElInput,
  FormItemProp,
  FormValidateCallback,
  FormProps,
  ComponentSize,
} from "element-plus";
// import type { ValidateFieldsError } from "async-validator";
import ElsElem from "../els-elem";
import { set, get, isEmpty } from "lodash";
import { ElemProps, Context as ElemContext, SetupResp } from "../els-elem";
import { isFormItemElem, renderFormElem, getDefaultTag } from "./config";
import { TypeElForm, ElsFormColumnItem, ElsFormExpose } from "./inter";
//
interface Props {
  modelValue: Record<string, any>;
  column: ElsFormColumnItem[];
  context?: Record<string, any>;
  // model?: Record<string,any>;
  rules?: TypeElForm["$props"]["rules"];
  inline?: boolean;
  labelPosition?: "left" | "right" | "top";
  labelWidth?: string | number;
  labelSuffix?: string;
  hideRequiredAsterisk?: boolean;
  showMessage?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  validateOnRuleChange?: boolean;
  size?: ComponentSize;
  disabled?: boolean;
}

// interface Props extends Partial<FormProps> {
//   modelValue: Record<string,any>;
//   column: ElsFormColumnItem[];
// }

// 定义 props 的 默认值和类型
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  context: () => ({}),
  inline: false,
  labelPosition: "right",
  hideRequiredAsterisk: false,
  showMessage: true,
  inlineMessage: false,
  statusIcon: false,
  validateOnRuleChange: true,
  disabled: false,
  size: "default",
});
// 定义 emits
// defineEmits(["update:value"]);
//
const { context: PropsContext } = props;
const {
  modelValue,
  column,
  rules,
  inline,
  labelPosition,
  labelWidth,
  labelSuffix,
  hideRequiredAsterisk,
  showMessage,
  inlineMessage,
  statusIcon,
  validateOnRuleChange,
  size,
  disabled,
} = toRefs(props);
//
provide("ElsFormModelValue", modelValue);
provide("ElsFormSize", size);
// 判断组件是否应该渲染 即  column 是否有值
const isShow = computed(() => column.value?.length > 0);

// 计算得到各个表单元素的 prop 集合
const elsFormProps: Set<string> = new Set();
provide("ElsFormProps", elsFormProps);
// 当外部 value 变化时
// colum 处理 重点 处理 prop 属性 以及由 prop 衍生的 rule value 等属性
const slots = useSlots();
const context: ElemContext = {
  tag: ElInput,
  setup(props: ElemProps): SetupResp {
    const sd = props.setup || {};
    const elem = props.elem;
    const ptag = !isEmpty(props.parent)
      ? props.parent.tag ?? props.context.tag ?? "div"
      : "div";
    const tag = elem.tag ?? getDefaultTag(ptag);
    //
    let prop = sd.prop ?? "";
    if (elem?.prop) {
      prop = prop ? prop + "." + elem.prop : elem.prop;
    }
    // 判定是否是 表单元素
    if (isFormItemElem(tag, ptag)) {
      // 保存表单元素的 prop
      const elsFormProps = inject<Set<string>>("ElsFormProps");
      elsFormProps && elsFormProps.add(prop);
      // onBeforeUnmount(() => {elsFormProps && elsFormProps.delete(prop)})
      return {
        ...PropsContext,
        tag,
        prop,
        parentTag: ptag,
        render: renderFormElem,
      };
    }
    //
    return { ...PropsContext, prop, parentTag: ptag, tag, render: undefined };
  },
  excludeKeys: ["elFormItem", "tip"],
  slots,
};

// 移除数据中的 undefined 属性,并返回新的数据
const getRealModel = () => {
  const res = {};
  let v: any;
  elsFormProps.forEach((k) => {
    if ((v = get(modelValue.value, k)) != undefined) {
      set(res, k, v);
    }
  });
  return res;
};
//  provide
const elFormRef = ref<TypeElForm>();
provide("elFormRef", elFormRef);
//
const validate = (callback?: FormValidateCallback) => {
  return elFormRef.value
    ? elFormRef.value.validate(callback)
    : Promise.resolve(false);
};
const validateField = (
  props?: FormItemProp | FormItemProp[],
  callback?: FormValidateCallback
) => {
  return elFormRef.value
    ? elFormRef.value.validateField(props, callback)
    : Promise.resolve(false);
};

// 暴露 api
defineExpose<ElsFormExpose>({
  elFormRef,
  elsFormProps,
  getRealModel,
  // elForm,
  validate,
  validateField,
  clearValidate: (props?: FormItemProp | FormItemProp[]) =>
    elFormRef.value?.clearValidate(props),
  resetFields: () => elFormRef.value?.resetFields(),
  scrollToField: (prop: FormItemProp) => elFormRef.value?.scrollToField(prop),
});
</script>

<template>
  <div v-if="isShow" class="els-form">
    <el-form
      ref="elFormRef"
      :model="modelValue"
      :rules="rules"
      :inline="inline"
      :label-position="labelPosition"
      :label-width="labelWidth"
      :label-suffix="labelSuffix"
      :hide-required-asterisk="hideRequiredAsterisk"
      :show-message="showMessage"
      :inline-message="inlineMessage"
      :status-icon="statusIcon"
      :validate-on-rule-change="validateOnRuleChange"
      :size="size"
      :disabled="disabled"
    >
      <template v-for="(e, i) in column" :key="i">
        <els-elem :elem="e" :context="context"></els-elem>
      </template>
    </el-form>
  </div>
</template>
