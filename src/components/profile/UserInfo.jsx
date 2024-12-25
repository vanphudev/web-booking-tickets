import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, Upload, Button, Modal, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import UserApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { StorageEnum } from "../../entity/enum";
import { getItem } from "../../utility/functionCommon/storage";
import AuthApi from "../../api/authApi";
import "./styles.scss";

const UserInfo = () => {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [formValues, setFormValues] = useState(null);
   const [errorMessage, setErrorMessage] = useState("");
   const userInfo = useSelector((state) => state.auth.userInfo);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
   const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
   const [imageUrl, setImageUrl] = useState(null);
   const accessToken = getItem(StorageEnum.UserToken);
   const userId = getItem(StorageEnum.UserInfo)?.userId || "";
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(true);

   const showConfirmModal = (values) => {
      setFormValues(values);
      setIsModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   const handleConfirm = async () => {
      try {
         setLoading(true);
         const data = {
            name: formValues.fullName,
            phone: userInfo?.phone,
            email: formValues.email,
            gender: formValues.gender,
            date_of_birth: formValues.dateOfBirth,
            avatar: form.getFieldValue("avatar"),
         };
         await UserApi.updateProfile(data)
            .then((res) => {
               if (res.status === 200 || res.status === 201) {
                  setIsSuccessModalOpen(true);
                  AuthApi.fetchMe({ customerId: userInfo?.userId });
               } else {
                  setErrorMessage(res?.message);
                  setIsErrorModalOpen(true);
               }
            })
            .catch((err) => {
               setIsErrorModalOpen(true);
            });
         setIsModalOpen(false);
      } catch (error) {
         setIsErrorModalOpen(true);
      } finally {
         setLoading(false);
      }
   };

   const onFinish = (values) => {
      const genderValueMapping = {
         male: 1,
         female: 0,
         other: -1,
      };
      const submittedValues = {
         ...values,
         gender: genderValueMapping[values.gender],
      };
      console.log("Form values:", submittedValues);
      showConfirmModal(submittedValues);
   };

   const handleUpload = async (info) => {
      if (info.file) {
         const reader = new FileReader();
         reader.onload = (e) => {
            const base64 = e.target.result;
            setImageUrl(base64);
            form.setFieldValue("avatar", base64);
         };
         reader.readAsDataURL(info.file);
      }
   };
   useEffect(() => {
      const loadUserData = async () => {
         try {
            setIsLoading(true);
            await AuthApi.fetchMe({ customerId: userId });
            form.setFieldValue("fullName", userInfo?.fullName);
            form.setFieldValue("phoneNumber", userInfo?.phone);
            form.setFieldValue("email", userInfo?.email);
            const genderMapping = {
               1: "male",
               0: "female",
               "-1": "other",
            };
            form.setFieldValue("gender", genderMapping[userInfo?.gender?.toString()]);
            form.setFieldValue("dateOfBirth", userInfo?.birthday ? dayjs(userInfo.birthday) : null);
            form.setFieldValue("avatar", userInfo?.avatar);
            setImageUrl(userInfo?.avatar);
         } catch (error) {
            message.error("Không thể tải thông tin người dùng");
         } finally {
            setIsLoading(false);
         }
      };

      loadUserData();
   }, [userId, form]);

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
      <div style={{ margin: "0 auto" }}>
         <h2 className='mb-2 text-2xl font-semibold'>Thông tin tài khoản</h2>
         <p className='text-gray-500 mb-6'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
         <div
            className='flex gap-8 p-5'
            style={{
               margin: "0 auto",
               border: "1px solid rgba(239, 82, 34, 0.6)",
               borderRadius: "16px",
            }}>
            {/* Cột trái - Phần upload ảnh */}
            <div className='w-1/3'>
               <div className='profile-container flex flex-col items-center'>
                  <Upload
                     name='avatar'
                     listType='picture-circle'
                     maxCount={1}
                     showUploadList={false}
                     className='mb-4 '
                     beforeUpload={(file) => {
                        if (file.size > 1024 * 1024) {
                           message.error("Kích thước ảnh phải nhỏ hơn 1MB!");
                           return Upload.LIST_IGNORE;
                        }
                        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
                        if (!isJpgOrPng) {
                           message.error("Chỉ chấp nhận file JPG/PNG!");
                           return Upload.LIST_IGNORE;
                        }
                        return false;
                     }}
                     onChange={(info) => handleUpload(info)}>
                     {imageUrl ? (
                        <img
                           src={imageUrl}
                           alt='avatar'
                           style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              objectFit: "cover",
                           }}
                        />
                     ) : (
                        <div>
                           <UploadOutlined />
                           <div>Chọn ảnh</div>
                        </div>
                     )}
                  </Upload>
                  <div className='text-gray-400 text-center text-sm'>
                     Dung lượng tối đa: 1MB
                     <br />
                     Định dạng: JPEG, PNG
                  </div>
               </div>
            </div>
            <div className='w-2/3' style={{ margin: "0 auto" }}>
               <Form
                  form={form}
                  layout='horizontal'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  onFinish={onFinish}
                  requiredMark={false}>
                  <Form.Item
                     label='Họ và tên'
                     name='fullName'
                     rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
                     <Input size='large' placeholder='Nhập họ và tên' />
                  </Form.Item>
                  <Form.Item
                     label='Số điện thoại'
                     name='phoneNumber'
                     rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại" },
                        { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
                     ]}>
                     <Input size='large' placeholder='Nhập số điện thoại' disabled />
                  </Form.Item>
                  <Form.Item
                     label='Giới tính'
                     name='gender'
                     rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
                     <Select size='large' placeholder='Chọn giới tính'>
                        <Select.Option value='male'>Nam</Select.Option>
                        <Select.Option value='female'>Nữ</Select.Option>
                        <Select.Option value='other'>Khác</Select.Option>
                     </Select>
                  </Form.Item>
                  <Form.Item
                     label='Email'
                     name='email'
                     rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                     ]}>
                     <Input size='large' placeholder='Nhập email' />
                  </Form.Item>
                  <Form.Item
                     label='Ngày sinh'
                     name='dateOfBirth'
                     rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}>
                     <DatePicker size='large' placeholder='Chọn ngày sinh' style={{ width: "100%" }} />
                  </Form.Item>
                  {/* <Form.Item
                     label='Địa chỉ'
                     name='address'
                     rules={[{required: true, message: "Vui lòng nhập địa chỉ"}]}>
                     <Input.TextArea size='large' placeholder='Nhập địa chỉ' />
                  </Form.Item> */}
                  <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                     <Button
                        size='large'
                        type='primary'
                        htmlType='submit'
                        className='bg-orange-500 hover:bg-orange-600 mt-5 w-full'
                        loading={loading}>
                        Cập nhật
                     </Button>
                  </Form.Item>
               </Form>
            </div>
         </div>
         <Modal
            size='large'
            title='Xác nhận cập nhật'
            open={isModalOpen}
            onOk={handleConfirm}
            onCancel={handleCancel}
            confirmLoading={loading}
            okText='Xác nhận'
            cancelText='Hủy'
            okButtonProps={{ className: "bg-orange-500" }}>
            <p>Bạn có chắc chắn muốn cập nhật thông tin?</p>
         </Modal>
         <Modal
            title='Thông báo'
            open={isSuccessModalOpen}
            onOk={() => setIsSuccessModalOpen(false)}
            onCancel={() => setIsSuccessModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ className: "bg-orange-500" }}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#00613D]'>✓</div>
               <h3 className='text-lg font-semibold'>Thành công!</h3>
               <p>Cập nhật thông tin thành công</p>
            </div>
         </Modal>
         <Modal
            title='Thông báo'
            open={isErrorModalOpen}
            onOk={() => setIsErrorModalOpen(false)}
            onCancel={() => setIsErrorModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ className: "bg-orange-500" }}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#bd0f0f]'>✕</div>
               <h3 className='text-lg font-semibold'>Lỗi!</h3>
               <p>Đã có lỗi xảy ra khi cập nhật thông tin</p>
               <p>{errorMessage}</p>
            </div>
         </Modal>
      </div>
   );
};

export default UserInfo;
