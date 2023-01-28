import Main from "./main.vue";

Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
};

export default Main;

import { ElsTextProps } from "@/components/els-text";

export interface ElsContentProps {
  class?: string | string[];
  type?:string;
  bg?: string | { url?: string; class?: string };
  imgs?:
    | string
    | string[]
    | { data: { url: string; class: string }[]; box?: boolean | string };
  text?: string | ElsTextProps;
}


export interface ContentBaseProps {
  class: string | string[];
  bg: string | { url?: string; class?: string };
}