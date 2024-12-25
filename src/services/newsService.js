import NewsApi from "../api";

const NewsService = {
   getData: async (credentials) => {
      try {
         const response = await NewsApi.login(credentials);
         return response.data;
      } catch (error) {
         console.error("Failed to get data", error);
         throw error;
      }
   },

   getDataWithID: async (id) => {
      try {
         const response = await NewsApi.getWithId(id);
         return response.data;
      } catch (error) {
         console.error(`Failed to get data with ID ${id}`, error);
         throw error;
      }
   },
};

export default NewsService;
