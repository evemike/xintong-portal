// 静态资源获取 public/json 中的文件
import http from "@/axios";

// json 文件数据获取
export const getJsonFileData = async (name: string) => {
  if (!/^.*?\.json$/.test(name)) {
    name += ".json";
  }
  try {
    const res = await http({
      url: "/json/" + name,
      method: "get",
    });
    if (res.data) {
      return typeof res.data == "string"
        ? JSON.parse(res.data.replace(/\/\/\s+.*/g, ""))
        : res.data;
    }
  } catch (e) {
    return undefined;
  }
};
