import React, {useEffect} from "react";
import {useContent} from "../hooks/common/contentContext";
import ManageBookingForm from "../features/ManageBookingForm/manageBookingForm";
import {Helmet} from "react-helmet";
const ManageBookingPage = () => {
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
            <title>Tra cứu vé - Futabus</title>
         </Helmet>
         <ManageBookingForm />
      </>
   );
};

export default ManageBookingPage;
