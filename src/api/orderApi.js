import APIClient from "./apiClients";

const OrderApi = {
   create: (data) => {
      const url = `public/booking/create`;
      return APIClient.post({url, data});
   },
   getBookingDetailsByCode: (bookingCode) => {
      const url = `public/booking/getbookingdetails?bookingCode=${bookingCode}`;
      return APIClient.get({url});
   },
   getPaymentVNPayUrl: (bookingId) => {
      const url = `public/booking/getpaymentvnpayurl?bookingId=${bookingId}`;
      return APIClient.get({url});
   },
   cancelBooking: (data) => {
      const url = `public/booking/cancel`;
      return APIClient.put({url, data});
   },
   updateAfterPayment: (data) => {
      const url = `public/booking/updateafterpayment`;
      return APIClient.put({url, data});
   },
   getInfoBooking: (bookingCode) => {
      const url = `public/booking/getinfobooking?bookingCode=${bookingCode}`;
      return APIClient.get({url});
   },
};

export default OrderApi;
