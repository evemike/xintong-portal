import Main from "./main.vue";

Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
};

export default Main;


export interface ElsTextProps {
  text: string | string[];
  splits?: [paragraph: string, line: string];
  isHover?: boolean;
  annotation?: {
    class: string;
    line?: number | number[];
    part?: number | number[];
    text?: string | string[];
    min?: number;
    max?: number;
    inclass?: string;
    outclass?: string;
  }[];
}