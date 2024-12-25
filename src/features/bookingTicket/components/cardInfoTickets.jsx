import React, {useState} from "react";
import {Button, Tabs, message, Spin} from "antd";
import "./styles.scss";
import Reviews from "./reviews";
import RoutesApi from "../../../api/routeApi";
import ReviewsApi from "../../../api/reviewApi";
import {UserOutlined} from "@ant-design/icons";

const boxShadowActive = "0 4px 4px rgba(239, 82, 34, .3), 0 -2px 8px rgba(239, 82, 34, .3), inset 0 0 0 0.6px #ef5222";
const boxShadow = "0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .2";

const Transshipment = () => {
   return (
      <div className='mt-2 flex h-96 justify-center overflow-y-auto rounded-b-xl bg-[#FBFBFB] px-1 pb-4'>
         <div className='w-full px-5 text-base'>
            <div className='pb-4'>
               <p className='font-bold'>Dịch vụ đón/trả khách tận nơi:</p>
               <ul className='ml-5 list-disc text-[15px]'>
                  <li>
                     <strong>Thời gian nhận khách:</strong>
                     <em>Trước 4 tiếng.</em>
                  </li>
                  <li>
                     <strong>Thời gian đón:</strong>
                     <em>
                        Chuẩn bị trước 2-3 tiếng do mật độ giao thông trong thành phố cao. Tài xế sẽ liên hệ thông báo
                        thời gian đón cụ thể vì có thể đón nhiều điểm.
                     </em>
                  </li>
                  <li>
                     <strong>Hẻm nhỏ không quay xe được:</strong>
                     <em>Xe sẽ đón khách ở đầu hẻm/đường.</em>
                  </li>
                  <li>
                     <strong>Khu vực có biển cấm đỗ xe:</strong>
                     <em>Xe sẽ đón tại vị trí gần nhất có thể.</em>
                  </li>
                  <li>
                     <strong>Hành lý:</strong>
                     <em>
                        Hành lý gọn nhẹ dưới 20kg. Không vận chuyển thú cưng, đồ có mùi, hoặc vật dụng có thể rò rỉ trên
                        xe.
                     </em>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   );
};

const Policy = () => {
   return (
      <div className='mt-2 flex h-96 justify-center overflow-y-auto rounded-b-xl bg-[#FBFBFB] px-1 pb-4'>
         <div className='overflow-auto'>
            <div className='flex flex-col px-4 py-2'>
               <div className='pb-2 text-lg font-medium'>Chính sách hủy vé</div>
               <ul className='content-editor has-bullet no-margin text-[15px]'>
                  <li>Vé chỉ được đổi một lần.</li>
                  <li>
                     Chi phí hủy vé từ 10% đến 30% giá vé tùy thuộc vào thời gian hủy so với thời gian đi xe được ghi
                     trên vé và số lượng vé cá nhân/nhóm áp dụng theo quy định hiện hành.
                  </li>
                  <li>
                     Nếu bạn cần đổi hoặc hủy vé đã thanh toán, liên hệ Call Center (1900 6067) hoặc tại quầy vé ít nhất
                     24 giờ trước thời gian đi xe được ghi trên vé, qua email hoặc tin nhắn để được hướng dẫn thêm.
                  </li>
               </ul>
            </div>
            <div className='divide h-[6px] bg-[#F7F7F7]'></div>
            <div className='flex flex-col px-4 py-2'>
               <div className='pb-2 text-lg font-medium'>Yêu cầu khi lên xe</div>
               <ul className='content-editor has-bullet no-margin text-[15px]'>
                  <li>
                     Tại điểm đón/bến xe, bạn cần có mặt trước 30 phút so với thời gian đi xe (đối với ngày lễ và Tết,
                     cần có mặt trước 60 phút).
                  </li>
                  <li>
                     Cung cấp thông tin vé (qua SMS/Email/Futa App) hoặc liên hệ quầy vé để xác nhận trước khi lên xe.
                     boarding.
                  </li>
                  <li>Không mang thức ăn hoặc đồ uống có mùi hăng lên xe.</li>
                  <li>Không hút thuốc, uống rượu, hoặc sử dụng chất kích thích trên xe.</li>
                  <li>Không mang các vật dụng dễ cháy, nổ lên xe.</li>
                  <li>Không vứt rác trên xe.</li>
                  <li>Không mang thú cưng lên xe.</li>
               </ul>
            </div>
            <div className='divide h-[6px] bg-[#F7F7F7]'></div>
            <div className='flex flex-col px-4 py-2'>
               <div className='pb-2 text-lg font-medium'>Hành lý tay</div>
               <ul className='content-editor has-bullet no-margin text-[15px]'>
                  <li>Tổng trọng lượng hành lý không được vượt quá 20kg.</li>
                  <li>Không vận chuyển hàng cồng kềnh.</li>
               </ul>
            </div>
            <div className='divide h-[6px] bg-[#F7F7F7]'></div>
            <div className='flex flex-col px-4 py-2'>
               <div className='pb-2 text-lg font-medium'>Hành lý tay</div>
               <ul className='content-editor has-bullet no-margin text-[15px]'>
                  <li>Trẻ em dưới 6 tuổi, cao dưới 1.3m, và cân nặng dưới 30kg không cần mua vé.</li>
                  <li>Trẻ em không đáp ứng được các tiêu chí trên phải mua một vé tương đương với vé người lớn.</li>
                  <li>Mỗi người lớn có thể đi kèm tối đa một trẻ em.</li>
                  <li>Hành khách mang thai cần đảm bảo sức khỏe trong suốt chuyến đi.</li>
               </ul>
            </div>
            <div className='divide h-[6px] bg-[#F7F7F7]'></div>
            <div className='flex flex-col px-4 py-2'>
               <div className='pb-2 text-lg font-medium'>Vé đón/trả khách</div>
               <ul className='content-editor has-bullet no-margin text-[15px]'>
                  <li>
                     Liên hệ hotline (19006067) để đăng ký ít nhất 2 giờ trước thời gian đi xe. Chuẩn bị hành lý nhỏ,
                     gọn nhẹ (tối đa 20kg).
                  </li>
                  <li>Dịch vụ đón/trả khách có sẵn tại các điểm thuận tiện dọc tuyến đường.</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

const Schedule = ({loading, pickupPoints, tripInfo, ways}) => {
   return (
      <div className='relative mt-2 flex h-96 justify-center overflow-y-auto rounded-b-xl bg-[#FBFBFB] pb-4'>
         {loading ? (
            <div className='flex h-full items-center justify-center'>
               <Spin size='large' tip='Đang tải điểm đón...' className='z-[99999]' />
            </div>
         ) : (
            <div className='flex w-full flex-col overflow-auto pb-20'>
               {pickupPoints
                  ?.sort((a, b) => a?.pickup_point_kind - b?.pickup_point_kind)
                  .map((point, index) => {
                     // Tính toán thời gian cho từng điểm
                     let pointTime;
                     if (point?.pickup_point_kind === -1) {
                        // Điểm xuất phát lấy giờ của chuyến xe
                        pointTime = new Date(tripInfo?.trip_departure_time).toLocaleTimeString("vi-VN", {
                           hour: "2-digit",
                           minute: "2-digit",
                           hour12: false,
                        });
                     } else if (point?.pickup_point_kind === 1) {
                        // Điểm cuối lấy giờ kết thúc
                        pointTime = new Date(tripInfo?.trip_arrival_time).toLocaleTimeString("vi-VN", {
                           hour: "2-digit",
                           minute: "2-digit",
                           hour12: false,
                        });
                     } else {
                        // Các điểm dọc đường cộng thêm số phút từ pickup_point_time
                        const baseTime = new Date(tripInfo?.trip_departure_time);
                        const newTime = new Date(baseTime.getTime() + point?.pickup_point_time * 60000);
                        const arrivalTime = new Date(tripInfo?.trip_arrival_time);

                        // Kiểm tra nếu thời gian mới vượt quá thời gian đến
                        if (newTime > arrivalTime) {
                           pointTime = new Date(tripInfo?.trip_arrival_time).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                           });
                        } else {
                           pointTime = newTime.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                           });
                        }
                     }

                     return (
                        <div className='text-black relative flex items-start px-4 text-[15px]' key={index}>
                           {point.pickup_point_kind !== 1 && (
                              <div className='absolute left-[78px] top-2 h-full border-r-2 border-dotted text-[#C8CCD3]'></div>
                           )}
                           <span className='font-medium'>{pointTime}</span>
                           <img
                              className='z-10 mx-4 mt-1'
                              src={
                                 point?.pickup_point_kind === 1
                                    ? "https://futabus.vn/images/icons/station.svg"
                                    : point?.pickup_point_kind === 0
                                    ? "https://futabus.vn/images/icons/pickup_gray.svg"
                                    : "https://futabus.vn/images/icons/pickup.svg"
                              }
                              alt='pickup'
                           />
                           <div className='mb-4'>
                              <div className='font-medium'>{point?.pickup_point_name}</div>
                              <div className='text-gray-500 text-[13px] leading-4'>
                                 {point?.office?.address || point?.pickup_point_description}
                              </div>
                           </div>
                        </div>
                     );
                  })}

               <div className='absolute bottom-0 z-20 w-[100%] rounded-b-lg bg-[#F7F7F7] px-4 py-2 text-[13px]'>
                  <span className='text-[15px] font-medium'>Noted</span>
                  <br />
                  <span className='font-medium'>{ways?.way_name}</span>
                  <br />
                  <span>{ways?.way_description}</span>
               </div>
            </div>
         )}
      </div>
   );
};

// Hàm helper để chuyển đổi UTC sang múi giờ Việt Nam
const convertToVNTime = (utcTime) => {
   return new Date(utcTime).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
   });
};

// Hàm tính thời gian di chuyển đã được điều chỉnh
const calculateDuration = (departure, arrival) => {
   const startTime = new Date(departure);
   const endTime = new Date(arrival);

   const durationInMinutes = (endTime - startTime) / (1000 * 60);
   const hours = Math.floor(durationInMinutes / 60);
   const minutes = Math.floor(durationInMinutes % 60);

   return {hours, minutes};
};

const formatCurrency = (amount) => {
   const roundedAmount = Math.round(amount);
   return roundedAmount?.toLocaleString("vi-VN") + "đ";
};

export default function CardInfoTickets({tripInfo, onSelectTrip}) {
   const [activeKey, setActiveKey] = useState(null);
   const [active, setActive] = useState(false);
   const [loading, setLoading] = useState(false);
   const [loadingReviews, setLoadingReviews] = useState(false);
   const [pickupPoints, setPickupPoints] = useState([]);
   const [ways, setWays] = useState([]);
   const [reviews, setReviews] = useState([]);

   const itemTabs = [
      {
         label: "Reviews",
         key: "1",
         children: <Reviews tripInfo={tripInfo} />,
      },
      {
         label: "Schedule",
         key: "2",
         children: (
            <Spin
               spinning={loading}
               size='large'
               tip='Loading...'
               style={{
                  width: "100%",
                  height: "130px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
               }}>
               {!loading && <Schedule loading={loading} pickupPoints={pickupPoints} tripInfo={tripInfo} ways={ways} />}
            </Spin>
         ),
      },
      {
         label: "Transshipment",
         key: "3",
         children: (
            <Spin
               spinning={loading}
               size='large'
               tip='Loading...'
               style={{
                  width: "100%",
                  height: "130px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
               }}>
               {!loading && <Transshipment />}
            </Spin>
         ),
      },
      {
         label: "Policy",
         key: "4",
         children: (
            <Spin spinning={loading} size='large' tip='Loading...'>
               {!loading && <Policy />}
            </Spin>
         ),
      },
   ];

   const handleSelectTab = async (key) => {
      if (activeKey === key) {
         setActiveKey(null);
      } else {
         setActiveKey(key);

         // Nếu chọn tab Schedule
         if (key === "2") {
            try {
               setLoading(true);
               const getRoutePickupPoints = async () => {
                  const res = await RoutesApi.getRoutePickupPoints(tripInfo?.route_id);
                  if (res?.status === 200) {
                     setPickupPoints(res?.metadata?.ways[0]?.pickup_points);
                     setWays(res?.metadata?.ways[0]);
                  }
               };
               getRoutePickupPoints();
            } catch (error) {
               message.error("Không thể tải danh sách điểm đón");
            } finally {
               setLoading(false);
            }
         }
      }
   };

   const handleActive = () => {
      setActive(!active);
   };

   return (
      <>
         <div
            className='flex max-h-[800px] w-[100%] flex-col gap-1 bg-bg-white p-3'
            style={{
               border: active ? ".1px solid #ef5222" : "0.5px solid #d1d5db",
               cursor: "pointer",
               borderRadius: "12px",
               boxShadow: active ? boxShadowActive : boxShadow,
            }}>
            <div onClick={handleActive} className='flex flex-nowrap items-start justify-between gap-8'>
               <div className='flex w-[100%] flex-col gap-3'>
                  <div className='flex flex-nowrap justify-between gap-3'>
                     <span className='text-2xl font-medium'>{convertToVNTime(tripInfo?.trip_departure_time)}</span>
                     <div className='flex flex-1 items-center justify-around'>
                        <img src='https://futabus.vn/images/icons/pickup.svg' alt='' />
                        <span className='flex-1 border-b-2 border-dotted text-[#C8CCD3]'></span>
                        <span className='text-gray text-center leading-4'>
                           <span className='text-[16px] font-medium text-[#8e8f92]'>
                              {calculateDuration(tripInfo?.trip_departure_time, tripInfo?.trip_arrival_time).hours}{" "}
                              hours {", "}{" "}
                              {calculateDuration(tripInfo?.trip_departure_time, tripInfo?.trip_arrival_time).minutes}{" "}
                              minutes
                           </span>
                           <br />
                           <span className='text-gray text-center leading-4 text-[#a8abb1]'>(Asia/Ho_Chi_Minh)</span>
                        </span>
                        <span className='flex-1 border-b-2 border-dotted text-[#C8CCD3]'></span>
                        <img src='https://futabus.vn/images/icons/station.svg' alt='' />
                     </div>
                     <span className='text-2xl font-medium'>{convertToVNTime(tripInfo?.trip_arrival_time)}</span>
                  </div>
                  <div className='flex flex-nowrap justify-between'>
                     <div className='flex flex-nowrap items-center justify-start'>
                        <span className='text-[15px] font-medium text-[#111111]'>{tripInfo?.origin_office}</span>
                     </div>
                     <div className='flex flex-nowrap items-center justify-start'>
                        <span className='text-[15px] font-medium text-[#111111]'>{tripInfo?.destination_office}</span>
                     </div>
                  </div>
               </div>
               <div className='flex min-w-[200px] flex-col justify-start gap-1'>
                  <div className='flex flex-nowrap items-center justify-start gap-3'>
                     <div className='h-[6px] w-[6px] rounded-full bg-[#C8CCD3]'></div>
                     <span className='text-[16px] font-medium text-[#C8CCD3]'>{tripInfo?.vehicle_type_name}</span>
                     <div className='h-[6px] w-[6px] rounded-full bg-[#C8CCD3]'></div>
                  </div>
                  <span className='text-[16px] font-bold text-text-green-color'>
                     {tripInfo?.available_seats} blank seat
                  </span>
                  <div className='mt-2 text-end'>
                     {tripInfo?.trip_discount > 0 ? (
                        <>
                           <span className='text-gray-400 mr-2 font-InterTight text-[18px] line-through'>
                              {formatCurrency(tripInfo?.trip_price)}
                           </span>
                           <span className='font-InterTight text-[22px] text-lg font-bold text-text-primary-color'>
                              {formatCurrency(
                                 tripInfo?.trip_price - (tripInfo?.trip_price * tripInfo?.trip_discount) / 100
                              )}
                           </span>
                        </>
                     ) : (
                        <span className='font-InterTight text-[22px] text-lg font-bold text-text-primary-color'>
                           {formatCurrency(tripInfo?.trip_price)}
                        </span>
                     )}
                  </div>
               </div>
            </div>
            <div className='divide'></div>
            <div className='flex flex-nowrap items-start justify-between gap-4'>
               <Tabs
                  activeKey={activeKey}
                  onTabClick={handleSelectTab}
                  tabBarExtraContent={
                     <Button type='primary' shape='round' onClick={() => onSelectTrip(tripInfo)}>
                        Select trip
                     </Button>
                  }
                  size={"large"}
                  style={{
                     width: "100%",
                  }}
                  items={itemTabs}
               />
            </div>
         </div>
      </>
   );
}
