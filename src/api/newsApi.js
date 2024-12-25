import APIClient from "./apiClients";

const NewsApi = {
   getAll: (data) => {
      const url = `public/article/getall`;
      return APIClient.get({url});
   },
   getWithId: (id) => {
      const url = `public/article/getbyid/${id}`;
      return APIClient.get({url});
   },
};

export default NewsApi;
