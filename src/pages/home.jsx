import React from "react";
import {Helmet} from "react-helmet";
import ContainerSearch from "../features/home/homeSearchRoutes/components/containerSearch";
import Promotion from "../features/home/featuredPromotion/promotion";
import CommonRoutes from "../features/home/commonRoutes/commonRoutes";
import StatisticsSection from "../features/home/statisticsSection/statisticsSection";
import ConnectFuta from "../features/home/connectingFutaGroup/connectFuta";

const Home = () => {
   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Trang chủ - Futabus</title>
         </Helmet>
         <ContainerSearch />
         <Promotion />
         <CommonRoutes />
         <StatisticsSection />
         <ConnectFuta />
      </>
   );
};

export default Home;
