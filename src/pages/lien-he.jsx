import React, {useEffect} from "react";
import {Helmet} from "react-helmet";
import ContactForm from "../features/contact/contact";
import {useContent} from "../hooks/common/contentContext";

const ContactPage = () => {
   const {isHeaderCustom, setIsHeaderCustom} = useContent();
   useEffect(() => {
      setIsHeaderCustom(true);
      return () => {
         setIsHeaderCustom(false);
      };
   }, []);
   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Liên hệ - Futabus</title>
         </Helmet>
         <ContactForm />
      </>
   );
};

export default ContactPage;
