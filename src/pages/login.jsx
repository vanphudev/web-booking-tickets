import React from "react";
import Login from "../features/login/login";
import ConnectFuta from "../features/home/connectingFutaGroup/connectFuta";
import {Helmet} from "react-helmet";
const LoginPage = () => {
   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Đăng nhập - Futabus</title>
         </Helmet>
         <Login />
         <div style={{marginTop: "400px"}}></div>
         <ConnectFuta />
      </>
   );
};

export default LoginPage;
