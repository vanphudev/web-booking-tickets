import React, {useState, useEffect} from "react";
import {
   Table,
   Input,
   DatePicker,
   Select,
   Button,
   Space,
   Tag,
   message,
   Dropdown,
   Spin,
   Modal,
   Rate,
   Steps,
   Radio,
   Checkbox,
} from "antd";
import {
   SearchOutlined,
   CopyOutlined,
   MoreOutlined,
   CloseCircleOutlined,
   StarOutlined,
   CheckCircleOutlined,
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import SearchTicketsApi from "../../api/searchTickets";
import RefundApi from "../../api/refundApi";
import ReviewApi from "../../api/reviewApi";
import "./stylesRefund.scss";

const OrderHistory = () => {
   const userInfo = useSelector((state) => state.auth.userInfo);
   const navigate = useNavigate();

   const [tickets, setTickets] = useState([]);
   const [isLoading, setLoading] = useState(false);

   const fetchData = async () => {
      setLoading(true);
      try {
         const res = await SearchTicketsApi.searchTicketByCustomerPhone({phone: userInfo?.phone || ""});
         if (res?.status === 200) {
            let data = res?.metadata?.data?.map((item) => {
               const cleanLocationName = (name) => {
                  return name?.replace(/(văn phòng|nhà xe|bến xe)\s*/gi, "").trim();
               };

               return {
                  key: item?.ticket_info?.ticket_code,
                  ticketCode: item?.ticket_info?.ticket_code,
                  bookingCode: item?.booking_info?.booking_code,
                  seatNumber: item?.ticket_info?.seat_name,
                  route:
                     cleanLocationName(item?.trip_info?.origin?.office_name) +
                     " - " +
                     cleanLocationName(item?.trip_info?.destination?.office_name),
                  departureTime: item?.trip_info?.departure_time,
                  arrivalTime: item?.trip_info?.arrival_time,
                  amount: item?.ticket_info?.ticket_amount,
                  status: item?.booking_info?.booking_status,
                  paymentStatus: item?.booking_info?.payment_status,
                  reviewInfo: item?.review_info,
                  tripId: item?.trip_info?.trip_id,
                  bookingId: item?.booking_info?.booking_id,
                  routeId: item?.trip_info?.route_id,
               };
            });
            setTickets(data);
         }
      } catch (err) {
         console.log("Lỗi khi lấy dữ liệu vé");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const res = await SearchTicketsApi.searchTicketByCustomerPhone({phone: userInfo?.phone || ""});
            if (res?.status === 200) {
               let data = res?.metadata?.data?.map((item) => {
                  const cleanLocationName = (name) => {
                     return name?.replace(/(văn phòng|nhà xe|bến xe)\s*/gi, "").trim();
                  };

                  return {
                     key: item?.ticket_info?.ticket_code,
                     ticketCode: item?.ticket_info?.ticket_code,
                     bookingCode: item?.booking_info?.booking_code,
                     seatNumber: item?.ticket_info?.seat_name,
                     route:
                        cleanLocationName(item?.trip_info?.origin?.office_name) +
                        " - " +
                        cleanLocationName(item?.trip_info?.destination?.office_name),
                     departureTime: item?.trip_info?.departure_time,
                     arrivalTime: item?.trip_info?.arrival_time,
                     amount: item?.ticket_info?.ticket_amount,
                     status: item?.booking_info?.booking_status,
                     paymentStatus: item?.booking_info?.payment_status,
                     reviewInfo: item?.review_info,
                     tripId: item?.trip_info?.trip_id,
                     bookingId: item?.booking_info?.booking_id,
                     routeId: item?.trip_info?.route_id,
                  };
               });
               setTickets(data);
            }
         } catch (err) {
            console.log("Lỗi khi lấy dữ liệu vé");
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [userInfo]);

   const [searchParams, setSearchParams] = useState({
      ticketCode: "",
      date: null,
      route: "",
      status: "",
   });
   const [filteredData, setFilteredData] = useState([]);

   useEffect(() => {
      setFilteredData(tickets);
   }, [tickets]);

   const handleCopyTicketCode = (code) => {
      navigator.clipboard.writeText(code);
      message.success("Đã sao chép mã vé");
   };

   const statusMap = {
      cancelled: "cancelled",
      pending: "pending",
      confirmed: "confirmed",
   };

   const columns = [
      {
         title: "Mã vé",
         width: 150,
         dataIndex: "ticketCode",
         key: "ticketCode",
         render: (code) => (
            <Space>
               {code}
               <Button icon={<CopyOutlined />} size='small' onClick={() => handleCopyTicketCode(code)} />
            </Space>
         ),
      },
      {
         title: "Số ghế",
         width: 100,
         dataIndex: "seatNumber",
         key: "seatNumber",
      },
      {
         title: "Trạng thái",
         dataIndex: "status",
         key: "status",
         width: 100,
         render: (status) => {
            let mappedStatus;
            let color;
            switch (status) {
               case "Đã hủy":
                  mappedStatus = "cancelled";
                  break;
               case "Chờ thanh toán":
                  mappedStatus = "pending";
                  break;
               case "Đã xác nhận":
                  mappedStatus = "confirmed";
                  break;
               default:
                  mappedStatus = status;
            }

            color = {
               cancelled: "error",
               pending: "warning",
               confirmed: "success",
            }[mappedStatus];

            return <Tag color={color}>{statusMap[mappedStatus] || mappedStatus}</Tag>;
         },
      },
      {
         title: "Mã đặt vé",
         dataIndex: "bookingCode",
         key: "bookingCode",
         width: 120,
         render: (code) => {
            if (!code) return "";
            const prefix = code.slice(0, 4);
            const suffix = code.slice(-2);
            const stars = "*".repeat(4);
            return `${prefix}${stars}${suffix}`;
         },
      },
      {
         title: "Tuyến đường",
         dataIndex: "route",
         key: "route",
         width: 200,
      },
      {
         title: "Thời gian khởi hành",
         dataIndex: "departureTime",
         key: "departureTime",
         width: 200,
         render: (departureTime) => {
            const date = new Date(departureTime);
            const days = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
            const dayOfWeek = days[date.getDay()];
            return `${dayOfWeek}, ${date.toLocaleString("vi-VN", {
               hour: "2-digit",
               minute: "2-digit",
               day: "2-digit",
               month: "2-digit",
               year: "numeric",
            })}`;
         },
      },
      {
         title: "Số tiền",
         dataIndex: "amount",
         key: "amount",
         width: 150,
         render: (amount) => {
            return new Intl.NumberFormat("vi-VN", {
               style: "currency",
               currency: "VND",
            }).format(amount);
         },
      },
      {
         title: "Hành động",
         key: "action",
         fixed: "right",
         align: "center",
         width: 80,
         render: (_, record) => {
            // Kiểm tra thời gian hiện tại với thời gian khởi hành
            const currentTime = new Date();
            const departureTime = new Date(record.departureTime);
            const timeDiff = departureTime - currentTime;
            const hoursBeforeDeparture = timeDiff / (1000 * 60 * 60);

            // Kiểm tra điều kiện hiển thị nút hủy vé
            const canCancel =
               record.paymentStatus === "completed" && hoursBeforeDeparture >= 12 && record.status === "confirmed";

            const items = [
               {
                  key: "1",
                  label: "Hủy vé",
                  icon: <CloseCircleOutlined style={{color: "#f5222d"}} />,
                  danger: true,
                  disabled: !canCancel,
                  onClick: () => handleCancelTicket(record),
               },
               {
                  key: "2",
                  label: "Xem vé",
                  icon: <SearchOutlined style={{color: "#ff8c00"}} />,
                  onClick: () =>
                     navigate(`/booking-ticket-manager?ticket_code=${record?.ticketCode}&phone=${userInfo?.phone}`),
                  disabled: record.paymentStatus !== "completed" || record.status !== "confirmed",
               },
               {
                  key: "3",
                  label: record.reviewInfo ? "Xem đánh giá" : "Đánh giá",
                  icon: <StarOutlined style={{color: "#ff8c00"}} />,
                  onClick: () => (record.reviewInfo ? handleViewReview(record) : handleAddReview(record)),
                  disabled:
                     record.paymentStatus !== "completed" ||
                     record.status !== "confirmed" ||
                     !record.arrivalTime ||
                     new Date().getTime() <= new Date(record.arrivalTime).getTime(),
               },
            ];

            return (
               <Dropdown menu={{items}} placement='bottomRight' className='m-auto'>
                  <Button icon={<MoreOutlined />} />
               </Dropdown>
            );
         },
      },
   ];

   const handleSearch = () => {
      const filtered = tickets.filter((item) => {
         // Kiểm tra mã vé
         const matchTicketCode = searchParams.ticketCode
            ? item.ticketCode.toLowerCase().includes(searchParams.ticketCode.toLowerCase())
            : true;

         // Kiểm tra ngày (nếu có chọn ngày)
         const matchDate = searchParams.date
            ? item.departureTime.includes(searchParams.date.format("DD-MM-YYYY"))
            : true;

         // Kiểm tra tuyến đường (tìm kiếm không phân biệt hoa thường)
         const matchRoute = searchParams.route
            ? item.route.toLowerCase().includes(searchParams.route.toLowerCase())
            : true;

         // Kiểm tra trạng thái
         const matchStatus = searchParams.status ? item.status === statusMap[searchParams.status] : true;

         return matchTicketCode && matchDate && matchRoute && matchStatus;
      });

      setFilteredData(filtered);
      message.success("Đã cập nhật kết quả tìm kiếm");
   };

   const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
   const [selectedTicket, setSelectedTicket] = useState(null);
   const [reviewForm, setReviewForm] = useState({
      rating: 0,
      comment: "",
   });

   // Thêm state mới để quản lý các option được chọn
   const [selectedOptions, setSelectedOptions] = useState([]);

   // Định nghĩa các option đánh giá
   const reviewOptions = {
      service: [
         "Nhân viên phục vụ thân thiện, chu đáo",
         "Nhân viên nhiệt tình hỗ trợ khách hàng",
         "Thái độ phục vụ chưa tốt cần cải thiện",
         "Nhân viên chuyên nghiệp, đúng giờ",
         "Thủ tục đơn giản, nhanh chóng",
         "Nhân viên hướng dẫn rõ ràng, dễ hiểu",
         "Cần cải thiện thái độ phục vụ khách hàng",
         "Quy trình phục vụ chuyên nghiệp",
      ],
      vehicle: [
         "Xe sạch sẽ, thoáng mát, tiện nghi",
         "Ghế ngồi thoải mái, rộng rãi",
         "Xe chạy êm, không ồn ào",
         "Xe mới, hiện đại, an toàn",
         "Xe xuống cấp cần bảo trì",
         "Điều hòa hoạt động tốt",
         "Trang thiết bị đầy đủ, hiện đại",
         "Không gian xe rộng rãi, thoải mái",
      ],
      trip: [
         "Khởi hành đúng giờ, đúng lịch trình",
         "Đến điểm đến đúng giờ dự kiến",
         "Lái xe chuyên nghiệp, an toàn",
         "Xuất phát trễ giờ so với lịch",
         "Dừng đỗ đúng điểm, thuận tiện",
         "Lộ trình hợp lý, đúng tuyến",
         "Thời gian di chuyển phù hợp",
         "Điểm dừng chân sạch sẽ, tiện nghi",
      ],
   };

   // Hàm xử lý khi chọn option
   const handleOptionChange = (option) => {
      setSelectedOptions((prev) => {
         if (prev.includes(option)) {
            return prev.filter((item) => item !== option);
         }
         return [...prev, option];
      });
   };

   const generateReviewContent = () => {
      let content = "Nội dung đánh giá: " + reviewForm.comment;
      if (selectedOptions.length > 0) {
         content += "<br/><br/>Chi tiết đánh giá:<br/>";
         content += selectedOptions.map((option) => `- ${option}`).join("<br/>");
      }

      return content;
   };

   // Hàm xử lý hiển thị modal thêm đánh giá
   const handleAddReview = (record) => {
      setSelectedTicket(record);
      setReviewForm({
         rating: 0,
         comment: "",
      });
      setIsReviewModalVisible(true);
   };

   // Hàm xử lý hiển thị modal xem đánh giá
   const handleViewReview = (record) => {
      setSelectedTicket(record);
      setReviewForm({
         rating: record.reviewInfo.rating,
         comment: record.reviewInfo.comment,
      });
      setIsReviewModalVisible(true);
   };

   const handleSubmitReview = async () => {
      try {
         //review_rating, review_date, review_comment, route_id, customer_id, trip_id, booking_id
         const data = {
            review_rating: reviewForm.rating,
            review_date: new Date().toISOString(),
            review_comment: generateReviewContent(),
            route_id: selectedTicket?.routeId,
            customer_id: userInfo?.userId,
            trip_id: selectedTicket?.tripId,
            booking_id: selectedTicket?.bookingId,
         };
         const res = await ReviewApi.createReview(data);
         if (res) {
            message.success("Đánh giá của bạn đã được ghi nhận thành công !");
            setIsReviewModalVisible(false);
            setSelectedOptions([]);
            setReviewForm({
               rating: 0,
               comment: "",
            });
            fetchData();
         } else {
            message.error("Có lỗi xảy ra khi gửi đánh giá");
         }
      } catch (error) {
         message.error("Có lỗi xảy ra khi gửi đánh giá");
      }
   };

   // Thêm states để quản lý modal hủy vé
   const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
   const [currentStep, setCurrentStep] = useState(0);
   const [cancelReason, setCancelReason] = useState("");
   const [agreeToTerms, setAgreeToTerms] = useState(false);
   const [confirmCancel, setConfirmCancel] = useState(false);

   const cancelReasons = [
      "Thay đổi lịch trình cá nhân",
      "Đặt nhầm thông tin chuyến đi",
      "Tìm được phương tiện khác phù hợp hơn",
      "Thay đổi số lượng hành khách",
      "Vấn đề về thời gian khởi hành",
      "Hoàn cảnh tài chính thay đổi",
      "Lý do sức khỏe",
      "Lý do khác",
   ];

   // Thêm state để quản lý input lý do khác
   const [otherReason, setOtherReason] = useState("");

   // Xử lý hiển thị modal hủy vé
   const handleCancelTicket = (record) => {
      setSelectedTicket(record);
      setIsCancelModalVisible(true);
   };

   const closeCancelModal = () => {
      setIsCancelModalVisible(false);
      setSelectedTicket(null);
      setCurrentStep(0);
      setCancelReason("");
      setOtherReason("");
      setAgreeToTerms(false);
      setConfirmCancel(false);
   };

   // Xử lý next step
   const handleNextStep = () => {
      setCurrentStep(currentStep + 1);
   };

   // Xử lý previous step
   const handlePrevStep = () => {
      setCurrentStep(currentStep - 1);
   };

   // Thêm state để quản lý modal thông báo
   const [isResultModalVisible, setIsResultModalVisible] = useState(false);
   const [resultModalConfig, setResultModalConfig] = useState({
      status: "success",
      title: "",
      message: "",
   });

   // Thêm state để quản lý trạng thái loading
   const [isCancellingTicket, setIsCancellingTicket] = useState(false);

   const handleSubmitCancel = async () => {
      setIsCancellingTicket(true); // Bắt đầu loading
      try {
         const data = {
            ticket_code: selectedTicket?.ticketCode,
            customer_phone: userInfo?.phone,
            refund_description: cancelReason === "Lý do khác" ? otherReason : cancelReason,
         };
         const res = await RefundApi.refund(data);
         if (res && (res?.status === 200 || res?.status === 201)) {
            setResultModalConfig({
               status: "success",
               title: "Hủy vé thành công!",
               message: "Yêu cầu hủy vé của bạn đã được xác nhận",
            });
            setIsCancelModalVisible(false);
            setCurrentStep(0);
            setCancelReason("");
            setAgreeToTerms(false);
            setConfirmCancel(false);
            fetchData();
         } else {
            setResultModalConfig({
               status: "error",
               title: "Hủy vé thất bại! ",
               message: `Có lỗi xảy ra khi hủy vé, vui lòng thử lại sau ${res?.message}`,
            });
         }
      } catch (error) {
         console.log("Lỗi hủy vé", error);
         setResultModalConfig({
            status: "error",
            title: "Hủy vé thất bại",
            message: `Có lỗi xảy ra khi hủy vé, vui lòng thử lại sau - ERROR: ${error?.message}`,
         });
      } finally {
         setIsCancellingTicket(false); // Kết thúc loading
         setIsResultModalVisible(true);
      }
   };

   // Nội dung các steps
   const steps = [
      {
         title: "Lý do hủy",
         content: (
            <div className='mt-10 flex h-[340px]  flex-col'>
               <h3 className='mb-4 font-medium'>Vui lòng chọn lý do hủy vé:</h3>
               <div className='flex-1 overflow-auto pr-4'>
                  <Radio.Group
                     onChange={(e) => {
                        setCancelReason(e.target.value);
                        if (e.target.value !== "Lý do khác") {
                           setOtherReason("");
                        }
                     }}
                     value={cancelReason}
                     className='flex flex-col'>
                     <div className='grid grid-cols-2 gap-x-8 gap-y-6'>
                        {cancelReasons.map((reason) => (
                           <Radio key={reason} value={reason} className='text-base'>
                              {reason}
                           </Radio>
                        ))}
                     </div>
                  </Radio.Group>

                  {/* Hiển thị input khi chọn Lý do khác */}
                  {cancelReason === "Lý do khác" && (
                     <div className='ml-6 mt-4'>
                        <Input.TextArea
                           value={otherReason}
                           onChange={(e) => setOtherReason(e.target.value)}
                           placeholder='Vui lòng nhập lý do của bạn...'
                           rows={3}
                           className='text-base'
                        />
                     </div>
                  )}
               </div>
            </div>
         ),
      },
      {
         title: "Điều khoản",
         content: (
            <div className='mt-10 flex h-[340px]  flex-col'>
               <h3 className='mb-4 font-medium'>Điều khoản và điều kiện hủy vé:</h3>
               <div className='bg-gray-50 mb-4 flex-1 overflow-auto rounded-lg p-6'>
                  <ul className='list-disc space-y-3 pl-4 text-base'>
                     <li>Phí hoàn vé sẽ được tính theo quy định của nhà xe</li>
                     <li>Thời gian hoàn tiền có thể mất từ 5-7 ngày làm việc</li>
                     <li>Vé đã hủy không thể khôi phục lại</li>
                     <li>Số tiền hoàn trả sẽ được chuyển về tài khoản/phương thức thanh toán ban đầu</li>
                     <li>Quý khách vui lòng kiểm tra kỹ thông tin trước khi xác nhận hủy vé</li>
                  </ul>
               </div>
               <Checkbox
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className='text-base'>
                  Tôi đã đọc và đồng ý với các điều khoản hủy vé
               </Checkbox>
            </div>
         ),
      },
      {
         title: "Xác nhận",
         content: (
            <div className='mt-10 flex h-[340px] flex-col'>
               <h3 className='mb-4 font-medium'>Xác nhận thông tin hủy vé:</h3>
               <div className='bg-gray-50 mb-4 flex-1 rounded-lg p-6'>
                  <div className='space-y-3 text-base'>
                     <div className='grid grid-cols-3 gap-2'>
                        <span className='text-gray-500'>Mã vé:</span>
                        <span className='col-span-2 font-medium'>{selectedTicket?.ticketCode}</span>
                     </div>
                     <div className='grid grid-cols-3 gap-2'>
                        <span className='text-gray-500'>Tuyến đường:</span>
                        <span className='col-span-2 font-medium'>{selectedTicket?.route}</span>
                     </div>
                     <div className='grid grid-cols-3 gap-2'>
                        <span className='text-gray-500'>Thời gian:</span>
                        <span className='col-span-2 font-medium'>
                           {new Date(selectedTicket?.departureTime).toLocaleString("vi-VN")}
                        </span>
                     </div>
                     <div className='grid grid-cols-3 gap-2'>
                        <span className='text-gray-500'>Lý do hủy:</span>
                        <span className='col-span-2 font-medium'>
                           {cancelReason === "Lý do khác" ? otherReason : cancelReason}
                        </span>
                     </div>
                  </div>
               </div>
               <Checkbox checked={confirmCancel} onChange={(e) => setConfirmCancel(e.target.checked)}>
                  Tôi xác nhận muốn hủy vé này và đồng ý với các điều kiện hoàn tiền
               </Checkbox>
            </div>
         ),
      },
   ];

   // Điều chỉnh modal
   const cancelModal = (
      <Modal
         title={<h2 className='text-xl font-semibold'>Hủy vé</h2>}
         open={isCancelModalVisible}
         onCancel={closeCancelModal}
         footer={[
            <Button key='back' onClick={handlePrevStep} disabled={currentStep === 0} size='large'>
               Quay lại
            </Button>,
            currentStep === steps.length - 1 ? (
               <Button
                  key='submit'
                  type='primary'
                  danger
                  onClick={handleSubmitCancel}
                  disabled={!confirmCancel || isCancellingTicket}
                  loading={isCancellingTicket}
                  size='large'>
                  {isCancellingTicket ? "Đang xử lý..." : "Xác nhận hủy vé"}
               </Button>
            ) : (
               <Button
                  key='next'
                  type='primary'
                  onClick={handleNextStep}
                  disabled={
                     (currentStep === 0 && !cancelReason) ||
                     (currentStep === 0 && cancelReason === "Lý do khác" && !otherReason) ||
                     (currentStep === 1 && !agreeToTerms)
                  }
                  size='large'>
                  Tiếp tục
               </Button>
            ),
         ]}
         width={800}
         minWidth={800}
         minHeight={900}
         bodyStyle={{padding: "24px"}}
         centered>
         <Steps current={currentStep} items={steps} className='mb-16' />
         <div className='min-h-[340px]'>{steps[currentStep].content}</div>
      </Modal>
   );

   // Thêm Modal kết quả
   const ResultModal = () => (
      <Modal
         open={isResultModalVisible}
         footer={[
            <Button
               key='close'
               type={resultModalConfig.status === "success" ? "primary" : "default"}
               onClick={() => setIsResultModalVisible(false)}
               className={resultModalConfig.status === "success" ? "bg-blue-500" : ""}
               size='large'>
               Đóng
            </Button>,
         ]}
         onCancel={() => setIsResultModalVisible(false)}
         width={500}
         centered
         closable={false}>
         <div className='flex flex-col items-center py-6 text-center'>
            <div
               className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full 
               ${resultModalConfig.status === "success" ? "bg-green-50" : "bg-red-50"}`}>
               {resultModalConfig.status === "success" ? (
                  <CheckCircleOutlined className='text-green-500 text-4xl' />
               ) : (
                  <CloseCircleOutlined className='text-red-500 text-4xl' />
               )}
            </div>

            <h3
               className={`mb-4 text-xl font-medium
               ${resultModalConfig.status === "success" ? "text-green-600" : "text-red-600"}`}>
               {resultModalConfig.title}
            </h3>

            <p className='text-gray-600 mb-6'>{resultModalConfig.message}</p>

            {resultModalConfig.status === "success" && (
               <>
                  <div className='bg-gray-50 mb-4 w-full max-w-sm rounded-lg p-4'>
                     <div className='space-y-2 text-left'>
                        <p className='text-gray-600'>• Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất</p>
                        <p className='text-gray-600'>• Thông tin hoàn tiền sẽ được gửi qua email của bạn</p>
                        <p className='text-gray-600'>• Thời gian hoàn tiền: 5-7 ngày làm việc</p>
                     </div>
                  </div>

                  <div className='text-gray-500 text-sm'>
                     Mọi thắc mắc vui lòng liên hệ
                     <span className='text-blue-600 ml-1 font-medium'>1900 6060</span>
                  </div>
               </>
            )}
         </div>
      </Modal>
   );

   if (isLoading) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
               <div className='flex min-h-[200px] items-center justify-center'>
                  <Spin size='large' tip='Đang tải dữ liệu...' />
               </div>
            </div>
         </div>
      );
   }

   return (
      <div style={{margin: "0 auto", border: "none"}}>
         <div className='mb-6 flex items-center justify-between'>
            <div>
               <h2 className='mb-2 text-2xl font-semibold'>Lịch sử đặt vé</h2>
               <p className='text-gray-500'>Theo dõi và quản lý lịch sử đặt vé của bạn</p>
            </div>
            <Space>
               <Button size='large' type='default' onClick={() => navigate("/booking-ticket-manager")}>
                  Tra cứu vé
               </Button>
               <Button size='large' type='primary' className='bg-orange-500' onClick={() => navigate("/")}>
                  Đặt vé
               </Button>
            </Space>
         </div>
         {/* Form tìm kiếm */}
         <div className='bg-white mb-6 rounded-lg '>
            <Space wrap className='w-full gap-4 '>
               <Input
                  size='large'
                  placeholder='Nhập mã vé'
                  value={searchParams.ticketCode}
                  onChange={(e) => setSearchParams({...searchParams, ticketCode: e.target.value})}
                  style={{width: "200px"}}
               />
               <DatePicker
                  size='large'
                  placeholder='Chọn ngày'
                  onChange={(date) => setSearchParams({...searchParams, date})}
                  style={{width: 200}}
               />
               <Input
                  size='large'
                  placeholder='Nhập tuyến đường'
                  value={searchParams.route}
                  onChange={(e) => setSearchParams({...searchParams, route: e.target.value})}
                  style={{width: 200}}
               />
               <Select
                  size='large'
                  placeholder='Trạng thái'
                  style={{width: 200}}
                  onChange={(value) => setSearchParams({...searchParams, status: value})}
                  options={[
                     {value: "cancelled", label: "Đã hủy"},
                     {value: "pending", label: "Chờ thanh toán"},
                     {value: "confirmed", label: "Đã xác nhận"},
                  ]}
               />
               <Button size='large' type='primary' onClick={handleSearch} className='bg-blue-500'>
                  Tìm kiếm
               </Button>
            </Space>
         </div>

         {/* Bảng dữ liệu */}
         <Table
            columns={columns}
            dataSource={filteredData}
            scroll={{x: 1300}}
            pagination={{
               total: filteredData.length,
               pageSize: 4,
               showSizeChanger: false,
               showQuickJumper: true,
               showTotal: (total) => `Tổng số: ${total}`,
            }}
            className='bg-white rounded-lg'
         />

         {/* Thêm Modal đánh giá */}
         <Modal
            title={
               <div className='flex items-center gap-2'>
                  <StarOutlined className='text-yellow-400 text-xl' />
                  <span className='text-xl font-semibold'>
                     {selectedTicket?.reviewInfo ? "Chi tiết đánh giá chuyến đi" : "Đánh giá chuyến đi"}
                  </span>
               </div>
            }
            open={isReviewModalVisible}
            onCancel={() => {
               setIsReviewModalVisible(false);
               setSelectedOptions([]);
               setReviewForm({
                  rating: 0,
                  comment: "",
               });
               setCurrentStep(0);
            }}
            footer={
               selectedTicket?.reviewInfo
                  ? [
                       <Button key='close' size='large' onClick={() => setIsReviewModalVisible(false)}>
                          Đóng
                       </Button>,
                    ]
                  : [
                       <Button
                          key='back'
                          size='large'
                          onClick={() => setCurrentStep(currentStep - 1)}
                          disabled={currentStep === 0}>
                          Quay lại
                       </Button>,
                       <Button
                          key='next'
                          type='primary'
                          size='large'
                          onClick={currentStep === 1 ? handleSubmitReview : () => setCurrentStep(currentStep + 1)}
                          disabled={currentStep === 0 && selectedOptions.length === 0}
                          className='bg-blue-500'>
                          {currentStep === 1 ? "Gửi đánh giá" : "Tiếp tục"}
                       </Button>,
                    ]
            }
            width={1000}
            centered>
            {!selectedTicket?.reviewInfo && (
               <>
                  <Steps
                     current={currentStep}
                     items={[{title: "Chọn tiêu chí"}, {title: "Đánh giá chi tiết"}]}
                     className='mb-6'
                  />

                  {currentStep === 0 && (
                     <div className='space-y-6'>
                        <div className='bg-gray-50 rounded-lg p-6'>
                           <h4 className='text-blue-600 mb-4 text-lg font-medium'>Dịch vụ</h4>
                           <div className='grid grid-cols-4 gap-x-8 gap-y-4'>
                              {reviewOptions.service.map((option) => (
                                 <Checkbox
                                    key={option}
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                    className='whitespace-normal text-base'>
                                    <span className='inline-block'>{option}</span>
                                 </Checkbox>
                              ))}
                           </div>
                        </div>

                        <div className='bg-gray-50 rounded-lg p-6'>
                           <h4 className='text-blue-600 mb-4 text-lg font-medium'>Phương tiện</h4>
                           <div className='grid grid-cols-4 gap-4'>
                              {reviewOptions.vehicle.map((option) => (
                                 <Checkbox
                                    key={option}
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                    className='whitespace-normal text-base'>
                                    <span className='inline-block'>{option}</span>
                                 </Checkbox>
                              ))}
                           </div>
                        </div>

                        <div className='bg-gray-50 rounded-lg p-6'>
                           <h4 className='text-blue-600 mb-4 text-lg font-medium'>Chuyến đi</h4>
                           <div className='grid grid-cols-4 gap-4'>
                              {reviewOptions.trip.map((option) => (
                                 <Checkbox
                                    key={option}
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                    className='whitespace-normal text-base'>
                                    <span className='inline-block'>{option}</span>
                                 </Checkbox>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {currentStep === 1 && (
                     <div className='mt-5 space-y-6'>
                        <div>
                           <h3 className='mb-3 font-medium'>Đánh giá chất lượng dịch vụ:</h3>
                           <Rate
                              value={reviewForm.rating}
                              onChange={(value) => setReviewForm({...reviewForm, rating: value})}
                              className='text-2xl'
                           />
                           {!reviewForm.rating && (
                              <p className='text-red-500 mt-1 text-sm'>Vui lòng chọn số sao đánh giá</p>
                           )}
                        </div>

                        <div>
                           <h3 className='mb-3 font-medium'>Nhận xét của bạn:</h3>
                           <Input.TextArea
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                              rows={4}
                              placeholder='Hãy chia sẻ trải nghiệm của bạn về chuyến đi này...'
                              className='text-base'
                           />
                           {!reviewForm.comment && (
                              <p className='text-red-500 mt-1 text-sm'>Vui lòng nhập nhận xét của bạn</p>
                           )}
                        </div>

                        <div className='bg-gray-50 rounded-lg p-4'>
                           <h3 className='mb-3 font-medium'>Các tiêu chí đã chọn:</h3>
                           <div className='grid grid-cols-3 gap-3'>
                              {selectedOptions.map((option, index) => (
                                 <div key={index} className='flex items-start gap-2'>
                                    <CheckCircleOutlined className='text-green-500 mt-1' />
                                    <span className='text-base'>{option}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}
               </>
            )}

            {selectedTicket?.reviewInfo && (
               <div className='space-y-6'>
                  <div>
                     <h3 className='mb-3 font-medium'>Nội dung đánh giá:</h3>
                     <Rate value={selectedTicket.reviewInfo.rating} disabled className='text-2xl' />
                  </div>
                  <div>
                     <h3 className='mb-3 font-medium'>Nhận xét:</h3>
                     <p className='text-base' dangerouslySetInnerHTML={{__html: selectedTicket.reviewInfo.content}} />
                  </div>
                  <div className='text-gray-500 text-right text-sm font-bold'>
                     Đã đánh giá vào: {new Date(selectedTicket.reviewInfo.review_date).toLocaleString("vi-VN")}
                  </div>
               </div>
            )}
         </Modal>
         {cancelModal}
         <ResultModal />
      </div>
   );
};

export default OrderHistory;
