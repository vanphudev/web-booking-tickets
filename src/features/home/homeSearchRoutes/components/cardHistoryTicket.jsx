import React from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../../../../hooks/common/contentContext";

const removeLocationPrefix = (provinceName) => {
   return provinceName.replace(/^Thành phố\s|^Tỉnh\s/, "");
};

const CardHistoryTicket = ({ from, to, fromTime, fromId, toId, fromName, toName, ticketCount }) => {
   const navigate = useNavigate();
   const { setSearchParams } = useContent();
   const today = new Date().toLocaleDateString('en-CA');
   const fromTimeDate = new Date(fromTime).toLocaleDateString('en-CA');
   const validFromTime = fromTimeDate < today ? today : fromTime;

   return (
      <div
         onClick={() => {
            setSearchParams({
               from,
               fromName,
               fromId,
               fromTime: validFromTime,
               to,
               toName,
               toId,
               isReturn: false,
               ticketCount: ticketCount || 1,
            });
            navigate(
               `/booking-ticket?from=${from}&fromId=${fromId}&fromTime=${validFromTime}&to=${to}&toId=${toId}&isReturn=false&ticketCount=${ticketCount || 1
               }`
            );
         }}
         className='flex cursor-pointer flex-col gap-2 bg-[#f9f9fa] p-2 px-8 transition-all duration-300 ease-in-out hover:bg-[#ffffff] hover:text-[#EF5222] hover:shadow-md'
         style={{ width: "max-content", borderRadius: "8px", border: "1px solid #d9d9d9" }}>
         <h3 className='text-[15px] font-medium'>{`${removeLocationPrefix(fromName)} - ${removeLocationPrefix(
            toName
         )}`}</h3>
         <p className='text-gray text-[13px]'>
            {fromTime || ""} - SL: {ticketCount || 1}
         </p>
      </div>
   );
};

export default CardHistoryTicket;
