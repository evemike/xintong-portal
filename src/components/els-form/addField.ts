import { Ref, ref, inject, onMounted, onBeforeUnmount, computed } from "vue";

import ElsForm from "./index";
import {
  FormItemContext,
  FormValidateCallback,
  ComponentSize,
  formContextKey,
  FormContext,
  FormProps,
} from "element-plus";
import { InterElFormProps } from "./inter";

export default function addElFormField(
  elsForm: Ref<InstanceType<typeof ElsForm> | undefined>,
  prop = ""
) {
  const elsFormItemRef = ref<HTMLDivElement>();
  const elFormContext = inject<FormContext>(formContextKey);
  const validateState = "";
  //
  const size = computed<ComponentSize>(() => {
    if (elFormContext && elFormContext.size) {
      return elFormContext.size;
    }
    return "default";
  });
  const formProps: InterElFormProps = {
    labelWidth: elFormContext?.labelWidth,
    rules: elFormContext?.rules,
    inline: elFormContext?.inline ?? false,
    labelPosition: (elFormContext?.labelPosition as any) ?? "left",
    labelSuffix: elFormContext?.labelSuffix,
    inlineMessage: elFormContext?.inlineMessage,
    statusIcon: elFormContext?.statusIcon,
    showMessage: elFormContext?.showMessage,
    disabled: elFormContext?.disabled,
    validateOnRuleChange: elFormContext?.validateOnRuleChange,
    hideRequiredAsterisk: elFormContext?.hideRequiredAsterisk,
    // scrollToError:elFormContext.scrollToError,
    size: size.value,
  };
  const validate = (trigger: string, callback?: FormValidateCallback) => {
    return elsForm.value
      ? elsForm.value.validate(callback)
      : Promise.resolve(false);
  };
  const clearValidate = () => {
    elsForm.value?.clearValidate();
  };
  const resetField = () => {
    elsForm.value?.resetFields();
  };
  //
  const fields: Partial<FormItemContext> = {
    prop,
    labelWidth: "",
    inlineMessage: "",
    showMessage: true,
    $el: elsFormItemRef.value,
    size: size.value,
    validateState,
    validate,
    clearValidate,
    resetField,
  };

  onMounted(() => {
    if (elFormContext && elFormContext.addField) {
      elFormContext.addField(fields as any);
    }
  });

  onBeforeUnmount(() => {
    if (elFormContext && elFormContext.removeField) {
      elFormContext.removeField(fields as any);
    }
  });

  return {
    size,
    formProps,
    validateState,
    elsFormItemRef,
    elFormContext,
    validate,
    clearValidate,
    resetField,
  };
}
