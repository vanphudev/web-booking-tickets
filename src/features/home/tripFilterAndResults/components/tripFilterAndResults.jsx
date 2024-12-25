import React from "react";
import {Layout, Row, Col, Typography, Checkbox, Button, Space, Empty} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

const {Title, Text} = Typography;

const TripFilterAndResults = () => {
   return (
      <Layout style={{padding: "20px", backgroundColor: "#f0f2f5"}}>
         <Row gutter={16}>
            <Col xs={24} md={8}>
               <div style={{backgroundColor: "#fff", padding: "20px", borderRadius: "8px"}}>
                  <Title level={5}>BỘ LỌC TÌM KIẾM</Title>
                  <Button
                     type='text'
                     style={{color: "red", float: "right", marginBottom: "10px"}}
                     icon={<DeleteOutlined />}>
                     Bỏ lọc
                  </Button>
                  {/* Filter Options */}
                  <div>
                     <Text strong>Giờ đi</Text>
                     <Checkbox.Group style={{display: "block", marginTop: "10px"}}>
                        <Checkbox value='earlyMorning'>Sáng sớm 00:00 - 06:00 (0)</Checkbox>
                        <Checkbox value='morning'>Buổi sáng 06:00 - 12:00 (0)</Checkbox>
                        <Checkbox value='afternoon'>Buổi chiều 12:00 - 18:00 (0)</Checkbox>
                        <Checkbox value='evening'>Buổi tối 18:00 - 24:00 (0)</Checkbox>
                     </Checkbox.Group>
                     <Space direction='vertical' style={{width: "100%", marginTop: "20px"}}>
                        <Text strong>Loại xe</Text>
                        <Button type='default'>Ghế</Button>
                        <Button type='default'>Giường</Button>
                        <Button type='default'>Limousine</Button>
                        <Text strong style={{marginTop: "20px"}}>
                           Hàng ghế
                        </Text>
                        <Button type='default'>Hàng đầu</Button>
                        <Button type='default'>Hàng giữa</Button>
                        <Button type='default'>Hàng cuối</Button>
                        <Text strong style={{marginTop: "20px"}}>
                           Tầng
                        </Text>
                        <Button type='default'>Tầng trên</Button>
                        <Button type='default'>Tầng dưới</Button>
                     </Space>
                  </div>
               </div>
            </Col>

            {/* Results Section */}
            <Col xs={24} md={16}>
               <div style={{padding: "20px"}}>
                  <Title level={4}>Bắc Kạn - TP. Hồ Chí Minh (0)</Title>
                  <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                     <Empty imageStyle={{height: 60}} description={<span>Không có kết quả được tìm thấy.</span>} />
                  </div>
               </div>
            </Col>
         </Row>
      </Layout>
   );
};

export default TripFilterAndResults;
