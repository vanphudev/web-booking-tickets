import React from "react";
import {Outlet} from "react-router-dom";
import Footer from "../layoutComponent/footer/footerHome/footer";

const LayoutInvoice = () => {
   return (
      <div>
         <main className='h-full w-full'>
            <Outlet />
         </main>
         <Footer />
      </div>
   );
};

export default LayoutInvoice;
