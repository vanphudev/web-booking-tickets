// import React, {useEffect, useState} from "react";
// import {Helmet} from "react-helmet";
// import {useContent} from "../hooks/common/contentContext";
// import {useSearchParams} from "react-router-dom";
// import OrderApi from "../api/orderApi";
// import {useNavigate} from "react-router-dom";
// import {Spin, Result, Button} from "antd";
// import PaymentSuccess from "../features/order/PaymentSuccess";

// const SuccessPayment = () => {
//    const navigate = useNavigate();
//    const [searchParams] = useSearchParams();
//    const [isLoading, setIsLoading] = useState(false);
//    const [isError, setIsError] = useState(false);
//    const [listBooking, setListBooking] = useState([]);
//    const {isHeaderCustom, setIsHeaderCustom} = useContent();

//    useEffect(() => {
//       const requiredParams = ["vnp_ResponseCode", "vnp_TxnRef", "vnp_Amount"];
//       const hasAllRequiredParams = requiredParams.every((param) => searchParams.has(param));

//       if (!hasAllRequiredParams) {
//          navigate("/");
//          return;
//       }

//       const handlePaymentParams = async () => {
//          const vnp_Params = {};
//          for (const [key, value] of searchParams.entries()) {
//             vnp_Params[key] = value;
//          }
//          const rspCode = vnp_Params["vnp_ResponseCode"];
//          if (rspCode !== "00") {
//             console.error("Thanh toán thất bại với mã:", rspCode);
//             setIsError(true);
//             return;
//          }
//          const paymentMethod = "vnpay";
//          try {
//             setIsLoading(true);
//             await OrderApi.updateAfterPayment({
//                paymentMethod,
//                vnp_Params,
//             })
//                .then(async (res) => {
//                   if (res?.metadata?.booking_code && res?.status === 200) {
//                      await OrderApi.getInfoBooking(res?.metadata?.booking_code).then((res) => {
//                         if (res?.status === 200 && res?.metadata?.data) {
//                            setListBooking(res?.metadata?.data);
//                         }
//                      });
//                   }
//                })
//                .catch((err) => {
//                   setIsError(true);
//                   console.error("Lỗi xác thực thanh toán:", err);
//                });
//             setIsLoading(false);
//             setIsError(false);
//          } catch (error) {
//             setIsLoading(false);
//             setIsError(true);
//             console.error("Lỗi xác thực thanh toán:", error);
//          }
//       };

//       handlePaymentParams();
//       setIsHeaderCustom(true);
//       return () => {
//          setIsHeaderCustom(false);
//       };
//    }, []);

//    const renderContent = () => {
//       if (isLoading) {
//          return (
//             <div
//                style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   minHeight: "80vh",
//                }}>
//                <Spin size='large' tip='Đang xử lý thanh toán...' className='z-[9999999]' />
//             </div>
//          );
//       }

//       if (isError) {
//          return (
//             <div>
//                <Result
//                   status='error'
//                   title='Thanh toán thất bại'
//                   subTitle='Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý thanh toán của bạn.'
//                   extra={[
//                      <Button type='primary' key='console' onClick={() => navigate("/")}>
//                         Về trang chủ
//                      </Button>,
//                      <Button key='buy' onClick={() => navigate("/")}>
//                         Đặt vé mới
//                      </Button>,
//                   ]}
//                />
//             </div>
//          );
//       }

//       if (!isError && !isLoading && listBooking.length === 0) {
//          return (
//             <div
//                style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   minHeight: "40vh",
//                   flexDirection: "column",
//                   gap: "20px",
//                }}>
//                <h1 style={{fontSize: "24px", fontWeight: "bold"}}>Không có dữ liệu thanh toán - Hãy thử lại sau !</h1>
//                <p style={{fontSize: "16px", color: "gray"}}>
//                   Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý thanh toán của bạn.
//                </p>
//                <Button size='large' width='100%' type='primary' key='console' onClick={() => navigate("/")}>
//                   Về trang chủ
//                </Button>
//                <Button size='large' width='100%' key='buy' onClick={() => navigate("/")}>
//                   Đặt vé mới
//                </Button>
//             </div>
//          );
//       }

//       if (!isError && !isLoading && listBooking.length != 0) {
//          return <PaymentSuccess bookingInfo={listBooking} />;
//       }

//       return (
//          <div
//             style={{
//                display: "flex",
//                justifyContent: "center",
//                alignItems: "center",
//                minHeight: "90vh",
//                flexDirection: "column",
//                gap: "20px",
//             }}></div>
//       );
//    };

//    return (
//       <>
//          <Helmet>
//             <meta charSet='utf-8' />
//             <title>Thanh toán thành công - Futabus</title>
//          </Helmet>
//          {renderContent()}
//       </>
//    );
// };

// export default SuccessPayment;

import {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import {useContent} from "../hooks/common/contentContext";
import {useSearchParams, useNavigate} from "react-router-dom";
import OrderApi from "../api/orderApi";
import {Spin, Result, Button} from "antd";
import PaymentSuccess from "../features/order/PaymentSuccess";

const SuccessPayment = () => {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);
   const [listBooking, setListBooking] = useState([]);
   const {setIsHeaderCustom} = useContent();

   useEffect(() => {
      const handlePaymentParams = async () => {
         const requiredParams = ["vnp_ResponseCode", "vnp_TxnRef", "vnp_Amount"];

         if (!requiredParams.every((param) => searchParams.has(param))) {
            navigate("/");
            return;
         }

         const vnp_Params = Object.fromEntries(searchParams.entries());
         const rspCode = vnp_Params["vnp_ResponseCode"];

         if (rspCode !== "00") {
            console.error("Thanh toán thất bại với mã:", rspCode);
            setIsError(true);
            return;
         }

         try {
            setIsLoading(true);
            const response = await OrderApi.updateAfterPayment({paymentMethod: "vnpay", vnp_Params});

            if (response?.metadata?.booking_code && response?.status === 200) {
               const bookingResponse = await OrderApi.getInfoBooking(response.metadata.booking_code);

               if (bookingResponse?.status === 200 && bookingResponse?.metadata?.data) {
                  setListBooking(bookingResponse.metadata.data);
               }
            }
            setIsError(false);
         } catch (error) {
            console.error("Lỗi xác thực thanh toán:", error);
            setIsError(true);
         } finally {
            setIsLoading(false);
         }
      };

      handlePaymentParams();
      setIsHeaderCustom(true);

      return () => setIsHeaderCustom(false);
   }, [searchParams, navigate, setIsHeaderCustom]);

   const renderContent = () => {
      if (isLoading) {
         return (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
               <Spin size='large' tip='Đang xử lý thanh toán...' className='z-[99999]' />
            </div>
         );
      }

      if (isError) {
         return (
            <>
               <Helmet>
                  <meta charSet='utf-8' />
                  <title>Thanh toán không thành công - Futabus</title>
               </Helmet>
               <Result
                  status='error'
                  title='Thanh toán thất bại'
                  subTitle='Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý thanh toán của bạn.'
                  extra={[
                     <Button type='primary' key='home' onClick={() => navigate("/")}>
                        Về trang chủ
                     </Button>,
                     <Button key='newBooking' onClick={() => navigate("/")}>
                        Đặt vé mới
                     </Button>,
                  ]}
               />
            </>
         );
      }

      if (listBooking.length === 0) {
         return (
            <>
               <Helmet>
                  <meta charSet='utf-8' />
                  <title>Thanh toán không thành công - Futabus</title>
               </Helmet>
               <div
                  style={{
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                     minHeight: "40vh",
                     flexDirection: "column",
                     gap: "20px",
                  }}>
                  <h1 style={{fontSize: "24px", fontWeight: "bold"}}>Không có dữ liệu thanh toán - Hãy thử lại sau!</h1>
                  <p style={{fontSize: "16px", color: "gray"}}>
                     Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý thanh toán của bạn.
                  </p>
                  <Button size='large' type='primary' onClick={() => navigate("/")}>
                     Về trang chủ
                  </Button>
                  <Button size='large' onClick={() => navigate("/")}>
                     Đặt vé mới
                  </Button>
               </div>
            </>
         );
      }

      return (
         <>
            <Helmet>
               <meta charSet='utf-8' />
               <title>Thanh toán thành công - Futabus</title>
            </Helmet>
            <PaymentSuccess bookingInfo={listBooking} />
         </>
      );
   };

   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Đang xử lý thanh toán - Futabus</title>
         </Helmet>
         {renderContent()}
      </>
   );
};

export default SuccessPayment;
