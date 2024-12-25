import React from "react";
import PaymentPage from "../features/order/order";
import {Helmet} from "react-helmet";

const Payment = () => {
   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Thanh toán - Futabus</title>
         </Helmet>
         <PaymentPage />
      </>
   );
};

export default Payment;
