import Main from "./main.vue";
import Select from "./select.vue";
//
Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
  Vue.component(Select.name, Select);
};

export default Main;

export const SvgSelect = Select;
