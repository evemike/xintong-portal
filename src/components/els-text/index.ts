import Main from "./main.vue";

Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
};

export default Main;


export interface ElsTextProps {
  text: string;
  splits: [paragraph: string, line: string];
  annotation: {
    class: string | string[];
    line?: number | number[];
    text: string | string[];
    check?: (t: string, l: number) => boolean;
  }[];
}