import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Form, Input, Checkbox, Button, Divider, Radio, Select, Tooltip, message, Modal } from "antd";
import { InfoCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, WarningOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useContent } from "../../hooks/common/ContentContext";
import "./styles/styles.scss";
import moment from "moment";
import "moment/locale/vi";
import { MapSeat, SEAT_TYPES } from "../../components/mapSeats/mapSeats";
import RoutesApi from "../../api/routeApi";
import OrderApi from "../../api/orderApi";
import { useNavigate } from "react-router-dom";
import VoucherApi from "../../api/voucherApi";
import sha256 from "crypto-js/sha256";
moment.locale("vi");

const formatTime = (isoDateTime) => {
   if (!isoDateTime) return "";
   return new Date(isoDateTime).toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
   });
};

const formatDate = (isoDateTime) => {
   if (!isoDateTime) return "";
   return new Date(isoDateTime)
      .toLocaleDateString('vi-VN', {
         timeZone: 'Asia/Ho_Chi_Minh',
         weekday: 'long',
         day: '2-digit',
         month: '2-digit',
         year: 'numeric'
      })
      .replace(/^\w/, (c) => c.toUpperCase());
};

const calculateDuration = (startTime, endTime) => {
   if (!startTime || !endTime) return "";

   try {
      // Tính khoảng thời gian bằng milliseconds
      const diffInMs = new Date(endTime) - new Date(startTime);

      console.log(diffInMs);

      // Chuyển đổi sang phút
      const durationInMinutes = Math.floor(diffInMs / (1000 * 60));

      // Tính số giờ và số phút
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;

      // Format kết quả
      if (minutes === 0) {
         return `(${hours} giờ)`;
      }
      return `(${hours} giờ ${minutes} phút)`;
   } catch (error) {
      console.error("Error calculating duration:", error);
      return "";
   }
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

const BookingDetail = ({ tripInfo, onBack }) => {
   const navigate = useNavigate();
   const userInfo = useSelector((state) => state.auth.userInfo);
   console.log(tripInfo);
   const { isHeaderCustom, setIsHeaderCustom } = useContent();

   useEffect(() => {
      setIsHeaderCustom(true);
      return () => {
         setIsHeaderCustom(false);
      };
   }, []);

   const [form] = Form.useForm();
   const [selectedSeats, setSelectedSeats] = useState([]);
   const [allPickupPoints, setAllPickupPoints] = useState([]);
   const [pickupType, setPickupType] = useState("pickup");
   const [dropoffType, setDropoffType] = useState("dropoff");
   const [selectedPickup, setSelectedPickup] = useState(null);
   const [selectedDropoff, setSelectedDropoff] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalContent, setModalContent] = useState("");
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
   const [warningMessage, setWarningMessage] = useState("");
   const [paymentData, setPaymentData] = useState(null);

   // Lọc điểm đón (pickup_point_kind là -1 hoặc 0)
   const pickupPoints = useMemo(() => {
      return allPickupPoints?.filter((point) => point.pickup_point_kind === -1 || point.pickup_point_kind === 0) || [];
   }, [allPickupPoints]);

   // Lọc điểm trả (pickup_point_kind là 1)
   const dropoffPoints = useMemo(() => {
      return allPickupPoints?.filter((point) => point?.pickup_point_kind === 1) || [];
   }, [allPickupPoints]);

   // Format option label cho Select
   const formatPointLabel = (office) => {
      return `${office?.name} - ${office?.address}`;
   };

   console.log(selectedSeats);
   useEffect(() => {
      form.setFieldValue("name", userInfo?.fullName);
      form.setFieldValue("phone", userInfo?.phone);
      form.setFieldValue("email", userInfo?.email);
      const getRoutePickupPoints = async () => {
         const res = await RoutesApi.getRoutePickupPoints(tripInfo?.route_id);
         if (res?.status === 200) {
            setAllPickupPoints(res?.metadata?.ways[0]?.pickup_points);
            console.log("pickup_points", res?.metadata?.ways[0]?.pickup_points);
         }
      };
      getRoutePickupPoints();
   }, [userInfo, form, tripInfo]);

   // Thêm hàm xử lý khi thay đổi loại điểm đón/trả
   const handlePickupTypeChange = (e) => {
      setPickupType(e.target.value);
      setSelectedPickup(null); // Reset giá trị khi chuyển đổi
   };

   const handleDropoffTypeChange = (e) => {
      setDropoffType(e.target.value);
      setSelectedDropoff(null); // Reset giá trị khi chuyển đổi
   };

   // Hàm để mở modal với nội dung tùy chỉnh
   const showModal = (content) => {
      setModalContent(content);
      setIsModalOpen(true);
   };

   const showConfirmModal = (paymentData) => {
      setIsConfirmModalOpen(true);
   };

   const showWarningModal = (message) => {
      setWarningMessage(message);
      setIsWarningModalOpen(true);
   };

   const handlePayment = () => {
      // Kiểm tra đã chọn ghế chưa
      if (!selectedSeats || selectedSeats.length === 0) {
         showWarningModal("Vui lòng chọn ghế trước khi thanh toán");
         return;
      }

      // Kiểm tra thông tin khách hàng
      form
         .validateFields()
         .then((values) => {
            // Kiểm tra điểm đón
            if (pickupType === "pickup" && !selectedPickup) {
               showWarningModal("Vui lòng chọn điểm đón từ danh sách");
               return;
            }
            if (pickupType === "shuttle" && !selectedPickup?.trim()) {
               showWarningModal("Vui lòng nhập địa chỉ đón trung chuyển");
               return;
            }

            // Kiểm tra điểm trả
            if (dropoffType === "dropoff" && !selectedDropoff) {
               showWarningModal("Vui lòng chọn điểm trả từ danh sách");
               return;
            }
            if (dropoffType === "shuttle" && !selectedDropoff?.trim()) {
               showWarningModal("Vui lòng nhập địa chỉ trả trung chuyển");
               return;
            }

            // Tạo object paymentData khi cần gửi API
            setPaymentData({
               trip_id: tripInfo?.trip_id,
               seats: selectedSeats.map((seat) => ({
                  seat_id: seat?.booking_seat_id,
                  seat_name: seat?.seat_name,
                  price:
                     tripInfo?.trip_discount > 0
                        ? tripInfo?.trip_price - tripInfo?.trip_price * tripInfo?.trip_discount / 100
                        : tripInfo?.trip_price,
               })),
               customer_info: {
                  name: values?.name,
                  phone: values?.phone,
                  email: values?.email,
                  userId: userInfo?.userId,
               },
               pickup_info: {
                  type: pickupType,
                  location: pickupType === "pickup" ? selectedPickup : selectedPickup,
               },
               dropoff_info: {
                  type: dropoffType,
                  location: dropoffType === "dropoff" ? selectedDropoff : selectedDropoff,
               },
               total_amount:
                  selectedSeats.length *
                  (tripInfo?.trip_discount > 0
                     ? tripInfo?.trip_price - tripInfo?.trip_price * tripInfo?.trip_discount / 100
                     : tripInfo?.trip_price),
            });

            // Hiển thị modal xác nhận
            setIsConfirmModalOpen(true);
         })
         .catch(({ errorFields }) => {
            const missingFields = errorFields.map((field) => {
               switch (field.name[0]) {
                  case "name":
                     return "Họ và tên";
                  case "phone":
                     return "Số điện thoại";
                  case "email":
                     return "Email";
                  case "acceptTerms":
                     return "Chấp nhận điều khoản của FUTA Bus Lines";
                  default:
                     return field.name[0];
               }
            });
            showWarningModal(`Vui lòng điền đầy đủ thông tin sau:\n${missingFields.join(", ")}`);
         });
   };

   // Thêm hàm tạo booking session
   const generateBookingSession = () => {
      try {
         const timestamp = new Date().getTime();
         const randomStr = Math.random().toString(36).substring(2, 15);
         const rawString = `BOOK_${timestamp}_${randomStr}`;

         // Đảm bảo sha256 trả về giá trị
         const hashedValue = sha256(rawString);
         if (!hashedValue) {
            throw new Error("Failed to generate hash");
         }

         const hashedString = hashedValue.toString().substring(0, 16);
         return `BOOK_${timestamp}_${hashedString}`;
      } catch (error) {
         console.error("Error generating booking session:", error);
         // Fallback nếu có lỗi
         const timestamp = new Date().getTime();
         const fallbackStr = Math.random().toString(36).substring(2, 10);
         return `BOOK_${timestamp}_${fallbackStr}`;
      }
   };

   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Đặt vé - Futabus</title>
         </Helmet>
         <div className='layout pb-5 pt-5 '>
            <Row
               className='bg-white mb-6 flex items-center rounded-lg'
               gutter={[24, 16]}
               style={{ backgroundColor: "#fff", padding: "10px 0px 10px 0px", margin: "0px 0px 10px 0px" }}>
               <Col span={6} className='flex items-center' style={{ alignItems: "flex-start", display: "flex" }}>
                  <div className='bg-gray-50 flex flex-col gap-2 rounded-lg p-3 text-[16px]'>
                     <div className='text-gray-600'>
                        <span className='font-bold text-[#00613D]'>Ngày đi: </span>
                        <span className='ml-2 font-medium'>{formatDate(tripInfo?.trip_date)}</span>
                     </div>
                     <div className='text-gray-600'>
                        <span className='font-bold text-[#00613D]'>Thời gian: </span>
                        <span className='ml-2'>
                           {formatTime(tripInfo?.trip_departure_time)} - {formatTime(tripInfo?.trip_arrival_time)}
                        </span>
                     </div>
                  </div>
               </Col>
               <Col span={12} className='flex flex-col items-center justify-center'>
                  <div className='m-auto mb-1 text-center text-2xl font-bold text-[#ef5222]'>
                     <span className='font-medium'>{tripInfo?.origin_office}</span>
                     <span className='ml-1'> - </span>
                     <span className='font-medium'>{tripInfo?.destination_office}</span>
                  </div>
                  <div className='text-gray-500 m-auto text-center text-sm font-bold text-[#00613D]'>
                     Từ {formatTime(tripInfo?.trip_departure_time)} - Đến {formatTime(tripInfo?.trip_arrival_time)}{" "}
                     {calculateDuration(tripInfo?.trip_departure_time, tripInfo?.trip_arrival_time)}
                  </div>
               </Col>
               <Col span={6} className='flex flex-col justify-end'>
                  <div className='bg-gray-50 flex flex-col items-end gap-2 rounded-lg p-3 text-[16px]'>
                     <div className='text-gray-600'>
                        <span className='font-bold text-[#00613D]'>Giá vé: </span>
                        {tripInfo?.trip_discount > 0 ? (
                           <>
                              <span className='text-gray-400 ml-2 line-through'>
                                 {formatCurrency(tripInfo?.trip_price)}
                              </span>
                              <span className='ml-2'> - </span>
                              <span className='ml-2 font-bold text-[#ef5222]'>
                                 {formatCurrency(tripInfo?.trip_price - tripInfo?.trip_price * tripInfo?.trip_discount / 100)}
                              </span>
                           </>
                        ) : (
                           <span className='ml-2 font-bold text-[#ef5222]'>
                              {formatCurrency(tripInfo?.trip_price)}
                           </span>
                        )}
                     </div>
                     <div className='text-gray-600'>
                        <span className='font-bold text-[#00613D]'>Loại xe: </span>
                        <span className='ml-2'>{tripInfo?.vehicle_type_name}</span>
                     </div>
                  </div>
               </Col>
            </Row>
            <Row gutter={24} style={{ alignItems: "flex-start", padding: "0px", margin: "0px" }}>
               <Col
                  span={16}
                  style={{ padding: "0px 5px 0px 0px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Card title='Chọn ghế' className='mb-4'>
                     <div className='flex w-full flex-col items-center'>
                        <div className='min-w-[50%]'>
                           <MapSeat
                              type={
                                 tripInfo?.vehicle_type_name.toLowerCase().trim() === "xe limousine"
                                    ? SEAT_TYPES.LIMOUSINE
                                    : tripInfo?.vehicle_type_name.toLowerCase().trim() === "xe giường"
                                       ? SEAT_TYPES.GIUONG
                                       : SEAT_TYPES.GHE
                              }
                              seatList={tripInfo?.booking_seats || []}
                              selectedSeats={selectedSeats}
                              onSeatSelect={(seats) => {
                                 setSelectedSeats(seats);
                              }}
                              maxSelect={5}
                           />
                        </div>
                     </div>
                  </Card>
                  <Card
                     title='Thông tin khách hàng'
                     className='mb-4'
                     styles={{
                        body: {
                           padding: "5px",
                        },
                     }}>
                     <Row gutter={24} style={{ alignItems: "flex-start", padding: "10px" }}>
                        <Col span={14}>
                           <Form
                              layout='horizontal'
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 16 }}
                              requiredMark={false}
                              form={form}>
                              <Form.Item
                                 name='name'
                                 label={
                                    <span>
                                       Họ và tên <span className='text-[#ef5222]'>(*)</span>
                                    </span>
                                 }
                                 required={true}
                                 rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
                                 <Input
                                    size='large'
                                    placeholder='Tên khách hàng'
                                    suffix={<InfoCircleOutlined className='text-gray-300' />}
                                 />
                              </Form.Item>
                              <Form.Item
                                 name='phone'
                                 label={
                                    <span>
                                       Số điện thoại <span className='text-[#ef5222]'>(*)</span>
                                    </span>
                                 }
                                 required={true}
                                 rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại" },
                                    {
                                       pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
                                       message: "Số điện thoại không hợp lệ (VD: 0912345678)",
                                    },
                                 ]}>
                                 <Input
                                    size='large'
                                    placeholder='Số điện thoại'
                                    suffix={<InfoCircleOutlined className='text-gray-300' />}
                                 />
                              </Form.Item>
                              <Form.Item
                                 name='email'
                                 label={<span>Email</span>}
                                 required={true}
                                 rules={[
                                    { required: true, message: "Vui lòng nhập email" },
                                    {
                                       type: "email",
                                       message: "Email không đúng định dạng",
                                    },
                                 ]}>
                                 <Input
                                    size='large'
                                    placeholder='Email'
                                    suffix={<InfoCircleOutlined className='text-gray-300' />}
                                 />
                              </Form.Item>
                              <Form.Item
                                 wrapperCol={{ offset: 1, span: 24 }}
                                 name='acceptTerms'
                                 valuePropName='checked'
                                 validateTrigger={['onChange']} // Thêm validateTrigger
                                 rules={[
                                    {
                                       required: true,
                                       message: "Bạn phải chấp nhận điều khoản và chính sách bảo mật của FUTA Bus Lines",
                                       validator: (_, value) => {
                                          if (value) {
                                             return Promise.resolve();
                                          }
                                          return Promise.reject('Bạn phải chấp nhận điều khoản và chính sách bảo mật của FUTA Bus Lines');
                                       },
                                       trigger: 'onChange' // Thêm trigger
                                    },
                                 ]}>
                                 <Checkbox
                                 >
                                    <span className='text-sm'>
                                       <span className='text-red-500 mr-1'>Chấp nhận</span>
                                       <span className='cursor-pointer text-[#ef5222] hover:underline'>điều khoản</span>
                                       <span> đặt vé & </span>
                                       <span className='cursor-pointer text-[#ef5222] hover:underline'>
                                          chính sách bảo mật
                                       </span>
                                       <span> thông tin của FUTA Bus Lines</span>
                                    </span>
                                 </Checkbox>
                              </Form.Item>
                           </Form>
                        </Col>
                        <Col span={10}>
                           <div>
                              <h3 className='text-red-500 mb-4 text-lg font-bold'>ĐIỀU KHOẢN & LƯU Ý</h3>
                              <div className='space-y-4 text-justify text-sm'>
                                 <p>
                                    <span className='font-bold text-[#ef5222]'>(*)</span> Quý khách vui lòng có mặt tại
                                    bến xuất phát của xe trước ít nhất 30 phút giờ xe khởi hành, mang theo thông báo đã
                                    thanh toán vé thành công có chứa mã vé được gửi từ hệ thống FUTA BUS LINES. Vui lòng
                                    liên hệ Trung tâm tổng đài{" "}
                                    <span className='font-bold text-[#ef5222]'>1900 6067</span> để được hỗ trợ.
                                 </p>
                                 <p>
                                    <span className='font-bold text-[#ef5222]'>(*)</span> Nếu quý khách có nhu cầu trung
                                    chuyển, vui lòng liên hệ Tổng đài trung chuyển{" "}
                                    <span className='font-bold text-[#ef5222]'>1900 6918</span> trước khi đặt vé. Chúng
                                    tôi không đón/trung chuyển tại những điểm xe trung chuyển không thể tới được.
                                 </p>
                              </div>
                           </div>
                        </Col>
                     </Row>
                  </Card>
                  <Card
                     title={
                        <div className='flex items-center gap-2 text-[700]'>
                           <span style={{ color: "#ef5222", fontWeight: "700" }}>Thông tin đón trả</span>
                           <InfoCircleOutlined className='text-[#ef5222]' />
                        </div>
                     }>
                     <Row gutter={24} style={{ alignItems: "flex-start", padding: "0px" }}>
                        <Col span={12}>
                           <div className='mb-4'>
                              <div className='mb-2 font-bold'>ĐIỂM ĐÓN</div>
                              <div className='space-y-2'>
                                 <div className='flex items-center gap-2'>
                                    <Radio.Group
                                       value={pickupType}
                                       onChange={handlePickupTypeChange}
                                       className='flex gap-4'>
                                       <Radio size='large' value='pickup'>
                                          <span className='text-orange-500'>Điểm đón</span>
                                       </Radio>
                                       {tripInfo?.trip_shuttle_enable === 1 && (
                                          <Radio size='large' value='shuttle'>
                                             Trung chuyển
                                          </Radio>
                                       )}
                                    </Radio.Group>
                                    <Tooltip title='Thông tin điểm đón'>
                                       <InfoCircleOutlined className='text-[#ef5222]' style={{ fontSize: "20px" }} />
                                    </Tooltip>
                                 </div>
                                 {pickupType === "shuttle" ? (
                                    <Input
                                       size='large'
                                       placeholder='Nhập địa chỉ trung chuyển'
                                       className='w-full'
                                       value={selectedPickup}
                                       onChange={(e) => setSelectedPickup(e.target.value)}
                                       suffix={
                                          <Tooltip title='Nhập địa chỉ bạn muốn được trung chuyển đến'>
                                             <InfoCircleOutlined
                                                className='text-[#ef5222]'
                                                style={{ fontSize: "20px" }}
                                             />
                                          </Tooltip>
                                       }
                                    />
                                 ) : (
                                    <Select
                                       size='large'
                                       showSearch
                                       placeholder='Chọn điểm đón'
                                       className='w-full'
                                       value={selectedPickup}
                                       onChange={(value) => setSelectedPickup(value)}
                                       optionFilterProp='children'
                                       filterOption={(input, option) =>
                                          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                       }
                                       options={pickupPoints.map((point) => ({
                                          value: point.office?.id,
                                          label: formatPointLabel(point.office),
                                       }))}
                                       suffixIcon={
                                          <Tooltip title='Thông tin điểm đón'>
                                             <InfoCircleOutlined
                                                className='text-[#ef5222]'
                                                style={{ fontSize: "20px" }}
                                             />
                                          </Tooltip>
                                       }
                                    />
                                 )}
                              </div>
                              <div className='mt-2 text-justify text-sm'>
                                 Quý khách vui lòng có mặt tại Bến xe/Văn Phòng/Điểm trung chuyển
                                 <br />
                                 <span className='text-[15px] font-bold text-[#00613D]'>
                                    {pickupPoints.find((point) => point?.office?.id === selectedPickup)?.office?.name}
                                 </span>{" "}
                                 <span className='text-[16px] font-bold text-[#ef5222]'>
                                    Trước {getArrivalTime(tripInfo?.trip_departure_time)}{" "}
                                    {formatDate(tripInfo?.trip_date)}
                                 </span>
                                 <br />
                                 để được trung chuyển hoặc kiểm tra thông tin trước khi lên xe.
                              </div>
                           </div>
                        </Col>
                        <Col span={12}>
                           <div className='mb-4'>
                              <div className='mb-2 font-bold'>ĐIỂM TRẢ</div>
                              <div className='space-y-2'>
                                 <div className='flex items-center gap-2'>
                                    <Radio.Group
                                       value={dropoffType}
                                       onChange={handleDropoffTypeChange}
                                       className='flex gap-4'>
                                       <Radio size='large' value='dropoff'>
                                          <span className='text-orange-500'>Điểm trả</span>
                                       </Radio>
                                       {tripInfo?.trip_shuttle_enable === 1 && (
                                          <Radio size='large' value='shuttle'>
                                             Trung chuyển
                                          </Radio>
                                       )}
                                    </Radio.Group>
                                    <Tooltip title='Thông tin điểm trả'>
                                       <InfoCircleOutlined className='text-[#ef5222]' style={{ fontSize: "20px" }} />
                                    </Tooltip>
                                 </div>
                                 {dropoffType === "shuttle" ? (
                                    <Input
                                       size='large'
                                       placeholder='Nhập địa chỉ trung chuyển'
                                       className='w-full'
                                       value={selectedDropoff}
                                       onChange={(e) => setSelectedDropoff(e.target.value)}
                                       suffix={
                                          <Tooltip title='Nhập địa chỉ bạn muốn được trung chuyển đến'>
                                             <InfoCircleOutlined
                                                className='text-[#ef5222]'
                                                style={{ fontSize: "20px" }}
                                             />
                                          </Tooltip>
                                       }
                                    />
                                 ) : (
                                    <Select
                                       size='large'
                                       showSearch
                                       placeholder='Chọn điểm trả'
                                       className='w-full'
                                       value={selectedDropoff}
                                       onChange={(value) => setSelectedDropoff(value)}
                                       optionFilterProp='children'
                                       filterOption={(input, option) =>
                                          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                       }
                                       options={dropoffPoints.map((point) => ({
                                          value: point.office.id,
                                          label: formatPointLabel(point.office),
                                       }))}
                                       suffixIcon={
                                          <Tooltip title='Thông tin điểm trả'>
                                             <InfoCircleOutlined
                                                className='text-[#ef5222]'
                                                style={{ fontSize: "20px" }}
                                             />
                                          </Tooltip>
                                       }
                                    />
                                 )}
                              </div>
                           </div>
                        </Col>
                     </Row>
                  </Card>
               </Col>
               <Col
                  span={8}
                  style={{ padding: "0px 0px 0px 5px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Card title='Thông tin lượt đi'>
                     <div className='space-y-4'>
                        <div className='flex justify-between'>
                           <span>Tuyến xe:</span>
                           <span className='font-[700]'>
                              {formatProvinceName(tripInfo?.origin_province)} -{" "}
                              {formatProvinceName(tripInfo?.destination_province)}
                           </span>
                        </div>
                        <div className='flex justify-between'>
                           <span>Thời gian xuất bến:</span>
                           <span className='font-[700] text-[#ef5222]'>
                              {formatTime(tripInfo?.trip_departure_time)} {formatDate(tripInfo?.trip_date)}
                           </span>
                        </div>
                        <div className='flex justify-between'>
                           <span>Số lượng ghế:</span>
                           <span className='font-[700]'>{selectedSeats.length} ghế</span>
                        </div>
                        <div className='flex justify-between'>
                           <span>Số ghế:</span>
                           <span className='font-[700]'>
                              {selectedSeats.length > 0 &&
                                 selectedSeats?.map((seat, index) => {
                                    return index === selectedSeats.length - 1
                                       ? seat?.seat_name
                                       : seat?.seat_name + ", ";
                                 })}
                           </span>
                        </div>
                        <Divider />
                        <div className='flex justify-between font-bold'>
                           <span>Tổng tiền lượt đi:</span>
                           <span className='font-[700] text-[#00613D]'>
                              {formatCurrency(
                                 selectedSeats.length *
                                 (tripInfo?.trip_discount > 0
                                    ? tripInfo?.trip_price - tripInfo?.trip_price * tripInfo?.trip_discount / 100
                                    : tripInfo?.trip_price)
                              )}
                           </span>
                        </div>
                     </div>
                  </Card>
                  <Card
                     title='Chi tiết giá'
                     className='mt-4'
                     styles={{
                        footer: {
                           padding: "16px 24px",
                           borderTop: "1px solid #f0f0f0",
                        },
                     }}>
                     <div className='space-y-2'>
                        <div className='flex justify-between'>
                           <span>Giá vé lượt đi:</span>
                           <span className='font-[700] text-[#00613D]'>
                              {formatCurrency(
                                 selectedSeats.length *
                                 (tripInfo?.trip_discount > 0
                                    ? tripInfo?.trip_price - tripInfo?.trip_price * tripInfo?.trip_discount / 100
                                    : tripInfo?.trip_price)
                              )}
                           </span>
                        </div>
                        <div className='flex justify-between'>
                           <span>Phí thanh toán (nếu có):</span>
                           <span className='font-[700]'>0đ</span>
                        </div>
                        <div className='flex justify-between text-lg font-bold'>
                           <span className='font-bold text-[#ef5222]'>Tổng tiền thanh toán:</span>
                           <span className='font-bold text-[#ef5222]'>
                              {formatCurrency(
                                 selectedSeats.length *
                                 (tripInfo?.trip_discount > 0
                                    ? tripInfo?.trip_price - tripInfo?.trip_price * tripInfo?.trip_discount / 100
                                    : tripInfo?.trip_price)
                              )}
                           </span>
                        </div>
                     </div>
                  </Card>
                  <div className='mt-4 flex justify-end space-x-4'>
                     <Button
                        onClick={onBack}
                        size='large'
                        className='hover:bg-gray-50 flex items-center gap-2 border-none'
                        style={{
                           padding: "8px 16px",
                           borderRadius: "8px",
                           color: "#ef5222",
                           fontWeight: "600",
                        }}>
                        <ArrowLeftOutlined className='text-lg' />
                        <span>Quay lại</span>
                     </Button>
                     <Button size='large' type='primary' onClick={handlePayment}>
                        Thanh toán
                     </Button>
                  </div>
               </Col>
            </Row>
         </div>
         <Modal
            title='Thông báo'
            open={isWarningModalOpen}
            onOk={() => setIsWarningModalOpen(false)}
            onCancel={() => setIsWarningModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{
               className: "bg-orange-500",
               style: { backgroundColor: "#ef5222", color: "#fff" },
            }}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#ff9800]'>
                  <WarningOutlined className='text-[#ff9800]' style={{ fontSize: "48px" }} />
               </div>
               <h3 className='text-lg font-semibold'>{warningMessage}</h3>
            </div>
         </Modal>
         <Modal
            title='Xác nhận thông tin đặt vé'
            open={isConfirmModalOpen}
            onOk={async () => {
               const bookingSession = generateBookingSession();
               const paymentDataWithSession = {
                  ...paymentData,
                  booking_session: bookingSession,
               };
               localStorage.setItem("booking_session", bookingSession);
               localStorage.setItem("payment_data", JSON.stringify(paymentDataWithSession));
               try {
                  const response = await OrderApi.create(paymentDataWithSession);
                  if (
                     response.status === 201 &&
                     response?.metadata?.data?.booking_code &&
                     response?.metadata?.data?.phone
                  ) {
                     setIsConfirmModalOpen(false);
                     navigate(
                        `/thanh-toan?bookingCode=${response?.metadata?.data?.booking_code}&phone=${response?.metadata?.data?.phone}`
                     );
                  }
               } catch (error) {
                  setWarningMessage(error?.message);
                  setIsWarningModalOpen(true);
               }
            }}
            onCancel={() => setIsConfirmModalOpen(false)}
            okText='Xác nhận đặt vé'
            cancelText='Hủy'
            width={600}
            okButtonProps={{
               className: "bg-orange-500",
               style: { backgroundColor: "#ef5222", color: "#fff" },
            }}>
            <div className='py-4'>
               {/* Thông tin chuyến đi */}
               <div className='border-b pb-3'>
                  <h3 className='mb-2 font-bold text-[#00613D]'>Thông tin chuyến đi:</h3>
                  <div className='grid grid-cols-2 gap-2'>
                     <div>
                        Tuyến xe:{" "}
                        <span className='font-semibold'>
                           {tripInfo?.origin_office} - {tripInfo?.destination_office}
                        </span>
                     </div>
                     <div>
                        Thời gian:{" "}
                        <span className='font-semibold'>
                           {formatTime(tripInfo?.trip_departure_time)} {formatDate(tripInfo?.trip_date)}
                        </span>
                     </div>
                     <div>
                        Số ghế:{" "}
                        <span className='font-semibold text-[#ef5222]'>
                           {selectedSeats.map((seat) => seat.seat_name).join(", ")}
                        </span>
                     </div>
                     <div>
                        Tổng tiền:{" "}
                        <span className='font-semibold text-[#ef5222]'>
                           {formatCurrency(paymentData?.total_amount)}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Thông tin khách hàng */}
               <div className='mt-4 border-b pb-3'>
                  <h3 className='mb-2 font-bold text-[#00613D]'>Thông tin khách hàng:</h3>
                  <div className='grid grid-cols-2 gap-2'>
                     <div>
                        Họ tên: <span className='font-semibold'>{paymentData?.customer_info?.name}</span>
                     </div>
                     <div>
                        Số điện thoại: <span className='font-semibold'>{paymentData?.customer_info?.phone}</span>
                     </div>
                     <div>
                        Email: <span className='font-semibold'>{paymentData?.customer_info?.email}</span>
                     </div>
                  </div>
               </div>

               {/* Thông tin đón trả */}
               <div className='mt-4'>
                  <h3 className='mb-2 font-bold text-[#00613D]'>Thông tin đón trả:</h3>
                  <div className='grid grid-cols-2 gap-2'>
                     <div>
                        <span className='font-semibold'>Điểm đón: </span>
                        {paymentData?.pickup_info?.type === "pickup" ? (
                           <span>
                              {
                                 pickupPoints.find((point) => point.office.id === paymentData?.pickup_info?.location)
                                    ?.office?.name
                              }{" "}
                              (Văn phòng/Bến xe)
                           </span>
                        ) : (
                           <span className='text-[#ef5222]'>{paymentData?.pickup_info?.location} (Trung chuyển)</span>
                        )}
                     </div>
                     <div>
                        <span className='font-semibold'>Điểm trả: </span>
                        {paymentData?.dropoff_info?.type === "dropoff" ? (
                           <span>
                              {
                                 dropoffPoints.find((point) => point.office.id === paymentData?.dropoff_info?.location)
                                    ?.office?.name
                              }{" "}
                              (Văn phòng/Bến xe)
                           </span>
                        ) : (
                           <span className='text-[#ef5222]'>{paymentData?.dropoff_info?.location} (Trung chuyển)</span>
                        )}
                     </div>
                  </div>
               </div>

               {/* Lưu ý */}
               <div className='text-gray-500 mt-4 text-sm'>
                  <p className='flex items-center gap-2'>
                     <InfoCircleOutlined className='text-[#ef5222]' />
                     Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đặt vé
                  </p>
               </div>
            </div>
         </Modal>
      </>
   );
};

export default BookingDetail;
