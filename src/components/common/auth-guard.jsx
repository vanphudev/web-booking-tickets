import React, {useEffect, useCallback, lazy} from "react";
import {useRouter} from "../../hooks/router/useRouter";
import {useDispatch} from "react-redux";
import {ErrorBoundary} from "react-error-boundary";
import apiAuth from "../../api/authApi";
import apiAddress from "../../api/addressApi";
import {clearUserInfoAndUserToken, setUserInfo} from "../../redux/slices/authSlice";
import {getItem, removeItem} from "../../utility/functionCommon/storage";
import {setProvinces} from "../../redux/slices/addressSlice";
import {StorageEnum} from "../../entity/enum";
import PageError from "../../pages/error/PageError";

export default function AuthGuard({children}) {
   const {replace} = useRouter();
   const accessToken = getItem(StorageEnum.UserToken)?.accessToken || "";
   const userId = getItem(StorageEnum.UserInfo)?.userId || "";
   const dispatch = useDispatch();

   const check = useCallback(async () => {
      if (!accessToken || !userId) {
         return;
      }
      if (accessToken && userId) {
         await apiAuth.getMe({customerId: userId}).then((response) => {
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
               dispatch(setUserInfo(userInfo));
            } else {
               removeItem(StorageEnum.UserToken);
               removeItem(StorageEnum.UserInfo);
               dispatch(clearUserInfoAndUserToken());
               replace("/");
            }
         });
      }
   }, [accessToken, dispatch, replace, userId]);

   const getProvinces = useCallback(async () => {
      await apiAddress.getAddresses().then((response) => {
         if (response.status === 200) {
            dispatch(setProvinces(response?.metadata?.provinces));
         }
      });
   }, []);

   useEffect(() => {
      check();
      getProvinces();
   }, [check, getProvinces]);

   return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>;
}
