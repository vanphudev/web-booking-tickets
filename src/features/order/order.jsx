import React, {useState, useEffect} from "react";
import {Radio, Card, Row, Col, Typography, Space, QRCode, Steps, Spin, Button, Alert, Modal, Input, Form} from "antd";
import ZaloPayIcon from "./PaymentIcons/zalopay-logo.png";
import VNPayIcon from "./PaymentIcons/vnpay-logo.jpg";
import {useContent} from "../../hooks/common/contentContext";
import PaymentSuccess from "./PaymentSuccess";
import {useSearchParams} from "react-router-dom";
import OrderApi from "../../api/orderApi";
import {useNavigate} from "react-router-dom";
import {WarningOutlined} from "@ant-design/icons";
import VoucherApi from "../../api/voucherApi";
import {CloseCircleFilled, CheckCircleFilled} from "@ant-design/icons";

import moment from "moment";
import "moment/locale/vi";

const {Title, Text} = Typography;

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

// Thêm hàm helper mới
const formatProvinceName = (provinceName) => {
   if (!provinceName) return "";
   return provinceName
      .replace(/^Tỉnh\s+/i, "")
      .replace(/^Thành phố\s+/i, "")
      .replace(/^TP\.\s*/i, "");
};

// Thêm hàm helper để tính thời gian cần có mặt (trước 30 phút)
const getArrivalTime = (departureTime) => {
   if (!departureTime) return "";
   return moment(departureTime).subtract(30, "minutes").format("HH:mm");
};

const CountdownTimer = ({expirationTime, onExpired}) => {
   const [timeLeft, setTimeLeft] = useState(0);

   useEffect(() => {
      if (!expirationTime) return;

      const calculateTimeLeft = () => {
         const expirationMoment = moment(expirationTime);
         const now = moment();
         const diff = expirationMoment.diff(now, "seconds");
         return diff > 0 ? diff : 0;
      };

      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
         const remaining = calculateTimeLeft();
         setTimeLeft(remaining);

         if (remaining <= 0) {
            clearInterval(timer);
            onExpired(); // Gọi callback khi hết thời gian
         }
      }, 1000);

      return () => clearInterval(timer);
   }, [expirationTime, onExpired]);

   const minutes = Math.floor(timeLeft / 60);
   const seconds = timeLeft % 60;

   return (
      <div className='countdown-container' style={{margin: "20px 0"}}>
         <Alert
            message={
               <div style={{textAlign: "center"}}>
                  <div style={{fontSize: "16px", marginBottom: "8px"}}>Thời gian giữ chỗ còn lại</div>
                  <div
                     style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: timeLeft <= 300 ? "#ff4d4f" : "#00613D",
                     }}>
                     {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </div>
                  <div
                     style={{
                        fontSize: "14px",
                        color: "#666",
                        marginTop: "8px",
                     }}>
                     Vui lòng hoàn tất thanh toán trước khi hết thời gian
                  </div>
               </div>
            }
            type={timeLeft <= 300 ? "error" : "info"}
            showIcon={false}
            style={{
               width: "100%",
               textAlign: "center",
               border: `2px solid ${timeLeft <= 300 ? "#ff4d4f" : "#00613D"}`,
               borderRadius: "8px",
               backgroundColor: timeLeft <= 300 ? "#fff2f0" : "#f6ffed",
            }}
         />
      </div>
   );
};

const PaymentPage = () => {
   const [form] = Form.useForm();
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const bookingCode = searchParams.get("bookingCode");
   const phone = searchParams.get("phone");
   const [voucherInfo, setVoucherInfo] = useState(null);
   const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
   const [voucherModalContent, setVoucherModalContent] = useState({type: "", message: ""});

   const {isHeaderCustom, setIsHeaderCustom} = useContent();
   useEffect(() => {
      setIsHeaderCustom(true);
      return () => {
         setIsHeaderCustom(false);
      };
   }, []);

   const [bookingDetail, setBookingDetail] = useState(null);

   useEffect(() => {
      const getBookingDetail = async () => {
         const res = await OrderApi.getBookingDetailsByCode(bookingCode)
            .then((res) => {
               if (res?.status === 200 && res.metadata) {
                  setBookingDetail(res?.metadata?.data);
               }
            })
            .catch((error) => {
               navigate("/");
            });
      };
      getBookingDetail();
   }, [bookingCode, navigate]);

   const [paymentMethod, setPaymentMethod] = useState("null");
   const paymentOptions = [
      {
         value: "zalopay",
         label: <span style={{color: "#0033C9", fontWeight: "800", fontSize: "20px"}}>ZaloPay</span>,
         description: (
            <div>
               <span style={{fontSize: "14px", color: "#00CF6A"}}>Thanh toán nhanh chóng qua ví điện tử ZaloPay.</span>
            </div>
         ),
         icon: <img src={ZaloPayIcon} alt='ZaloPay' style={{width: "80px", height: "80px"}} />,
         qrInstructions: "Quét mã QR bằng ứng dụng ZaloPay để thanh toán",
      },
      {
         value: "vnpay",
         label: <span style={{color: "#ED1C21", fontWeight: "800", fontSize: "20px"}}>VNPay</span>,
         description: (
            <div>
               <span style={{fontSize: "14px", color: "#0182C7"}}>
                  Thanh toán an toàn qua VNPay với hơn 40 ngân hàng.
               </span>
            </div>
         ),
         icon: <img src={VNPayIcon} alt='VNPay' style={{width: "80px", height: "80px"}} />,
         qrInstructions: "Quét mã QR bằng ứng dụng VNPay hoặc ứng dụng Mobile Banking để thanh toán",
      },
   ];

   const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
   const [warningMessage, setWarningMessage] = useState("");

   const handlePaymentClick = () => {
      if (paymentMethod === "null") {
         setWarningMessage("Vui lòng chọn phương thức thanh toán");
         setIsWarningModalOpen(true);
         return;
      }
      if (paymentUrl === "") {
         setWarningMessage("Có lỗi xảy ra khi tạo liên kết thanh toán");
         setIsWarningModalOpen(true);
         return;
      }
      window.location.href = paymentUrl;
   };

   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

   const handleCancelPayment = async () => {
      const data = {
         bookingId: bookingCode,
         seats: bookingDetail?.seats,
         tripId: bookingDetail?.trip_info?.trip_id,
      };

      await OrderApi.cancelBooking(data)
         .then((res) => {
            if (res?.status === 200) {
               setWarningMessage("Hủy thanh toán thành công");
               setIsWarningModalOpen(true);
               navigate("/");
            }
         })
         .catch((error) => {
            setWarningMessage("Có lỗi xảy ra khi hủy thanh toán");
            setIsWarningModalOpen(true);
         });
   };

   const [isLoading, setIsLoading] = useState(false);
   const [paymentUrl, setPaymentUrl] = useState("");

   const handlePaymentMethodChange = async (e) => {
      const selectedMethod = e.target.value;
      setPaymentMethod(selectedMethod);

      if (selectedMethod === "null") return;
      try {
         setIsLoading(true);
         await OrderApi.getPaymentVNPayUrl(bookingCode).then((res) => {
            if (res?.status === 200 && res?.metadata) {
               setPaymentUrl(res.metadata?.data?.payment_url);
            } else {
               setWarningMessage("Có lỗi xảy ra khi tạo liên kết thanh toán");
               setIsWarningModalOpen(true);
            }
         });
      } catch (error) {
         console.error("Payment error:", error);
         setWarningMessage("Không thể tạo liên kết thanh toán. Vui lòng thử lại sau");
         setIsWarningModalOpen(true);
      } finally {
         setIsLoading(false);
      }
   };

   const handleExpiration = async () => {
      const data = {
         bookingId: bookingCode,
         seats: bookingDetail?.seats,
         tripId: bookingDetail?.trip_info?.trip_id,
      };

      try {
         await OrderApi.cancelBooking(data);
         setWarningMessage("Đã hết thời gian giữ chỗ");
         setIsWarningModalOpen(true);
         navigate("/");
      } catch (error) {
         console.error("Error canceling booking:", error);
         setWarningMessage("Có lỗi xảy ra khi hủy thanh toán");
         setIsWarningModalOpen(true);
      }
   };

   return (
      <div className='payment-page layout m-0 py-5'>
         <Row
            className='bg-white mb-6 flex items-center rounded-lg'
            gutter={[24, 16]}
            style={{backgroundColor: "#fff", padding: "10px 0px 10px 0px", margin: "0px 0px 10px 0px"}}>
            <Col span={6} className='flex items-center' style={{alignItems: "flex-start", display: "flex"}}>
               <div className='bg-gray-50 flex flex-col gap-2 rounded-lg p-3 text-[16px]'>
                  <div className='text-gray-600'>
                     <span className='font-bold text-[#00613D]'>Ngày đi: </span>
                     <span className='ml-2 font-medium'>{formatDate(bookingDetail?.trip_info?.trip_date)}</span>
                  </div>
                  <div className='text-gray-600'>
                     <span className='font-bold text-[#00613D]'>Thời gian: </span>
                     <span className='ml-2'>
                        {formatTime(bookingDetail?.trip_info?.departure_time)} -{" "}
                        {formatTime(bookingDetail?.trip_info?.arrival_time)}
                     </span>
                  </div>
               </div>
            </Col>
            <Col span={12} className='flex flex-col items-center justify-center'>
               <div className='m-auto mb-1 text-center text-2xl font-bold text-[#ef5222]'>
                  <span className='font-medium'>{bookingDetail?.trip_info?.origin_office_name}</span>
                  <span className='ml-1'> - </span>
                  <span className='font-medium'>{bookingDetail?.trip_info?.destination_office_name}</span>
               </div>
               <div className='text-gray-500 m-auto text-center text-sm font-bold text-[#00613D]'>
                  Từ {formatTime(bookingDetail?.trip_info?.departure_time)} - Đến{" "}
                  {formatTime(bookingDetail?.trip_info?.arrival_time)}{" "}
                  {calculateDuration(bookingDetail?.trip_info?.departure_time, bookingDetail?.trip_info?.arrival_time)}
               </div>
            </Col>
            <Col span={6} className='flex flex-col justify-end'>
               <div className='bg-gray-50 flex flex-col items-end gap-2 rounded-lg p-3 text-[16px]'>
                  <div className='text-gray-600'>
                     <span className='font-bold text-[#00613D]'>Giá vé: </span>
                     {bookingDetail?.trip_info?.trip_discount > 0 ? (
                        <>
                           <span className='text-gray-400 ml-2 line-through'>
                              {formatCurrency(bookingDetail?.trip_info?.trip_price)}
                           </span>
                           <span className='ml-2'> - </span>
                           <span className='ml-2 font-bold text-[#ef5222]'>
                              {formatCurrency(
                                 bookingDetail?.trip_info?.trip_price -
                                    (bookingDetail?.trip_info?.trip_discount * bookingDetail?.trip_info?.trip_price) /
                                       100
                              )}
                           </span>
                        </>
                     ) : (
                        <span className='ml-2 font-bold text-[#ef5222]'>
                           {formatCurrency(bookingDetail?.trip_info?.trip_price)}
                        </span>
                     )}
                  </div>
                  <div className='text-gray-600'>
                     <span className='font-bold text-[#00613D]'>Loại xe: </span>
                     <span className='ml-2'>{bookingDetail?.trip_info?.vehicle?.type}</span>
                  </div>
               </div>
            </Col>
         </Row>
         <CountdownTimer expirationTime={bookingDetail?.booking_info?.expiration_time} onExpired={handleExpiration} />
         <Row gutter={[24, 24]} style={{padding: "0px 0px 0px 0px", margin: "0px 0px 0px 0px"}}>
            <Col span={14} style={{padding: "0px 5px 0px 0px", display: "flex", flexDirection: "column", gap: "5px"}}>
               <Card
                  title={
                     <div className='flex items-center gap-2 text-[700]'>
                        <span style={{color: "#00613D", fontWeight: "800", fontSize: "20px"}}>
                           Chọn phương thức thanh toán
                        </span>
                     </div>
                  }>
                  <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod} style={{width: "100%"}}>
                     <Space direction='vertical' style={{width: "100%"}}>
                        {paymentOptions.map((option) => (
                           <Radio key={option.value} value={option.value} className='payment-radio-button'>
                              <Space>
                                 {option.icon}
                                 <div>
                                    <Text strong>{option.label}</Text>
                                    <br />
                                    <Text type='secondary' style={{fontSize: "12px"}}>
                                       {option.description}
                                    </Text>
                                 </div>
                              </Space>
                           </Radio>
                        ))}
                     </Space>
                  </Radio.Group>
               </Card>
               <Card style={{marginTop: 16}}>
                  <Space direction='vertical' align='center' style={{width: "100%"}}>
                     {/* <QRCode
                        value='https://example.com'
                        size={200}
                        icon={paymentMethod === "zalopay" ? "/zalopay-logo.png" : "/vnpay-logo.png"}
                     /> */}
                     <Title level={4}>
                        {paymentOptions.find((opt) => opt.value === paymentMethod)?.qrInstructions}
                     </Title>
                     <Steps
                        progressDot
                        current={-1}
                        direction='vertical'
                        items={[
                           {
                              title: <Text strong>Bước 1: Chuẩn bị</Text>,
                              description: (
                                 <div>
                                    <Text>
                                       • Đảm bảo đã cài đặt ứng dụng {paymentMethod === "zalopay" ? "ZaloPay" : "VNPay"}
                                    </Text>
                                    <br />
                                    <Text>• Đăng nhập vào tài khoản của bạn</Text>
                                 </div>
                              ),
                           },
                           {
                              title: <Text strong>Bước 2: Mở ứng dụng</Text>,
                              description: (
                                 <div>
                                    <Text>
                                       • Mở ứng dụng {paymentMethod === "zalopay" ? "ZaloPay" : "VNPay"} trên điện thoại
                                    </Text>
                                    <br />
                                    <Text>• Chọn chức năng quét mã QR</Text>
                                 </div>
                              ),
                           },
                           {
                              title: <Text strong>Bước 3: Quét mã QR</Text>,
                              description: (
                                 <div>
                                    <Text>• Quét mã QR hiển thị trên màn hình</Text>
                                    <br />
                                    <Text>• Kiểm tra thông tin đơn hàng</Text>
                                 </div>
                              ),
                           },
                           {
                              title: <Text strong>Bước 4: Xác nhận thanh toán</Text>,
                              description: (
                                 <div>
                                    <Text>• Xác nhận số tiền cần thanh toán</Text>
                                    <br />
                                    <Text>• Nhấn &quot;Xác nhận&quot; để hoàn tất giao dịch</Text>
                                    <br />
                                    <Text type='secondary'>
                                       Lưu ý: Vui lòng không tắt trình duyệt trong quá trình thanh toán
                                    </Text>
                                 </div>
                              ),
                           },
                        ]}
                     />
                  </Space>
               </Card>
            </Col>
            <Col span={10} style={{padding: "0px 0px 0px 5px", display: "flex", flexDirection: "column", gap: "5px"}}>
               <Card
                  title={
                     <div className='flex items-center gap-2 text-[700]'>
                        <span style={{color: "#00613D", fontWeight: "800", fontSize: "20px"}}>
                           Thông tin hành khách
                        </span>
                     </div>
                  }>
                  <Space direction='vertical' style={{width: "100%"}}>
                     <Row justify='space-between'>
                        <Text>Họ và tên</Text>
                        <Text strong>{bookingDetail?.customer_info?.name}</Text>
                     </Row>
                     <Row justify='space-between'>
                        <Text>Số điện thoại</Text>
                        <Text strong>{bookingDetail?.customer_info?.phone}</Text>
                     </Row>
                     <Row justify='space-between'>
                        <Text>Email</Text>
                        <Text strong>{bookingDetail?.customer_info?.email}</Text>
                     </Row>
                  </Space>
               </Card>

               <Card
                  title={
                     <div className='flex items-center gap-2 text-[700]'>
                        <span style={{color: "#00613D", fontWeight: "800", fontSize: "20px"}}>Thông tin lượt đi</span>
                     </div>
                  }
                  style={{marginTop: 16}}>
                  <Space direction='vertical' style={{width: "100%"}}>
                     <Row justify='space-between'>
                        <Text>Tuyến xe</Text>
                        <Text strong>
                           {bookingDetail?.trip_info?.origin_office_name} -{" "}
                           {bookingDetail?.trip_info?.destination_office_name}
                        </Text>
                     </Row>
                     <Row justify='space-between'>
                        <Text>Thời gian xuất bến</Text>
                        <Text strong>
                           {formatTime(bookingDetail?.trip_info?.departure_time)}{" "}
                           {formatDate(bookingDetail?.trip_info?.trip_date)}
                        </Text>
                     </Row>
                     <Row justify='space-between'>
                        <Text>Số lượng ghế</Text>
                        <Text strong>{bookingDetail?.seats?.length} Ghế</Text>
                     </Row>
                     <Row justify='space-between'>
                        <Text>Số ghế</Text>
                        <Text strong>{bookingDetail?.seats?.map((seat) => seat.seat_name).join(", ")}</Text>
                     </Row>
                  </Space>
               </Card>

               <Card
                  title={
                     <div className='flex items-center gap-2 text-[700]'>
                        <span style={{color: "#00613D", fontWeight: "800", fontSize: "20px"}}>Chi tiết giá</span>
                     </div>
                  }
                  style={{marginTop: 16}}>
                  <Space direction='vertical' style={{width: "100%"}}>
                     <Row justify='space-between'>
                        <Text>Giá vé lượt đi</Text>
                        <Text strong>{formatCurrency(bookingDetail?.booking_info?.total_price)}</Text>
                     </Row>
                     <Row justify='space-between'>
                        <Text>Phí thanh toán</Text>
                        <Text strong>0đ</Text>
                     </Row>
                     {/*  */}
                     {/*  */}
                     {/*  */}
                     {/*  */}
                     {/*  */}
                     {/*  */}
                     {bookingDetail?.booking_info?.voucher_id && (
                        <Row justify='space-between'>
                           <Text>Tổng tiền giảm giá sau giảm </Text>
                           <Text strong style={{color: "#ff4d4f", fontSize: "18px"}}>
                              {formatCurrency(
                                 bookingDetail?.booking_info?.total_price - bookingDetail?.booking_info?.discount_amount
                              )}
                           </Text>
                        </Row>
                     )}
                     {bookingDetail?.booking_info?.voucher_id && (
                        <Row justify='space-between'>
                           <Text>Tổng tiền giảm </Text>
                           <Text strong style={{color: "#ff4d4f", fontSize: "18px"}}>
                              {formatCurrency(bookingDetail?.booking_info?.discount_amount)}
                           </Text>
                        </Row>
                     )}
                     {/*  */}
                     {/*  */}
                     {/*  */}
                     {/*  */}
                     {/*  */}
                     {/*  */}
                     <Row justify='space-between'>
                        <Text>Tổng hóa đơn</Text>
                        <Text strong style={{color: "#ff4d4f", fontSize: "18px"}}>
                           {formatCurrency(
                              bookingDetail?.booking_info?.total_price - bookingDetail?.booking_info?.discount_amount
                           )}
                        </Text>
                     </Row>
                     <Row>
                        <Text type='secondary'>
                           Lưu ý: Nếu bạn đã áp dụng mã giảm giá, tổng tiền sẽ được tính lại tương ứng
                        </Text>
                     </Row>
                  </Space>
               </Card>

               <Card className='mt-4'>
                  <Form form={form}>
                     <div className='flex items-center gap-2'>
                        <Form.Item className='mb-0 flex-1' name='couponCode' style={{marginBottom: "0px"}}>
                           <Input size='large' placeholder='Nhập mã giảm giá' style={{borderColor: "#00613D"}} />
                        </Form.Item>
                        <Button
                           size='large'
                           style={{
                              backgroundColor: "#00613D",
                              color: "white",
                              borderColor: "#00613D",
                           }}
                           onClick={async () => {
                              const couponCode = form.getFieldValue("couponCode");
                              if (couponCode) {
                                 await VoucherApi.getByCode({
                                    code: couponCode,
                                    amount: bookingDetail?.booking_info?.total_price,
                                    bookingCode: bookingCode,
                                 })
                                    .then(async (voucherRes) => {
                                       if (voucherRes && (voucherRes.status === 200 || voucherRes.status === 201)) {
                                          if (voucherRes?.metadata?.voucher) {
                                             setVoucherInfo(voucherRes?.metadata);
                                             setVoucherModalContent({
                                                type: "success",
                                                message: `Áp dụng mã giảm giá "${couponCode}" thành công! Bạn được giảm ${voucherRes?.metadata?.discount_amount}đ`,
                                             });
                                             if (paymentUrl) {
                                                await OrderApi.getPaymentVNPayUrl(bookingCode).then((res) => {
                                                   if (res?.status === 200 && res?.metadata) {
                                                      setPaymentUrl(res.metadata?.data?.payment_url);
                                                   } else {
                                                      setWarningMessage("Có lỗi xảy ra khi tạo liên kết thanh toán");
                                                      setIsWarningModalOpen(true);
                                                   }
                                                });
                                             }
                                             // Gọi API cập nhật booking detail
                                             const bookingRes = await OrderApi.getBookingDetailsByCode(bookingCode);
                                             if (bookingRes?.status === 200 && bookingRes.metadata) {
                                                setBookingDetail(bookingRes?.metadata?.data);
                                             }
                                          } else {
                                             setVoucherModalContent({
                                                type: "error",
                                                message: "Mã giảm giá không hợp lệ hoặc đã hết hạn!",
                                             });
                                          }
                                       } else {
                                          setVoucherModalContent({
                                             type: "error",
                                             message: `Mã giảm giá không hợp lệ!`,
                                          });
                                       }
                                       setIsVoucherModalOpen(true);
                                    })
                                    .catch((error) => {
                                       setVoucherModalContent({
                                          type: "error",
                                          message: `Có lỗi xảy ra khi áp dụng mã giảm giá! ${error?.message}`,
                                       });
                                       setIsVoucherModalOpen(true);
                                    });
                              } else {
                                 setVoucherModalContent({
                                    type: "error",
                                    message: "Vui lòng nhập mã giảm giá!",
                                 });
                                 setIsVoucherModalOpen(true);
                              }
                           }}>
                           Áp dụng
                        </Button>
                     </div>
                  </Form>
               </Card>
               <Card style={{marginTop: 16}}>
                  <Space direction='vertical' align='center' style={{width: "100%"}}>
                     <div style={{display: "flex", gap: "16px", justifyContent: "center"}}>
                        <Button
                           type='primary'
                           size='large'
                           style={{
                              backgroundColor: "#ff4d4f",
                              width: "200px",
                              height: "45px",
                              fontSize: "16px",
                           }}
                           onClick={handlePaymentClick}>
                           Thanh toán ngay
                        </Button>
                        <Button
                           size='large'
                           style={{
                              width: "200px",
                              height: "45px",
                              fontSize: "16px",
                              border: "1px solid #ff4d4f",
                              color: "#ff4d4f",
                           }}
                           onClick={() => setIsCancelModalOpen(true)}>
                           Hủy thanh toán
                        </Button>
                     </div>
                  </Space>
               </Card>
            </Col>
         </Row>
         <Row gutter={[24, 24]}>
            <Col span={24}>
               <Card
                  title={
                     <div className='flex items-center gap-2 text-[700] '>
                        <span style={{color: "#00613D", fontWeight: "800", fontSize: "20px"}}>
                           Hướng dẫn thanh toán
                        </span>
                     </div>
                  }
                  style={{marginTop: 16}}>
                  <Steps
                     progressDot
                     current={-1}
                     direction='vertical'
                     items={[
                        {
                           title: <Text strong>Bước 1: Chuẩn bị</Text>,
                           description: (
                              <div>
                                 <Text>
                                    • Đảm bảo bạn đã cài đặt ứng dụng{" "}
                                    {paymentMethod === "zalopay" ? "ZaloPay" : "VNPay"}
                                 </Text>
                                 <br />
                                 <Text>• Đăng nhập vào tài khoản của bạn</Text>
                              </div>
                           ),
                        },
                        {
                           title: <Text strong>Bước 2: Mở ứng dụng</Text>,
                           description: (
                              <div>
                                 <Text>
                                    • Mở ứng dụng {paymentMethod === "zalopay" ? "ZaloPay" : "VNPay"} trên điện thoại
                                 </Text>
                                 <br />
                                 <Text>• Chọn chức năng quét mã QR</Text>
                              </div>
                           ),
                        },
                        {
                           title: <Text strong>Bước 3: Quét mã QR</Text>,
                           description: (
                              <div>
                                 <Text>• Quét mã QR hiển thị trên màn hình</Text>
                                 <br />
                                 <Text>• Kiểm tra thông tin đơn hàng</Text>
                              </div>
                           ),
                        },
                        {
                           title: <Text strong>Bước 4: Xác nhận thanh toán</Text>,
                           description: (
                              <div>
                                 <Text>• Xác nhận số tiền cần thanh toán</Text>
                                 <br />
                                 <Text>• Nhấn &quot;Xác nhận&quot; để hoàn tất giao dịch</Text>
                                 <br />
                                 <Text type='secondary'>
                                    Lưu ý: Vui lòng không tắt trình duyệt trong quá trình thanh toán
                                 </Text>
                              </div>
                           ),
                        },
                     ]}
                  />
               </Card>
            </Col>
         </Row>
         {/* <PaymentSuccess /> */}

         {/* Thêm Modal thông báo */}
         <Modal
            title={
               <div style={{color: voucherModalContent.type === "success" ? "#00613D" : "#ff4d4f"}}>
                  {voucherModalContent.type === "success" ? "Thành công" : "Thông báo"}
               </div>
            }
            open={isVoucherModalOpen}
            onOk={() => setIsVoucherModalOpen(false)}
            onCancel={() => setIsVoucherModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{style: {display: "none"}}}
            okButtonProps={{
               style: {
                  backgroundColor: voucherModalContent.type === "success" ? "#00613D" : "#ff4d4f",
                  borderColor: voucherModalContent.type === "success" ? "#00613D" : "#ff4d4f",
                  color: "white",
               },
            }}>
            <div className='py-4 text-center'>
               <div className='mb-4'>
                  {voucherModalContent.type === "success" ? (
                     <CheckCircleFilled style={{fontSize: "48px", color: "#00613D"}} />
                  ) : (
                     <CloseCircleFilled style={{fontSize: "48px", color: "#ff4d4f"}} />
                  )}
               </div>
               <p className='text-lg'>{voucherModalContent.message}</p>
            </div>
         </Modal>
         <Modal
            title='Thông báo'
            open={isWarningModalOpen}
            onOk={() => setIsWarningModalOpen(false)}
            onCancel={() => setIsWarningModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{style: {display: "none"}}}
            okButtonProps={{
               className: "bg-orange-500",
               style: {backgroundColor: "#ef5222", color: "#fff"},
            }}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#ff9800]'>
                  <WarningOutlined className='text-[#ff9800]' style={{fontSize: "48px"}} />
               </div>
               <h3 className='text-lg font-semibold'>{warningMessage}</h3>
            </div>
         </Modal>
         <Modal
            title='Xác nhận hủy'
            open={isCancelModalOpen}
            onOk={handleCancelPayment}
            onCancel={() => setIsCancelModalOpen(false)}
            okText='Đồng ý'
            cancelText='Không'
            okButtonProps={{
               style: {backgroundColor: "#ff4d4f", borderColor: "#ff4d4f"},
            }}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#ff4d4f]'>
                  <WarningOutlined style={{fontSize: "48px"}} />
               </div>
               <h3 className='text-lg font-semibold'>Bạn có chắc chắn muốn hủy thanh toán?</h3>
               <p className='text-gray-500'>Thao tác này không thể hoàn tác</p>
            </div>
         </Modal>
      </div>
   );
};

export default PaymentPage;
