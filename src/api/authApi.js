import APIClient from "./apiClients";
import {setItem} from "../utility/functionCommon/storage";
import {StorageEnum} from "../entity/enum";
import {useDispatch} from "react-redux";
import {store} from "../redux/store";
import {setUserInfoAndUserToken, clearUserInfoAndUserToken, setUserInfo} from "../redux/slices/authSlice";

const AuthApi = {
   login: async (data) => {
      const url = `public/customer/auth/signin`;
      return await APIClient.post({url, data})
         .then((response) => {
            if (response.status === 200 || response.status === 201) {
               const userInfo = {
                  userId: response.metadata?.customer?.customer_id,
                  email: response.metadata?.customer?.customer_email,
                  phone: response.metadata?.customer?.customer_phone,
                  fullName: response.metadata?.customer?.customer_full_name,
                  gender: response.metadata?.customer?.customer_gender,
                  birthday: response.metadata?.customer?.customer_birthday,
                  avatar: response.metadata?.customer?.customer_avatar,
                  address: response.metadata?.customer?.customer_destination_address,
               };
               const userToken = {
                  accessToken: response.metadata?.tokens?.accessToken,
                  refreshToken: response.metadata?.tokens?.refreshToken,
               };
               const newToken = {userInfo, userToken};
               setItem(StorageEnum.UserInfo, userInfo);
               setItem(StorageEnum.UserToken, userToken);
               store.dispatch(setUserInfoAndUserToken(newToken));
               return response;
            }
            console.log("response", response);
            return response;
         })
         .catch((error) => {
            console.log("error", error);
            return error;
         });
   },
   logout: async () => {
      const url = `private/customer/auth/logOut`;
      return await APIClient.post({url});
   },
   register: async (data) => {
      const url = `public/customer/auth/signup`;
      return await APIClient.post({url, data});
   },
   fetchMe: async (data) => {
      const url = `private/customer/auth/getById`;
      return await APIClient.post({url, data}).then((response) => {
         if (response.status === 200 || response.status === 201) {
            const userInfo = {
               userId: response.metadata?.customer?.customer_id,
               email: response.metadata?.customer?.customer_email,
               phone: response.metadata?.customer?.customer_phone,
               fullName: response.metadata?.customer?.customer_full_name,
               gender: response.metadata?.customer?.customer_gender,
               birthday: response.metadata?.customer?.customer_birthday,
               avatar: response.metadata?.customer?.customer_avatar,
               address: response.metadata?.customer?.customer_destination_address,
            };
            store.dispatch(setUserInfo(userInfo));
         } else {
            removeItem(StorageEnum.UserToken);
            removeItem(StorageEnum.UserInfo);
            store.dispatch(clearUserInfoAndUserToken());
            replace("/");
         }
      });
   },
   // forgotPassword: async (data) => {
   //    const url = `${BASE_URL}/auth/forgot-password`;
   //    return await axios.post(url, data);
   // },
   //    const url = `${BASE_URL}/auth/reset-password`;
   //    return await axios.post(url, data);
   // },
   // changePassword: async (data) => {
   //    const url = `${BASE_URL}/auth/change-password`;
   //    return await axios.post(url, data);
   // },
   getMe: async (data) => {
      const url = `private/customer/auth/getById`;
      return await APIClient.post({url, data});
   },
   // updateProfile: async (data) => {
   //    const url = `${BASE_URL}/auth/update-profile`;
   //    return await axios.put(url, data);
   // },
   // updateAvatar: async (data) => {
   //    const url = `${BASE_URL}/auth/update-avatar`;
   //    return await axios.put(url, data);
   // },
   // updateCover: async (data) => {
   //    const url = `${BASE_URL}/auth/update-cover`;
   //    return await axios.put(url, data);
   // },
   // logout: async () => {
   //    const url = `${BASE_URL}/auth/logout`;
   //    return await axios.post(url);
   // },
   // verifyEmail: async (data) => {
   //    const url = `${BASE_URL}/auth/verify-email`;
   //    return await axios.post(url, data);
   // },
};

export default AuthApi;
