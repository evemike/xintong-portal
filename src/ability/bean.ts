//
import { provide, ref } from "vue";

export default function getBeans<T = any>(name: string) {
  const instanceBean = ref<T>();
  //
  provide(name, instanceBean);
  //
  return instanceBean;
}
