import Main from "./main.vue";

//
Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
};
//
export default Main;

export * from "./inter"
