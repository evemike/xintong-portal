import { computed, ref } from "vue";
import i18n from "@/i18n";
import { useI18n } from "vue-i18n";
export default {
  setup() {
    const uselan = useI18n();
    const PAGE_NAME = ref("");
    const lang = computed(() => {
      const local = uselan.locale.value;
      const mess = i18n.global.getLocaleMessage(local);
      const d = mess.d || {};
      const p = mess[PAGE_NAME.value] || {};
      return { ...d, ...p };
    });
    return { PAGE_NAME, lang };
  },
};
