import React from "react";
import {Col, Row} from "antd";

const ConnectFuta = () => {
   return (
      <section className='flex h-full w-full flex-col text-center' style={{backgroundColor: "#FFF7F5"}}>
         <div className='layout'>
            <Row style={{padding: "20px 0"}} justify='center' className='gap-6'>
               <Col span={16}>
                  <span className='home-title'>KẾT NỐI FUTA GROUP</span>
                  <p className='home-title-content'>
                     Kết nối đa dạng hệ sinh thái FUTA Group qua App FUTA: mua vé Xe Phương Trang, Xe Buýt, Xe Hợp Đồng,
                     Giao Hàng,...
                  </p>
               </Col>
               <Col style={{textAlign: "left", display: "flex", alignItems: "center", justifyContent: "end"}}>
                  <img
                     src='https://cdn.futabus.vn/futa-busline-cms-dev/1_ketnoi_3c401512ac/1_ketnoi_3c401512ac.svg'
                     alt=''
                  />
               </Col>
            </Row>
         </div>
      </section>
   );
};

export default ConnectFuta;
