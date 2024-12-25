import React from "react";
import {Row, Col, Typography, Input, Card} from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/style.scss";

const Promotion = () => {
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
      <section className='layout bg-orange flex h-full flex-col pt-10  text-center 2lg:pt-[32rem]'>
         <div className='layout py-14'>
            <Row justify='start' className='mb-5' style={{padding: "0", margin: "0"}}>
               <Col span={24} style={{margin: "0"}}>
                  <span className='home-title'>KHUYẾN MÃI NỔI BẬT</span>
               </Col>
               <Col span={24} className=' mt-8 w-full' style={{padding: "0", margin: "0"}}>
                  <Slider {...settings}>
                     <div className='w-[100%] max-w-[369px] cursor-pointer  p-2 sm:ml-0'>
                        <div
                           style={{
                              width: "100%",
                              height: "100%",
                              overflow: "hidden",
                              borderRadius: "20px",
                              boxShadow:
                                 "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                           }}>
                           <img
                              src='https://cdn.futabus.vn/futa-busline-cms-dev/343x184_4x_29d182ce55/343x184_4x_29d182ce55.png'
                              alt='Khuyến mãi 1'
                              style={{width: "100%", height: "auto"}}
                           />
                        </div>
                     </div>
                     <div className='w-[100%] max-w-[369px] cursor-pointer   p-2 sm:ml-0'>
                        <div
                           style={{
                              width: "100%",
                              height: "100%",
                              overflow: "hidden",
                              borderRadius: "20px",
                              boxShadow:
                                 "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                           }}>
                           <img
                              src='https://cdn.futabus.vn/futa-busline-web-cms-prod/Zalo_11b66ecb81/Zalo_11b66ecb81.png'
                              alt='Khuyến mãi 1'
                              style={{width: "100%", height: "auto"}}
                           />
                        </div>
                     </div>
                     <div className='w-[100%] max-w-[369px] cursor-pointer  p-2 sm:ml-0'>
                        <div
                           style={{
                              width: "100%",
                              height: "100%",
                              overflow: "hidden",
                              borderRadius: "20px",
                              boxShadow:
                                 "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                           }}>
                           <img
                              src='https://cdn.futabus.vn/futa-busline-cms-dev/Banner_FUTA_Pay_2_57b0471834/Banner_FUTA_Pay_2_57b0471834.png'
                              alt='Khuyến mãi 1'
                              style={{width: "100%", height: "auto"}}
                           />
                        </div>
                     </div>
                  </Slider>
               </Col>
            </Row>
         </div>
      </section>
   );
};

export default Promotion;
