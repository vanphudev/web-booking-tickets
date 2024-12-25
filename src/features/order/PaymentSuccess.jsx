import React, {useRef} from "react";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import {message} from "antd";
import {Card, Typography, Button, Row, Col, Divider} from "antd";
import {CheckCircleFilled, DownloadOutlined, ShareAltOutlined} from "@ant-design/icons";
import TicketComponent from "../../components/TicketComponent/ticketComponent";

import moment from "moment";

const formatTime = (isoDateTime) => {
   if (!isoDateTime) return "";
   return moment(isoDateTime).format("hh:mm A");
};

const formatDate = (isoDateTime) => {
   if (!isoDateTime) return "";
   return moment(isoDateTime)
      .utcOffset("+0700")
      .format("dddd, DD/MM/YYYY")
      .replace(/^\w/, (c) => c.toUpperCase());
};

const calculateDuration = (startTime, endTime) => {
   if (!startTime || !endTime) return "";
   const start = moment(startTime);
   const end = moment(endTime);
   const duration = moment.duration(end.diff(start));
   const hours = Math.floor(duration.asHours());
   const minutes = Math.floor(duration.asMinutes() % 60);

   if (minutes === 0) {
      return `(${hours} giờ)`;
   }
   return `(${hours} giờ ${minutes} phút)`;
};

const formatCurrency = (amount) => {
   const roundedAmount = Math.round(amount);
   return roundedAmount?.toLocaleString("vi-VN") + "đ";
};

const {Title, Text} = Typography;

const PaymentSuccess = ({bookingInfo}) => {
   const ticketsContainerRef = useRef(null);
   const downloadAllTickets = async () => {
      try {
         message.loading({content: "Đang chuẩn bị tải vé...", key: "download"});
         const ticketElements = ticketsContainerRef.current.querySelectorAll(".ticket-card");
         const zip = new JSZip();

         // Tạo tên file với định dạng: ve-xe-futa-DDMMYYYY-HHMMSS
         const now = new Date();
         const dateStr = now
            .toLocaleDateString("vi-VN", {
               day: "2-digit",
               month: "2-digit",
               year: "numeric",
            })
            .split("/")
            .join("");
         const timeStr = now
            .toLocaleTimeString("vi-VN", {
               hour: "2-digit",
               minute: "2-digit",
               second: "2-digit",
               hour12: false,
            })
            .split(":")
            .join("");
         const fileName = `ve-xe-futa-${dateStr}-${timeStr}.zip`;
         // Chuyển đổi từng vé thành ảnh và thêm vào zip
         const promises = Array.from(ticketElements).map(async (ticket, index) => {
            try {
               const canvas = await html2canvas(ticket, {
                  scale: 2,
                  backgroundColor: "#ffffff",
                  logging: false,
               });

               return new Promise((resolve) => {
                  canvas.toBlob(
                     (blob) => {
                        zip.file(`ve-xe-futa-${dateStr}-${timeStr}-${index + 1}.png`, blob);
                        resolve();
                     },
                     "image/png",
                     1.0
                  );
               });
            } catch (error) {
               console.error(`Lỗi khi xử lý vé ${index + 1}:`, error);
               throw error;
            }
         });

         // Đợi tất cả các vé được xử lý xong
         await Promise.all(promises);

         // Tạo và tải file zip
         const zipBlob = await zip.generateAsync({type: "blob"});
         const zipUrl = URL.createObjectURL(zipBlob);
         const link = document.createElement("a");
         link.href = zipUrl;
         link.download = fileName;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         URL.revokeObjectURL(zipUrl);

         message.success({content: "Tải vé thành công!", key: "download"});
      } catch (error) {
         console.error("Lỗi khi tải vé:", error);
         message.error({content: "Có lỗi xảy ra khi tải vé!", key: "download"});
      }
   };

   return (
      <div
         className='payment-success layout'
         style={{
            backgroundColor: "#f5f5f5",
            margin: "30px auto",
            borderRadius: "40px",
            border: "1px solid rgba(239, 82, 34, 0.6)",
            outline: "8px solid rgba(170, 46, 8, 0.1)",
         }}>
         <Card style={{backgroundColor: "transparent", border: "none"}}>
            {/* Header */}
            <div style={{textAlign: "center", marginBottom: "24px"}}>
               <CheckCircleFilled style={{fontSize: "64px", color: "#52c41a"}} />
               <Title level={2} style={{color: "#00613D", margin: "16px 0"}}>
                  Mua vé xe thành công
               </Title>
               <Text type='text-secondary' style={{fontSize: "18px"}}>
                  FUTA Bus Lines đã gửi thông tin vé đã đặt về địa chỉ email {bookingInfo?.customer_info?.email}. Vui
                  lòng kiểm tra lại.
               </Text>
            </div>
            <Card
               title={
                  <Typography.Title
                     level={4}
                     style={{color: "#00613D", margin: "0 auto", fontWeight: 700, textAlign: "center"}}>
                     THÔNG TIN MUA VÉ
                  </Typography.Title>
               }
               style={{marginBottom: "24px"}}>
               <Row gutter={[16, 16]}>
                  <Col span={12}>
                     <Text style={{fontSize: 18, fontWeight: 500, color: "#00613D"}}>Họ và tên:</Text>
                     <Text strong style={{marginLeft: "8px", fontSize: 18, fontWeight: 500, color: "#00613D"}}>
                        {bookingInfo?.customer_info?.name}
                     </Text>
                  </Col>
                  <Col span={12}>
                     <Text style={{fontSize: 18, fontWeight: 500, color: "#00613D"}}>Tổng giá vé:</Text>
                     <Text strong style={{marginLeft: "8px", fontSize: 18, fontWeight: 500, color: "#00613D"}}>
                        {formatCurrency(bookingInfo?.booking_info?.total_payment)}
                     </Text>
                  </Col>
                  <Col span={12}>
                     <Text style={{fontSize: 18, fontWeight: 500, color: "#00613D"}}>Số điện thoại:</Text>
                     <Text strong style={{marginLeft: "8px", fontSize: 18, fontWeight: 500, color: "#00613D"}}>
                        {bookingInfo?.customer_info?.phone}
                     </Text>
                  </Col>
                  <Col span={12}>
                     <Text style={{fontSize: 18, fontWeight: 500, color: "#00613D"}}>PTTT:</Text>
                     <Text strong style={{marginLeft: "8px", fontSize: 18, fontWeight: 500, color: "#00613D"}}>
                        VNPAY
                     </Text>
                  </Col>
                  <Col span={12}>
                     <Text style={{fontSize: 18, fontWeight: 500, color: "#00613D"}}>Email:</Text>
                     <Text strong style={{marginLeft: "8px", fontSize: 18, fontWeight: 500, color: "#00613D"}}>
                        {bookingInfo?.customer_info?.email}
                     </Text>
                  </Col>
                  <Col span={12}>
                     <Text style={{fontSize: 18, fontWeight: 500, color: "#00613D"}}>Trạng thái:</Text>
                     <Text strong style={{marginLeft: "8px", fontSize: 20, fontWeight: 700, color: "#52c41a"}}>
                        Thanh toán thành công
                     </Text>
                  </Col>
               </Row>
            </Card>

            {/* Vé xe */}
            <Row ref={ticketsContainerRef} gutter={[24, 24]} style={{alignItems: "center", justifyContent: "center"}}>
               {bookingInfo?.tickets?.map((ticket, index) => (
                  <Col span={8} key={index}>
                     <TicketComponent bookingInfo={bookingInfo} ticket={ticket} />
                  </Col>
               ))}
            </Row>

            {/* Buttons */}
            <div style={{textAlign: "center", marginTop: "24px"}}>
               <Button
                  type='primary'
                  icon={<DownloadOutlined />}
                  size='large'
                  onClick={downloadAllTickets}
                  style={{marginRight: "16px", backgroundColor: "#00613D"}}>
                  Tải tất cả vé
               </Button>
               <Button icon={<ShareAltOutlined />} size='large'>
                  Chia sẻ
               </Button>
            </div>
         </Card>
      </div>
   );
};

export default PaymentSuccess;
