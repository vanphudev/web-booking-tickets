import React, {useEffect, useState, Suspense} from "react";
import {Outlet} from "react-router-dom";
import FooterComponent from "../layoutComponent/footer/footerHome/footer";
import HeaderComponent from "../layoutComponent/header/headerLogin/headerComponentLogin";
import {Spin} from "antd";

const LayoutDashboardLogin = () => {
   return (
      <>
         <HeaderComponent />
         <main className='h-full w-full'>
            <Suspense
               fallback={
                  <div className='flex h-screen items-center justify-center'>
                     <Spin size='large' fullscreen />
                  </div>
               }>
               <Outlet />
            </Suspense>
         </main>
         <FooterComponent />
      </>
   );
};

export default LayoutDashboardLogin;
