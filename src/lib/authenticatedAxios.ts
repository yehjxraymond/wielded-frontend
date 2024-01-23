import axios, { CancelTokenSource } from "axios";
import localForage from "localforage";
import { config } from "../config";

let source: CancelTokenSource;

export const authenticatedAxios = axios.create({ baseURL: config.baseUrl });
authenticatedAxios.interceptors.request.use(async (config) => {
  const token = await localForage.getItem<string>("access_token");

  if (!token) {
    if (source) {
      source.cancel("Token not available, request cancelled.");
    }
    source = axios.CancelToken.source();
    config.cancelToken = source.token;
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
