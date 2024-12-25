import React from "react";
import {Icon} from "@iconify-icon/react";
import {Layout, Row, Col, Typography, Space} from "antd";
import {RightCircleOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
const {Footer} = Layout;
const {Text, Title} = Typography;

const FooterComponent = () => {
   return (
      <footer
         className='mx-auto  flex  max-h-screen w-full flex-col justify-end text-[15px] pt-5'
         style={{backgroundColor: "#FFF7F5"}}>
         <div className='layout mx-auto w-full'>
            <Footer style={{backgroundColor: "#FFF7F5", padding: "0px"}}>
               <Row gutter={[32, 32]} style={{padding: "0", margin: "0", alignItems: "start"}}>
                  <Col xs={24} md={8}>
                     <Title level={5} style={{color: "#e83e1d", fontSize: "20px", fontWeight: "bold"}}>
                        TRUNG TÂM TỔNG ĐÀI & CSKH
                     </Title>
                     <Title level={3} style={{color: "#e83e1d", margin: 0}}>
                        1900 6067
                     </Title>
                     <Text
                        style={{display: "block", marginTop: 20, color: "#00613D", fontWeight: "bold"}}
                        className='text-green font-medium uppercase'>
                        CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG - FUTA BUS LINES
                     </Text>
                     <Text style={{display: "block"}}>
                        <span style={{fontWeight: "bold"}}>Địa chỉ:</span> Số 01 Tô Hiến Thành, Phường 3, Thành phố Đà
                        Lạt, Tỉnh Lâm Đồng, Việt Nam.
                     </Text>
                     <Text style={{display: "block"}}>
                        <span style={{fontWeight: "bold"}}>Email:</span> hotro@futa.vn
                     </Text>
                     <Text style={{display: "block"}}>
                        <span style={{fontWeight: "bold"}}>Điện thoại:</span> 02838386852
                     </Text>

                     <Space style={{marginTop: 20}}>
                        <img
                           src='https://cdn.futabus.vn/futa-busline-cms-dev/CH_Play_712783c88a/CH_Play_712783c88a.svg'
                           alt='Google Play'
                           style={{width: 120}}
                        />
                        <img
                           src='https://cdn.futabus.vn/futa-busline-cms-dev/App_Store_60da92cb12/App_Store_60da92cb12.svg'
                           alt='App Store'
                           style={{width: 120}}
                        />
                     </Space>
                  </Col>
                  <Col xs={24} md={8}>
                     <Title level={5} style={{color: "#00613D", fontWeight: "bold", fontSize: "18px"}}>
                        FUTA Bus Lines
                     </Title>
                     <Space direction='vertical' size='small'>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Về chúng tôi</Text>
                        </Space>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Lịch trình</Text>
                        </Space>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Tuyển dụng</Text>
                        </Space>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Tin tức & Sự kiện</Text>
                        </Space>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Mạng lưới văn phòng</Text>
                        </Space>
                     </Space>
                  </Col>
                  <Col xs={24} md={8}>
                     <Title level={5} style={{color: "#00613D", fontWeight: "bold", fontSize: "18px"}}>
                        Hỗ trợ
                     </Title>
                     <Space direction='vertical' size='small'>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Tra cứu thông tin đặt vé</Text>
                        </Space>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Điều khoản sử dụng</Text>
                        </Space>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Câu hỏi thường gặp</Text>
                        </Space>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Hướng dẫn đặt vé trên Web</Text>
                        </Space>
                        <Space align='start'>
                           <RightCircleOutlined />
                           <Text style={{display: "inline-block"}}>Hướng dẫn nạp tiền trên App</Text>
                        </Space>
                        <Title
                           level={5}
                           style={{marginTop: 10, color: "#00613D", fontWeight: "bold", fontSize: "18px"}}>
                           Connect with us
                        </Title>
                        <Space>
                           <Icon icon='logos:facebook' width='32' height='32' />
                           <Icon icon='logos:youtube-icon' width='32' height='32' />
                           <Icon icon='devicon:google' width='32' height='32' />
                        </Space>
                     </Space>
                  </Col>
               </Row>
               <Row
                  gutter={[32, 32]}
                  style={{padding: "0", margin: "0"}}
                  className='flex flex-nowrap items-center justify-around gap-2'>
                  <Col>
                     <img
                        src='https://cdn.futabus.vn/futa-busline-cms-dev/Bus_Lines_817c989817/Bus_Lines_817c989817.svg'
                        alt=''
                        style={{width: "240px"}}
                     />
                  </Col>
                  <Col>
                     <img
                        src='https://cdn.futabus.vn/futa-busline-cms-dev/logo_futa_express_0ad93b22d3/logo_futa_express_0ad93b22d3.svg'
                        alt=''
                        style={{width: "240px"}}
                     />
                  </Col>
                  <Col>
                     <img
                        src='https://cdn.futabus.vn/futa-busline-cms-dev/FUTA_Advertising_d0b60b3a45/FUTA_Advertising_d0b60b3a45.svg'
                        alt=''
                        style={{width: "240px"}}
                     />
                  </Col>
               </Row>
            </Footer>
         </div>
         <Row style={{marginTop: 20, textAlign: "center"}} className='bg-bg-green text-bg-white '>
            <Col span={24}>
               <Text className='text-bg-white' style={{color: "white", fontSize: "14px"}}>
                  &copy; 2023 | Bản quyền thuộc về Công ty Cổ Phần Xe khách Phương Trang - FUTA Bus Lines 2023 | Chịu
                  trách nhiệm quản lý nội dung: Ông Nguyễn Văn Phú
                  {" | "}
                  <Link to='/teamInfo' style={{color: "#FFBD4A"}}>
                     Thông tin nhóm phát triển
                  </Link>
               </Text>
            </Col>
         </Row>
      </footer>
   );
};

export default FooterComponent;
