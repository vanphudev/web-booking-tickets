import React, {useState} from "react";
import "./../../styles/common/index.scss";
import {WrapperInputContainer, WrapperInputStyle, WrapperLabelStyle} from "./style";

const InputFormComponent = ({labelText = "", placeholderText = "", ...rest}) => {
   const [isFocused, setIsFocused] = useState(false);
   const [valueInput, setValueInput] = useState("");

   const handleFocus = () => {
      setIsFocused(true);
   };

   const handleBlur = () => {
      if (!valueInput) {
         setIsFocused(false);
      }
   };

   const handleChange = (e) => {
      setValueInput(e.target.value);
   };

   return (
      <WrapperInputContainer>
         {(isFocused || valueInput) && (
            <WrapperLabelStyle isFocused={isFocused} hasValue={!!valueInput}>
               {labelText}
            </WrapperLabelStyle>
         )}
         <WrapperInputStyle
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={valueInput}
            onChange={handleChange}
            placeholder={!valueInput && !isFocused ? placeholderText : ""}
            {...rest}
         />
      </WrapperInputContainer>
   );
};

export default InputFormComponent;
