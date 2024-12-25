import APIClient from "./apiClients";

const VoucherApi = {
   getByCode: (data) => {
      const url = `public/voucher/getByCode?code=${data?.code}&amount=${data?.amount}&bookingCode=${data?.bookingCode}`;
      return APIClient.get({ url });
   },
   getByCustomer: (data) => {
      const url = `public/voucher/getByCustomer?customer_id=${data?.customerId}&phone=${data?.phone}`;
      return APIClient.get({ url });
   },
};

export default VoucherApi;
