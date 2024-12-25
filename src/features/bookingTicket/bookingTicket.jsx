import React from "react";
import {ClockCircleOutlined, DollarOutlined, SwitcherOutlined, DeleteOutlined} from "@ant-design/icons";
import {Layout, Row, Col, Typography, Checkbox, Button, Space, Empty, Badge, Tooltip} from "antd";
import {useThemeToken} from "../../hooks/common/use-theme-token";
import "./styles/styles.scss";
const {Title, Text} = Typography;
import {useState} from "react";
import CardInfoTickets from "./components/cardInfoTickets";
import {useSelector} from "react-redux";

const BookingTicket = ({trips, onSelectTrip, searchParams}) => {
   const origins = useSelector((state) => state.address.provinces);
   const destinations = useSelector((state) => state.address.provinces);
   const from = origins.find((origin) => origin.province_id === searchParams.fromId);
   const to = destinations.find((destination) => destination.province_id === searchParams.toId);
   const {colorBgLayout} = useThemeToken();
   const [filter, setFilter] = useState({});
   const [filterSaveMoney, setFilterSaveMoney] = useState({});
   const [filterClock, setFilterClock] = useState({});
   const [filterSeat, setFilterSeat] = useState({});

   const handleFilter = (key, value) => {
      if (filter[key] === value) {
         setFilter({...filter, [key]: undefined});
      } else {
         setFilter({...filter, [key]: value});
      }
   };

   const handleFilterSaveMoney = (value) => {
      if (filterSaveMoney === value) {
         setFilterSaveMoney(undefined);
      } else {
         setFilterSaveMoney(value);
      }
   };

   const handleFilterClock = (value) => {
      if (filterClock === value) {
         setFilterClock(undefined);
      } else {
         setFilterClock(value);
      }
   };

   const handleFilterSeat = (value) => {
      if (filterSeat === value) {
         setFilterSeat(undefined);
      } else {
         setFilterSeat(value);
      }
   };

   const handleClearFilter = () => {
      setFilter({});
   };

   const filterTrips = (trips) => {
      if (!trips?.departureTrips) return [];
      return trips?.departureTrips
         ?.filter((trip) => {
            if (filter.time?.length > 0) {
               const hour = new Date(trip.trip_departure_time).getHours();
               const isValidTime = filter.time.some((timeRange) => {
                  switch (timeRange) {
                     case "earlyMorning":
                        return hour >= 0 && hour < 6;
                     case "morning":
                        return hour >= 6 && hour < 12;
                     case "afternoon":
                        return hour >= 12 && hour < 18;
                     case "evening":
                        return hour >= 18 && hour < 24;
                     default:
                        return true;
                  }
               });
               if (!isValidTime) return false;
            }
            if (filter?.type) {
               const vehicleType = trip.vehicle_type_name.toLowerCase();
               if (filter.type === "limousine" && !vehicleType.includes("limousine")) return false;
               if (filter.type === "seat" && !vehicleType.includes("ghế")) return false;
               if (filter.type === "bed" && !vehicleType.includes("giường")) return false;
            }
            if (filterSeat === "empty") {
               if (trip.available_seats === 0) return false;
            }
            if (filterSaveMoney === "special") {
               if (parseFloat(trip?.trip_discount) <= 0) return false;
            }
            if (
               filter?.floor &&
               (trip.vehicle_type_name.toLowerCase().includes("limousine") ||
                  trip.vehicle_type_name.toLowerCase().includes("giường"))
            ) {
               const availableSeats = trip.booking_seats.filter((seat) => seat.booking_seat_status === 0);
               if (filter.floor === "top") {
                  const hasTopFloorSeats = availableSeats.some(
                     (seat) => parseInt(seat.seat_name.substring(1)) >= 1 && parseInt(seat.seat_name.substring(1)) <= 17
                  );
                  if (!hasTopFloorSeats) return false;
               }
               if (filter.floor === "bottom") {
                  const hasBottomFloorSeats = availableSeats.some(
                     (seat) =>
                        parseInt(seat.seat_name.substring(1)) >= 18 && parseInt(seat.seat_name.substring(1)) <= 34
                  );
                  if (!hasBottomFloorSeats) return false;
               }
            }
            if (filter?.row) {
               const availableSeats = trip.booking_seats.filter((seat) => seat.booking_seat_status === 0);
               const getSeatNumber = (seat) => parseInt(seat.seat_name.substring(1));
               if (filter.row === "first") {
                  const hasFrontSeats = availableSeats.some((seat) => {
                     const num = getSeatNumber(seat);
                     return (num >= 1 && num <= 6) || (num >= 18 && num <= 24);
                  });
                  if (!hasFrontSeats) return false;
               }
               if (filter.row === "middle") {
                  const hasMiddleSeats = availableSeats.some((seat) => {
                     const num = getSeatNumber(seat);
                     return (num >= 7 && num <= 12) || (num >= 25 && num <= 30);
                  });
                  if (!hasMiddleSeats) return false;
               }
               if (filter.row === "last") {
                  const hasLastSeats = availableSeats.some((seat) => {
                     const num = getSeatNumber(seat);
                     return (num >= 13 && num <= 17) || (num >= 31 && num <= 34);
                  });
                  if (!hasLastSeats) return false;
               }
            }
            return true;
         })
         .sort((a, b) => {
            if (filterClock === "early") {
               const timeA = new Date(a.trip_departure_time).getTime();
               const timeB = new Date(b.trip_departure_time).getTime();
               return timeA - timeB;
            }
            return 0;
         });
   };

   return (
      <>
         <section className='layout flex h-full flex-col pb-[10rem] 2lg:pt-[36rem]'>
            <Layout style={{margin: "0", padding: "0", backgroundColor: colorBgLayout}}>
               <div
                  style={{
                     margin: "0",
                     padding: "0",
                     height: "100%",
                     display: "flex",
                     width: "100%",
                     alignItems: "start",
                     justifyContent: "space-between",
                     gap: "5px",
                  }}>
                  <div className='bg-white m-0 w-[30%] p-0'>
                     <div
                        style={{
                           padding: "0px",
                           backgroundColor: "white",
                           borderRadius: "12px",
                           border: "1px solid rgba(239, 82, 34, 0.6)",
                           outline: "8px solid rgba(170, 46, 8, 0.1)",
                        }}>
                        <div className='flex items-center justify-between p-[16px]'>
                           <div className='flex items-center justify-start gap-2'>
                              <span className='text-[16px] font-[600] uppercase text-[#111111]'>BỘ LỌC TÌM KIẾM</span>
                              <Badge count={filter ? Object.keys(filter).length : 0} />
                           </div>
                           <Button
                              onClick={handleClearFilter}
                              style={{
                                 color: "#E12424",
                                 padding: "2px",
                                 fontWeight: "bold",
                                 fontSize: "16px",
                                 gap: "4px",
                              }}
                              type='text'
                              icon={<DeleteOutlined />}
                              iconPosition='end'>
                              Xóa bộ lọc
                           </Button>
                        </div>
                        <div className='divide h-[1px] w-full bg-[#E12424]'></div>
                        <div className='p-[16px] font-InterTight text-[16px]'>
                           <div className='flex items-center justify-start gap-2'>
                              <span className='text-[16px] font-[600]'>Giờ đi</span>
                              <Badge
                                 count={filter.time ? filter.time.length : 0}
                                 style={{backgroundColor: "#52c41a"}}
                              />
                           </div>
                           <Checkbox.Group
                              value={filter.time}
                              style={{display: "block", marginTop: "10px"}}
                              onChange={(checkedValues) => handleFilter("time", checkedValues)}>
                              <Checkbox value='earlyMorning' checked={filter.time === "earlyMorning"}>
                                 Sáng sớm 00:00 - 06:00 (0)
                              </Checkbox>
                              <Checkbox value='morning' checked={filter.time === "morning"}>
                                 Buổi sáng 06:00 - 12:00 (0)
                              </Checkbox>
                              <Checkbox value='afternoon' checked={filter.time === "afternoon"}>
                                 Buổi chiều 12:00 - 18:00 (0)
                              </Checkbox>
                              <Checkbox value='evening' checked={filter.time === "evening"}>
                                 Buổi tối 18:00 - 24:00 (0)
                              </Checkbox>
                           </Checkbox.Group>
                        </div>
                        <div className='divide'></div>
                        <div className='p-[16px] font-InterTight text-[16px]'>
                           <span className='text-[16px] font-[600]'>Loại xe</span>
                           <Space style={{width: "100%", marginTop: "20px"}}>
                              <Button
                                 type='default'
                                 onClick={() => handleFilter("type", "seat")}
                                 color={filter.type === "seat" ? "danger" : "default"}
                                 variant='outlined'>
                                 Ghế
                              </Button>
                              <Button
                                 type='default'
                                 onClick={() => handleFilter("type", "bed")}
                                 color={filter.type === "bed" ? "danger" : "default"}
                                 variant='outlined'>
                                 Giường
                              </Button>
                              <Button
                                 type='default'
                                 onClick={() => handleFilter("type", "limousine")}
                                 color={filter.type === "limousine" ? "danger" : "default"}
                                 variant='outlined'>
                                 Limousine
                              </Button>
                           </Space>
                        </div>
                        <div className='divide'></div>
                        <div className='p-[16px] font-InterTight text-[16px]'>
                           <span className='text-[16px] font-[600]'>Hàng ghế</span>
                           <Space style={{width: "100%", marginTop: "20px"}}>
                              <Button
                                 type='default'
                                 onClick={() => handleFilter("row", "first")}
                                 color={filter.row === "first" ? "danger" : "default"}
                                 variant='outlined'>
                                 Hàng đầu
                              </Button>
                              <Button
                                 type='default'
                                 onClick={() => handleFilter("row", "middle")}
                                 color={filter.row === "middle" ? "danger" : "default"}
                                 variant='outlined'>
                                 Hàng giữa
                              </Button>
                              <Button
                                 type='default'
                                 onClick={() => handleFilter("row", "last")}
                                 color={filter.row === "last" ? "danger" : "default"}
                                 variant='outlined'>
                                 Hàng cuối
                              </Button>
                           </Space>
                        </div>
                        <div className='divide'></div>
                        <div className='p-[16px] font-InterTight text-[16px]'>
                           <span className='text-[16px] font-[600]'>Tầng</span>
                           <Space style={{width: "100%", marginTop: "20px"}}>
                              <Button
                                 type='default'
                                 onClick={() => handleFilter("floor", "top")}
                                 color={filter.floor === "top" ? "danger" : "default"}
                                 variant='outlined'>
                                 Tầng trên
                              </Button>
                              <Button
                                 type='default'
                                 onClick={() => handleFilter("floor", "bottom")}
                                 color={filter.floor === "bottom" ? "danger" : "default"}
                                 variant='outlined'>
                                 Tầng dưới
                              </Button>
                           </Space>
                        </div>
                     </div>
                  </div>
                  <div
                     style={{margin: "0", padding: "0", backgroundColor: colorBgLayout}}
                     className='mb-1 flex h-full w-[68%] flex-col items-start justify-center'>
                     <div style={{padding: "0px"}} className='w-full'>
                        <div className='flex items-center justify-between'>
                           <Title level={3}>
                              {from?.province_name} - {to?.province_name} ({trips?.departureTrips?.length})
                           </Title>
                        </div>
                        <div className='flex w-full items-center justify-start gap-3'>
                           <Button
                              size='large'
                              style={{fontWeight: "bold"}}
                              color={filterSaveMoney === "special" ? "danger" : "default"}
                              variant={filterSaveMoney === "special" ? "solid" : "outlined"}
                              icon={<DollarOutlined style={{fontSize: "20px"}} />}
                              onClick={() => handleFilterSaveMoney("special")}>
                              Giảm giá đặc biệt
                           </Button>
                           <Button
                              size='large'
                              color={filterClock === "early" ? "danger" : "default"}
                              variant={filterClock === "early" ? "solid" : "outlined"}
                              icon={<ClockCircleOutlined style={{fontSize: "20px"}} />}
                              onClick={() => handleFilterClock("early")}>
                              Giờ đi sớm nhất
                           </Button>
                           <Button
                              size='large'
                              color={filterSeat === "empty" ? "danger" : "default"}
                              variant={filterSeat === "empty" ? "solid" : "outlined"}
                              icon={<SwitcherOutlined style={{fontSize: "20px"}} />}
                              onClick={() => handleFilterSeat("empty")}>
                              Ghế trống
                           </Button>
                        </div>
                        {filterTrips(trips)?.length === 0 ? (
                           <div className='mt-[100px] flex h-full items-center justify-center'>
                              <Empty
                                 className='flex flex-col items-center justify-center'
                                 imageStyle={{height: 150}}
                                 image={<img src='https://futabus.vn/images/empty_list.svg' alt='empty' />}
                                 description={<span>Không có kết quả được tìm thấy.</span>}
                              />
                           </div>
                        ) : (
                           <div className='flex flex-col gap-[20px] py-5'>
                              {filterTrips(trips)?.map((trip, index) => (
                                 <CardInfoTickets tripInfo={trip} key={index} onSelectTrip={onSelectTrip} />
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </Layout>
         </section>
      </>
   );
};

export default BookingTicket;
