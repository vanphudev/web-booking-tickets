import React, {useEffect} from "react";
import {useContent} from "../hooks/common/ContentContext";
import {Helmet} from "react-helmet";
import {Row, Col, Card, Typography} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";
import {Image, Button} from "antd";
const {Title, Paragraph} = Typography;
const {Text} = Typography;

const GuideBookingTicket = () => {
   const {isHeaderCustom, setIsHeaderCustom} = useContent();
   useEffect(() => {
      setIsHeaderCustom(true);
      return () => {
         setIsHeaderCustom(false);
      };
   }, []);
   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Hướng dẫn đặt vé - Futabus</title>
         </Helmet>
         <div className='layout px-4 py-10 xl:px-0'>
            <div className='text-center'>
               <div className='mt-10 sm:mt-[60px]'>
                  <Title level={4} className='uppercase text-[#111111]'>
                     Scan the QR to download the app for customers
                  </Title>
                  <Row justify='center' gutter={[16, 16]} className='mt-4'>
                     <Col>
                        <Image src='https://futabus.vn/images/guideCharge/logo_futa.png' alt='FUTA Logo' width={120} />
                     </Col>
                     <Col>
                        <Image
                           src='https://futabus.vn/images/guideCharge/qr_app.png'
                           alt='QR Code for App'
                           width={120}
                        />
                     </Col>
                  </Row>
                  <Row justify='center' gutter={[16, 16]} className='mt-4'>
                     <Col>
                        <Button
                           type='link'
                           target='_blank'
                           href='http://onelink.to/futa.android'
                           rel='noreferrer'
                           icon={
                              <img
                                 src='https://cdn.futabus.vn/futa-busline-cms-dev/CH_Play_712783c88a/CH_Play_712783c88a.svg'
                                 width={86}
                                 height={28}
                                 alt='Android Link'
                              />
                           }>
                           Download for Android
                        </Button>
                     </Col>
                     <Col>
                        <Button
                           type='link'
                           target='_blank'
                           href='http://onelink.to/futa.ios'
                           rel='noreferrer'
                           icon={
                              <img
                                 src='https://cdn.futabus.vn/futa-busline-cms-dev/App_Store_60da92cb12/App_Store_60da92cb12.svg'
                                 width={86}
                                 height={28}
                                 alt='iOS Link'
                              />
                           }>
                           Download for iOS
                        </Button>
                     </Col>
                  </Row>
               </div>

               <div className='mt-10 bg-[#FFF7F5] p-4 text-center'>
                  <Title level={5} className='text-[#EF5222]'>
                     PRESTIGE – QUALITY – HONOR
                  </Title>
                  <Row
                     justify='center'
                     className='mt-4 text-justify text-base font-medium text-[#111111] sm:text-left sm:text-lg'>
                     <Col span={24}>
                        <Paragraph>
                           FUTA BUS LINES - PHUONG TRANG INC would like to thank our customers for trusting and using
                           our services. We always operate with the principle of "Quality is Honor" and make constant
                           efforts to bring the best service experiences to customers.
                        </Paragraph>
                        <Paragraph>
                           We not only ensure safe, quality, punctual trips, but also care about the ticket buying
                           experience of our customers. We have improved our online ticket purchase site{" "}
                           <a href='https://futabus.vn/' className='text-[#EF5222]'>
                              Ticket Information | FUTA Bus Lines | Booking Center and Customer Care 19006067
                           </a>{" "}
                           to make buying tickets easier and more convenient than ever.
                        </Paragraph>
                        <Paragraph>
                           Besides, we are proud to introduce the FUTA Bus ticket purchase application, helping
                           customers save time buying tickets. Through this application, customers can look up
                           information about schedules, choose seats/beds, and pay quickly and conveniently on their
                           mobile phones. We believe that with the FUTA Bus ticket purchase app and website{" "}
                           <a href='https://futabus.vn/' className='text-[#EF5222]'>
                              Ticket Information | FUTA Bus Lines | Booking Center and Customer Care 19006067
                           </a>
                           improved experience will bring a good experience and save customers valuable time.
                        </Paragraph>
                     </Col>
                  </Row>
               </div>
            </div>
            <div className='p-0 sm:p-5'>
               <div className='mt-8 text-center text-2xl font-bold text-[#00613D] sm:text-3xl'>
                  The outstanding experiences that the ticket buy
                  <span className='text-[#EF5222]'> FUTA Bus</span>
                  and Website
                  <span className='text-[#EF5222]'> futabus.vn</span>
                  bring
               </div>
               <div className='mt-[50px]'>
                  <Row gutter={[16, 16]} justify='center'>
                     <Col span={24} sm={8}>
                        <Card
                           hoverable
                           style={{
                              boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.1)",
                              borderRadius: "16px",
                              textAlign: "center",
                              padding: "20px",
                           }}
                           cover={
                              <img
                                 src='https://futabus.vn/images/guideCharge/web/step1/time.svg'
                                 alt=''
                                 style={{width: "60px"}}
                              />
                           }>
                           <Title level={4}>Customers take the initiative in their schedule</Title>
                           <Text className='mt-5'>
                              From the pick-up point, the passenger point to the journey time.
                           </Text>
                        </Card>
                     </Col>
                     <Col span={24} sm={8}>
                        <Card
                           hoverable
                           style={{
                              boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.1)",
                              borderRadius: "16px",
                              textAlign: "center",
                              padding: "20px",
                           }}
                           cover={
                              <img
                                 src='https://futabus.vn/images/guideCharge/web/step1/chair.svg'
                                 alt=''
                                 style={{width: "60px"}}
                              />
                           }>
                           <Title level={4}>Customers are selected and proactive location</Title>
                           <Text className='mt-5'>Number of seats in the car.</Text>
                        </Card>
                     </Col>
                     <Col span={24} sm={8}>
                        <Card
                           hoverable
                           style={{
                              boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.1)",
                              borderRadius: "16px",
                              textAlign: "center",
                              padding: "20px",
                           }}
                           cover={
                              <img
                                 src='https://futabus.vn/images/guideCharge/web/step1/comfortable.svg'
                                 alt=''
                                 style={{width: "60px"}}
                              />
                           }>
                           <Title level={4}>Not lined up on holidays and New Year</Title>
                        </Card>
                     </Col>
                     <Col span={24} sm={8}>
                        <Card
                           hoverable
                           style={{
                              boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.1)",
                              borderRadius: "16px",
                              textAlign: "center",
                              padding: "20px",
                           }}
                           cover={
                              <img
                                 src='https://futabus.vn/images/guideCharge/web/step1/ulity.svg'
                                 alt=''
                                 style={{width: "60px"}}
                              />
                           }>
                           <Title level={4}>Easily combine and receive incentives</Title>
                           <Text className='mt-5'>
                              When using other services of Phuong Trang such as taxis, stops, freight, etc.
                           </Text>
                        </Card>
                     </Col>
                     <Col span={24} sm={8}>
                        <Card
                           hoverable
                           style={{
                              boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.1)",
                              borderRadius: "16px",
                              textAlign: "center",
                              padding: "20px",
                           }}
                           cover={
                              <img
                                 src='https://futabus.vn/images/guideCharge/web/step1/interest.svg'
                                 alt=''
                                 style={{width: "60px"}}
                              />
                           }>
                           <Title level={4}>When registering members</Title>
                           <Text className='mt-5'>
                              Customers receive many incentives, as well as many attractive gifts.
                           </Text>
                        </Card>
                     </Col>
                     <Col span={24} sm={8}>
                        <Card
                           hoverable
                           style={{
                              boxShadow: "0px 4px 32px rgba(0, 0, 0, 0.1)",
                              borderRadius: "16px",
                              textAlign: "center",
                              padding: "20px",
                           }}
                           cover={
                              <img
                                 src='https://futabus.vn/images/guideCharge/web/step1/comment.svg'
                                 alt=''
                                 style={{width: "60px"}}
                              />
                           }>
                           <Title level={4}>Easily comment to improve service quality</Title>
                        </Card>
                     </Col>
                  </Row>
               </div>
            </div>
            <div className='step-guide'>
               <div className='mt-10 bg-[#FFF7F5] p-5'>
                  <Title level={2} className='mt-8 text-center text-2xl font-bold text-[#00613D] sm:text-3xl'>
                     Step 2: Steps to help customers experience buying tickets fast
                  </Title>

                  <div className='no-scrollbar mt-10 block justify-center overflow-x-auto sm:flex sm:overflow-hidden'>
                     <Row justify='center' gutter={[16, 16]}>
                        {[
                           {
                              step: "01",
                              image: "/images/guideCharge/web/step1/bound_step_active.png",
                              description: "Visit the address",
                              isActive: true,
                           },
                           {
                              step: "02",
                              image: "/images/guideCharge/web/step1/bound_step_inactive.png",
                              description: "Select cruise information",
                              isActive: false,
                           },
                           {
                              step: "03",
                              image: "/images/guideCharge/web/step1/bound_step_inactive.png",
                              description: "Choose chairs, pickup points, passenger info",
                              isActive: false,
                           },
                           {
                              step: "04",
                              image: "/images/guideCharge/web/step1/bound_step_inactive.png",
                              description: "Select a payment method",
                              isActive: false,
                           },
                           {
                              step: "05",
                              image: "/images/guideCharge/web/step1/bound_step_inactive.png",
                              description: "Buy successful car tickets",
                              isActive: false,
                           },
                        ].map(({step, image, description, isActive}, index) => (
                           <Col key={index} className='flex items-center justify-center'>
                              <div className='relative flex items-center'>
                                 <Image width={isActive ? 118 : 80} src={image} alt={`Step ${step}`} />
                                 <p className='absolute left-6 text-2xl font-extrabold text-[#EF5222] lg:left-[34px] lg:text-[40px]'>
                                    {step}
                                 </p>
                                 <div
                                    className='absolute flex h-[80px] w-auto items-center text-sm text-[#000000] lg:w-[150px] lg:text-lg'
                                    style={{left: 0, bottom: "-80px"}}>
                                    {description}
                                 </div>
                                 <Image
                                    className='ml-2 w-8 lg:w-auto'
                                    src='/images/guideCharge/web/step1/step_progress.svg'
                                    alt='Progress'
                                    width={20}
                                 />
                              </div>
                           </Col>
                        ))}
                     </Row>
                  </div>

                  <div className='mt-10 text-center text-2xl font-semibold text-[#111111] sm:mt-[50px] sm:text-3xl'>
                     Access to address
                     <a href='https://futabus.vn/' className='ml-2 text-[#EF5222]'>
                        futabus.vn
                     </a>
                  </div>
                  <Image src='/images/guideCharge/web/step1/step1.png' alt='Step Image' className='m-auto mt-10' />

                  <div className='mt-[40px] text-center text-2xl font-semibold text-[#111111]'>
                     Download app at{" "}
                     <a className='text-[#EF5222]' href='https://futabus.vn/'>
                        futabus.vn
                     </a>{" "}
                     or find FUTA app on
                     <br />
                     Futa Bus on <span className='text-[#EF5222]'>Google Play</span> or{" "}
                     <span className='text-[#EF5222]'>Apple store</span>
                  </div>

                  <div className='item mt-4 flex justify-center gap-8'>
                     <a target='_blank' href='http://onelink.to/futa.android' rel='noreferrer'>
                        <Image
                           src='https://cdn.futabus.vn/futa-busline-cms-dev/CH_Play_712783c88a/CH_Play_712783c88a.svg'
                           alt='Google Play'
                           width={86}
                           height={28}
                        />
                     </a>
                     <a target='_blank' href='http://onelink.to/futa.ios' rel='noreferrer'>
                        <Image
                           src='https://cdn.futabus.vn/futa-busline-cms-dev/App_Store_60da92cb12/App_Store_60da92cb12.svg'
                           alt='App Store'
                           width={86}
                           height={28}
                        />
                     </a>
                  </div>
               </div>
            </div>
            <div className='p-5'>
               <div className='mt-8 text-center text-2xl font-bold text-[#00613D] sm:text-3xl'>
                  Step 3: Tickets will be sent to email. Please check the email to receive tickets
               </div>
               <div className='mt-[50px]'>
                  <img
                     src='\images\guideCharge\web\step1\co_step3.PNG'
                     alt='Step 3 Guide'
                     className='m-auto mt-10 w-full'
                  />
               </div>
            </div>
         </div>
      </>
   );
};

export default GuideBookingTicket;
