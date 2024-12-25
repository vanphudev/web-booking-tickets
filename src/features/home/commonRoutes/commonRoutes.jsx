import React from "react";
import {Row, Col, Typography, Input, Card} from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardCommonRoute from "./cardCommonRoute";
import "./styles/styles.scss";

const CommonRoutes = () => {
   const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplaySpeed: 2000,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
   };

   return (
      <section className='flex h-full w-full flex-col text-center ' style={{backgroundColor: "#FFF7F5"}}>
         <div className='layout py-5' style={{backgroundColor: "#FFF7F5"}}>
            <Row justify='start' className='mb-5'>
               <Col span={24}>
                  <span className='home-title'>TUYẾN PHỔ BIẾN</span>
                  <p className='home-title-content'>Được khách hàng tin tưởng và lựa chọn</p>
               </Col>
               <Col span={24} className=' mt-1 w-full'>
                  <CardCommonRoute />
               </Col>
            </Row>
         </div>
      </section>
   );
};

export default CommonRoutes;
