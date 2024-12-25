import React from "react";
import {Card, Col, Row} from "antd";

const data = [
   {
      title: "Tuyến xe từ",
      city: "Tp Hồ Chí Minh",
      imageUrl: "https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_2_8bf6ed1d78/Rectangle_23_2_8bf6ed1d78.png",
      routes: [
         {destination: "Đà Lạt", distance: "305km", time: "8 giờ", date: "13/11/2024", price: "290.000đ"},
         {destination: "Cần Thơ", distance: "166km", time: "3 giờ 12 phút", date: "13/11/2024", price: "165.000đ"},
         {destination: "Long Xuyên", distance: "203km", time: "5 giờ", date: "13/11/2024", price: "190.000đ"},
      ],
   },
   {
      title: "Tuyến xe từ",
      city: "Đà Lạt",
      imageUrl: "https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_3_2d8ce855bc/Rectangle_23_3_2d8ce855bc.png",
      routes: [
         {destination: "TP. Hồ Chí Minh", distance: "310km", time: "8 giờ", date: "13/11/2024", price: "290.000đ"},
         {destination: "Đà Nẵng", distance: "757km", time: "17 giờ", date: "13/11/2024", price: "410.000đ"},
         {destination: "Cần Thơ", distance: "457km", time: "11 giờ", date: "13/11/2024", price: "435.000đ"},
      ],
   },
   {
      title: "Tuyến xe từ",
      city: "Đà Nẵng",
      imageUrl: "https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_4_061f4249f6/Rectangle_23_4_061f4249f6.png",
      routes: [
         {destination: "Đà Lạt", distance: "666km", time: "17 giờ", date: "13/11/2024", price: "410.000đ"},
         {destination: "BX An Sương", distance: "966km", time: "20 giờ", date: "13/11/2024", price: "460.000đ"},
         {destination: "Nha Trang", distance: "528km", time: "9 giờ 25 phút", date: "13/11/2024", price: "300.000đ"},
      ],
   },
];

const CardCommonRoute = () => {
   return (
      <Row gutter={16}>
         {data.map((card, index) => (
            <Col span={8} key={index}>
               <Card
                  cover={
                     <img
                        alt={card.city}
                        src={card.imageUrl}
                        style={{height: "150px", objectFit: "cover", borderRadius: "15px"}}
                     />
                  }
                  styles={{
                     body: {
                        padding: "0px",
                     },
                  }}
                  style={{
                     position: "relative",
                     overflow: "hidden",
                     borderRadius: "15px",
                     boxShadow:
                        "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                  }}>
                  <div className='absolute left-[12px] top-[80px] flex flex-col items-start justify-start gap-1'>
                     <span className='text-bg-white'>{card.title}</span>
                     <span
                        className='text-bg-white'
                        style={{fontWeight: "800", fontSize: "20px"}}>{`${card.city}`}</span>
                  </div>
                  {card.routes.map((route, idx) => (
                     <div
                        className='flex w-[100%]'
                        key={idx}
                        style={{
                           display: "flex",
                           padding: "12px",
                           borderBottom: idx < card.routes.length - 1 ? "1px solid #f0f0f0" : "none",
                        }}>
                        <div className='flex w-[100%] cursor-pointer flex-col justify-start gap-2'>
                           <div className='flex w-[100%] items-center justify-between'>
                              <span className='text-bg-green ' style={{fontWeight: "bold", margin: "0px"}}>
                                 {route.destination}
                              </span>
                              <span className='text-bg-green' style={{fontWeight: "bold", margin: "0px"}}>
                                 {route.price}
                              </span>
                           </div>
                           <div style={{fontWeight: "400", color: "#1d1d1f", textAlign: "left"}}>
                              {route.distance} - {route.time} - {route.date}
                           </div>
                        </div>
                     </div>
                  ))}
               </Card>
            </Col>
         ))}
      </Row>
   );
};

export default CardCommonRoute;
