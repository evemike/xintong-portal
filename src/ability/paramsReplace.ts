import { unref, Ref, computed } from "vue"
import { useStore } from "vuex"
import i18n from "@/i18n";

type RefT<T> = T | Ref<T>

export default function paramsReplace(str: string = "", params: RefT<Record<string, any>> = {}) {

    const store = useStore();
    //
    const paramsAttr = computed(() => {
        const token = store.getters.token;
        const locale = i18n.global.locale;
        const userId = store.getters.userId;
        //
        return { token, locale, userId, ...params }
    })
    //
    const reg = /\{\s*(\w+)\s*\}/g
    const parse = (str: string) => {
        let res = str;
        let r: RegExpExecArray | null;
        while ((r = reg.exec(res)) != null) {
            const [s, k] = r;
            if (k && unref(paramsAttr)[k] != undefined) {
                res = res.replace(s, unref(paramsAttr)[k])
            }
        }
        return res;
    }
    //
    return {
        parse,
        result:parse(str)
    }
}