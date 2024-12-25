import APIClient from "./apiClients";

const ContactApi = {
   createContact: (data) => {
      const url = `public/contact/create`;
      return APIClient.post({url, data});
   },
};

export default ContactApi;
