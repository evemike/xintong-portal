import { Ref, computed, unref, Component } from "vue";
import { Elem } from "../components/els-elem";
import { ElCollapseItem, ElButton, ElIcon, ElCollapse } from "element-plus";
import { More } from "@element-plus/icons-vue";
import SvgIcon from "../components/svg-icon";

export interface InterGroup extends Elem {
  label: string;
  icon?: string;
  name?: string;
  nodeProps?: Record<string, any>;
}

export interface InterNode extends Elem {
  group?: string;
  label: string;
  icon?: string | Component;
}

export default function createElCollapse(
  nodes: Ref<InterNode[]>,
  groups?: Ref<InterGroup[]>,
  search?: Ref<string>
) {
  const groupData = computed(() => {
    const groupValue = unref(groups) || [];
    const items: Elem[] = [];
    const names: string[] = [];
    const labels: string[] = [];
    const titles: Elem[] = [];
    const props: Record<string, any>[] = [];
    for (let i = 0, l = groupValue.length; i < l; i++) {
      const {
        name = String(i),
        label,
        nodeProps = {},
        icon,
        ...attr
      } = groupValue[i];
      names.push(name);
      labels.push(label);
      props.push(nodeProps);
      items.push({ tag: ElCollapseItem, name });
      titles.push({
        tag: "div",
        slot: "title",
        ...attr,
        cls: [
          { tag: ElIcon, cls: [{ tag: SvgIcon, id: icon }] },
          { tag: "span", cls: label },
        ],
      });
    }
    return { items, names, labels, titles, props };
  });

  const nodeData = computed(() => {
    const nodesValue = unref(nodes) || [];
    const { names, labels, props } = groupData.value;
    const items: Elem[][] = [];
    const others: Elem[] = [];
    for (const node of nodesValue) {
      const { group, label, icon, ...attr } = node;
      let ins = -1;
      const cls = icon
        ? typeof icon == "string"
          ? [{ tag: ElIcon, cls: [{ tag: SvgIcon, id: icon }] }, label]
          : [{ tag: ElIcon, cls: [{ tag: icon }] }, label]
        : label;
      if (group) {
        ins = names.includes(group)
          ? names.indexOf(group)
          : labels.indexOf(group);
      }
      if (ins > -1) {
        if (!items[ins]) {
          items[ins] = [];
        }
        items[ins].push({ tag: ElButton, cls, label, ...props[ins], ...attr });
      } else {
        others.push({ tag: ElButton, cls, label, ...attr });
      }
    }
    return { items, others };
  });
  const collapseItems = computed<Elem[]>(() => {
    const { items, others } = nodeData.value;
    const { titles, items: childs } = groupData.value;
    let elems = items;
    let oths = others;
    if (search && search.value) {
      elems = items.map((item) =>
        item.filter((d) => d && d.label && d.label.includes(search.value))
      );
      oths = others.filter((d) => d.label.includes(search.value));
      console.log(items, elems);
    }
    //
    const res: Elem[] = [];
    for (let i = 0, l = elems.length; i < l; i++) {
      const es = elems[i];
      if (es && es.length > 0) {
        const ei = childs[i];
        const ts = titles[i];
        res.push({ ...ei, cls: [ts, ...es] });
      }
    }
    if (oths.length > 0) {
      res.push({
        tag: ElCollapseItem,
        name: "others-" + childs.length,
        cls: [
          {
            tag: "div",
            slot: "title",
            cls: [
              { tag: ElIcon, cls: [{ tag: More }] },
              { tag: "span", cls: "未分组" },
            ],
          },
          ...oths,
        ],
      });
    }
    return res;
  });
  //
  const collapse = computed(() => {
    const { names } = groupData.value;
    return { tag: ElCollapse, modelValue: names, cls: collapseItems };
  });

  return { collapseItems, collapse };
}
