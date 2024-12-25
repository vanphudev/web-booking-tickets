import APIClient from "./apiClients";

const AddressApi = {
   getAddresses: async (data) => {
      const url = `public/provinces/getall`;
      return await APIClient.get({url});
   },
   getProvinces: async (data) => {
      const url = `public/provinces/getall`;
      return await APIClient.get({url});
   },
   getDistrictsByProvinceId: async (data) => {
      const url = `public/districts/getbyprovinceid/${data.province_id}`;
      return await APIClient.get({url});
   },
   getWardsByDistrictId: async (data) => {
      const url = `public/wards/getbydistrictid/${data.district_id}`;
      return await APIClient.get({url});
   },
};

export default AddressApi;
