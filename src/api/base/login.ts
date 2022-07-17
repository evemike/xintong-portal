import http from "@/axios";
import { URI } from "@/axios/config";
import { AxiosPromise } from "axios";

export const getMenu = () => {
  return http({
    url: "/api/get-menu",
    method: "get",
  });
};

export const login = (d: {
  username: string;
  password: string;
}) => {
  const formData = new FormData();
  for (const key in d) {
    formData.append(key, d[key]);
  }
  return http({
    url: URI.system + "/oauth/token",
    method: "post",
    data: formData,
    headers:{
      Authorization:false,
      Accept: 'application/json',
    }
  });
};
