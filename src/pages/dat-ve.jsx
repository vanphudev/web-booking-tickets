import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ContainerSearch from "../features/home/homeSearchRoutes/components/containerSearch";
import BookingTicket from "../features/bookingTicket/bookingTicket";
import BookingDetail from "../features/bookingDetail/bookingDetail";
import { useContent } from "../hooks/common/contentContext";
import { Spin } from "antd";
import TripApi from "../api/tripApi";

const BookingTicketPage = () => {
   const { searchParams, setSearchParams } = useContent();
   const [selectedTrip, setSelectedTrip] = useState(null);
   const handleSelectTrip = (tripInfo) => {
      // console.log("tripInfo", tripInfo);
      setSelectedTrip(tripInfo);
   };
   const handleBack = () => {
      setSelectedTrip(null);
   };
   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      setSearchParams({
         from: urlParams.get("from") || "",
         fromId: urlParams.get("fromId") || "",
         fromTime: urlParams.get("fromTime") || null,
         to: urlParams.get("to") || "",
         toId: urlParams.get("toId") || "",
         toTime: urlParams.get("toTime") || null,
         isReturn: urlParams.get("isReturn") === "true",
         ticketCount: parseInt(urlParams.get("ticketCount")) || 1,
      });
   }, []);

   const [key, setKey] = useState(0);

   useEffect(() => {
      const handleUrlChange = () => {
         const urlParams = new URLSearchParams(window.location.search);
         setSearchParams({
            from: urlParams.get("from") || "",
            fromId: urlParams.get("fromId") || "",
            fromTime: urlParams.get("fromTime") || null,
            to: urlParams.get("to") || "",
            toId: urlParams.get("toId") || "",
            toTime: urlParams.get("toTime") || null,
            isReturn: urlParams.get("isReturn") === "true",
            ticketCount: parseInt(urlParams.get("ticketCount")) || 1,
         });
         setKey((prevKey) => prevKey + 1);
      };

      window.addEventListener("popstate", handleUrlChange);
      return () => {
         window.removeEventListener("popstate", handleUrlChange);
      };
   }, []);

   const getTripInfo = async (searchParams) => {
      const response = await TripApi.getTripInfo({
         fromId: searchParams?.fromId || "",
         toId: searchParams?.toId || "",
         fromTime: searchParams?.fromTime || "",
         toTime: searchParams?.toTime || "",
         isReturn: searchParams?.isReturn || false,
         ticketCount: searchParams?.ticketCount || 1,
      });
      if (response.status === 200) {
         console.log("response", response?.metadata);
         return response?.metadata;
      }
      return [];
   };

   // tạo biến lưu trữ trips
   const [trips, setTrips] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchTripInfo = async () => {
         if (searchParams.fromId && searchParams.toId) {
            setLoading(true);
            try {
               const tripInfo = await getTripInfo(searchParams);
               setTrips(tripInfo);
            } catch (error) {
               console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
               setLoading(false);
            }
         }
      };
      fetchTripInfo();
   }, [searchParams]);

   return (
      // Thêm key vào phần tử cha để force re-render
      <div key={key}>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Đặt vé - Futabus</title>
         </Helmet>
         {!selectedTrip ? (
            <>
               <ContainerSearch searchParams={searchParams} setSelectedTrip={setSelectedTrip} />
               <Spin size='large' spinning={loading} tip='Đang tìm kiếm chuyến xe ...' style={{ zIndex: 100000 }}>
                  <BookingTicket trips={trips} onSelectTrip={handleSelectTrip} searchParams={searchParams} />
               </Spin>
            </>
         ) : (
            <BookingDetail tripInfo={selectedTrip} onBack={handleBack} />
         )}
      </div>
   );
};

export default BookingTicketPage;
