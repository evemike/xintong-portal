// /attachFile/upload

import http from "@/axios";
import { URI } from "@/axios/config";

export const uploadFileUrl = URI.system + '/attachFile/upload'
// 文件上传
export const uploadFile = (data:FormData) => {
  return http({
    url:uploadFileUrl,
    method: "post",
    data
  });
};
