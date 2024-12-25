import {useState, useEffect} from "react";
import {RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential} from "@firebase/auth";
import {auth} from "../../configs/firebase-config";
import {useNavigate} from "react-router-dom";
import {Icon} from "@iconify/react";
import {PhoneOutlined, UserAddOutlined} from "@ant-design/icons";
import React from "react";
import {App, Form, Row, Col, Tabs, Input, Button} from "antd";
import FormSwitcher from "./FormSwitcher";
import authApi from "../../api/authApi";
import {useContent} from "../../hooks/common/ContentContext";
import "./styles/styles.scss";

const Login = () => {
   const {notification} = App.useApp();
   const [form] = Form.useForm();
   const [formLogin, setFormLogin] = useState();
   const [step, setStep] = useState("login");
   const [label, setLabel] = useState("Sign in account");
   const [phoneNumber, setPhoneNumber] = useState("");
   const [otp, setOtp] = useState("");
   const [isCreateAccount, setIsCreateAccount] = useState(false); // Dùng để kiểm tra xem có phải đang tạo tài khoản không
   const [verificationId, setVerificationId] = useState("");
   const [timeRemaining, setTimeRemaining] = useState(null);
   const [isResendDisabled, setIsResendDisabled] = useState(true);
   const [phoneError, setPhoneError] = useState(""); // Thêm state để hiển thị lỗi
   // Dùng cho việc tạo tài khoản

   useEffect(() => {
      return () => {
         if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
         }
      };
   }, []);

   const setupReCaptcha = async () => {
      if (!auth) {
         console.error("Auth is not initialized");
         return;
      }

      try {
         // Xóa recaptcha cũ nếu tồn tại
         if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
         }

         // Khởi tạo RecaptchaVerifier mới
         window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {
               console.log("reCAPTCHA solved");
            },
            "expired-callback": () => {
               if (window.recaptchaVerifier) {
                  localStorage.removeItem("_grecaptcha");
                  window.recaptchaVerifier.clear();
                  window.recaptchaVerifier = null;
               }
            },
         });

         // Render recaptcha
         await window.recaptchaVerifier.render();
      } catch (error) {
         console.error("Error setting up ReCaptcha:", error);
         throw error;
      }
   };

   const handlerLogin = async (values) => {
      if (!values.phone || !values.password) {
         notification.error({
            message: "Vui lòng nhập số điện thoại và mật khẩu!",
            duration: 3,
         });
         return;
      }
      const data = {
         phone: values.phone,
         password: values.password,
      };
      await authApi
         .login(data)
         .then((res) => {
            if (res?.status === 200) {
               notification.success({
                  message: "Đăng nhập thành công!",
                  duration: 3,
               });
            }
            if (res?.error == true) {
               notification.error({
                  message: res?.message,
                  duration: 3,
               });
            }
         })
         .catch((error) => {
            notification.error({
               message: "Đăng nhập thất bại! ",
               duration: 3,
            });
         });
   };

   const handlerSendOTP = async () => {
      if (!phoneNumber) {
         notification.error({
            message: "Vui lòng nhập số điện thoại của bạn để chúng tôi gửi mã OTP!",
            duration: 3,
         });
         return;
      }
      if (!validatePhoneNumber(phoneNumber)) {
         notification.error({
            message: "Số điện thoại của bạn không hợp lệ!",
            duration: 3,
         });
         return;
      }
      try {
         await setupReCaptcha();
         let formattedPhone = phoneNumber.trim();
         if (formattedPhone.startsWith("0")) {
            formattedPhone = "+84" + formattedPhone.substring(1);
         } else if (!formattedPhone.startsWith("+84")) {
            formattedPhone = "+84" + formattedPhone;
         }
         const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
         setVerificationId(confirmationResult.verificationId);
         setStep("verifyOTP");
         setTimeRemaining(46);
         setIsResendDisabled(true);
         notification.success({
            message: "Đã gửi mã OTP đến số điện thoại thành công - Vui lòng xác thực mã OTP!",
            duration: 3,
         });
      } catch (error) {
         notification.error({
            message: (
               <>
                  Ôi không, Bạn gửi mã OTP thất bại rồi! Thử lại sau bạn nhé!
                  <br />
                  <p className='text-[15px] font-medium text-[#bd0f0f]'>{error.message}</p>
               </>
            ),
            duration: 3,
         });

         if (window.recaptchaVerifier) {
            Recaptcha.reload();
            localStorage.removeItem("_grecaptcha");
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
         }
      }
   };

   const handleVerifyOtp = async () => {
      if (otp.join("").length !== 6 || isNaN(otp.join(""))) {
         notification.warning({
            message: "Mã OTP phải có 6 chữ số!",
            duration: 3,
         });
         return;
      }
      if (!otp || !verificationId) {
         notification.warning({
            message: "Vui lòng nhập mã OTP!",
            duration: 3,
         });
         return;
      }
      try {
         const credential = PhoneAuthProvider.credential(verificationId, otp.join(""));
         await signInWithCredential(auth, credential);
         notification.success({
            message: "Xác thực số điện thoại thành công!",
            duration: 3,
         });
         if (isCreateAccount) {
            setVerificationId("");
            setOtp("");
            setStep("register");
         } else {
            setStep("login");
         }
      } catch (error) {
         notification.error({
            message: (
               <>
                  Ôi không, Bạn xác thực số điện thoại thất bại rồi! Thử lại sau bạn nhé!
                  <br />
                  <p className='text-[15px] font-medium text-[#bd0f0f]'>{error.message}</p>
               </>
            ),
            duration: 3,
         });
      }
   };

   const onChangeTabs = (key) => {
      if (key == "1") {
         setLabel("Sign in account");
         setPhoneNumber("");
         setTimeRemaining(null);
         setIsCreateAccount(false);
         setOtp("");
         setVerificationId("");
      } else {
         setLabel("Create account");
         setPhoneError("");
         setPhoneNumber("");
         setTimeRemaining(null);
         setOtp("");
         setVerificationId("");
         setIsCreateAccount(true);
      }
   };

   const handlerOtpForgotPass = () => {
      setIsCreateAccount(false);
      handlerSendOTP();
   };

   const handlerOtpCreateAccount = () => {
      setIsCreateAccount(true);
      handlerSendOTP();
   };

   const handlerCreateAccount = async (values) => {
      if (!values) {
         notification.error({
            message: "Vui lòng kiểm tra lại dữ liệu !",
            duration: 3,
         });
         return;
      }

      const data = {
         phone: phoneNumber,
         password: values.password,
         name: values.name,
         email: values.email,
         gender: values.gender,
      };

      await authApi
         .register(data)
         .then((res) => {
            if (res.status === 201) {
               notification.success({
                  message: "Bạn đã tạo tài khoản thành công!\n",
                  duration: 3,
               });
               setStep("login");
            }
         })
         .catch((error) => {
            notification.error({
               message: (
                  <>
                     Ôi không, Bạn tạo tài khoản thất bại rồi! Thử lại sau bạn nhé!
                     <br />
                     <p className='text-[15px] font-medium text-[#bd0f0f]'>{error.message}</p>
                  </>
               ),
               duration: 3,
            });
         });
   };

   const validatePhoneNumber = (phone) => {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      return phoneRegex.test(phone);
   };

   const handlePhoneChange = (e) => {
      const value = e.target.value;
      setPhoneNumber(value);
      if (value == "") {
         setPhoneError("Vui lòng nhập số điện thoại!");
         return;
      }
      if (!validatePhoneNumber(value)) {
         setPhoneError("Số điện thoại không hợp lệ");
         return;
      } else {
         setPhoneError("");
      }
   };

   const items = [
      {
         key: "1",
         label: (
            <div className='flex items-center p-3 '>
               <PhoneOutlined style={{fontSize: "24px"}} />
               <span style={{fontWeight: "inherit"}}>Sign in account</span>
            </div>
         ),
         children: (
            <>
               <div className='mt-4 flex flex-col gap-6'>
                  <Form form={formLogin} name='loginForm' className='mt-5 flex flex-col gap-6' onFinish={handlerLogin}>
                     <Form.Item name='phone' rules={[{required: true, message: "Vui lòng nhập số điện thoại!"}]}>
                        <Input size='large' placeholder='Phone' prefix={<PhoneOutlined />} />
                     </Form.Item>
                     <Form.Item name='password' rules={[{required: true, message: "Vui lòng nhập mật khẩu!"}]}>
                        <Input.Password
                           placeholder='Enter your password'
                           size='large'
                           prefix={<Icon icon={"material-symbols:password"} />}
                        />
                     </Form.Item>
                     <Form.Item>
                        <Button type='primary' shape='round' size='large' htmlType='submit' style={{width: "100%"}}>
                           Login
                        </Button>
                     </Form.Item>
                  </Form>
               </div>
               <Button
                  type='link'
                  danger
                  style={{padding: "0", margin: "0", fontWeight: "inherit"}}
                  onClick={() => {
                     setStep("forgotPassword");
                  }}>
                  Forgot password
               </Button>
            </>
         ),
      },
      {
         key: "2",
         label: (
            <div className='flex items-center p-3 '>
               <UserAddOutlined style={{fontSize: "24px"}} />
               <span style={{fontWeight: "inherit"}}>Create account</span>
            </div>
         ),
         children: (
            <div className='mt-4 flex flex-col gap-6'>
               <div className='flex flex-col gap-2'>
                  <Input
                     size='large'
                     type='text'
                     placeholder='Enter phone number'
                     prefix={<PhoneOutlined />}
                     onChange={handlePhoneChange}
                     value={phoneNumber}
                     status={phoneError ? "error" : ""}
                  />
                  {phoneError && <span className='text-sm text-[#ff5630]'>{phoneError}</span>}
               </div>
               <div id='recaptcha-container' className='m-auto text-center' style={{maxWidth: "200px"}}></div>
               <Button type='primary' shape='round' size='large' onClick={handlerOtpCreateAccount}>
                  Next
               </Button>
            </div>
         ),
      },
   ];

   const onChangeOTP = (text) => {
      setOtp(text);
   };

   useEffect(() => {
      let timer;
      if (timeRemaining !== null && timeRemaining > 0) {
         timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      } else if (timeRemaining === 0) {
         if (otp || verificationId) {
            notification.error({
               message: "Mã OTP đã hết hạn - Vui lòng thao tác lại!",
               duration: 3,
            });
            setOtp("");
            setVerificationId("");
            setIsResendDisabled(false);
            setPhoneNumber("");
            setStep("login");
         }
      }
      return () => clearTimeout(timer);
   }, [timeRemaining]);

   return (
      <>
         <section className='layout bg-white login-scss relative m-auto mt-10 flex h-auto flex-col'>
            <div
               className='absolute -top-[90px] h-[480px] w-[100%]'
               style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1px solid rgba(239, 82, 34, .6)",
                  outline: "6px solid rgba(170, 46, 8, .063)",
               }}>
               <Row
                  gutter={24}
                  className='flex h-[100%] flex-nowrap items-start justify-center'
                  style={{
                     margin: "0px",
                     padding: "0px",
                  }}>
                  <Col span={14}>
                     <div className='relative'>
                        <div className='absolute left-[50px] top-[20px]'>
                           <img
                              src='https://cdn.futabus.vn/futa-busline-cms-dev/logo_Text_fd1a850bb9/logo_Text_fd1a850bb9.svg'
                              alt=''
                           />
                        </div>
                        <img
                           src='https://cdn.futabus.vn/futa-busline-cms-dev/TVC_00aa29ba5b/TVC_00aa29ba5b.svg'
                           alt=''
                        />
                     </div>
                  </Col>
                  <FormSwitcher
                     step={step}
                     phoneError={phoneError}
                     setPhoneError={setPhoneError}
                     handlePhoneChange={handlePhoneChange}
                     isCreateAccount={isCreateAccount}
                     setIsCreateAccount={setIsCreateAccount}
                     handlerOtpForgotPass={handlerOtpForgotPass}
                     phoneNumber={phoneNumber}
                     setPhoneNumber={setPhoneNumber}
                     timeRemaining={timeRemaining}
                     setTimeRemaining={setTimeRemaining}
                     handleVerifyOtp={handleVerifyOtp}
                     onChangeTabs={onChangeTabs}
                     otp={otp}
                     form={form}
                     setOtp={setOtp}
                     onChangeOTP={onChangeOTP}
                     verificationId={verificationId}
                     setVerificationId={setVerificationId}
                     handleRegister={handlerCreateAccount}
                     handlerLogin={handlerLogin}
                     label={label}
                     setLabel={setLabel}
                     items={items}
                     setStep={setStep}
                  />
               </Row>
            </div>
         </section>
      </>
   );
};

export default Login;
