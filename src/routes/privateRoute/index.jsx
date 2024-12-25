import React from "react";
import LayoutDashboard from "../../layouts/layoutPageShared/layoutDashbroad";
import AuthGuard from "../../components/common/auth-guard";
import Profile from "../../pages/profile";

const ROUTER_PATH = {
   PROFILE: "/profile",
   USER_PROFILE: "profile",
   USER_INFO: "user-info",
   ORDER_HISTORY: "order-history",
   ADDRESS: "address",
   RESET_PASSWORD: "reset-password"
};

const privateRoutes = [
   {
      path: ROUTER_PATH.PROFILE,
      element: (
         <AuthGuard>
            <LayoutDashboard />
         </AuthGuard>
      ),
      children: [
         {
            path: "",  // Route mặc định cho /profile
            element: <Profile />,
         }
      ],
   },
];

export default privateRoutes;
export { ROUTER_PATH };
