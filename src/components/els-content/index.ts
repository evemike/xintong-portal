import Main from "./main.vue";

Main.install = function (Vue: any) {
  Vue.component(Main.name, Main);
};

export default Main;

import { ElsTextProps } from "@/components/els-text";

export interface ElsContentProps extends Record<string,any> {
  name?:string
}


export interface ContentBaseProps {
  class: string;
  bg: string | { url?: string; class?: string,icon?:string };
  isHover?:boolean
}