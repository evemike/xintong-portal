import http from "@/axios";
import { URI } from "@/axios/config";

// 设备协议类型
export const equipProtoType = () => {
  return http({
    url: URI.system + "/mProto/queryTree",
    method: "get",
  });
};

// 查询所有驱动 /mDriver/queryAllList
export const driverList = () => {
  return http({
    url: URI.system + "/mDriver/queryAllList",
    method: "get",
  });
}
