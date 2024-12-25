import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useRouter} from "../../../../hooks/router/useRouter";
import store from "../../../../redux/store";
import api from "../../../../api/authApi";
import {useSelector} from "react-redux";
import {Menu, Dropdown, Button, Row, Col, Space, Modal} from "antd";
import {useContent} from "../../../../hooks/common/contentContext";
import ROUTER_PATH from "../../../../configs/router";
import {clearUserInfoAndUserToken} from "../../../../redux/slices/authSlice";
import {removeItem} from "../../../../utility/functionCommon/storage";
import {StorageEnum} from "../../../../entity/enum";
import "./styles/style.scss";
import {Link} from "react-router-dom";
import voucher from "../../../../assets/images/voucher.png";
import refund from "../../../../assets/images/refund-history.png";

const languageMenu = [
   {
      label: (
         <div className='flex items-center gap-2'>
            <img src='https://futabus.vn/images/icons/vietnam.svg' alt='' />
            <span style={{fontWeight: "bold"}}>VN</span>
         </div>
      ),
      key: "0",
      value: {
         label: (
            <div className='flex items-center gap-2'>
               <img src='https://futabus.vn/images/icons/vietnam.svg' alt='' />
               <span style={{fontWeight: "bold", color: "white"}}>VN</span>
            </div>
         ),
      },
   },
   {
      label: (
         <div className='flex items-center gap-2'>
            <img src='https://futabus.vn/images/icons/eng.svg' alt='' />
            <span style={{fontWeight: "bold"}}>EN</span>
         </div>
      ),
      key: "1",
      value: {
         label: (
            <div className='flex items-center gap-2'>
               <img src='https://futabus.vn/images/icons/eng.svg' alt='' />
               <span style={{fontWeight: "bold", color: "white"}}>EN</span>
            </div>
         ),
      },
   },
];

const HeaderComponent = () => {
   const {tab, setTab} = useContent();
   const navigate = useNavigate();
   const {replace} = useRouter();
   const location = useLocation();

   const userInfo = useSelector((state) => state.auth.userInfo);

   const [selectedLanguage, setSelectedLanguage] = useState(languageMenu[0].value);
   const {isHeaderCustom} = useContent();
   const handleLanguageChange = (e) => {
      const language = languageMenu.find((item) => item.key === e.key);
      setSelectedLanguage(language.value);
   };

   const handleLoginClick = () => {
      navigate("/login");
   };

   const [open, setOpen] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);

   const showLogoutModal = () => {
      setOpen(true);
   };

   const handleLogout = async () => {
      setConfirmLoading(true);
      try {
         const response = await api.logout();
         if (response.status === 200 || response.status === 201) {
            store.dispatch(clearUserInfoAndUserToken());
            removeItem(StorageEnum.UserInfo);
            removeItem(StorageEnum.UserToken);
            window.location.href = "/login";
         }
      } catch (error) {
         store.dispatch(clearUserInfoAndUserToken());
         removeItem(StorageEnum.UserInfo);
         removeItem(StorageEnum.UserToken);
         window.location.href = "/login";
      } finally {
         setConfirmLoading(false);
         setOpen(false);
      }
   };

   const handleCancelLogout = () => {
      setOpen(false);
   };

   const userMenu = [
      {
         label: (
            <Link to='/profile?tab=user-info' className='flex items-center gap-2' onClick={() => setTab("user-info")}>
               <img src='https://futabus.vn/images/header/profile/Profile.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Thông tin tài khoản</span>
            </Link>
         ),
         key: "0",
      },
      {
         label: (
            <Link to='/profile?tab=voucher' className='flex items-center gap-2' onClick={() => setTab("voucher")}>
               <img src={voucher} alt='' style={{width: "32px", height: "32px"}} />
               <span style={{ fontWeight: "bold" }}>Mã giảm giá</span>
            </Link>
         ),
         key: "1",
      },
      {
         label: (
            <Link
               to='/profile?tab=order-history'
               className='flex items-center gap-2'
               onClick={() => setTab("order-history")}>
               <img src='https://futabus.vn/images/header/profile/History.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Lịch sử mua vé</span>
            </Link>
         ),
         key: "2",
      },
      {
         label: (
            <Link
               to='/profile?tab=refund-history'
               className='flex items-center gap-2'
               onClick={() => setTab("refund-history")}>
               <img src={refund} alt='' style={{width: "32px", height: "32px"}} />
               <span style={{fontWeight: "bold"}}>Lịch sử hủy vé</span>
            </Link>
         ),
         key: "3",
      },
      {
         label: (
            <Link to='/profile?tab=address' className='flex items-center gap-2' onClick={() => setTab("address")}>
               <img src='https://futabus.vn/images/header/profile/Address.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Địa chỉ</span>
            </Link>
         ),
         key: "4",
      },
      {
         label: (
            <Link
               to='/profile?tab=reset-password'
               className='flex items-center gap-2'
               onClick={() => setTab("reset-password")}>
               <img src='https://futabus.vn/images/header/profile/Password.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Đổi mật khẩu</span>
            </Link>
         ),
         key: "5",
      },
      {
         label: (
            <div className='flex items-center gap-2' onClick={showLogoutModal}>
               <img src='https://futabus.vn/images/header/profile/Logout.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Đăng xuất</span>
            </div>
         ),
         key: "6",
      },
   ];

   const getSelectedKey = () => {
      let currentPath = location.pathname;
      if (currentPath[0] === "/") {
         currentPath = currentPath.slice(1);
      }
      currentPath = currentPath.split("/")[0];
      currentPath = currentPath.split("?")[0];
      const routerMap = {
         [ROUTER_PATH.HOME_FIRST]: "1",
         [ROUTER_PATH.SCHEDULE]: "2",
         [ROUTER_PATH.BOOKING_TICKET_MANAGER]: "3",
         [ROUTER_PATH.NEWS]: "4",
         [ROUTER_PATH.CONTACT]: "5",
         [ROUTER_PATH.ABOUT_US]: "6",
         "": "1",
      };

      return routerMap[currentPath] ? [routerMap[currentPath]] : [];
   };

   const [selectedKeys, setSelectedKeys] = useState(getSelectedKey());

   useEffect(() => {
      setSelectedKeys(getSelectedKey());
   }, [location.pathname, setSelectedKeys]);

   const handleMenuClick = (key) => {
      setSelectedKeys([key]);

      const routeMap = {
         1: ROUTER_PATH.HOME_FIRST,
         2: ROUTER_PATH.SCHEDULE,
         3: ROUTER_PATH.BOOKING_TICKET_MANAGER,
         4: ROUTER_PATH.NEWS,
         5: ROUTER_PATH.CONTACT,
         6: ROUTER_PATH.ABOUT_US,
      };

      const route = routeMap[key];
      if (route) {
         if (route === ROUTER_PATH.HOME_FIRST) {
            navigate(route);
         } else {
            navigate("/" + route);
         }
      }
   };

   const menuItems = [
      {
         key: "1",
         label: (
            <Link to='/' style={{fontWeight: "bold"}}>
               Trang chủ
            </Link>
         ),
      },
      {
         key: "2",
         label: (
            <Link to='/schedule' style={{fontWeight: "bold"}}>
               Lịch trình
            </Link>
         ),
      },
      {
         key: "3",
         label: (
            <Link to='/booking-ticket-manager' style={{fontWeight: "bold"}}>
               Tra cứu vé
            </Link>
         ),
      },
      {
         key: "4",
         label: (
            <Link to='/tin-tuc' style={{fontWeight: "bold"}}>
               Tin tức
            </Link>
         ),
      },
      {
         key: "5",
         label: (
            <Link to='/contact' style={{fontWeight: "bold"}}>
               Liên hệ
            </Link>
         ),
      },
      {
         key: "6",
         label: (
            <Link to='/about-us' style={{fontWeight: "bold"}}>
               Về chúng tôi
            </Link>
         ),
      },
   ];

   return (
      <>
         <Modal
            title='Xác nhận đăng xuất'
            open={open}
            onOk={handleLogout}
            confirmLoading={confirmLoading}
            onCancel={handleCancelLogout}
            okText='Đăng xuất'
            cancelText='Hủy'>
            <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
         </Modal>
         <header
            className='header flex h-full w-full flex-col bg-[#F3F3F5] text-center'
            style={{paddingBottom: isHeaderCustom ? "0px" : "100px"}}>
            <div className='layout w-full'>
               <Row gutter={24} className='flex items-center justify-center' style={{margin: "0px", width: "100%"}}>
                  <Row gutter={24} style={{margin: "0px", width: "100%"}}>
                     <Row span={24} style={{margin: "0px", width: "100%"}}>
                        <Col
                           span={8}
                           style={{padding: "10px 0px", width: "100%"}}
                           className='flex items-center justify-start'>
                           <div className='language-menu' style={{width: "max-content"}}>
                              <Dropdown
                                 menu={{
                                    items: languageMenu,
                                    onClick: handleLanguageChange,
                                 }}>
                                 <a onClick={(e) => e.preventDefault()}>
                                    <Space className='cursor-pointer'>
                                       {selectedLanguage ? selectedLanguage.label : "Select Language"}
                                       <img src='https://futabus.vn/images/icons/icon_form_droplist.svg' alt='' />
                                    </Space>
                                 </a>
                              </Dropdown>
                           </div>
                        </Col>
                        <Col span={8} style={{padding: "0 10px"}}>
                           <Link to='/' className='logo'>
                              <img
                                 src='https://futabus.vn/_next/static/media/logo_new.8a0251b8.svg'
                                 alt='logo'
                                 style={{width: "100%", height: "auto", cursor: "pointer"}}
                              />
                           </Link>
                        </Col>
                        <Col
                           span={8}
                           style={{padding: "10px 0px", display: "flex", justifyContent: "flex-end"}}
                           className='flex items-center justify-end'>
                           {userInfo?.userId ? (
                              <div className='user-menu' style={{width: "max-content"}}>
                                 <Dropdown
                                    menu={{
                                       items: userMenu,
                                    }}>
                                    <a onClick={(e) => e.preventDefault()}>
                                       <Space className='cursor-pointer'>
                                          <div className='flex items-center gap-2'>
                                             <img
                                                loading='lazy'
                                                src={
                                                   userInfo?.avatar
                                                      ? userInfo?.avatar
                                                      : "https://futabus.vn/images/banners/avatar_test.svg"
                                                }
                                                alt='Profile Avatar'
                                                style={{width: "32px", height: "32px", borderRadius: "50%"}}
                                             />
                                             <span style={{fontWeight: "bold", color: "white"}}>
                                                Chào bạn!, {userInfo?.fullName}
                                             </span>
                                          </div>
                                          <img src='https://futabus.vn/images/icons/icon_form_droplist.svg' alt='' />
                                       </Space>
                                    </a>
                                 </Dropdown>
                              </div>
                           ) : (
                              <Button type='default' shape='round' onClick={handleLoginClick}>
                                 <div className='flex items-center gap-2'>
                                    <img
                                       src='https://futabus.vn/images/icons/person.svg'
                                       alt=''
                                       style={{width: "20px"}}
                                    />
                                    <span style={{fontWeight: "bold"}}>Đăng nhập / Đăng ký</span>
                                 </div>
                              </Button>
                           )}
                        </Col>
                     </Row>
                  </Row>
                  <Row gutter={24} style={{minHeight: "70px"}}>
                     <Col span={24} className='flex items-center justify-center'>
                        <Menu
                           theme='light'
                           mode='horizontal'
                           selectedKeys={selectedKeys}
                           items={menuItems}
                           style={{width: "100%"}}
                        />
                     </Col>
                  </Row>
               </Row>
            </div>
         </header>
      </>
   );
};

export default HeaderComponent;
