import Main from "./menu.vue";
// import Menu from "./menu.vue";
import Route from "./route.vue"
//
Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
  // Vue.component(Route.name, Route);
};

export default Main;

export {Route}

export * from "./inter"