import APIClient from "./apiClients";

const UserApi = {
   updateProfile: async (data) => {
      const url = `private/customer/profile/updateprofile`;
      return await APIClient.put({url, data});
   },
   resetPassword: async (data) => {
      const url = `private/customer/profile/resetpassword`;
      return await APIClient.put({url, data});
   },
   updateAddress: async (data) => {
      const url = `private/customer/profile/updateaddress`;
      return await APIClient.put({url, data});
   },
};

export default UserApi;
