import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  HttpStatusCode,
} from "axios";

import { getUserCredentials } from "@storage/user/getUser.credentials";

import Toast from "react-native-toast-message";

type SignOut = () => void;

type ApiInstanceProps = AxiosInstance & {
  registerInterceptCookieManager: (signOut: SignOut) => () => void;
};

type PromisseType = {
  onSuccess: (cookie: string) => void;
  onFailure: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedQueue: Array<PromisseType> = [];

const api = axios.create({
  baseURL: "https://gestao.faridnet.com.br/",
  // baseURL: "http://192.168.89.174:53652/",
  timeout: 10000,
}) as ApiInstanceProps;

api.registerInterceptCookieManager = (signOut) => {
  const interceptCookieManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === HttpStatusCode.BadRequest) {
        if (requestError.response.data?.Error.Code === "NotLoggedIn") {
          const user = await getUserCredentials();

          if (!user) {
            signOut();

            Toast.show({
              type: "info",
              text1: "Sua sessão expirou.",
              text2: "Faça login novamente!",
            });

            return Promise.reject(requestError);
          }

          const originalRequestConfig = requestError.config;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (cookie: string) => {
                  originalRequestConfig.headers = {
                    Cookie: cookie,
                  };
                  resolve(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          return new Promise((resolve, reject) => {
            try {
              const options: AxiosRequestConfig = {
                method: "POST",
                url: "/Account/LoginOnApp",
                data: {
                  username: user.username,
                  password: user.password,
                },
              };

              api(options).then(({ headers }) => {
                if (!headers["set-cookie"]) {
                  throw new Error("Faça login novamente.");
                }

                const cookie = headers["set-cookie"][0];

                if (originalRequestConfig.data) {
                  originalRequestConfig.data = JSON.parse(
                    originalRequestConfig.data
                  );
                }

                api.defaults.headers.common.Cookie = cookie;

                failedQueue.forEach((request) => {
                  request.onSuccess(cookie);
                });

                resolve(api(originalRequestConfig));
              });
            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
              failedQueue = [];
            }
          });
        }

        if (requestError.response.data?.Error.Code === "AccessDenied") {
          Toast.show({
            type: "info",
            text1: "Sua sessão expirou.",
            text2: "Faça login novamente!",
          });
          signOut();
        }
      }

      return Promise.reject(requestError);
    }
  );

  return () => {
    api.interceptors.response.eject(interceptCookieManager);
  };
};

export { api };
