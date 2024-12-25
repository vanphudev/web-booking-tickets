import {useEffect, useState} from "react";
import {Button, Spin} from "antd";
import appRoutes from "../../api/routeApi";
import "./style.scss";
import {useNavigate} from "react-router-dom";
import {useContent} from "../../hooks/common/ContentContext";

const removeVietnameseTones = (str) => {
   return str
      .normalize("NFD") // Tách các ký tự tổ hợp
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
      .replace(/đ/g, "d") // Thay thế 'đ' thường
      .replace(/Đ/g, "D"); // Thay thế 'Đ' hoa
};

const ScheduleCard = ({routes}) => {
   const navigate = useNavigate();
   const {setSelectedRoute} = useContent();

   const handleSearchRoute = (route) => {
      const today = new Date().toLocaleDateString('en-CA');

      setSelectedRoute({
         from: removeVietnameseTones(route?.from).toUpperCase().replace(/\s+/g, ""),
         fromId: route?.fromId,
         fromTime: today,
         to: removeVietnameseTones(route?.to).toUpperCase().replace(/\s+/g, ""),
         toId: route?.toId,
         isReturn: false,
         ticketCount: 1,
      });
      navigate(
         `/booking-ticket?from=${removeVietnameseTones(route?.from).toUpperCase().replace(/\s+/g, "")}&fromId=${
            route?.fromId
         }&fromTime=${today}&to=${removeVietnameseTones(route?.to).toUpperCase().replace(/\s+/g, "")}&toId=${
            route?.toId
         }&isReturn=false&ticketCount=${route?.ticketCount || 1}`
      );
   };

   const shouldApplyScroll = routes.length > 3;

   return (
      <div className='schedule-card bg-bg-white'>
         <div
            className='flex w-full flex-col gap-[6px] text-left '
            style={shouldApplyScroll ? {height: "140px", overflowY: "auto"} : {}}>
            {routes?.map((route, index) => (
               <div className='ant-row items-center' key={index}>
                  <div className='ant-col ant-col-6'>
                     <span className='text-orange font-bold'>{route.from}</span>
                     <img src='https://futabus.vn/images/icons/ic_double_arrow.svg' alt='arrow' className='mx-2' />
                     <span>{route.to}</span>
                  </div>
                  <div className='ant-col ant-col-3'>{route.type}</div>
                  <div className='ant-col ant-col-3'>{route.distance}</div>
                  <div className='ant-col ant-col-4'>{route.time}</div>
                  <div className='ant-col ant-col-2'>
                     {/* {route.price ? `${Number(route.price).toLocaleString()}đ` : "---"}
                      */}
                     {" --- "}
                  </div>
                  <div className='button-container'>
                     <Button
                        type='primary'
                        shape='round'
                        size='middle'
                        variant='filled'
                        onClick={() => handleSearchRoute(route)}>
                        <span>Tìm tuyến xe</span>
                     </Button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

const RouteList = ({routes}) => {
   const groupedRoutes = routes.reduce((acc, route) => {
      const from = route.from;
      if (!acc[from]) {
         acc[from] = [];
      }
      acc[from].push(route);
      return acc;
   }, {});

   return (
      <div className='route-list'>
         {Object.keys(groupedRoutes).map((from, index) => (
            <ScheduleCard key={index} routes={groupedRoutes[from]} />
         ))}
      </div>
   );
};

const Schedule = () => {
   const [routeData, setRouteData] = useState([]);
   const [fromSearch, setFromSearch] = useState("");
   const [toSearch, setToSearch] = useState("");
   const [filteredRoutes, setFilteredRoutes] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchRoutes = async () => {
         try {
            setLoading(true);
            const response = await appRoutes.getRoutes();
            const formattedRoutes = response?.metadata?.routes?.map((route) => {
               const formatProvinceName = (name) => {
                  return name.replace("Tỉnh ", "").replace("Thành phố ", "").replace("TP. ", "");
               };
               return {
                  from: formatProvinceName(route?.origin_province),
                  fromId: route?.origin_province_id,
                  to: formatProvinceName(route?.destination_province),
                  toId: route?.destination_province_id,
                  type: route?.vehicle_type_name,
                  distance: `${route?.route_distance}km`,
                  time: `${Math.floor(route?.route_duration / 60)} giờ ${route?.route_duration % 60} phút`,
                  price: route?.route_price,
               };
            });
            setRouteData(formattedRoutes);
            setFilteredRoutes(formattedRoutes);
         } catch (error) {
            console.error("Lỗi khi tải dữ liệu tuyến đường:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchRoutes();
   }, []);

   // Xử lý lọc routes khi người dùng nhập
   useEffect(() => {
      const filtered = routeData.filter((route) => {
         const fromMatch = route.from.toLowerCase().includes(fromSearch.toLowerCase());
         const toMatch = route.to.toLowerCase().includes(toSearch.toLowerCase());

         if (fromSearch && toSearch) {
            return fromMatch && toMatch;
         } else if (fromSearch) {
            return fromMatch;
         } else if (toSearch) {
            return toMatch;
         }
         return true;
      });

      setFilteredRoutes(filtered);
   }, [fromSearch, toSearch, routeData]);

   // Xử lý đổi vị trí điểm đi và điểm đến
   const handleSwitchLocations = () => {
      const tempFrom = fromSearch;
      setFromSearch(toSearch);
      setToSearch(tempFrom);
   };

   return (
      <div className='lich_trinh schedule-container layout '>
         <div className='wrapper-container-left '>
            <div className='input-group'>
               <div className='icon-search'>
                  <img src='https://futabus.vn/images/icons/search.svg' alt='search icon' />
                  <input
                     type='text'
                     placeholder='Nhập điểm đi'
                     className='input-field'
                     value={fromSearch}
                     onChange={(e) => setFromSearch(e.target.value)}
                  />
               </div>
               <img
                  className='switch-location-Schedule'
                  src='https://futabus.vn/images/icons/switch_location.svg'
                  alt='switch location icon'
                  onClick={handleSwitchLocations}
                  style={{cursor: "pointer"}}
               />
               <div className='icon-search'>
                  <img src='https://futabus.vn/images/icons/search.svg' alt='search icon' />
                  <input
                     type='text'
                     placeholder='Nhập điểm đến'
                     className='input-field'
                     value={toSearch}
                     onChange={(e) => setToSearch(e.target.value)}
                  />
               </div>
            </div>
         </div>
         {loading ? (
            <div className='flex min-h-[500px] items-center justify-center'>
               <Spin size='large' />
            </div>
         ) : (
            <>
               <div className='schedule-card bg-bg-white'>
                  <div className='schedule-header flex w-full flex-col gap-[6px] text-left'>
                     <div className='ant-row items-center '>
                        <div className='ant-col ant-col-6 font-bold'>
                           <h2>Tuyến xe</h2>
                        </div>
                        <div className='ant-col ant-col-3 font-bold'>Loại xe</div>
                        <div className='ant-col ant-col-3 font-bold'>Quãng đường</div>
                        <div className='ant-col ant-col-4 font-bold'>Thời gian hành trình</div>
                        <div className='ant-col ant-col-2 font-bold'>Giá vé</div>
                     </div>
                  </div>
               </div>
               <div className='route-container'>
                  <div className='route-list-container'>
                     <RouteList routes={filteredRoutes} />
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export default Schedule;
