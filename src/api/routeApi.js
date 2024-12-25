import APIClient from "./apiClients";

const RoutesApi = {
   getRoutes: async () => {
      const url = `public/route/getall`;
      return await APIClient.get({url});
   },
   getRouteReviews: async (id) => {
      const url = `public/route/getroutereviews?routeId=${id}`;
      return await APIClient.get({url});
   },
   getRoutePickupPoints: async (id) => {
      const url = `public/route/getroutepickuppoints?routeId=${id}`;
      return await APIClient.get({url});
   },
};

export default RoutesApi;
