// 静态资源获取 public/json 中的文件
import http from "@/axios";
import { saveLocal, getLocal } from "@/utils/storage";
// json 文件数据获取
const prefiex = "page-data-";
export const getJsonFileData = async (name: string) => {
  if (!/^.*?\.json$/.test(name)) {
    name += ".json";
  }
  try {
    const dn = `${prefiex}${name}`;
    const td = getLocal(dn);
    let data = td;
    if (data == undefined) {
      const res = await http({
        url: "/xintong/json/" + name,
        method: "get",
      });
      data = res.data;
      saveLocal(dn,data)
    }

    if (data) {
      return typeof data == "string"
        ? JSON.parse(data.replace(/\/\/\s+.*/g, ""))
        : data;
    }
  } catch (e) {
    return undefined;
  }
};
