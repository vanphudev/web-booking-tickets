import APIClient from "./apiClients";

const RefundApi = {
   refund: (data) => {
      const url = `private/customer/refund/refund`;
      return APIClient.post({url, data});
   },
};

export default RefundApi;