import { Input } from "antd";
import styled from "styled-components";

export const WrapperInputContainer = styled.div`
  position: relative;
  margin: 15px;
  width: 100%;
  background-color: inherit; 
`;

export const WrapperLabelStyle = styled.label`
  position: absolute;
  font-weight:500;
  top: ${({ isFocused, hasValue }) => (isFocused || hasValue ? '3px' : '50%')}; 
  left: 15px;
  padding: 0 5px;
  background-color: var(--text-white-color);
  color: ${({ isFocused }) => (isFocused ? '#000' : '#aaa')};
  font-size: ${({ isFocused, hasValue }) => (isFocused || hasValue ? '12px' : '16px')}; 
  transform: translateY(-50%);
  transition: all 15s ease;
  pointer-events: none;
  z-index: 1;
`;

export const WrapperInputStyle = styled(Input)`
  width: 100%;
  padding: 12px 15px 10px 15px; 
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s ease;
  font-family: "Inter Tight", sans-serif;
  font-weight:bold;
  text-color: var(--text-black-color);
  font-size:15px;
  background-color: var(--bg-white); /* Đặt nền trắng cho input */
  &:focus {
    border-color: var(--text-error-color); /* Màu viền đỏ khi click vào textbox */
  }
 &:hover {
    border-color: var(--text-error-color); /* Màu đỏ khi hover */
  }
`;

