import React, {useState, useEffect} from "react";
import {Col, Button, Input, Tabs} from "antd";
import {Icon} from "@iconify/react";
import {Form, Select} from "antd";
const {Option} = Select;

const RegisterForm = ({form, onSubmit, phoneNumber, setStep}) => {
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      form.setFieldsValue({phone: phoneNumber});
   }, [phoneNumber, form]);

   const handleSubmit = async (values) => {
      setLoading(true);
      try {
         await onSubmit(values);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Col span={10} className='flex h-[100%] items-center justify-center'>
         <div className='flex flex-col items-start justify-center gap-2 pt-5'>
            <span className='mb-4 text-center text-2xl font-medium'>Register</span>
            <Form
               form={form}
               name='register'
               layout='horizontal'
               labelCol={{span: 6}}
               wrapperCol={{span: 18}}
               onFinish={handleSubmit}
               className='mt-4 flex w-full flex-col gap-1'>
               <Form.Item
                  name='name'
                  label='Name'
                  style={{padding: "0px", marginBottom: "13px"}}
                  rules={[
                     {required: true, message: "Please enter your name!"},
                     {min: 3, message: "Name must be at least 3 characters!"},
                  ]}>
                  <Input placeholder='Enter your name' size='large' />
               </Form.Item>
               <Form.Item
                  name='phone'
                  label='Phone Number'
                  style={{padding: "0px", marginBottom: "13px"}}
                  rules={[
                     {required: true, message: "Please enter your phone number!"},
                     {pattern: /^[0-9]{10}$/, message: "Phone number must be 10 digits!"},
                  ]}>
                  <Input placeholder='Enter your phone number' size='large' disabled />
               </Form.Item>
               <Form.Item
                  name='email'
                  label='Email'
                  style={{padding: "0px", marginBottom: "13px"}}
                  rules={[
                     {required: true, message: "Please enter your email!"},
                     {type: "email", message: "Email is not valid!"},
                  ]}>
                  <Input placeholder='Enter your email' size='large' />
               </Form.Item>
               <Form.Item
                  name='gender'
                  label='Gender'
                  style={{padding: "0px", marginBottom: "13px"}}
                  rules={[{required: true, message: "Please select your gender!"}]}>
                  <Select placeholder='Select your gender' size='large'>
                     <Option value='1'>Male</Option>
                     <Option value='0'>Female</Option>
                     <Option value='-1'>Other</Option>
                  </Select>
               </Form.Item>
               <Form.Item
                  name='password'
                  label='Password'
                  style={{padding: "0px", marginBottom: "13px"}}
                  rules={[
                     {required: true, message: "Please enter your password!"},
                     {min: 6, message: "Password must be at least 6 characters!"},
                  ]}>
                  <Input.Password placeholder='Enter your password' size='large' />
               </Form.Item>
               <Form.Item wrapperCol={{span: 18, offset: 6}} style={{padding: "0px", marginBottom: "13px"}}>
                  <Button type='primary' shape='round' size='large' htmlType='submit' block loading={loading}>
                     Register
                  </Button>
                  <Button
                     type='link'
                     danger
                     style={{padding: "0", margin: "0", fontWeight: "inherit"}}
                     onClick={() => setStep("login")}>
                     Back to login
                  </Button>
               </Form.Item>
            </Form>
         </div>
      </Col>
   );
};

const ForgotPasswordForm = ({
   handlerOtpForgotPass,
   phoneNumber,
   setPhoneNumber,
   setStep,
   setVerificationId,
   handlePhoneChange,
   phoneError,
   setPhoneError,
}) => {
   useEffect(() => {
      setPhoneError("");
      setPhoneNumber("");
      setVerificationId("");
   }, []);
   return (
      <Col span={10} className='flex h-[100%] items-center justify-center'>
         <div className='flex flex-col items-start justify-center gap-2 pt-10'>
            <span className='text-center text-2xl font-medium'>Forgot Password</span>
            <div className='mt-4 flex w-[100%] flex-col gap-6'>
               <Input
                  size='large'
                  type='text'
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder='Enter phone number'
                  prefix={<Icon icon={"ic:baseline-phone"} />}
               />
               {phoneError && <span className='text-sm text-[#ff5630]'>{phoneError}</span>}
               <div id='recaptcha-container' className='m-auto text-center' style={{maxWidth: "200px"}}></div>
               <Button type='primary' shape='round' size='large' onClick={handlerOtpForgotPass}>
                  Send OTP Code
               </Button>
               <Button
                  type='link'
                  danger
                  style={{padding: "0", margin: "0", fontWeight: "inherit"}}
                  onClick={() => setStep("login")}>
                  Back to login
               </Button>
            </div>
         </div>
      </Col>
   );
};

const OTPForm = ({timeRemaining, handleVerifyOtp, onChangeOTP, setOtp, phoneNumber, setStep, setTimeRemaining}) => {
   useEffect(() => {
      setOtp("");
      setTimeRemaining(46);
   }, []);

   if (!phoneNumber) {
      setStep("login");
      return;
   }
   return (
      <Col span={10} className='flex h-[100%] items-center justify-center'>
         <div className='mt-4 flex w-full flex-col gap-6'>
            <span className='text-center text-2xl font-medium'>Enter OTP code</span>
            <Input.OTP
               size='large'
               formatter={(str) => str.replace(/\D/g, "").toUpperCase()}
               onInput={(e) => {
                  onChangeOTP(e);
               }}
            />
            <span className='text-gray-600 text-sm'>
               OTP code has been sent to <strong>{phoneNumber}</strong>
            </span>
            <span className='text-red-500 text-sm font-medium'>
               Time remaining: <strong>00 : {timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}</strong>
            </span>
            <Button type='primary' shape='round' size='large' onClick={handleVerifyOtp}>
               Next
            </Button>
            <Button
               type='link'
               danger
               style={{padding: "0", margin: "0", fontWeight: "inherit"}}
               onClick={() => setStep("login")}>
               Back to login
            </Button>
         </div>
      </Col>
   );
};

const LoginForm = ({
   onChangeTabs,
   setStep,
   label,
   items,
   setIsCreateAccount,
   setLabel,
   setPhoneNumber,
   setTimeRemaining,
   setOtp,
   setVerificationId,
   isCreateAccount,
   setPhoneError,
}) => {
   useEffect(() => {
      setLabel("Sign in account");
      setPhoneNumber("");
      setTimeRemaining(null);
      setIsCreateAccount(false);
      setPhoneError("");
      setOtp("");
      setVerificationId("");
   }, []);
   return (
      <Col span={10} className='flex h-[100%] items-center justify-center'>
         <div className='flex flex-col items-start justify-center gap-2 pt-10'>
            <span className='text-center text-2xl font-medium'>{label}</span>
            <Tabs defaultActiveKey='1' items={items} onChange={onChangeTabs} style={{width: "100%"}} />
         </div>
      </Col>
   );
};

const FormSwitcher = ({
   step,
   setIsCreateAccount,
   isCreateAccount,
   setPhoneError,
   handlerOtpForgotPass,
   setTimeRemaining,
   phoneNumber,
   handlePhoneChange,
   phoneError,
   setPhoneNumber,
   timeRemaining,
   isResendDisabled,
   setVerificationId,
   handleVerifyOtp,
   handlerLogin,
   handleRegister,
   onChangeOTP,
   otp,
   form,
   setOtp,
   onChangeTabs,
   label,
   setLabel,
   items,
   setStep,
}) => {
   useEffect(() => {
      return () => {
         if (step === "login") {
            form.resetFields();
         }
      };
   }, [
      step,
      setLabel,
      setTimeRemaining,
      setOtp,
      setPhoneNumber,
      setVerificationId,
      form,
      setIsCreateAccount,
      phoneNumber,
   ]);

   switch (step) {
      case "forgotPassword":
         return (
            <ForgotPasswordForm
               phoneError={phoneError}
               handlePhoneChange={handlePhoneChange}
               handlerOtpForgotPass={handlerOtpForgotPass}
               phoneNumber={phoneNumber}
               setPhoneNumber={setPhoneNumber}
               setStep={setStep}
               setPhoneError={setPhoneError}
               setVerificationId={setVerificationId}
            />
         );
      case "verifyOTP":
         return (
            <OTPForm
               timeRemaining={timeRemaining}
               isResendDisabled={isResendDisabled}
               handleVerifyOtp={handleVerifyOtp}
               onChangeOTP={onChangeOTP}
               otp={otp}
               setOtp={setOtp}
               setTimeRemaining={setTimeRemaining}
               phoneNumber={phoneNumber}
               handlerLogin={handlerLogin}
               setStep={setStep}
            />
         );
      case "register":
         return <RegisterForm onSubmit={handleRegister} form={form} phoneNumber={phoneNumber} setStep={setStep} />;
      case "login":
      default:
         return (
            <LoginForm
               onChangeTabs={onChangeTabs}
               setStep={setStep}
               label={label}
               setLabel={setLabel}
               items={items}
               setOtp={setOtp}
               setPhoneError={setPhoneError}
               setVerificationId={setVerificationId}
               setPhoneNumber={setPhoneNumber}
               setTimeRemaining={setTimeRemaining}
               isCreateAccount={isCreateAccount}
               setIsCreateAccount={setIsCreateAccount}
            />
         );
   }
};

export default FormSwitcher;
