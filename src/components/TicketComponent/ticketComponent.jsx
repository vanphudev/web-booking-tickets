import React, {useRef} from "react";
import html2canvas from "html2canvas";
import {Card, Typography, Row, Col, Divider, Button, QRCode, message} from "antd";
import {ShareAltOutlined, DownloadOutlined} from "@ant-design/icons";
import images from "./qr.svg";
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

const TicketComponent = ({bookingInfo, ticket}) => {
   const ticketRef = useRef(null);

   const downloadTicket = async () => {
      try {
         const ticketElement = ticketRef.current;
         const canvas = await html2canvas(ticketElement, {
            scale: 2, // Tăng độ phân giải
            backgroundColor: "#ffffff",
            logging: false,
         });

         // Chuyển canvas thành blob
         canvas.toBlob(
            (blob) => {
               // Tạo URL từ blob
               const url = window.URL.createObjectURL(blob);
               // Tạo thẻ a ẩn để tải xuống
               const link = document.createElement("a");
               link.href = url;
               link.download = "ve-xe-futa.png";
               document.body.appendChild(link);
               link.click();
               // Cleanup
               document.body.removeChild(link);
               window.URL.revokeObjectURL(url);
               message.success("Đã tải vé xuống thành công!");
            },
            "image/png",
            1.0
         );
      } catch (error) {
         console.error("Lỗi khi tải vé:", error);
         message.error("Có lỗi xảy ra khi tải vé!");
      }
   };

   const shareTicket = async () => {
      try {
         const ticketElement = ticketRef.current;
         const canvas = await html2canvas(ticketElement, {
            scale: 2,
            backgroundColor: "transparent",
            logging: false,
         });

         canvas.toBlob(
            async (blob) => {
               if (navigator.share) {
                  const file = new File([blob], "ve-xe-futa.png", {type: "image/png"});
                  try {
                     await navigator.share({
                        files: [file],
                        title: "Vé xe FUTA",
                        text: "Chia sẻ vé xe FUTA",
                     });
                     message.success("Đã chia sẻ vé thành công!");
                  } catch (error) {
                     console.error("Lỗi khi chia sẻ:", error);
                     message.error("Có lỗi xảy ra khi chia sẻ vé!");
                  }
               } else {
                  message.warning("Trình duyệt không hỗ trợ tính năng chia sẻ!");
               }
            },
            "image/png",
            1.0
         );
      } catch (error) {
         console.error("Lỗi khi chia sẻ vé:", error);
         message.error("Có lỗi xảy ra khi chia sẻ vé!");
      }
   };

   return (
      <div className='ticket-wrapper p-3'>
         <Card ref={ticketRef} className='ticket-card' bodyStyle={{padding: 16}} style={{border: "2px solid #E8E8E8"}}>
            {/* Header */}
            <Row justify='space-between' align='middle' style={{marginBottom: 16}}>
               <Typography.Text strong style={{fontSize: 18}}>
                  Mã vé: <span style={{color: "#E8460D", fontWeight: 700}}>{ticket?.ticket_code}</span>
               </Typography.Text>
               <Row gutter={8} align='middle' style={{gap: 8}}>
                  <Button
                     type='link'
                     style={{padding: "10px", backgroundColor: "#ECEEF0", borderRadius: "50%"}}
                     icon={<DownloadOutlined />}
                     onClick={downloadTicket}
                  />
                  <Button
                     type='link'
                     style={{padding: "10px", backgroundColor: "#ECEEF0", borderRadius: "50%"}}
                     icon={<ShareAltOutlined />}
                     onClick={shareTicket}
                  />
               </Row>
            </Row>
            <Row justify='center' style={{marginBottom: 16}}>
               <div
                  style={{
                     width: 200,
                     height: 200,
                  }}>
                  <QRCode errorLevel='H' size={200} iconSize={200 / 5} value='https://ant.design/' icon={images} />
               </div>
            </Row>
            {/* Ticket Info */}
            <Row justify='space-between' style={{marginBottom: 8}}>
               <p style={{fontSize: 15, color: "#768092", fontWeight: 600}}>Tuyến xe</p>
               <Typography.Text strong style={{fontSize: 16, color: "#00613D"}}>
                  {bookingInfo?.trip_info?.origin_office_name} - {bookingInfo?.trip_info?.destination_office_name}
               </Typography.Text>
            </Row>
            <Row justify='space-between' style={{marginBottom: 8}}>
               <p style={{fontSize: 15, color: "#768092", fontWeight: 600}}>Thời gian</p>
               <Typography.Text strong style={{fontSize: 16, color: "#00613D"}}>
                  {formatTime(bookingInfo?.trip_info?.departure_time)} {formatDate(bookingInfo?.trip_info?.trip_date)}
               </Typography.Text>
            </Row>
            <Row justify='space-between' style={{marginBottom: 8}}>
               <p style={{fontSize: 15, color: "#768092", fontWeight: 600}}>Số ghế</p>
               <Typography.Text strong style={{fontSize: 16, color: "#00613D"}}>
                  {ticket?.seat_name || "---"}
               </Typography.Text>
            </Row>
            <Row justify='space-between' style={{marginBottom: 8, width: "100%"}}>
               <p style={{fontSize: 15, color: "#768092", fontWeight: 600}}>Điểm lên xe</p>
               <p style={{fontSize: 16, color: "#E8460D", textAlign: "right", fontWeight: 600}}>
                  {bookingInfo?.location_info?.pickup?.office_name 
                     ? `${bookingInfo.location_info.pickup.office_name} - (Văn phòng/Bến xe)`
                     : `${bookingInfo?.booking_info?.transfer_point_name} - (Trung chuyển)`
                  }
                  <br />
               </p>
            </Row>
            <div className='ticket-divider'>
               <div
                  style={{
                     position: "relative",
                     borderTop: "2px dashed #e8e8e8",
                     margin: "12px 0",
                  }}>
                  <span
                     style={{
                        position: "absolute",
                        left: -15,
                        top: -10,
                        width: 20,
                        height: 20,
                        backgroundColor: "#e8e8e8", // Màu nền giống màu nền trang
                        borderRadius: "50%",
                        transform: "translateX(-50%)",
                     }}
                  />
                  <span
                     style={{
                        position: "absolute",
                        right: -15,
                        top: -10,
                        width: 20,
                        height: 20,
                        backgroundColor: "#e8e8e8", // Màu nền giống màu nền trang
                        borderRadius: "50%",
                        transform: "translateX(50%)",
                     }}
                  />
               </div>
            </div>

            {/* Price */}
            <Row justify='space-between' style={{marginBottom: 16}}>
               <p style={{fontSize: 18, color: "#00613D", fontWeight: 800}}>Giá vé</p>
               <p style={{fontSize: 18, color: "#00613D", fontWeight: 800}}>{formatCurrency(ticket?.seat_price)}</p>
            </Row>

            {/* Footer Note */}
            <p
               className='m-auto w-[100%] text-center'
               style={{fontSize: "14px", color: "#00613D", fontWeight: 700, textAlign: "center"}}>
               Mang mã vé đến văn phòng để đổi vé lên xe trước giờ xuất bến ít nhất 60 phút.
            </p>
         </Card>
      </div>
   );
};

export default TicketComponent;
