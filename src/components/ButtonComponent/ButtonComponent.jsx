import React from "react";
import {Button} from "antd";
import styled from "styled-components";

const StyledButton = styled(Button)`
   background-color: #f7e4dc !important; /* Màu nền đỏ nhạt */
   color: #f87f50 !important; /* Màu chữ đỏ đậm */
   background-color: #f7e4dc !important;
   border: none !important;
   border-radius: 20px !important;
   width: 30% !important;
   height: 35px !important;
   font-size: 15px !important;
   font-weight: 700 !important;
   display: flex !important;
   justify-content: center !important;
   align-items: center !important;
   transition: background-color 0.3s ease, color 0.3s ease !important;
   &:hover,
   &:focus {
      background-color: #f87f50 !important; /* Màu nền đỏ đậm khi hover/focus */
      color: #fff !important; /* Màu chữ trắng khi hover/focus */
   }
   &:active {
      background-color: #f87f50 !important; /* Màu nền đỏ đậm khi click */
      color: #fff !important; /* Màu chữ trắng khi click */
   }
`;

const ButtonComponent = ({size, icon, style, textButton, ...rests}) => {
   return (
      <StyledButton size={size} icon={icon} style={style} {...rests}>
         {textButton}
      </StyledButton>
   );
};

export default ButtonComponent;
