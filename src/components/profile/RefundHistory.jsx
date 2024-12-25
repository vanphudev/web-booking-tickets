   import  {useState, useEffect} from "react";
import {Table, Select, Button, Space, Tag, message, Spin} from "antd";
import {CopyOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import SearchTicketsApi from "../../api/searchTickets";

const RefundHistory = () => {
   const userInfo = useSelector((state) => state.auth.userInfo);

   const [tickets, setTickets] = useState([]);
   const [isLoading, setLoading] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const res = await SearchTicketsApi.getCustomerTicketsRefund({phone: userInfo?.phone || ""});
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
                     amount: item?.ticket_info?.ticket_amount,
                     status: item?.booking_info?.booking_status,
                     refundDate: item?.refund_info?.refunded_at,
                     refundStatus: item?.refund_info?.is_refunded, 
                     refundAmount: item?.refund_info?.refund_amount, 
                     refundDescription: item?.refund_info?.refund_description, 
                     refundApproved: item?.refund_info?.is_approved, 
                     refund_percentage: item?.refund_info?.refund_percentage,
                     booking_total_payment: item?.booking_info?.booking_total_payment,
                     booking_number_of_ticket: item?.booking_info?.booking_number_of_ticket,
                     refundAmountPerTicket: item?.booking_info?.booking_total_payment / item?.booking_info?.booking_number_of_ticket,
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
      pending: "pending", // Đang chờ xử lý
      confirmed: "confirmed", // Đã xử lý
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
         title: "Ngày yêu cầu hủy vé",
         dataIndex: "refundDate",
         key: "refundDate",
         width: 200,
         render: (refundDate) => {
            const date = new Date(refundDate);
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
         title: "Số ghế",
         width: 100,
         dataIndex: "seatNumber",
         key: "seatNumber",
      },
      {
         title: "Trạng thái hoàn tiền",
         dataIndex: "refundStatus",
         key: "refundStatus",
         width: 100,
         render: (refundStatus) => {
            let mappedStatus;
            let color;
            switch (refundStatus) {
               case 0:
                  mappedStatus = "Chưa hoàn tiền";
                  break;
               case 1:
                  mappedStatus = "Đã hoàn tiền";
                  break;
               default:
                  mappedStatus = refundStatus;
            }

            color = {
               "Chưa hoàn tiền": "warning",
               "Đã hoàn tiền": "success",
            }[mappedStatus];
            return <Tag color={color}>{statusMap[mappedStatus] || mappedStatus}</Tag>;
         },
      },
      {
         title: "Trạng thái xác nhận hoàn tiền",
         dataIndex: "refundApproved",
         key: "refundApproved",
         width: 100,
         render: (refundApproved) => {
            let mappedStatus;
            let color;
            switch (refundApproved) {
               case 0:
                  mappedStatus = "Chưa xác nhận";
                  break;
               case 1:
                  mappedStatus = "Đã xác nhận";
                  break;
               default:
                  mappedStatus = refundApproved;
            }

            color = {
               "Chưa xác nhận": "warning",
               "Đã xác nhận": "success",
            }[mappedStatus];
            return <Tag color={color}>{statusMap[mappedStatus] || mappedStatus}</Tag>;
         },
      },
      {
         title: "Tổng tiền thanh toán hóa đơn",
         dataIndex: "booking_total_payment",
         key: "booking_total_payment",
         width: 100,
         render: (booking_total_payment) => {
            return `${booking_total_payment} VNĐ`;
         },
      },
      {
         title: "Tổng số vé/hóa đơn",
         dataIndex: "booking_number_of_ticket",
         key: "booking_number_of_ticket",
         width: 100,
         render: (booking_number_of_ticket) => {
            return `${booking_number_of_ticket}`;
         },
      },
      {
         title: "Gía trị hoàn tiền vé/hóa đơn",
         dataIndex: "refundAmountPerTicket",
         key: "refundAmountPerTicket",
         width: 100,
         render: (refundAmountPerTicket) => {
            return `${Math.round(refundAmountPerTicket).toLocaleString()} VNĐ`;
         },
      },
      {
         title: "Số tiền được phép hoàn",
         dataIndex: "refundAmount",
         key: "refundAmount",
         width: 100,
         render: (refundAmount) => {
            return `${refundAmount} VNĐ`;
         },
      },
      {
         title: "Lý do hoàn tiền",
         dataIndex: "refundDescription",
         key: "refundDescription",
         width: 200,
      },
      {
         // tỉ lệ hoàn tiền
         title: "Tỉ lệ hoàn tiền",
         dataIndex: "refund_percentage",
         key: "refund_percentage",
         width: 100,
         render: (refund_percentage) => {
            return `${refund_percentage}%`;
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
   ];

   const handleSearch = () => {
      const filtered = tickets.filter((item) => {
         const matchStatus = searchParams.status ? item.status === statusMap[searchParams.status] : true;
         return matchStatus;
      });

      setFilteredData(filtered);
      message.success("Đã cập nhật kết quả tìm kiếm");
   };

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
               <h2 className='mb-2 text-2xl font-semibold'>Lịch sử yêu cầu hủy vé</h2>
               <p className='text-gray-500'>Theo dõi lịch sử yêu cầu hủy vé của bạn</p>
            </div>
         </div>
         {/* <div className='bg-white mb-6 rounded-lg '>
            <Space wrap className='w-full gap-4 '>
               <Select
                  size='large'
                  placeholder='Trạng thái'
                  style={{width: 200}}
                  onChange={(value) => setSearchParams({...searchParams, status: value})}
                  options={[
                     {value: "pending", label: "Chờ xác nhận hủy vé"},
                     {value: "confirmed", label: "Đã xác nhận hủy vé"},
                  ]}
               />
               <Button size='large' type='primary' onClick={handleSearch} className='bg-blue-500'>
                  Tìm kiếm
               </Button>
            </Space>
         </div> */}
         <Table
            columns={columns}
            dataSource={filteredData}
            scroll={{x: 1300}}
            pagination={{
               total: filteredData.length,
               pageSize: 2,
               showSizeChanger: false,
               showQuickJumper: true,
               showTotal: (total) => `Tổng số: ${total}`,
            }}
            className='bg-white rounded-lg'
         />
      </div>
   );
};

export default RefundHistory;
