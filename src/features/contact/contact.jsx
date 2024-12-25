import React, {useState} from "react";
import {
   Form,
   Input,
   Button,
   Select,
   Row,
   Col,
   Typography,
   DatePicker,
   Segmented,
   InputNumber,
   Mentions,
   Cascader,
   message,
   Modal,
   Spin,
} from "antd";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import "./styles/styles.scss";
import ContactApi from "../../api/contactApi";
import {WarningOutlined} from "@ant-design/icons";

const {Title} = Typography;
const {Paragraph} = Typography;
const variant = "filled";

const ContactForm = () => {
   const [form] = Form.useForm();
   const userInfo = useSelector((state) => state.auth.userInfo);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalMessage, setModalMessage] = useState("");
   const [modalType, setModalType] = useState("success"); // 'success' hoặc 'warning'
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (values) => {
      setLoading(true);
      try {
         await ContactApi.createContact(values)
            .then((res) => {
               if (res?.status === 201) {
                  setModalType("success");
                  setModalMessage(
                     <div className='text-center'>
                        <h3 className='mb-4 text-2xl font-bold text-[#EF5222]'>Gửi thông tin liên hệ thành công!</h3>
                        <div className='text-gray-700 space-y-2 text-start'>
                           <p>Chúng tôi đã nhận được thông tin của bạn.</p>
                           <p>Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất!</p>
                           <p>Cảm ơn bạn đã quan tâm đến dịch vụ của chúng tôi.</p>
                           <p className='mt-4 font-bold text-[#EF5222]'>FUTA BUS LINES</p>
                        </div>
                     </div>
                  );
                  setIsModalOpen(true);
                  form.resetFields();
               }
            })
            .catch((error) => {
               setModalType("warning");
               setModalMessage("Có lỗi xảy ra. Vui lòng thử lại sau!");
               setIsModalOpen(true);
            })
            .finally(() => {
               setLoading(false);
            });
      } catch (error) {
         setModalType("warning");
         setModalMessage("Có lỗi xảy ra. Vui lòng thử lại sau!");
         setIsModalOpen(true);
         setLoading(false);
      }
   };

   useEffect(() => {
      form.setFieldValue("name", userInfo?.fullName);
      form.setFieldValue("phone", userInfo?.phone);
      form.setFieldValue("email", userInfo?.email);
      form.setFieldValue("title", "");
      form.setFieldValue("notes", "");
   }, [userInfo, form]);

   return (
      <>
         <Spin size='large' spinning={loading} tip='Đang gửi thông tin liên hệ ...' style={{zIndex: 100000}}>
            <div className='layout contact flex flex-nowrap items-start justify-center  py-10 xl:px-0'>
               <Row
                  gutter={24}
                  style={{
                     padding: "0",
                     margin: "0",
                     alignItems: "flex-start",
                     justifyContent: "center",
                     width: "100%",
                  }}>
                  <Col span={8} className='h-[100%]' style={{paddingTop: "28px"}}>
                     <div style={{textAlign: "left"}}>
                        <div className='pl-4 text-[30px] font-bold uppercase sm:pl-0 '>Contact Us</div>
                        <Title level={5} style={{marginBottom: "24px"}}>
                           FUTA BUS LINES - PHUONG TRANG INC
                        </Title>
                        <Paragraph>
                           <strong>Address:</strong> 01 To Hien Thanh Street, Ward 3, Da Lat City, Lam Dong Province,
                           Vietnam.
                        </Paragraph>
                        <Paragraph>
                           <strong>Website:</strong>{" "}
                           <a href='https://futabus.vn/' target='_blank' rel='noopener noreferrer'>
                              https://futabus.vn/
                           </a>
                        </Paragraph>
                        <Paragraph>
                           <strong>Phone:</strong> 02838386852
                        </Paragraph>
                        <Paragraph>
                           <strong>Fax:</strong> 02838386853
                        </Paragraph>
                        <Paragraph>
                           <strong>Email:</strong> <a href='mailto:hotro@futa.vn'>hotro@futa.vn</a>
                        </Paragraph>
                        <Paragraph>
                           <strong>Hotline:</strong> 19006067
                        </Paragraph>
                     </div>
                  </Col>
                  <Col span={16} className='flex h-[100%] justify-center'>
                     <div className='bg-white flex h-20 items-center gap-4 rounded-t-[10px] text-[30px] text-xl font-semibold text-[#EF5222]'>
                        <img src='https://futabus.vn/images/icons/mail_send.svg' alt='' />
                        Send contact information to us
                     </div>
                     <Form
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        form={form}
                        variant={"filled"}
                        style={{
                           maxWidth: "100%",
                        }}
                        onFinish={handleSubmit}>
                        <Form.Item
                           label='FUTA BUS LINES'
                           name='busLine'
                           initialValue='1'
                           rules={[{required: true, message: "Vui lòng chọn đơn vị cần liên hệ!"}]}>
                           <Select size='large' placeholder='Chọn đơn vị cần liên hệ' defaultValue='1'>
                              <Select.Option value='1'>Tuyến xe FUTA Bus Lines</Select.Option>
                              <Select.Option value='2'>Vận chuyển FUTA Bus Express</Select.Option>
                           </Select>
                        </Form.Item>
                        <Form.Item
                           label='Name'
                           name='name'
                           required
                           tooltip='Nhập họ tên'
                           rules={[{required: true, message: "Vui lòng nhập họ tên!"}]}>
                           <Input size='large' placeholder='Họ tên' />
                        </Form.Item>
                        <Form.Item
                           label='Phone'
                           name='phone'
                           required
                           tooltip='Nhập số điện thoại liên hệ'
                           rules={[{required: true, message: "Vui lòng nhập số điện thoại!"}]}>
                           <Input placeholder='Số điện thoại' />
                        </Form.Item>
                        <Form.Item
                           label='Email'
                           name='email'
                           required
                           tooltip='Email liên hệ'
                           rules={[
                              {required: true, message: "Vui lòng nhập email!"},
                              {type: "email", message: "Vui lòng nhập đúng định dạng email!"},
                           ]}>
                           <Input size='large' placeholder='Email' />
                        </Form.Item>
                        <Form.Item
                           label='Tiêu đề'
                           name='title'
                           required
                           tooltip='Nhập tiêu đề'
                           rules={[{required: true, message: "Vui lòng nhập tiêu đề!"}]}>
                           <Input size='large' placeholder='Nhập tiêu đề' />
                        </Form.Item>
                        <Form.Item
                           label='Nội dung'
                           name='notes'
                           required
                           tooltip='Nhập nội dung'
                           rules={[{required: true, message: "Vui lòng nhập nội dung!"}]}>
                           <Input.TextArea size='large' rows={4} placeholder='Nhập nội dung' />
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 8, span: 16}}>
                           <Button type='primary' size='large' htmlType='submit' block className='mt-6'>
                              Send
                           </Button>
                        </Form.Item>
                     </Form>
                  </Col>
               </Row>
            </div>
         </Spin>
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
               <div className='flex items-start justify-center'>
                  <img
                     src='https://res.cloudinary.com/dkhkjaual/image/upload/v1733254548/android-icon-144x144_ob9ww9.png'
                     alt=''
                     className='mr-4 h-[100px] w-[100px]'
                  />
                  <div className='text-lg font-semibold'>{modalMessage}</div>
               </div>
            ) : (
               <div className='text-red-500 flex items-center justify-center'>
                  <WarningOutlined className='mr-2' />
                  <div className='text-lg font-semibold'>{modalMessage}</div>
               </div>
            )}
         </Modal>
      </>
   );
};

export default ContactForm;
