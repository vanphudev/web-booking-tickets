import APIClient from "./apiClients";

const ReviewApi = {
   getReviewsByRoute: async (routeId) => {
      const url = `public/review/getbyrouteid/${routeId}`;
      try {
         const response = await APIClient.get({url});
         if (response && (response.status === 200 || response.status === 201)) {
            return response?.metadata;
         }
         return null;
      } catch (error) {
         console.error(error);
         return null;
      }
   },
   createReview: async (data) => {
      const url = `public/review/create`;
      return await APIClient.post({url, data});
   },
};

export default ReviewApi;
