import {lazy} from "react";

export const Home = lazy(() => import("../../pages/home"));
export const LoginPage = lazy(() => import("../../pages/login"));
export const ContactPage = lazy(() => import("../../pages/lien-he"));
export const AboutUsPage = lazy(() => import("../../pages/ve-chung-toi"));
export const NewsPage = lazy(() => import("../../pages/tin-tuc"));
export const BookingTicket = lazy(() => import("../../pages/dat-ve"));
export const TeamInfo = lazy(() => import("../../pages/teamInfo"));
export const ManageBookingPage = lazy(() => import("../../pages/tra-cuu-ve"));
export const SchedulePage = lazy(() => import("../../pages/schedule"));
export const GuideBookingTicket = lazy(() => import("../../pages/huong-dan-dat-ve"));
export const PageError = lazy(() => import("../../pages/error/PageError"));
export const Page404 = lazy(() => import("../../pages/error/Page404"));
export const Page500 = lazy(() => import("../../pages/error/Page500"));
export const NewsDetails = lazy(() => import("../../features/newsDetails/newsDetails"));
export const PaymentPage = lazy(() => import("../../pages/thanh-toan"));
export const SuccessPayment = lazy(() => import("../../pages/success-payment"));
