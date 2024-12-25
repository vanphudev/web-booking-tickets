import axios from "axios";
import {setUserInfo, setUserToken, clearUserInfoAndUserToken, setUserInfoAndUserToken} from "../redux/slices/authSlice";
import {store} from "../redux/store";
import {useRouter} from "../hooks/router/useRouter";
import {getItem, removeItem, setItem} from "../utility/functionCommon/storage";
import {useAppDispatch} from "../redux/store";
import {StorageEnum} from "../entity/enum";

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_APP_BASE_API,
   timeout: 50000,
   headers: {"Content-Type": "application/json;charset=utf-8"},
});

axiosInstance.interceptors.request.use(
   (config) => {
      config.headers.Authorization = (getItem(StorageEnum.UserToken) || {}).accessToken;
      config.headers.Client_ID = (getItem(StorageEnum.UserInfo) || {}).userId;
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

const UserApi = {
   RefreshToken: "public/customer/auth/refresh-token",
};

async function refreshToken() {
   try {
      const response = await axiosInstance.post(UserApi.RefreshToken, {
         refreshToken: (getItem(StorageEnum.UserToken) || {}).refreshToken,
         customerId: (getItem(StorageEnum.UserInfo) || {}).userId,
      });
      if (response) {
         const userInfo = {
            userId: response?.metadata?.customer?.customer_id,
            email: response?.metadata?.customer?.customer_email,
            phone: response?.metadata?.customer?.customer_phone,
            fullName: response?.metadata?.customer?.customer_full_name,
            gender: response?.metadata?.customer?.customer_gender,
            birthday: response?.metadata?.customer?.customer_birthday,
            avatar: response?.metadata?.customer?.customer_avatar,
            address: response?.metadata?.customer?.customer_destination_address,
         };
         const userToken = {
            accessToken: response?.metadata?.tokens?.accessToken,
            refreshToken: response?.metadata?.tokens?.refreshToken,
         };
         return {userInfo, userToken};
      }
   } catch (error) {
      return error;
   }
}

axiosInstance.interceptors.response.use(
   (response) => {
      return response.data;
   },

   async (error) => {
      const {response} = error || {};
      const status = response?.status;
      if (status === 401) {
         console.log("Token expired. Attempting to refresh token...");
         store.dispatch(clearUserInfoAndUserToken());
         removeItem(StorageEnum.UserInfo);
         removeItem(StorageEnum.UserToken);
         window.location.href = "/login";
         return error?.response;
      }

      if (status === 500) {
         window.location.href = "/500";
         return error?.response;
      }

      if (status == 419) {
         try {
            const newToken = await refreshToken();
            setItem(StorageEnum.UserInfo, newToken.userInfo);
            setItem(StorageEnum.UserToken, newToken.userToken);
            store.dispatch(setUserInfoAndUserToken(newToken));
            axiosInstance.defaults.headers.common.Authorization = newToken.userToken.accessToken;
            axiosInstance.defaults.headers.common.Client_ID = newToken.userInfo.userId;
            if (error.config) {
               return await axiosInstance.request(error.config);
            }
         } catch (refreshError) {
            store.dispatch(clearUserInfoAndUserToken());
            removeItem(StorageEnum.UserInfo);
            removeItem(StorageEnum.UserToken);
            window.location.href = "/login";
            return error?.response?.data;
         }
      }
      return Promise.reject(error?.response?.data);
   }
);

class APIClient {
   get(config) {
      return this.request({...config, method: "GET"});
   }

   post(config) {
      return this.request({...config, method: "POST"});
   }

   put(config) {
      return this.request({...config, method: "PUT"});
   }

   delete(config) {
      return this.request({...config, method: "DELETE"});
   }

   request(config) {
      return new Promise((resolve, reject) => {
         axiosInstance
            .request(config)
            .then((res) => {
               resolve(res);
            })
            .catch((e) => {
               reject(e);
            });
      });
   }
}

export default new APIClient();
