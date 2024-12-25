import APIClient from "./apiClients";

const SearchTicketsApi = {
   searchTickets: (data) => {
      const url = `public/booking/searchtickets?ticketCode=${data?.ticketCode}&customerPhone=${data?.phone}`;
      return APIClient.get({url});
   },
   searchTicketByCustomerPhone: (data) => {
      const url = `private/customer/tickets/get-customer-tickets?customerPhone=${data?.phone}`;
      return APIClient.get({url});
   },
   getCustomerTicketsRefund: (data) => {
      const url = `private/customer/tickets/get-customer-tickets-refund?customerPhone=${data?.phone}`;
      return APIClient.get({url});
   },
};

export default SearchTicketsApi;
