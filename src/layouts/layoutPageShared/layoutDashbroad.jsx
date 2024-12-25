import React, {Suspense, lazy} from "react";
import {Outlet} from "react-router-dom";
import {Spin} from "antd";
import {Helmet} from "react-helmet";

// Lazy load components
const HeaderComponent = lazy(() => import("../layoutComponent/header/headerHome/headerComponent"));
const FooterComponent = lazy(() => import("../layoutComponent/footer/footerHome/footer"));

// Loading component tái sử dụng
const LoadingComponent = () => (
   <div className='z-[9999] flex h-screen items-center justify-center'>
      <Spin size='large' />
   </div>
);

const LayoutDashboard = () => {
   return (
      <>
         <Helmet>
            <script type='text/javascript'>
               {`
                  var Tawk_API = Tawk_API || {};
                  Tawk_LoadStart = new Date();
                  (function() {
                     var s1 = document.createElement("script"),
                        s0 = document.getElementsByTagName("script")[0];
                     s1.async = true;
                     s1.src = "https://embed.tawk.to/674c3f122480f5b4f5a66003/1ie0tcoce";
                     s1.charset = "UTF-8";
                     s1.setAttribute("crossorigin", "*");
                     s0.parentNode.insertBefore(s1, s0);
                  })();
               `}
            </script>
         </Helmet>
         <Suspense fallback={<LoadingComponent />}>
            <HeaderComponent />
         </Suspense>

         <main className='h-full w-full'>
            <Suspense fallback={<LoadingComponent />}>
               <Outlet />
            </Suspense>
         </main>

         <Suspense fallback={<LoadingComponent />}>
            <FooterComponent />
         </Suspense>
      </>
   );
};

export default LayoutDashboard;
