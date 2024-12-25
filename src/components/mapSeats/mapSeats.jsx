import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { WarningOutlined } from "@ant-design/icons";

// Constants cho các loại ghế
const SEAT_TYPES = {
   GHE: "GHE",
   GIUONG: "GIUONG",
   LIMOUSINE: "LIMOUSINE",
};

// Constants cho trạng thái ghế
const SEAT_STATUS = {
   AVAILABLE: "AVAILABLE",
   DISABLED: "DISABLED",
   SELECTED: "SELECTED",
   BOOKED: "BOOKED",
};

const seatIcons = {
   [SEAT_STATUS.DISABLED]: "https://futabus.vn/images/icons/seat_disabled.svg",
   [SEAT_STATUS.AVAILABLE]: "https://futabus.vn/images/icons/seat_active.svg",
   [SEAT_STATUS.SELECTED]: "https://futabus.vn/images/icons/seat_selecting.svg",
   [SEAT_STATUS.BOOKED]: "https://futabus.vn/images/icons/seat_disabled.svg",
};

const MapSeat = ({
   type = SEAT_TYPES.GHE,
   seatList = [], // Danh sách ghế và trạng thái
   selectedSeats = [], // Ghế đã chọn
   onSeatSelect, // Callback khi chọn ghế
   maxSelect = 5, // Số ghế tối đa được chọn
}) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleSeatClick = (seat) => {
      if (!seat?.booking_seat_id || seat.is_locked === 1 || seat.booking_seat_status === 1) {
         return;
      }

      const isSelected = selectedSeats?.find((s) => s?.booking_seat_id === seat.booking_seat_id);

      if (isSelected) {
         const newSelectedSeats = selectedSeats?.filter((s) => s?.booking_seat_id !== seat.booking_seat_id);
         onSeatSelect(newSelectedSeats);
      } else {
         if (selectedSeats?.length < maxSelect) {
            onSeatSelect([...selectedSeats, seat]);
         } else {
            setIsModalOpen(true);
         }
      }
   };

   const getSeatIcon = (seat) => {
      if (selectedSeats.find((s) => s.booking_seat_id === seat.booking_seat_id)) {
         return seatIcons[SEAT_STATUS.SELECTED];
      }
      return seatIcons[
         seat?.is_locked === 1
            ? SEAT_STATUS.DISABLED
            : seat?.booking_seat_status === 1
               ? SEAT_STATUS.BOOKED
               : SEAT_STATUS.AVAILABLE
      ];
   };

   const getSeatTextColor = (seat) => {
      if (seat?.is_locked === 1 || seat?.booking_seat_status === 1) {
         return "text-[#A2ABB3]";
      }
      if (selectedSeats.find((s) => s.booking_seat_id === seat.booking_seat_id)) {
         return "text-[#EF5222]";
      }
      return "text-[#339AF4]";
   };

   const [seatListData, setSeatListData] = useState([]);

   useEffect(() => {
      const sortedSeatList = seatList?.sort((a, b) => {
         const numA = parseInt(a?.seat_name.replace(/\D/g, ""));
         const numB = parseInt(b?.seat_name.replace(/\D/g, ""));
         return numA - numB;
      });
      setSeatListData(sortedSeatList);
   }, [seatList]);

   const getSeatClassName = (seat) => {
      return `relative ${!seat || seat.is_locked === 1 || seat.booking_seat_status === 1
         ? "cursor-not-allowed pointer-events-none opacity-70"
         : "cursor-pointer"
         } text-center`;
   };

   return (
      <>
         <div className='flex w-full flex-col items-center'>
            <div className='min-w-[50%]'>
               <div className='mx-auto flex w-full flex-col p-2'>
                  {/* Legend */}
                  <div className='mb-10 flex items-center justify-between text-sm font-medium gap-12'>
                     <span className='flex items-center'>
                        <div className='mr-2 h-4 w-4 rounded border border-[#C0C6CC] bg-[#D5D9DD]'></div>
                        Đã bán
                     </span>
                     <span className='flex items-center'>
                        <div className='mr-2 h-4 w-4 rounded border border-[#96C5E7] bg-[#DEF3FF]'></div>
                        Trống
                     </span>
                     <span className='flex items-center'>
                        <div className='mr-2 h-4 w-4 rounded border border-[#F8BEAB] bg-[#FDEDE8]'></div>
                        Đang chọn
                     </span>
                  </div>
                  {type === SEAT_TYPES.GHE && (
                     <div className='flex w-full flex-col items-center'>
                        <div className='min-w-[50%]'>
                           <div className='flex flex-col items-center'>
                              <div className='flex flex-col items-center'>
                                 <div className='mb-2 flex items-center justify-center'>
                                    <span className='text-gray-600 font-semibold'>Downstairs</span>
                                 </div>
                                 {Array.from({ length: Math.ceil((seatListData.length - 4) / 3) }).map((_, rowIndex) => {
                                    const startIdx = rowIndex * 3;
                                    const rowSeats = seatListData.slice(startIdx, startIdx + 3);
                                    const isLastRow = startIdx >= 21;
                                    return (
                                       <div key={`row-${rowIndex}`} className='mt-2 grid grid-cols-4 gap-6'>
                                          {isLastRow ? (
                                             // Render hàng cuối với 4 ghế
                                             <>
                                                {seatListData.slice(-4).map((seat) => (
                                                   <div
                                                      key={seat.booking_seat_id}
                                                      className={getSeatClassName(seat)}
                                                      onClick={() => handleSeatClick(seat)}>
                                                      <img
                                                         className='mx-auto'
                                                         width='32'
                                                         src={getSeatIcon(seat)}
                                                         alt='seat icon'
                                                      />
                                                      <span
                                                         className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                                            seat
                                                         )}`}>
                                                         {seat?.seat_name}
                                                      </span>
                                                   </div>
                                                ))}
                                             </>
                                          ) : (
                                             // Render các hàng bình thường với 3 ghế + khoảng trống
                                             <>
                                                {/* Ghế 1 */}
                                                <div
                                                   className={getSeatClassName(rowSeats[0])}
                                                   onClick={() => handleSeatClick(rowSeats[0])}>
                                                   <img
                                                      className='mx-auto'
                                                      width='32'
                                                      src={getSeatIcon(rowSeats[0])}
                                                      alt='seat icon'
                                                   />
                                                   <span
                                                      className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                                         rowSeats[0]
                                                      )}`}>
                                                      {rowSeats[0]?.seat_name}
                                                   </span>
                                                </div>

                                                {/* Ghế 2 */}
                                                <div
                                                   className={getSeatClassName(rowSeats[1])}
                                                   onClick={() => handleSeatClick(rowSeats[1])}>
                                                   <img
                                                      className='mx-auto'
                                                      width='32'
                                                      src={getSeatIcon(rowSeats[1])}
                                                      alt='seat icon'
                                                   />
                                                   <span
                                                      className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                                         rowSeats[1]
                                                      )}`}>
                                                      {rowSeats[1]?.seat_name}
                                                   </span>
                                                </div>

                                                {/* Khoảng trống giữa */}
                                                <div className='w-6'></div>

                                                {/* Ghế 3 */}
                                                <div
                                                   className={getSeatClassName(rowSeats[2])}
                                                   onClick={() => handleSeatClick(rowSeats[2])}>
                                                   <img
                                                      className='mx-auto'
                                                      width='32'
                                                      src={getSeatIcon(rowSeats[2])}
                                                      alt='seat icon'
                                                   />
                                                   <span
                                                      className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                                         rowSeats[2]
                                                      )}`}>
                                                      {rowSeats[2]?.seat_name}
                                                   </span>
                                                </div>
                                             </>
                                          )}
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
                  {
                     (type === SEAT_TYPES.GIUONG || type === SEAT_TYPES.LIMOUSINE) && (
                        <div className='flex flex-nowrap items-start justify-center gap-10'>
                           {/* Tầng dưới */}
                           <div className='flex flex-col items-center'>
                              <div className='mb-2 flex items-center justify-center'>
                                 <span className='text-gray-600 font-semibold'>Tầng dưới</span>
                              </div>
                              <div className='grid grid-cols-3 gap-4'>
                                 {/* Hàng đầu tiên - chỉ có 2 ghế */}
                                 <div
                                    className={getSeatClassName(seatListData[0])}
                                    onClick={() => handleSeatClick(seatListData[0])}>
                                    <img
                                       className='mx-auto'
                                       width='32'
                                       src={getSeatIcon(seatListData[0])}
                                       alt='seat icon'
                                    />
                                    <span
                                       className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                          seatListData[0]
                                       )}`}>
                                       {seatListData[0]?.seat_name}
                                    </span>
                                 </div>
                                 <div className='invisible relative'>{/* Ghế ẩn */}</div>
                                 <div
                                    className={getSeatClassName(seatListData[1])}
                                    onClick={() => handleSeatClick(seatListData[1])}>
                                    <img
                                       className='mx-auto'
                                       width='32'
                                       src={getSeatIcon(seatListData[1])}
                                       alt='seat icon'
                                    />
                                    <span
                                       className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                          seatListData[1]
                                       )}`}>
                                       {seatListData[1]?.seat_name}
                                    </span>
                                 </div>
                                 {/* Các hàng còn lại của tầng dưới */}
                                 {seatListData
                                    .filter((seat) => {
                                       const seatNum = parseInt(seat.seat_name.replace(/\D/g, ""));
                                       return seatNum > 2 && seatNum <= 17; // Từ ghế 3-17
                                    })
                                    .map((seat) => (
                                       <div
                                          key={seat.booking_seat_id}
                                          className={getSeatClassName(seat)}
                                          onClick={() => handleSeatClick(seat)}>
                                          <img className='mx-auto' width='32' src={getSeatIcon(seat)} alt='seat icon' />
                                          <span
                                             className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                                seat
                                             )}`}>
                                             {seat?.seat_name}
                                          </span>
                                       </div>
                                    ))}
                              </div>
                           </div>

                           {/* Tầng trên - tương tự */}
                           <div className='flex flex-col items-center'>
                              <div className='mb-2 flex items-center justify-center'>
                                 <span className='text-gray-600 font-semibold'>Tầng trên</span>
                              </div>
                              <div className='grid grid-cols-3 gap-4'>
                                 {/* Hàng đầu tiên - chỉ có 2 ghế */}
                                 <div
                                    className={getSeatClassName(seatListData[17])}
                                    onClick={() => handleSeatClick(seatListData[17])}>
                                    <img
                                       className='mx-auto'
                                       width='32'
                                       src={getSeatIcon(seatListData[17])}
                                       alt='seat icon'
                                    />
                                    <span
                                       className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                          seatListData[17]
                                       )}`}>
                                       {seatListData[17]?.seat_name}
                                    </span>
                                 </div>
                                 <div className='invisible relative'>{/* Ghế ẩn */}</div>
                                 <div
                                    className={getSeatClassName(seatListData[18])}
                                    onClick={() => handleSeatClick(seatListData[18])}>
                                    <img
                                       className='mx-auto'
                                       width='32'
                                       src={getSeatIcon(seatListData[18])}
                                       alt='seat icon'
                                    />
                                    <span
                                       className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                          seatListData[18]
                                       )}`}>
                                       {seatListData[18]?.seat_name}
                                    </span>
                                 </div>

                                 {/* Các hàng còn lại của tầng trên */}
                                 {seatListData
                                    .filter((seat) => {
                                       const seatNum = parseInt(seat.seat_name.replace(/\D/g, ""));
                                       return seatNum > 19 && seatNum <= 34; // Từ ghế 20-34
                                    })
                                    .map((seat) => (
                                       <div
                                          key={seat.booking_seat_id}
                                          className={getSeatClassName(seat)}
                                          onClick={() => handleSeatClick(seat)}>
                                          <img className='mx-auto' width='32' src={getSeatIcon(seat)} alt='seat icon' />
                                          <span
                                             className={`absolute left-1/2 top-1 -translate-x-1/2 transform text-xs font-semibold ${getSeatTextColor(
                                                seat
                                             )}`}>
                                             {seat?.seat_name}
                                          </span>
                                       </div>
                                    ))}
                              </div>
                           </div>
                        </div>
                     )}
               </div>
            </div>
         </div>

         <Modal
            title='Thông báo'
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ className: "bg-orange-500" }}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#ff9800]'>
                  <WarningOutlined className='text-[#ff9800]' style={{ fontSize: "48px" }} />
               </div>
               <h3 className='text-lg font-semibold'>Bạn chỉ có thể chọn tối đa 5 ghế</h3>
               <p className='text-gray-500 text-sm'>Vui lòng chọn ít hơn 5 ghế</p>
            </div>
         </Modal>
      </>
   );
};

export { MapSeat, SEAT_TYPES, SEAT_STATUS };
