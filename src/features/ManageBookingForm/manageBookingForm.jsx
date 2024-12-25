import React, {useState, useEffect, useCallback} from "react";
import {Form, Input, Button, Modal, Spin} from "antd";
import {PhoneOutlined, IdcardOutlined, WarningOutlined} from "@ant-design/icons";
import SearchTicketsApi from "../../api/searchTickets";
import TicketComponent from "./TicketComponent/ticketComponent";
import {useLocation} from "react-router-dom";

const ManageBookingForm = () => {
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   const ticketCode = searchParams.get("ticket_code");
   const phone = searchParams.get("phone");
   const [form] = Form.useForm();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalType, setModalType] = useState("error");
   const [modalMessage, setModalMessage] = useState("");
   const [ticketInfo, setTicketInfo] = useState(null);
   const [loading, setLoading] = useState(false);

   const onFinish = useCallback(
      async (values) => {
         if (values.ticket_code.length == "") {
            setModalType("error");
            setModalMessage("Vui lòng nhập mã vé!");
            setIsModalOpen(true);
            return;
         }
         if (values.phone.length == "") {
            setModalType("error");
            setModalMessage("Vui lòng nhập số điện thoại!");
            setIsModalOpen(true);
            return;
         }
         const data = {
            ticketCode: values?.ticket_code,
            phone: values?.phone,
         };
         setLoading(true);
         try {
            setTicketInfo(null);
            await SearchTicketsApi.searchTickets(data).then((res) => {
               if (res?.status === 200) {
                  setTicketInfo(res?.metadata?.data);
                  console.log(res?.metadata?.data);
               }
               if (res?.metadata?.status === 404 || res?.metadata?.status === 400) {
                  setModalType("error");
                  setModalMessage(`Mã vé ${values?.ticket_code} không tồn tại !`);
                  setIsModalOpen(true);
                  return;
               }
               if (res?.metadata?.data === "") {
                  setModalType("error");
                  setModalMessage(`Mã vé ${values?.ticket_code} không tồn tại !`);
                  setIsModalOpen(true);
                  return;
               }
            });
         } catch (err) {
            setModalType("error");
            setModalMessage(`Mã vé ${values?.ticket_code} không tồn tại !`);
            setIsModalOpen(true);
            return;
         } finally {
            setLoading(false);
         }
      },
      [setIsModalOpen, setTicketInfo, setLoading]
   );

   useEffect(() => {
      if (ticketCode && phone) {
         form.setFieldsValue({ticket_code: ticketCode, phone: phone});
         onFinish({ticket_code: ticketCode, phone: phone});
      }
   }, [ticketCode, phone, form, onFinish]);

   return (
      <>
         <div
            style={{padding: "20px"}}
            className='layout flex flex-col items-center justify-center gap-10 px-4 py-10 xl:px-0'>
            <h2 className='uppercase' style={{color: "#00613D", fontSize: "40px", fontWeight: "bold"}}>
               TRA CỨU THÔNG TIN ĐẶT VÉ
            </h2>
            <Form
               name='manage_booking'
               layout='horizontal'
               form={form}
               onFinish={onFinish}
               style={{width: "60%", gap: "18px", display: "flex", flexDirection: "column"}}>
               <Form.Item
                  style={{width: "100%"}}
                  name='phone'
                  rules={[
                     {required: true, message: "Vui lòng nhập số điện thoại!"},
                     {pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số."},
                  ]}>
                  <Input
                     size='large'
                     placeholder='Nhập số điện thoại mà bạn đã đặt vé.'
                     prefix={<PhoneOutlined className='text-gray-400' />}
                  />
               </Form.Item>
               <Form.Item name='ticket_code' rules={[{required: true, message: "Vui lòng nhập mã vé!"}]}>
                  <Input
                     size='large'
                     placeholder='Nhập mã vé (VD: HFYDHA272)'
                     prefix={<IdcardOutlined className='text-gray-400' />}
                  />
               </Form.Item>
               <Form.Item>
                  <Button
                     type='primary'
                     htmlType='submit'
                     size='large'
                     loading={loading}
                     className='mt-2'
                     style={{
                        backgroundColor: "rgb(255, 240, 230)",
                        color: "rgb(241, 90, 36)",
                        border: "none",
                        width: "100%",
                     }}>
                     Search
                  </Button>
               </Form.Item>
            </Form>
         </div>
         <div className='layout flex justify-center' style={{margin: "0 auto"}}>
            <div className='flex justify-center' style={{maxWidth: "350px"}}>
               {loading ? (
                  <Spin size='large' tip='Đang tải thông tin vé...' />
               ) : (
                  ticketInfo && <TicketComponent bookingInfo={ticketInfo} ticket={ticketInfo?.ticket_info} />
               )}
            </div>
         </div>
         <Modal
            centered
            title='Thông báo'
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{
               style: {
                  display: "none",
               },
            }}>
            {modalType === "success" ? (
               <div className='items- flex    justify-center'>
                  <img
                     src='https://res.cloudinary.com/dkhkjaual/image/upload/v1733254548/android-icon-144x144_ob9ww9.png'
                     alt=''
                     className='mr-4 h-[100px] w-[100px]'
                  />
                  <div className='text-lg font-semibold'>{modalMessage}</div>
               </div>
            ) : (
               <div className='text-red-500 flex items-center justify-center'>
                  <img
                     src='https://res.cloudinary.com/dkhkjaual/image/upload/v1733254548/android-icon-144x144_ob9ww9.png'
                     alt=''
                     className='mr-4 h-[100px] w-[100px]'
                  />
                  <div className='text-lg font-semibold'>{modalMessage}</div>
               </div>
            )}
         </Modal>
      </>
   );
};

export default ManageBookingForm;
