import React, {useState, Suspense} from "react";
import {Helmet} from "react-helmet";
import {Row, Col, Menu, Spin, Modal} from "antd";
import {useContent} from "../hooks/common/contentContext";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {clearUserInfoAndUserToken} from "../redux/slices/authSlice";
import {removeItem} from "../utility/functionCommon/storage";
import {StorageEnum} from "../entity/enum";
import voucher from "../assets/images/voucher.png";
import refund from "../assets/images/refund-history.png";

const UserInfo = React.lazy(() => import("../components/profile/UserInfo"));
const OrderHistory = React.lazy(() => import("../components/profile/OrderHistory"));
const Address = React.lazy(() => import("../components/profile/Address"));
const ResetPassword = React.lazy(() => import("../components/profile/ResetPassword"));
const Voucher = React.lazy(() => import("../components/profile/voucher"));
const RefundHistory = React.lazy(() => import("../components/profile/RefundHistory"));

import "../pages/styles/styles.scss";

const Profile = () => {
   const {isHeaderCustom, setIsHeaderCustom} = useContent();
   const {tab} = useContent();
   const defaultKey = tab || "user-info";
   const [selectedKey, setSelectedKey] = useState(defaultKey);
   const dispatch = useDispatch();
   const [open, setOpen] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);

   useEffect(() => {
      setIsHeaderCustom(true);
      setSelectedKey(tab || "user-info");
      return () => {
         setIsHeaderCustom(false);
      };
   }, [isHeaderCustom, setIsHeaderCustom, setSelectedKey, tab, defaultKey]);

   const handleLogout = async () => {
      setConfirmLoading(true);
      try {
         const response = await api.logout();
         if (response.status === 200 || response.status === 201) {
            dispatch(clearUserInfoAndUserToken());
            removeItem(StorageEnum.UserInfo);
            removeItem(StorageEnum.UserToken);
            window.location.href = "/login";
         }
      } catch (error) {
         dispatch(clearUserInfoAndUserToken());
         removeItem(StorageEnum.UserInfo);
         removeItem(StorageEnum.UserToken);
         window.location.href = "/login";
      } finally {
         setConfirmLoading(false);
         setOpen(false);
      }
   };

   const menuItems = [
      {
         key: "user-info",
         icon: <img src='https://futabus.vn/images/header/profile/Profile.svg' alt='' />,
         label: "Thông tin tài khoản",
      },
      {
         key: "voucher",
         icon: <img src={voucher} alt='' style={{width: "32px", height: "32px"}} />,
         label: "Mã giảm giá",
      },
      {
         key: "order-history",
         icon: <img src='https://futabus.vn/images/header/profile/History.svg' alt='' />,
         label: "Lịch sử đặt vé",
      },
      {
         key: "refund-history",
         icon: <img src={refund} alt='' style={{width: "32px", height: "32px"}} />,
         label: "Lịch sử hủy vé",
      },
      {
         key: "address",
         icon: <img src='https://futabus.vn/images/header/profile/Address.svg' alt='' />,
         label: "Địa chỉ",
      },
      {
         key: "reset-password",
         icon: <img src='https://futabus.vn/images/header/profile/Password.svg' alt='' />,
         label: "Đổi mật khẩu",
      },
      {
         key: "logout",
         icon: <img src='https://futabus.vn/images/header/profile/Logout.svg' alt='' />,
         label: "Đăng xuất",
         onClick: () => setOpen(true),
      },
   ];

   const renderComponent = () => {
      switch (selectedKey) {
         case "user-info":
            return <UserInfo />;
         case "voucher":
            return <Voucher />;
         case "order-history":
            return <OrderHistory />;
         case "refund-history":
            return <RefundHistory />;
         case "address":
            return <Address />;
         case "reset-password":
            return <ResetPassword />;
         default:
            return <UserInfo />;
      }
   };

   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Thông tin tài khoản - Futabus</title>
         </Helmet>
         <div className='layout flex flex-nowrap items-start justify-center py-10 xl:px-0'>
            <Row
               gutter={[24, 24]}
               className='profile w-full max-w-screen-xl items-start'
               style={{margin: "0px", padding: "0px", alignItems: "flex-start"}}>
               <Col xs={24} sm={12} md={8} lg={6}>
                  <div className='sticky top-4'>
                     <Menu
                        mode='inline'
                        selectedKeys={[selectedKey]}
                        items={menuItems}
                        onClick={({key}) => {
                           if (key !== "logout") {
                              setSelectedKey(key);
                              const searchParams = new URLSearchParams(window.location.search);
                              searchParams.set("tab", key);
                              window.history.pushState(
                                 {},
                                 "",
                                 `${window.location.pathname}?${searchParams.toString()}`
                              );
                           }
                        }}
                        style={{
                           borderRadius: "8px",
                           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                           width: "100%",
                           minHeight: "calc(80vh - 200px)",
                           overflowY: "auto",
                        }}
                     />
                  </div>
               </Col>
               <Col xs={24} sm={12} md={16} lg={18}>
                  <div className='bg-white min-h-[500px] rounded-lg p-0'>
                     <Suspense
                        fallback={
                           <div className='flex h-[400px] items-center justify-center'>
                              <Spin size='large' tip='Đang tải...' />
                           </div>
                        }>
                        {renderComponent()}
                     </Suspense>
                  </div>
               </Col>
            </Row>
         </div>
         <Modal
            title='Xác nhận đăng xuất'
            open={open}
            onOk={handleLogout}
            confirmLoading={confirmLoading}
            onCancel={() => setOpen(false)}
            okText='Đăng xuất'
            cancelText='Hủy'
            okButtonProps={{
               className: "bg-orange-500",
            }}>
            <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
         </Modal>
      </>
   );
};

export default Profile;
