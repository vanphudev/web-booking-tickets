import APIClient from "./apiClients";

const TripApi = {
   getTripInfo: async (data) => {
      const url = `/public/trip/gettrips?fromId=${data.fromId}&toId=${data.toId}&fromTime=${data.fromTime}&toTime=${data.toTime}&isReturn=${data.isReturn}&ticketCount=${data.ticketCount}`;
      return await APIClient.get({url, data});
   },
};

export default TripApi;
