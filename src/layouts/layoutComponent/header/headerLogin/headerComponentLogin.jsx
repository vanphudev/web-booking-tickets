import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useRouter} from "../../../../hooks/router/useRouter";

import {useNavigate} from "react-router-dom";
import store from "../../../../redux/store";
import {useSelector} from "react-redux";
import {Layout, Menu, Dropdown, Button, Row, Col, Space} from "antd";
import {useContent} from "../../../../hooks/common/ContentContext";
import ROUTER_PATH from "../../../../configs/router";
import "./styles/style.scss";
import {userInfo} from "@/entity/enum";

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
   const navigate = useNavigate();
   const handleLoginClick = () => {
      navigate("/login");
   };
   const userInfo = useSelector((state) => state.auth.userInfo);
   const [selectedLanguage, setSelectedLanguage] = useState(languageMenu[0].value);
   const {isHeaderCustom} = useContent();
   const handleLanguageChange = (e) => {
      const language = languageMenu.find((item) => item.key === e.key);
      setSelectedLanguage(language.value);
   };

   const userMenu = [
      {
         label: (
            <div className='flex items-center gap-2'>
               <img src='https://futabus.vn/images/header/profile/Profile.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Account Information</span>
            </div>
         ),
         key: "0",
      },
      {
         label: (
            <div className='flex items-center gap-2'>
               <img src='https://futabus.vn/images/header/profile/History.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Ticket Purchase History</span>
            </div>
         ),
         key: "1",
      },
      {
         label: (
            <div className='flex items-center gap-2'>
               <img src='https://futabus.vn/images/header/profile/Address.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Address</span>
            </div>
         ),
         key: "2",
      },
      {
         label: (
            <div className='flex items-center gap-2'>
               <img src='https://futabus.vn/images/header/profile/Password.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Reset Password</span>
            </div>
         ),
         key: "3",
      },
      {
         label: (
            <div className='flex items-center gap-2'>
               <img src='https://futabus.vn/images/header/profile/Logout.svg' alt='' />
               <span style={{fontWeight: "bold"}}>Logout</span>
            </div>
         ),
         key: "4",
      },
   ];

   const {replace} = useRouter();

   useEffect(() => {
      if (userInfo?.userId) {
         replace(import.meta.env.VITE_APP_HOME_PAGE);
      }
   }, [userInfo?.userId, replace]);

   return (
      <header
         className='header flex h-full w-full flex-col text-center'
         style={{paddingBottom: isHeaderCustom ? "0px" : "100px"}}>
         <div className='layout w-full'>
            <Row gutter={24} className='flex items-center justify-center' style={{margin: "0px", width: "100%"}}>
               <Row gutter={24} style={{margin: "0px", width: "100%"}}>
                  <Row span={24} style={{margin: "0px", width: "100%"}}>
                     <Col span={8} style={{padding: "10px 0px"}} className='flex items-center justify-start'>
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
                        <div
                           className='logo'
                           onClick={() => {
                              replace(import.meta.env.VITE_APP_HOME_PAGE);
                           }}>
                           <img
                              src='https://futabus.vn/_next/static/media/logo_new.8a0251b8.svg'
                              alt='logo'
                              style={{width: "100%", height: "auto", cursor: "pointer"}}
                           />
                        </div>
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
                                             src={
                                                userInfo?.avatar
                                                   ? userInfo?.avatar
                                                   : "https://futabus.vn/images/banners/avatar_test.svg"
                                             }
                                             alt='Profile Avatar'
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
                                 <img src='https://futabus.vn/images/icons/person.svg' alt='' style={{width: "20px"}} />
                                 <span style={{fontWeight: "bold"}}>Đăng nhập / Đăng ký</span>
                              </div>
                           </Button>
                        )}
                     </Col>
                  </Row>
               </Row>
            </Row>
         </div>
      </header>
   );
};

export default HeaderComponent;
