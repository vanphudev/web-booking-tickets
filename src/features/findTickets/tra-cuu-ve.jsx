import React, {useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {WrapperContainerLeft} from "./styletracuuve";
import InputFormComponent from "@/components/InputFormComponent/InputFormComponent";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";

const BookingTicketManager = () => {
   const [recaptchaValue, setRecaptchaValue] = useState(null);
   const handleRecaptchaChange = (value) => {
      setRecaptchaValue(value);
   };

   const handleSubmit = async () => {
      if (recaptchaValue) {
         try {
            const response = await fetch("/verify-recaptcha", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({recaptchaValue}),
            });

            const result = await response.json();
            if (response.ok) {
               alert(result.message);
            } else {
               alert(result.message);
            }
         } catch (error) {
            console.error("Error:", error);
         }
      } else {
         alert("Please complete the reCAPTCHA.");
      }
   };

   return (
      <div
         style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg-white) !important",
            height: "1000px",
         }}>
         <div
            style={{
               width: "800px",
               height: "445px",
               borderRadius: "6px",
               backgroundColor: "var(--bg-white) !important",
               display: "flex",
            }}>
            <WrapperContainerLeft>
               <h1>TRA CỨU THÔNG TIN ĐẶT VÉ</h1>
               <InputFormComponent
                  style={{marginBottom: "3px"}}
                  labelText='Số điện thoại'
                  placeholderText='Vui lòng nhập số điện thoại'
               />
               <InputFormComponent
                  style={{marginBottom: "3px"}}
                  labelText='Mã vé'
                  placeholderText='Vui lòng nhập mã vé'
               />

               <div
                  style={{
                     marginTop: "10px",
                     textAlign: "center",
                     width: "100%",
                     display: "flex",
                     justifyContent: "center",
                  }}>
                  <ReCAPTCHA sitekey='6LcqhOIUAAAAAG8IgR3bw9SuyG4kqHD89WTC2IBj' onChange={handleRecaptchaChange} />
               </div>

               <ButtonComponent
                  size='large'
                  border={false}
                  style={{
                     height: "35px",
                     width: "30%",
                     border: "none",
                     borderRadius: "20px",
                     margin: "26px 35% 10px",
                  }}
                  textButton='Tra cứu'
                  onClick={handleSubmit}
               />
            </WrapperContainerLeft>
         </div>
      </div>
   );
};

export default BookingTicketManager;
