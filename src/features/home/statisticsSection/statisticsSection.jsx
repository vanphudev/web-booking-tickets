import {Row, Col, Typography} from "antd";
import {UserOutlined, EnvironmentOutlined, CarOutlined} from "@ant-design/icons";
const {Title, Text} = Typography;

const data = [
   {
      icon: (
         <img
            src='https://cdn.futabus.vn/futa-busline-cms-dev/Group_662c4422ba/Group_662c4422ba.svg'
            alt=''
            style={{width: "120px"}}
         />
      ),
      title: "Hơn 20 Triệu",
      subtitle: "Lượt khách",
      description: "Phương Trang phục vụ hơn 20 triệu lượt khách bình quân 1 năm trên toàn quốc",
   },
   {
      icon: (
         <img
            src='https://cdn.futabus.vn/futa-busline-cms-dev/Store_55c0da8bd7/Store_55c0da8bd7.svg'
            alt=''
            style={{width: "120px"}}
         />
      ),
      title: "Hơn 350",
      subtitle: "Phòng vé - Bưu cục",
      description: "Phương Trang có hơn 350 phòng vé, trạm trung chuyển, bến xe,... trên toàn hệ thống",
   },
   {
      icon: (
         <img
            src='https://cdn.futabus.vn/futa-busline-cms-dev/Group_2_75b5ed1dfd/Group_2_75b5ed1dfd.svg'
            alt=''
            style={{width: "120px"}}
         />
      ),
      title: "Hơn 1,000",
      subtitle: "Chuyến xe",
      description: "Phương Trang phục vụ hơn 1,000 chuyến xe đường dài và liên tỉnh mỗi ngày",
   },
];
const StatisticsSection = () => {
   return (
      <section className='flex h-full w-full flex-col text-center'>
         <div className='layout'>
            <Row style={{padding: "20px 0"}}>
               <Col span={24}>
                  <span className='home-title'>FUTA BUS LINES - CHẤT LƯỢNG LÀ DANH DỰ</span>
                  <p className='home-title-content'>Được khách hàng tin tưởng và lựa chọn</p>
               </Col>
            </Row>
            <Row gutter={24} className='flex-nowrap'>
               <Col
                  span={12}
                  className='flex flex-col justify-center gap-8'
                  style={{textAlign: "left", display: "flex", alignItems: "flex-start"}}>
                  {data.map((item, index) => (
                     <div span={8} key={index} style={{textAlign: "left", display: "flex", alignItems: "center"}}>
                        <div style={{marginRight: "25px"}}>{item.icon}</div>
                        <div>
                           <Title level={4} style={{marginBottom: 0}}>
                              <Text style={{fontSize: "30px", color: "#1d1d1f", margin: 0}}> {item.title}</Text>
                              <Text style={{fontSize: "18px", color: "#1d1d1f"}}>{item.subtitle}</Text>
                           </Title>
                           <Text style={{color: "#637280", margin: 0, fontSize: "16px", fontWeight: "600"}}>
                              {item.description}
                           </Text>
                        </div>
                     </div>
                  ))}
               </Col>
               <Col span={12} style={{textAlign: "left", display: "flex", alignItems: "center", justifyContent: "end"}}>
                  <img src='https://cdn.futabus.vn/futa-busline-cms-dev/image_f922bef1bb/image_f922bef1bb.svg' alt='' />
               </Col>
            </Row>
         </div>
      </section>
   );
};

export default StatisticsSection;
