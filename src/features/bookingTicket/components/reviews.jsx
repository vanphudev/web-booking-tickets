import React, {useEffect, useState, useMemo} from "react";
import {Rate, Avatar, Card, List, Progress, Row, Col, Tag, Spin, message} from "antd";
import {UserOutlined, CheckCircleOutlined} from "@ant-design/icons";
import ReviewsApi from "../../../api/reviewApi";

const getInitials = (fullName) =>
   fullName
      ?.split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

const CommentText = ({text}) => {
   const [isExpanded, setIsExpanded] = useState(false);

   return (
      <div style={{position: "relative"}}>
         <p
            style={{
               margin: "8px 0",
               maxHeight: isExpanded ? "none" : "48px",
               overflow: "hidden",
               position: "relative",
            }}
            dangerouslySetInnerHTML={{__html: text}}
         />
         {text.length > 100 && (
            <div
               style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "linear-gradient(to left, white 30%, transparent)",
                  padding: "0 10px",
               }}>
               <span
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{
                     color: "#F56A00",
                     cursor: "pointer",
                  }}>
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
               </span>
            </div>
         )}
      </div>
   );
};

const StatisticsCard = ({statistics}) => (
   <Card style={{marginBottom: "24px"}}>
      <Row gutter={24} align='middle'>
         <Col span={8}>
            <div style={{textAlign: "center", borderRight: "1px solid #f0f0f0", padding: "5px"}}>
               <h1
                  style={{
                     fontSize: "48px",
                     margin: 0,
                     color: "#FFFFFF",
                     backgroundColor: "#F56A00",
                     border: "2px solid #F56A00",
                     borderRadius: "8px",
                     padding: "1px 20px",
                     display: "inline-block",
                     marginBottom: "10px",
                  }}>
                  {statistics.rating}
               </h1>
               <Rate disabled value={statistics.rating} style={{fontSize: "20px", color: "#FADB14"}} />
               <div style={{marginTop: "10px", fontSize: "16px"}}>{statistics.totalReviews} đánh giá</div>
            </div>
         </Col>
         <Col span={16}>
            {statistics.ratingDetails.map((item) => (
               <Row key={item.stars} align='middle' style={{marginBottom: "12px"}}>
                  <Col span={4}>
                     <div style={{display: "flex", alignItems: "center", gap: "4px"}}>
                        <Rate disabled value={item.stars} count={1} style={{color: "#FADB14"}} />
                        <span>{item.stars}</span>
                     </div>
                  </Col>
                  <Col span={16}>
                     <Progress
                        percent={item.percent}
                        showInfo={false}
                        strokeColor='#F56A00'
                        style={{margin: "0 10px"}}
                     />
                  </Col>
                  <Col span={4} style={{textAlign: "right"}}>
                     {item.count}
                  </Col>
               </Row>
            ))}
         </Col>
      </Row>
   </Card>
);

const ReviewList = ({reviewsList}) => (
   <List
      itemLayout='vertical'
      dataSource={reviewsList}
      pagination={{
         pageSize: 1,
         total: reviewsList.length,
         position: "bottom",
         align: "center",
         style: {marginTop: "20px"},
      }}
      renderItem={(item) => (
         <Card style={{marginBottom: "16px"}}>
            <div style={{display: "flex", alignItems: "flex-start"}}>
               <Avatar style={{backgroundColor: "#F56A00", marginRight: "12px"}}>{item.avatar}</Avatar>
               <div style={{flex: 1}}>
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                     <h4 style={{margin: "0 0 4px 0"}}>{item.userName}</h4>
                     <span style={{color: "#999"}}>
                        {new Date(item.date).toLocaleDateString("vi-VN", {
                           weekday: "long",
                           year: "numeric",
                           month: "long",
                           day: "numeric",
                        })}
                     </span>
                  </div>
                  <Rate disabled value={item.rating} style={{fontSize: "14px", color: "#FADB14"}} />
                  <CommentText text={item.comment} />
                  {item.verified && (
                     <Tag color='#27AE60' icon={<CheckCircleOutlined />}>
                        Đã mua vé
                     </Tag>
                  )}
               </div>
            </div>
         </Card>
      )}
   />
);

const Reviews = ({tripInfo}) => {
   const [loadingReviews, setLoadingReviews] = useState(false);
   const [reviews, setReviews] = useState(null);

   useEffect(() => {
      const fetchReviews = async () => {
         setLoadingReviews(true);
         try {
            const res = await ReviewsApi.getReviewsByRoute(tripInfo?.route_id);
            setReviews(res || null);
         } catch {
            message.error("Không thể tải danh sách đánh giá");
         } finally {
            setLoadingReviews(false);
         }
      };

      if (tripInfo?.route_id) fetchReviews();
   }, [tripInfo]);

   const statistics = useMemo(() => {
      if (!reviews?.stats) return null;

      return {
         rating: Number(reviews.stats.average_rating || 0).toFixed(1),
         totalReviews: reviews.stats.total_reviews,
         ratingDetails: [
            {stars: 5, count: reviews.stats.five_star_count, percent: reviews.stats.five_star_percent},
            {stars: 4, count: reviews.stats.four_star_count, percent: reviews.stats.four_star_percent},
            {stars: 3, count: reviews.stats.three_star_count, percent: reviews.stats.three_star_percent},
            {stars: 2, count: reviews.stats.two_star_count, percent: reviews.stats.two_star_percent},
            {stars: 1, count: reviews.stats.one_star_count, percent: reviews.stats.one_star_percent},
         ],
      };
   }, [reviews]);

   const reviewsList = useMemo(
      () =>
         reviews?.reviews?.map((item) => ({
            id: item.review_id,
            userName: item.review_belongto_customer.customer_full_name,
            avatar: getInitials(item.review_belongto_customer.customer_full_name),
            rating: item.review_rating,
            comment: item.review_comment,
            date: item.review_date,
            verified: true,
         })) || [],
      [reviews]
   );

   if (loadingReviews) {
      return (
         <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "200px"}}>
            <Spin size='large' tip='Đang tải...' />
         </div>
      );
   }

   if (!statistics) {
      return (
         <div
            style={{
               margin: "20px",
               textAlign: "center",
               padding: "24px",
               color: "#999",
               fontSize: "16px",
               backgroundColor: "#f9f9f9",
               borderRadius: "8px",
               border: "1px dashed #ddd",
            }}>
            <div style={{marginBottom: "8px"}}>
               <UserOutlined style={{fontSize: "24px"}} />
            </div>
            Chưa có đánh giá nào cho tuyến đi này
            <div style={{color: "#F56A00", marginTop: "8px", fontSize: "14px", fontWeight: "500"}}>
               Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
            </div>
         </div>
      );
   }

   return (
      <div
         className={`reviews-container ${reviews?.reviews?.length !== 0 ? "h-[540px]" : "h-[200px]"} overflow-y-auto`}
         style={{padding: "20px"}}>
         <StatisticsCard statistics={statistics} />
         <ReviewList reviewsList={reviewsList} />
      </div>
   );
};

export default Reviews;
