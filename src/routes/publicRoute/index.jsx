import React, {lazy} from "react";
import LayoutDashboard from "../../layouts/layoutPageShared/layoutDashbroad";
import LayoutDashboardLogin from "../../layouts/layoutPageShared/layoutDashbroadLogin";
import AuthGuard from "../../components/common/auth-guard";
import ROUTER_PATH from "../../configs/router";

import {
   Home,
   LoginPage,
   ContactPage,
   AboutUsPage,
   NewsPage,
   BookingTicket,
   TeamInfo,
   ManageBookingPage,
   SchedulePage,
   GuideBookingTicket,
   PageError,
   Page404,
   Page500,
   NewsDetails,
   PaymentPage,
   SuccessPayment,
} from "./lazyComponents";

const ERROR_ROUTE = {
   path: "*",
   element: <PageError />,
};

const NOT_FOUND_ROUTE = {
   path: "*",
   element: <Page404 />,
};

const SERVER_500 = {
   path: "500",
   element: <Page500 />,
};

const publicRoutes = [
   {
      path: ROUTER_PATH.HOME_FIRST,
      element: (
         <AuthGuard>
            <LayoutDashboard />
         </AuthGuard>
      ),
      children: [
         {
            index: true,
            element: <Home />,
         },
         {
            path: ROUTER_PATH.HOME_INDEX,
            element: <Home />,
         },
         {
            path: ROUTER_PATH.HOME_SECOND,
            element: <Home />,
         },
         {
            path: ROUTER_PATH.CONTACT,
            element: <ContactPage />,
         },
         {
            path: ROUTER_PATH.ABOUT_US,
            element: <AboutUsPage />,
         },
         // {
         //    path: ROUTER_PATH.INVOICE,
         //    element: <Invoice />,
         // },
         {
            path: ROUTER_PATH.BOOKING_TICKET_MANAGER,
            element: <ManageBookingPage />,
         },
         {
            path: "/" + ROUTER_PATH.NEWS,
            element: <NewsPage />,
            children: [
               {
                  index: true,
                  element: <NewsPage />,
               },
               {
                  path: ROUTER_PATH.NEWS_FUTA_CITY_BUS,
                  element: <NewsPage />,
               },
               {
                  path: ROUTER_PATH.NEWS_FUTA_BUS_LINES,
                  element: <NewsPage />,
               },
               {
                  path: ROUTER_PATH.NEWS_SUMMARY,
                  element: <NewsPage />,
               },
               {
                  path: ROUTER_PATH.NEWS_PROMOTION,
                  element: <NewsPage />,
               },
               {
                  path: ROUTER_PATH.NEWS_AWARD,
                  element: <NewsPage />,
               },
               {
                  path: ROUTER_PATH.NEWS_STOP,
                  element: <NewsPage />,
               },
            ],
         },
         {
            path: ROUTER_PATH.PAYMENT,
            element: <PaymentPage />,
         },
         {
            path: "/xem-tin/:slug",
            element: <NewsDetails />,
         },
         {
            path: ROUTER_PATH.BOOKING_TICKET,
            element: <BookingTicket />,
         },
         {
            path: ROUTER_PATH.SUCCESS_PAYMENT,
            element: <SuccessPayment />,
         },
         // {
         //    path: ROUTER_PATH.PAYMENT,
         //    element: <Payment />,
         // },
         {
            path: ROUTER_PATH.SCHEDULE,
            element: <SchedulePage />,
         },
         {
            path: ROUTER_PATH.TEAM_INFO,
            element: <TeamInfo />,
         },
         {
            path: ROUTER_PATH.GUIDE,
            element: <GuideBookingTicket />,
         },
      ],
   },
   {
      path: ROUTER_PATH.LOGIN,
      element: (
         <AuthGuard>
            <LayoutDashboardLogin />
         </AuthGuard>
      ),
      children: [
         {
            index: true,
            element: <LoginPage />,
         },
      ],
   },
   {
      path: ROUTER_PATH.HOME_FIRST,
      children: [NOT_FOUND_ROUTE, ERROR_ROUTE, SERVER_500],
   },
];

export default publicRoutes;
