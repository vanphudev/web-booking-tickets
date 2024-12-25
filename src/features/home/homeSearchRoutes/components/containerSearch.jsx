import React, { useState, useMemo, useEffect } from "react";
import { Radio, Row, Col, Flex, Input, Button, Typography, Select, Popover, List, Tag, DatePicker, Modal } from "antd";
import { CloseCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";
dayjs.extend(customParseFormat);
dayjs.locale("vi");
const { RangePicker } = DatePicker;
// const weekFormat = "MM/DD";
import "../styles/styleSearch.scss";
import "../styles/styleOverrideAnt.scss";
import { CheckOutlined } from "@ant-design/icons";
import switch_location from "../../../../assets/icons/switch_location.svg";
import arrow_down_select from "../../../../assets/icons/arrow_down_select.svg";
import circle_checkbox_checked from "../../../../assets/icons/circle_checkbox_checked.svg";
import CardHistoryTicket from "./cardHistoryTicket";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useContent } from "../../../../hooks/common/contentContext";

const CustomErrorModal = ({ visible, message, onClose }) => {
   return (
      <Modal
         open={visible}
         onCancel={onClose}
         footer={null}
         width={400}
         centered
         closable={false}
         className='custom-error-modal'>
         <div style={{ textAlign: "center", padding: "20px 0" }}>
            <WarningOutlined style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }} />
            <h3 style={{ fontSize: 20, margin: "16px 0", color: "#262626" }}>Thông báo</h3>
            <p style={{ fontSize: 16, color: "#595959", marginBottom: 24 }}>{message}</p>
            <button
               onClick={onClose}
               style={{
                  background: "#ff4d4f",
                  border: "none",
                  color: "white",
                  padding: "8px 32px",
                  borderRadius: "24px",
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all 0.3s",
               }}
               onMouseOver={(e) => (e.target.style.background = "#ff7875")}
               onMouseOut={(e) => (e.target.style.background = "#ff4d4f")}>
               Đóng
            </button>
         </div>
      </Modal>
   );
};

const removeVietnameseTones = (str) => {
   return str
      .normalize("NFD") // Tách các ký tự tổ hợp
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
      .replace(/đ/g, "d") // Thay thế 'đ' thường
      .replace(/Đ/g, "D"); // Thay thế 'Đ' hoa
};

const ContainerSearch = ({ searchParams = null, setSelectedTrip }) => {
   const navigate = useNavigate();
   const { setSearchParams } = useContent();
   const origins = useSelector((state) => state.address.provinces);
   const destinations = useSelector((state) => state.address.provinces);
   const [isRoundTrip, setIsRoundTrip] = useState(false);
   const [dateDeparture, setDateDeparture] = useState(dayjs());
   const [dateReturn, setDateReturn] = useState(dayjs());
   const [origin, setOrigin] = useState({ id: "", name: "" });
   const [destination, setDestination] = useState({ id: "", name: "" });
   const [openOriginPopover, setOpenOriginPopover] = useState(false);
   const [openDestinationPopover, setOpenDestinationPopover] = useState(false);
   const [quantity, setQuantity] = useState(1);
   const [errorModalVisible, setErrorModalVisible] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [searchParamsHistory, setSearchParamsHistory] = useState(() => {
      return JSON.parse(localStorage.getItem("recentSearches")) || [];
   });

   useEffect(() => {
      if (!searchParams) {
         setOrigin({
            id: searchParamsHistory[0]?.fromId || "",
            name: searchParamsHistory[0]?.fromName || "",
         });
         setDestination({
            id: searchParamsHistory[0]?.toId || "",
            name: searchParamsHistory[0]?.toName || "",
         });
         setDateDeparture(
            searchParamsHistory[0]?.fromTime
               ? dayjs(searchParamsHistory[0]?.fromTime).isBefore(dayjs())
                  ? dayjs()
                  : dayjs(searchParamsHistory[0]?.fromTime)
               : dayjs()
         );
         setQuantity(searchParamsHistory[0]?.ticketCount || 1);
      }

      if (searchParams?.fromId && origins?.length) {
         const originProvince = origins.find((province) => province?.province_id === searchParams?.fromId);
         if (originProvince) {
            setOrigin({
               id: searchParams?.fromId,
               name: originProvince?.province_name,
            });
         }
      }

      if (searchParams?.toId && destinations?.length) {
         const destinationProvince = destinations.find((province) => province?.province_id === searchParams?.toId);
         if (destinationProvince) {
            setDestination({
               id: searchParams?.toId,
               name: destinationProvince?.province_name,
            });
         }
      }

      if (searchParams?.ticketCount) {
         const count = searchParams.ticketCount;
         if (count < 1) {
            setQuantity(1);
         } else if (count > 5) {
            setQuantity(5);
         } else {
            setQuantity(count);
         }
      }

      if (searchParams?.fromTime) {
         const selectedDate = dayjs(searchParams?.fromTime);
         setDateDeparture(selectedDate.isBefore(dayjs().startOf("day")) ? dayjs() : selectedDate);
      }
   }, [searchParams, origins, destinations, setSearchParams, setSelectedTrip, searchParamsHistory]);

   const handleCloseTag = (name) => {
      console.log(name);
   };

   const handleChangeIsRoundTrip = () => {
      setIsRoundTrip(!isRoundTrip);
   };
   const handleChangeDateDeparture = (date, dateString) => {
      setDateDeparture(date);
   };
   const handleChangeDateRange = (dates) => {
      if (dates) {
         setDateDeparture(dates[0]);
         setDateReturn(dates[1]);
      } else {
         setDateDeparture(null);
         setDateReturn(null);
      }
   };

   const handleSwitchLocation = () => {
      const tempOrigin = { ...origin };
      setOrigin(destination);
      setDestination(tempOrigin);
   };

   const showError = (message) => {
      setErrorMessage(message);
      setErrorModalVisible(true);
   };

   const MAX_RECENT_SEARCHES = 4;

   const handleSearchTrip = (searchData) => {
      if (!searchData) return;
      const isDuplicate = searchParamsHistory.some(
         (item) =>
            item?.fromId === searchData?.fromId &&
            item?.toId === searchData?.toId &&
            item?.fromTime === searchData?.fromTime &&
            searchData?.ticketCount === item?.ticketCount
      );

      if (!isDuplicate) {
         const newSearchHistory = [searchData, ...searchParamsHistory].slice(0, MAX_RECENT_SEARCHES);
         setSearchParamsHistory(newSearchHistory);
         localStorage.setItem("recentSearches", JSON.stringify(newSearchHistory));
      }
      const baseUrl = "/booking-ticket";
      const urlParams = new URLSearchParams();
      urlParams.set("from", searchData?.from || "");
      urlParams.set("fromId", searchData?.fromId || "");
      urlParams.set("fromTime", searchData?.fromTime || "");
      urlParams.set("to", searchData?.to || "");
      urlParams.set("toId", searchData?.toId || "");
      urlParams.set("toTime", searchData?.toTime || "");
      urlParams.set("isReturn", searchData?.isReturn || false);
      urlParams.set("ticketCount", searchData?.ticketCount || 1);
      const fullUrl = `${baseUrl}?${urlParams.toString()}`;
      navigate(fullUrl, { replace: true });
      setSearchParams(searchData);
      setSelectedTrip(null);
   };

   const handleSearch = () => {
      if (!origin.id || !destination.id) {
         showError("Vui lòng chọn điểm đi và điểm đến");
         return;
      }
      if (!dateDeparture) {
         showError("Vui lòng chọn ngày đi");
         return;
      }
      if (dateDeparture.isBefore(dayjs().startOf("day"))) {
         showError("Ngày đi không được nhỏ hơn ngày hiện tại");
         return;
      }
      if (isRoundTrip && !dateReturn) {
         showError("Vui lòng chọn ngày về");
         return;
      }
      if (isRoundTrip && dateReturn && dateDeparture.isAfter(dateReturn)) {
         showError("Ngày về phải sau ngày đi");
         return;
      }
      if (!quantity || quantity < 1) {
         showError("Vui lòng chọn số lượng vé từ 1 đến 5");
         return;
      }
      const searchData = {
         from: removeVietnameseTones(origin?.name).toUpperCase().replace(/\s+/g, ""),
         fromName: origin?.name,
         fromId: origin?.id,
         fromTime: dateDeparture.format("YYYY-MM-DD"),
         to: removeVietnameseTones(destination?.name).toUpperCase().replace(/\s+/g, ""),
         toName: destination?.name,
         toId: destination?.id,
         isReturn: isRoundTrip,
         ticketCount: quantity,
         ...(isRoundTrip && { toTime: dateReturn.format("YYYY-MM-DD") }),
      };
      handleSearchTrip(searchData);
   };

   const handleQuantityChange = (value) => {
      const numValue = Number(value);
      if (numValue < 1) {
         setQuantity(1);
      } else if (numValue > 5) {
         setQuantity(5);
      } else {
         setQuantity(numValue);
      }
   };

   const ContentOrigin = (origins) => {
      const [searchValue, setSearchValue] = useState("");
      const handleSearchChange = (e) => {
         setSearchValue(e.target.value);
      };

      const uniqueOrigins = useMemo(() => {
         const seen = new Set();
         return searchParamsHistory.filter((item) => {
            if (!item?.fromName || seen.has(item.fromName)) return false;
            seen.add(item.fromName);
            return true;
         });
      }, [searchParamsHistory]);

      const handleSelectOrigin = (province) => {
         setOrigin({
            id: province?.province_id,
            name: province?.province_name,
         });
         setOpenOriginPopover(false);
         setOpenDestinationPopover(true);
      };

      const filteredOrigins = origins.filter(
         (item) =>
            item?.province_id !== destination?.id &&
            item?.province_name.toLowerCase().includes(searchValue.toLowerCase())
      );

      return (
         <div style={{ maxWidth: "263px", width: "100%", maxHeight: "450px", height: "100%" }}>
            <Typography.Text type='secondary'>PROVINCE/CITY</Typography.Text>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
               <Input
                  size='large'
                  placeholder='Tìm điểm đi'
                  value={searchValue}
                  allowClear
                  onChange={handleSearchChange}
                  style={{ width: "100%" }}
               />
            </div>
            <List
               dataSource={filteredOrigins}
               renderItem={(item) => (
                  <List.Item
                     style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                     onClick={() => handleSelectOrigin(item)}>
                     {item.province_name}
                  </List.Item>
               )}
               style={{ maxHeight: 150, overflowY: "auto" }}
            />
            <Typography.Text type='secondary' style={{ marginTop: "16px", display: "block" }}>
               RECENT SEARCH
            </Typography.Text>
            <div style={{ marginTop: 8 }}>
               {uniqueOrigins.map((item, index) => (
                  <Tag
                     closeIcon={<CloseCircleOutlined />}
                     key={index}
                     onClose={() => handleCloseTag(item?.fromName)}
                     style={{ marginBottom: 8, cursor: "pointer" }}
                     className='hover:text-[#ff4d4f]'
                     onClick={() =>
                        handleSelectOrigin({
                           province_id: item?.fromId,
                           province_name: item?.fromName,
                        })
                     }>
                     {item?.fromName}
                  </Tag>
               ))}
            </div>
         </div>
      );
   };
   const ContentDestination = (destinations) => {
      const [searchValue, setSearchValue] = useState("");

      const uniqueDestinations = useMemo(() => {
         const seen = new Set();
         return searchParamsHistory.filter((item) => {
            if (!item?.toName || seen.has(item.toName)) return false;
            seen.add(item.toName);
            return true;
         });
      }, [searchParamsHistory]);

      const handleSearchChange = (e) => {
         setSearchValue(e.target.value);
      };

      const handleSelectDestination = (province) => {
         setDestination({
            id: province?.province_id,
            name: province?.province_name,
         });
         setOpenDestinationPopover(false);
      };

      const filteredDestinations = destinations.filter(
         (item) =>
            item?.province_id !== origin?.id && item?.province_name.toLowerCase().includes(searchValue.toLowerCase())
      );

      return (
         <div style={{ maxWidth: "263px", width: "100%", maxHeight: "450px", height: "100%" }}>
            <Typography.Text type='secondary'>PROVINCE/CITY</Typography.Text>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
               <Input
                  size='large'
                  placeholder='Tìm điểm đến'
                  value={searchValue}
                  allowClear
                  onChange={handleSearchChange}
                  style={{ width: "100%" }}
               />
            </div>
            <List
               dataSource={filteredDestinations}
               renderItem={(item) => (
                  <List.Item
                     style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                     onClick={() => handleSelectDestination(item)}>
                     {item?.province_name}
                  </List.Item>
               )}
               style={{ maxHeight: 150, overflowY: "auto" }}
            />
            <Typography.Text type='secondary' style={{ marginTop: "16px", display: "block" }}>
               RECENT SEARCH
            </Typography.Text>
            <div style={{ marginTop: 8 }}>
               {uniqueDestinations.map((item, index) => (
                  <Tag
                     closeIcon={<CloseCircleOutlined />}
                     key={index}
                     onClose={() => handleCloseTag(item?.toName)}
                     onClick={() =>
                        handleSelectDestination({
                           province_id: item?.toId,
                           province_name: item?.toName,
                        })
                     }
                     className='hover:text-[#ff4d4f]'
                     style={{ marginBottom: 8, cursor: "pointer" }}>
                     {item?.toName}
                  </Tag>
               ))}
            </div>
         </div>
      );
   };

   const handleOriginPopoverChange = (visible) => {
      setOpenOriginPopover(visible);
      if (visible) {
         setOpenDestinationPopover(false);
      }
   };

   const handleDestinationPopoverChange = (visible) => {
      setOpenDestinationPopover(visible);
      if (visible) {
         setOpenOriginPopover(false);
      }
   };

   return (
      <>
         <section className='layout bg-white relative flex h-auto flex-col'>
            <div className='home-search absolute z-30'>
               <div className='card-box-shadown relative mx-auto mb-10  h-[250px] w-full cursor-pointer rounded-xl object-cover 2lg:flex'>
                  <img
                     alt='Landing page banner'
                     className='card-box-shadown relative mx-auto mb-10 h-[250px] w-full cursor-pointer rounded-xl object-cover transition-all duration-200 2lg:flex'
                     src='https://cdn.futabus.vn/futa-busline-web-cms-prod/web_ca16250b69/web_ca16250b69.png'
                     style={{ position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" }}
                  />
               </div>
               <div className='search-form relative m-2  font-medium 2lg:m-auto xl:w-[1128px]'>
                  <Flex gap='middle' wrap='wrap' justify='space-between' className='mb-5'>
                     <Radio.Group name='radiogroup' defaultValue={1}>
                        <Radio value={1} checked={isRoundTrip} onChange={handleChangeIsRoundTrip}>
                           One-way
                        </Radio>
                        {/* <Radio value={2} checked={isRoundTrip} onChange={handleChangeIsRoundTrip}>
                           Round-trip
                        </Radio> */}
                     </Radio.Group>
                     <Flex className='text-orange hidden cursor-pointer font-medium 2lg:contents'>
                        <Link to={"/huong-dan-dat-ve"}>Hướng dẫn đặt vé</Link>
                     </Flex>
                  </Flex>
                  <Row justify='center' className='mb-5 gap-2'>
                     <Col
                        style={{ padding: 0, margin: 0 }}
                        className='no-wrap relative m-0 flex flex-1 items-center justify-center gap-2'>
                        <div style={{ width: "100%" }}>
                           <Typography.Text className='mb-3 p-0 text-sm font-medium'>Điểm đi</Typography.Text>
                           <Popover
                              placement='bottom'
                              title='Điểm đi'
                              content={() => ContentOrigin(origins)}
                              trigger='click'
                              open={openOriginPopover}
                              overlayStyle={{ width: "263px" }}
                              onOpenChange={handleOriginPopoverChange}>
                              <Input
                                 size='large'
                                 readOnly
                                 value={origin?.name}
                                 placeholder='Điểm đi'
                                 className='size-[20px] h-[67px] cursor-pointer'
                              />
                           </Popover>
                        </div>
                        <img
                           className='switch-location absolute top-1/2 mt-[10px] -translate-y-1/2 transform 2lg:bottom-3 2lg:h-10 2lg:w-10'
                           src={switch_location}
                           alt='switch location icon'
                           onClick={handleSwitchLocation}
                           style={{ cursor: "pointer" }}
                        />
                        <div style={{ width: "100%" }}>
                           <Typography.Text className='mb-3 p-0 text-sm font-medium'>Điểm đến</Typography.Text>
                           <Popover
                              placement='bottom'
                              title='Điểm đến'
                              content={() => ContentDestination(destinations)}
                              trigger='click'
                              overlayStyle={{ width: "263px" }}
                              open={openDestinationPopover}
                              onOpenChange={handleDestinationPopoverChange}>
                              <Input
                                 size='large'
                                 readOnly
                                 value={destination?.name}
                                 placeholder='Điểm đến'
                                 className='h-[67px] cursor-pointer'
                              />
                           </Popover>
                        </div>
                     </Col>
                     <Col
                        style={{ padding: 0, margin: 0 }}
                        className='no-wrap m-0 flex flex-1 items-center justify-center gap-2 p-0'>
                        <div style={{ width: "100%" }}>
                           <Typography.Text className='m-0 p-0 text-sm font-medium'>
                              {isRoundTrip && dateDeparture && dateReturn
                                 ? `Từ ${dateDeparture.format("DD/MM/YYYY")} đến ${dateReturn.format("DD/MM/YYYY")}`
                                 : !isRoundTrip
                                    ? "Ngày đi"
                                    : "Ngày đi và Ngày về"}
                           </Typography.Text>
                           {!isRoundTrip ? (
                              <DatePicker
                                 size='large'
                                 onChange={handleChangeDateDeparture}
                                 suffixIcon={""}
                                 value={dateDeparture}
                                 placeholder='Ngày đi'
                                 className=' h-[67px] w-full cursor-pointer'
                                 format={"dddd - DD/MM/YYYY"}
                                 locale={{
                                    lang: {
                                       locale: "vi",
                                       placeholder: "Chọn ngày",
                                       rangePlaceholder: ["Ngày bắt đầu", "Ngày kết thúc"],
                                       today: "Hôm nay",
                                       now: "Bây giờ",
                                       backToToday: "Trở về hôm nay",
                                       ok: "Đồng ý",
                                       clear: "Xóa",
                                       month: "Tháng",
                                       year: "Năm",
                                       previousMonth: "Tháng trước",
                                       nextMonth: "Tháng sau",
                                       monthSelect: "Chọn tháng",
                                       yearSelect: "Chọn năm",
                                       decadeSelect: "Chọn thập kỷ",
                                       week: "Tuần",
                                       timeSelect: "Chọn thời gian",
                                       dateSelect: "Chọn ngày",
                                       weekSelect: "Chọn tuần",
                                       hour: "Giờ",
                                       minute: "Phút",
                                       second: "Giây",
                                    },
                                 }}
                                 disabledDate={(current) => {
                                    const tooEarly = current && current < dayjs().startOf("day");
                                    const tooLate = current && current > dayjs().add(1, "month").endOf("day");
                                    return tooEarly || tooLate;
                                 }}
                              />
                           ) : (
                              <RangePicker
                                 size='large'
                                 suffixIcon={""}
                                 separator={""}
                                 onChange={handleChangeDateRange}
                                 placeholder={["Ngày đi", "Ngày về"]}
                                 value={[dateDeparture, dateReturn]}
                                 className='h-[67px] w-full cursor-pointer'
                                 format={"dddd, DD/MM/YYYY"}
                                 disabledDate={(current) => {
                                    const tooEarly = current && current < dayjs().startOf("day");
                                    const tooLate = current && current > dayjs().add(1, "month").endOf("day");
                                    return tooEarly || tooLate;
                                 }}
                              />
                           )}
                        </div>
                        <div style={{ width: !isRoundTrip ? "100%" : "25%" }}>
                           <Typography.Text className='m-0 p-0 text-sm font-medium'>Số lượng</Typography.Text>
                           <Select
                              value={quantity}
                              onChange={handleQuantityChange}
                              menuItemSelectedIcon={<img src={circle_checkbox_checked} alt='checked' />}
                              suffixIcon={<img src={arrow_down_select} alt='arrow down select' />}
                              style={{ height: "67px", width: "100%" }}
                              options={[
                                 { value: "1", label: "1" },
                                 { value: "2", label: "2" },
                                 { value: "3", label: "3" },
                                 { value: "4", label: "4" },
                                 { value: "5", label: "5" },
                              ]}
                           />
                        </div>
                     </Col>
                  </Row>
                  <Flex className='text-orange my-4 hidden cursor-pointer font-medium 2lg:contents'>
                     <Typography.Text style={{ padding: "0px", marginLeft: "10px" }} className='p-0 text-sm font-medium'>
                        Lịch sử tìm kiếm gần đây
                     </Typography.Text>
                  </Flex>
                  <Row justify='start' className='mb-5' style={{ padding: "0px", margin: "0px" }}>
                     <Col
                        style={{ padding: 0, margin: 0, marginBottom: "15px" }}
                        className='no-wrap relative  flex flex-1 items-center justify-start gap-2 p-0'>
                        <div
                           style={{ width: "100%", overflow: "scroll" }}
                           className='flex flex-nowrap justify-start gap-5 '>
                           {searchParamsHistory?.map((item, index) => (
                              <CardHistoryTicket key={index} {...item} />
                           ))}
                        </div>
                     </Col>
                  </Row>
                  <div className='absolute left-1/2 flex -translate-x-1/2 justify-center'>
                     <Button
                        style={{ width: "300px", height: "50px", fontWeight: "600" }}
                        type='primary'
                        shape='round'
                        className='w-[200px] text-bg-white'
                        size='large'
                        onClick={handleSearch}>
                        Tìm chuyến xe
                     </Button>
                  </div>
               </div>
            </div>
         </section>
         <CustomErrorModal
            visible={errorModalVisible}
            message={errorMessage}
            onClose={() => setErrorModalVisible(false)}
         />
      </>
   );
};

// ContainerSearch.propTypes = {
//    searchParams: PropTypes.shape({
//       fromId: PropTypes.string,
//       from: PropTypes.string,
//       toId: PropTypes.string,
//       to: PropTypes.string,
//       ticketCount: PropTypes.number,
//       fromTime: PropTypes.string,
//    }),
//    onSearch: PropTypes.func.isRequired,
// };

export default ContainerSearch;
