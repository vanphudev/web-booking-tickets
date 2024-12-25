import React, {useState} from "react";
import {Form, Input, Button, message, Modal} from "antd";
import {LockOutlined} from "@ant-design/icons";
import UserApi from "../../api/userApi";
import AuthApi from "../../api/authApi";
import {useSelector} from "react-redux";
const ResetPassword = () => {
   const [form] = Form.useForm();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [formValues, setFormValues] = useState(null);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
   const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
   const userInfo = useSelector((state) => state.auth.userInfo);

   const handleSubmit = (values) => {
      if (values.newPassword !== values.confirmPassword) {
         setIsErrorModalOpen(true);
         return;
      }
      setFormValues(values);
      setIsModalOpen(true);
   };

   const handleConfirm = async () => {
      try {
         setLoading(true);
         const data = {
            old_password: formValues.currentPassword,
            new_password: formValues.newPassword,
         };
         await UserApi.resetPassword(data)
            .then((res) => {
               if (res.status === 200 || res.status === 201) {
                  setIsModalOpen(false);
                  setIsSuccessModalOpen(true);
                  form.resetFields();
                  AuthApi.fetchMe({customerId: userInfo?.userId});
               } else {
                  setIsErrorModalOpen(true);
               }
            })
            .catch((error) => {
               setIsErrorModalOpen(true);
               console.log(error);
            });
      } catch (error) {
         setIsErrorModalOpen(true);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div style={{margin: "0 auto"}}>
         <h2 className='mb-2 text-2xl font-semibold'>Đặt lại mật khẩu</h2>
         <p className='text-gray-500 mb-6'>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
         <Form
            form={form}
            name='reset_password'
            onFinish={handleSubmit}
            layout='horizontal'
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Form.Item
               name='currentPassword'
               label='Mật khẩu hiện tại'
               rules={[
                  {
                     required: true,
                     message: "Vui lòng nhập mật khẩu hiện tại!",
                  },
               ]}>
               <Input.Password size='large' prefix={<LockOutlined />} placeholder='Nhập mật khẩu hiện tại' />
            </Form.Item>

            <Form.Item
               name='newPassword'
               label='Mật khẩu mới'
               rules={[
                  {
                     required: true,
                     message: "Vui lòng nhập mật khẩu mới!",
                  },
                  {
                     min: 6,
                     message: "Mật khẩu phải có ít nhất 6 ký tự!",
                  },
               ]}>
               <Input.Password size='large' prefix={<LockOutlined />} placeholder='Nhập mật khẩu mới' />
            </Form.Item>
            <Form.Item
               name='confirmPassword'
               label='Xác nhận mật khẩu mới'
               rules={[
                  {
                     required: true,
                     message: "Vui lòng xác nhận mật khẩu mới!",
                  },
                  {
                     min: 6,
                     message: "Mật khẩu phải có ít nhất 6 ký tự!",
                  },
               ]}>
               <Input.Password size='large' prefix={<LockOutlined />} placeholder='Xác nhận mật khẩu mới' />
            </Form.Item>
            <Form.Item wrapperCol={{offset: 8, span: 16}}>
               <div className='mt-10 flex gap-4'>
                  <Button size='large' onClick={() => form.resetFields()} block>
                     Hủy
                  </Button>
                  <Button size='large' type='primary' htmlType='submit' block loading={loading}>
                     Xác nhận
                  </Button>
               </div>
            </Form.Item>
         </Form>
         <Modal
            title='Xác nhận đổi mật khẩu'
            open={isModalOpen}
            onOk={handleConfirm}
            onCancel={() => setIsModalOpen(false)}
            confirmLoading={loading}
            okText='Xác nhận'
            cancelText='Hủy'>
            <p>Bạn có chắc chắn muốn đổi mật khẩu không?</p>
         </Modal>
         <Modal
            title='Thông báo'
            open={isSuccessModalOpen}
            onOk={() => setIsSuccessModalOpen(false)}
            onCancel={() => setIsSuccessModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{style: {display: "none"}}}
            okButtonProps={{className: "bg-orange-500"}}>
            <div className='py-4 text-center'>
               <div className='text-green-500 mb-2 text-2xl'>✓</div>
               <h3 className='text-lg font-semibold'>Thành công!</h3>
               <p>Đổi mật khẩu thành công</p>
            </div>
         </Modal>
         <Modal
            title='Thông báo'
            open={isErrorModalOpen}
            onOk={() => setIsErrorModalOpen(false)}
            onCancel={() => setIsErrorModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{style: {display: "none"}}}
            okButtonProps={{className: "bg-orange-500"}}>
            <div className='py-4 text-center'>
               <div className='text-red-500 mb-2 text-2xl'>✕</div>
               <h3 className='text-lg font-semibold'>Lỗi!</h3>
               <p>Có lỗi xảy ra khi đổi mật khẩu!</p>
            </div>
         </Modal>
      </div>
   );
};

export default ResetPassword;
