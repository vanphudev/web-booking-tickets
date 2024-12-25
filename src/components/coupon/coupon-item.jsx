import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Card } from "antd";
import Countdown from "react-countdown";
import "./styles.scss";
const CouponItem = ({ code, discount_percentage = 0, startDate, endDate }) => {
   const [isCopied, setIsCopied] = useState(false);

   // Xử lý sao chép
   const handleCopy = () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
   };

   return (
      <Card
         styles={{
            body: {
               padding: "10px",
            }
         }}
         className="rounded-xl shadow-lg p-2 border border-[#ff4e50] transition-all duration-500 relative"
         style={{ maxWidth: 400, minWidth: 400, borderRadius: "20px !important", }}
      >
         {/* Icon và Tiêu đề */}
         <div className="flex justify-end items-center mb-2">
            <div className="text-white text-2xl font-bold flex items-center mr-1">
               <i className="absolute -top-4 -left-2 text-[50px] transform -rotate-12">🎉</i>
               Mã giảm giá {discount_percentage}%
            </div>
         </div>

         {/* Mã giảm giá và nút Copy trên cùng một dòng */}
         <div className="flex items-center justify-between gap-4">
            <div className="bg-white text-center rounded-md p-4 shadow-md text-lg font-bold text-gray-800 flex-1">
               {code}
            </div>
         </div>

         <div className="mt-4 text-center text-white">
            <Countdown
               date={new Date(endDate)}
               renderer={({ days, hours, minutes, seconds }) => (
                  <div className="text-lg font-semibold">
                     {days} ngày {hours} giờ {minutes} phút {seconds} giây
                  </div>
               )}
            />
         </div>

         {/* Countdown bên dưới */}
         <div className="mt-4 text-left text-white flex items-center justify-between gap-4">
            <div className="text-sm mt-1">
               Hết hạn: {new Date(endDate).toLocaleDateString('vi-VN')}
            </div>
            <CopyToClipboard text={code} onCopy={handleCopy}>
               <button
                  className={`btn-grad whitespace-nowrap ${isCopied ? "hover:!bg-green-500" : ""}`}
               >
                  {isCopied ? "Đã sao chép!" : "Sao chép"}
               </button>
            </CopyToClipboard>
         </div>

      </Card>
   );
};

export default CouponItem;
