import React from "react";
import {Card, Row, Col, Pagination, Input, Menu, Spin} from "antd";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {SearchOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import "./styles/styles.scss";
import NewsApi from "../../api/newsApi";

const News = () => {
   const location = useLocation();
   const [selectedKey, setSelectedKey] = useState("tin-tuc");
   const [newsData, setNewsData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const pageSize = 3;
   const [totalItems, setTotalItems] = useState(0);
   const [loading, setLoading] = useState(false);
   const [allNewsData, setAllNewsData] = useState([]);
   const [loadingAllNews, setLoadingAllNews] = useState(false);

   useEffect(() => {
      const pathSegments = location.pathname.split("/").filter(Boolean);

      if (pathSegments.length === 1 && pathSegments[0] === "tin-tuc") {
         setSelectedKey("tin-tuc");
         return;
      }

      if (pathSegments.length === 2 && pathSegments[0] === "tin-tuc") {
         const subPath = pathSegments[1];
         const matchedItem = menuItems.find((item) => {
            const itemPath = item.label.props.to.split("/").pop();
            return itemPath === subPath;
         });

         if (matchedItem) {
            setSelectedKey(matchedItem.key);
         } else {
            setSelectedKey("tin-tuc");
         }
      }
   }, [location.pathname]);

   const menuItems = [
      {
         key: "tin-tuc",
         label: (
            <Link to='/tin-tuc/tong-hop' className='flex items-center' style={{fontWeight: "bold"}}>
               <svg className='mr-1 h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' />
                  <path d='M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' />
               </svg>
               Tin tức tổng hợp
            </Link>
         ),
      },
      {
         key: "futa-bus-lines",
         label: (
            <Link to='/tin-tuc/futa-bus-lines' style={{fontWeight: "bold"}}>
               FUTA Bus Lines
            </Link>
         ),
      },
      {
         key: "futa-city-bus",
         label: (
            <Link to='/tin-tuc/futa-city-bus' style={{fontWeight: "bold"}}>
               FUTA City Bus
            </Link>
         ),
      },
      {
         key: "khuyen-mai",
         label: (
            <Link to='/tin-tuc/khuyen-mai' style={{fontWeight: "bold"}}>
               Khuyến mãi
            </Link>
         ),
      },
      {
         key: "giai-thuong",
         label: (
            <Link to='/tin-tuc/giai-thuong' style={{fontWeight: "bold"}}>
               Giải thưởng
            </Link>
         ),
      },
      {
         key: "tram-dung",
         label: (
            <Link to='/tin-tuc/tram-dung' style={{fontWeight: "bold"}}>
               Trạm Dừng
            </Link>
         ),
      },
   ];

   useEffect(() => {
      async function fetchHighlightNews() {
         setLoading(true);
         try {
            const res = await NewsApi.getAll({
               page: 1,
               limit: 10,
               category: selectedKey !== "tin-tuc" ? selectedKey : undefined,
            });
            if (res.status === 200) {
               setNewsData(res.metadata?.articles);
            }
         } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
         } finally {
            setLoading(false);
         }
      }
      fetchHighlightNews();
   }, [selectedKey]);

   useEffect(() => {
      async function fetchAllNews() {
         setLoadingAllNews(true);
         try {
            const res = await NewsApi.getAll({
               category: selectedKey !== "tin-tuc" ? selectedKey : undefined,
            });
            if (res.status === 200) {
               setAllNewsData(res.metadata?.articles);
            }
         } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
         } finally {
            setLoadingAllNews(false);
         }
      }
      fetchAllNews();
   }, [selectedKey]);

   const formatVietnameseDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
         hour: "2-digit",
         minute: "2-digit",
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      });
   };

   const getCurrentPageData = () => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return allNewsData.slice(startIndex, endIndex);
   };

   const handlePageChange = (page) => {
      setCurrentPage(page);
   };

   return (
      <div className='layout'>
         <div className='bg-orange-500 text-white'>
            <div className='container mx-auto mt-3'>
               <div className='menu-news flex h-12 items-center justify-between'>
                  <Menu
                     mode='horizontal'
                     items={menuItems}
                     className=' bg-transparent text-white border-none'
                     style={{flex: 1}}
                     selectedKeys={[selectedKey]}
                  />
                  <div className='w-72'>
                     <Input
                        size='large'
                        placeholder='Tìm kiếm tin tức'
                        prefix={<SearchOutlined className='text-gray-400' />}
                        className='rounded-full border-none'
                     />
                  </div>
               </div>
            </div>
         </div>
         {loading ? (
            <div className='flex min-h-[500px] items-center justify-center'>
               <Spin size='large' />
            </div>
         ) : (
            <div className='container mx-auto py-8'>
               <div className='mb-8'>
                  <div className='flex w-full items-center gap-6 pb-6'>
                     <div className='text-[28px] font-semibold text-[#00613D]'>Tin tức nổi bật</div>
                     <div className='mt-1 h-[2px] flex-auto bg-[#00613D]'></div>
                  </div>
                  <Row gutter={[16, 16]} className='mb-8' style={{alignItems: "stretch"}}>
                     <Col span={12} className='flex-1'>
                        <Link to={`/xem-tin/${newsData[0]?.article_slug}`}>
                           <Card
                              style={{boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 32px"}}
                              hoverable
                              cover={
                                 <img
                                    alt='promotion'
                                    src={newsData[0]?.thumbnail_img}
                                    className='h-[300px] object-cover'
                                 />
                              }
                              className='h-full'>
                              <h3 className='mb-2 text-lg font-bold'>{newsData[0]?.article_title}</h3>
                              <p className='text-gray-500'>{formatVietnameseDate(newsData[0]?.published_at)}</p>
                           </Card>
                        </Link>
                     </Col>
                     <Col span={12} className='flex-1 p-0'>
                        <Row gutter={[16, 16]}>
                           {newsData
                              .slice(1, 5)
                              .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
                              .map((news, index) => (
                                 <Col span={12} key={index}>
                                    <Link to={`/xem-tin/${news.article_slug}`}>
                                       <Card
                                          style={{boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 32px"}}
                                          hoverable
                                          cover={
                                             <img
                                                alt={`news-${index}`}
                                                src={news.thumbnail_img}
                                                className='h-[150px] object-cover'
                                             />
                                          }
                                          className='h-full'>
                                          <h4 className='mb-2 line-clamp-2 font-bold'>{news.article_title}</h4>
                                          <p className='text-gray-500 text-sm'>
                                             {formatVietnameseDate(news.published_at)}
                                          </p>
                                       </Card>
                                    </Link>
                                 </Col>
                              ))}
                        </Row>
                     </Col>
                  </Row>
               </div>
               <div className='mb-8'>
                  <div className='flex w-full items-center gap-6 pb-6'>
                     <div className='text-[28px] font-semibold text-[#00613D]'>Tiêu điểm</div>
                     <div className='mt-1 h-[2px] flex-auto bg-[#00613D]'></div>
                  </div>
                  <Row gutter={[16, 16]} className='mb-8' style={{alignItems: "stretch"}}>
                     {newsData
                        .filter((news) => news.is_priority === 1)
                        .slice(0, 4)
                        .map((news, index) => (
                           <Col span={6} key={index}>
                              <Link to={`/xem-tin/${news.article_slug}`}>
                                 <Card
                                    style={{boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 32px"}}
                                    hoverable
                                    cover={<img alt={`highlight-${index}`} src={news.thumbnail_img} />}
                                    className='h-full'>
                                    <h4 className='mb-2 line-clamp-2 font-bold'>{news.article_title}</h4>
                                    <p className='text-gray-500 text-sm'>{formatVietnameseDate(news.published_at)}</p>
                                 </Card>
                              </Link>
                           </Col>
                        ))}
                  </Row>
               </div>
               <div>
                  <div className='flex w-full items-center gap-6 pb-6'>
                     <div className='text-[28px] font-semibold text-[#00613D]'>Tất cả tin tức</div>
                     <div className='mt-1 h-[2px] flex-auto bg-[#00613D]'></div>
                  </div>

                  {loadingAllNews ? (
                     <div className='flex items-center justify-center py-8'>
                        <Spin size='large' />
                     </div>
                  ) : (
                     <>
                        <Row gutter={[16, 16]} className='mb-8' style={{alignItems: "stretch"}}>
                           {getCurrentPageData().map((news, index) => (
                              <Col span={8} key={index}>
                                 <Link to={`/xem-tin/${news.article_slug}`}>
                                    <Card
                                       style={{boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 32px"}}
                                       hoverable
                                       cover={
                                          <img
                                             alt={news.article_title}
                                             src={news.thumbnail_img}
                                             className='h-[200px] object-cover'
                                          />
                                       }
                                       className='h-full'>
                                       <h4 className='mb-2 line-clamp-2 font-bold'>{news.article_title}</h4>
                                       <p className='text-gray-500 text-sm'>
                                          {formatVietnameseDate(news.published_at)}
                                       </p>
                                    </Card>
                                 </Link>
                              </Col>
                           ))}
                        </Row>
                        <div className='mt-8 flex justify-center'>
                           <Pagination
                              current={currentPage}
                              total={allNewsData.length}
                              pageSize={pageSize}
                              onChange={handlePageChange}
                              showSizeChanger={false}
                              showQuickJumper={false}
                              showLessItems={true}
                           />
                        </div>
                     </>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default News;
