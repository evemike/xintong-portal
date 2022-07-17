import { RouteRecordNormalized, RouteRecordRaw } from "vue-router";

export const isMenuElem = (node: RouteRecordNormalized | RouteRecordRaw) => {
  const { label } = node.meta || {};
  return label != undefined;
};
export const isMenuItem = (node: RouteRecordNormalized | RouteRecordRaw) => {
  const { type = "item", label } = node.meta || {};
  return type == "item" && label != undefined;
};
export const isMenuSub = (node: RouteRecordNormalized | RouteRecordRaw) => {
  const { children = [] } = node;
  const { type = "sub", label } = node.meta || {};
  //
  return (
    type == "sub" &&
    children.filter((c) => isMenuElem(c)).length > 0 &&
    label != undefined
  );
};
export const isMenuGroup = (node: RouteRecordNormalized | RouteRecordRaw) => {
  const { children = [] } = node;
  const { type, label } = node.meta || {};
  return type == "group" && children.length > 0 && label != undefined;
};
export const getMenuLabel = (
  node: RouteRecordNormalized | RouteRecordRaw
): string => {
  const { label = "" } = node.meta || {};
  return "" + label;
};
