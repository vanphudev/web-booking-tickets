import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {Typography, Spin, Divider} from "antd";
import NewsApi from "../../api/newsApi";
import {useContent} from "../../hooks/common/ContentContext";
import "./styles.scss";

const {Title} = Typography;

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

const NewsDetails = () => {
   const {isHeaderCustom, setIsHeaderCustom} = useContent();
   useEffect(() => {
      setIsHeaderCustom(true);
      return () => {
         setIsHeaderCustom(false);
      };
   }, []);
   const {slug} = useParams();
   const [newsDetail, setNewsDetail] = useState(null);
   const [loading, setLoading] = useState(true);
   const [relatedNews, setRelatedNews] = useState([]);

   useEffect(() => {
      const fetchNewsDetail = async () => {
         try {
            setLoading(true);
            const response = await NewsApi.getWithId(slug);
            if (response.status === 200) {
               setNewsDetail(response.metadata?.article);
            }
         } catch (error) {
            console.error("Lỗi khi tải chi tiết tin tức:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchNewsDetail();
   }, [slug]);

   useEffect(() => {
      const fetchRelatedNews = async () => {
         try {
            const response = await NewsApi.getRelatedNews(slug);
            if (response.status === 200) {
               setRelatedNews(response.metadata?.related_news);
            }
         } catch (error) {
            console.error("Lỗi khi tải tin tức liên quan:", error);
         }
      };

      fetchRelatedNews();
   }, [slug]);

   if (loading) {
      return (
         <div className='flex min-h-[500px] items-center justify-center'>
            <Spin size='large' />
         </div>
      );
   }

   return (
      <div className='layout news-detail py-8'>
         <div className='container mx-auto '>
            <Title level={1} className='mb-4 text-[32px] font-bold text-[#2C2C2C]'>
               {newsDetail?.article_title}
            </Title>
            <div className='text-gray-500 mb-6'>Ngày đăng: {formatVietnameseDate(newsDetail?.published_at)}</div>
            <Divider />
            <div className='news-content'>
               {newsDetail?.thumbnail_img && (
                  <div className='mb-6'>
                     <img
                        loading='lazy'
                        src={newsDetail.thumbnail_img}
                        alt={newsDetail.article_title}
                        className='mx-auto w-[100%] rounded-lg'
                     />
                  </div>
               )}
               <div
                  className='prose prose-lg prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-lg max-w-none'
                  dangerouslySetInnerHTML={{__html: newsDetail?.article_content}}
               />
            </div>
            <Divider />
            <div className='mt-8'>
               <div className='col-span-4 mt-10 flex items-center gap-6 pb-6'>
                  <div className='text-[28px] font-semibold text-[#00613D]'>Tin tức liên quan</div>
                  <div className='mt-1 h-[2px] flex-auto bg-[#00613D]'></div>
                  <div className='flex cursor-pointer items-center font-medium text-[#E8490E]'>
                     <span className='mr-2 font-bold'>Xem tất cả</span>
                     <img src='https://futabus.vn/images/icons/ic_arrow_right.svg' alt='' />
                  </div>
               </div>
               <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {relatedNews?.map((news) => (
                     <Link to={`/tin-tuc/${news.slug}`} key={news.id} className='group'>
                        <div className='bg-white overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md'>
                           <div className='relative pt-[56.25%]'>
                              <img
                                 src={news.thumbnail_img}
                                 alt={news.article_title}
                                 className='absolute left-0 top-0 h-full w-full object-cover'
                              />
                              {news.published_at && (
                                 <div className='bg-primary text-white absolute bottom-3 left-3 rounded px-2 py-1 text-sm'>
                                    {formatVietnameseDate(news.published_at, "dd/MM")}
                                 </div>
                              )}
                           </div>
                           <div className='p-4'>
                              <h3 className='group-hover:text-primary line-clamp-2 text-base font-semibold transition-colors'>
                                 {news.article_title}
                              </h3>
                              <div className='text-gray-500 mt-2 text-sm'>
                                 {formatVietnameseDate(news.published_at)}
                              </div>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default NewsDetails;
