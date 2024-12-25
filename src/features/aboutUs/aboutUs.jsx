import React from "react";

const CompanyOverview = () => {
   return (
      <div className='layout unselectext px-4 py-10 xl:px-0'>
         <div className='flex flex-col gap-5 '>
            <div className='flex flex-col gap-2 ' style={{textAlign: "justify"}}>
               <h1
                  style={{
                     textAlign: "center",
                     fontWeight: "bold",
                     fontSize: "30px",
                     color: "rgb(241, 90, 36)",
                  }}>
                  PHUONG TRANG
               </h1>
               <h3 style={{textAlign: "center", fontSize: "18px", fontWeight: "bolder"}}>“Quality is honor”</h3>
               <p style={{columnCount: 1}}>
                  <span style={{color: "rgb(32, 33, 36)"}}>
                     Founded in 2001 focusing on supporting the transportation needs of Vietnamese people.
                  </span>{" "}
                  with main business activities in the field of buying and selling cars, passenger transport, real
                  estate and service business. Phuong Trang has gradually become a familiar name that accompanies
                  Vietnamese people in all fields.
               </p>
               <p style={{columnCount: 1}}>
                  After more than 20 years of establishment and development, putting the customer as the focus, we are
                  proud to become a core freight forwarding enterprise that actively contributes to the overall
                  development of the transportation industry in particular and the global economy. the country's economy
                  in general. Always improving to bring the best quality of service to customers, Phuong Trang Company
                  has been recognized through many prestigious awards such as "Vietnam's No. 1 Brand," "Top 10 Famous
                  Brands of Vietnam," “Top 10 Perfect Services for Consumers in 2022,” “Top 10 Typical Enterprises in
                  Vietnam,” “Top 10 Prestigious Brands, Products and Services in Vietnam – ASEAN 2022”…
               </p>
            </div>

            {/* CTA Section */}
            <div className='mx-auto mt-8 flex w-28 cursor-pointer items-center justify-center gap-2 text-[18px] text-[#A2ABB3]'>
               Xem thêm
               <img src='/images/icons/arrow_right.svg' alt='' className='rotate-90' width='9' />
            </div>

            {/* Vision and Mission Section */}
            <div className='mt-8 flex w-full flex-col items-start gap-6 sm:flex-row'>
               <div className='aspect-[3/2] w-full sm:flex-1'>
                  <div className='relative rounded-[10px]'>
                     <img
                        loading='lazy'
                        alt='Vision Image'
                        className='relative rounded-[10px] transition-all duration-200'
                        src='https://cdn.futabus.vn/futa-busline-web-cms-prod/Artboard_3_3x_fb31ff2c98/Artboard_3_3x_fb31ff2c98.png'
                     />
                  </div>
               </div>
               <div className='flex-1'>
                  <div className='text-orange mb-6 text-[22px] font-semibold sm:text-[42px] sm:leading-[50px]'>
                     TẦM NHÌN VÀ SỨ MỆNH
                  </div>
                  <div className='content-editor ck-content'>
                     <p style={{columnCount: 1}}>
                        <strong>
                           <span style={{color: "rgb(230, 77, 77)"}}>BÁO ĐÁP TỔ QUỐC VÌ MỘT VIỆT NAM HÙNG CƯỜNG.</span>
                        </strong>
                        <br />
                        Trở thành Tập Đoàn uy tín và chất lượng hàng đầu Việt Nam với cam kết:
                     </p>
                     <ul>
                        <li>
                           <p style={{columnCount: 1}}>Tạo môi trường làm việc năng động, thân thiện.</p>
                        </li>
                        <li>
                           <p style={{columnCount: 1}}>Phát triển từ lòng tin của khách hàng.</p>
                        </li>
                        <li>
                           <p style={{columnCount: 1}}>Trở thành tập đoàn dẫn đầu chuyên nghiệp.</p>
                        </li>
                     </ul>
                     <p style={{columnCount: 1}}>
                        <strong>
                           <span style={{color: "rgb(230, 77, 77)"}}>Phương Trang </span>
                        </strong>
                        luôn phấn đấu làm việc hiệu quả nhất, để luôn cống hiến, đóng góp hết sức mình vì một Việt Nam
                        hùng cường.
                     </p>
                  </div>
               </div>
            </div>

            {/* Core Values Section */}
            <div className='mt-8 flex w-full flex-col items-start gap-6 sm:flex-row-reverse'>
               <div className='aspect-[3/2] w-full sm:flex-1'>
                  <div className='relative rounded-[10px]'>
                     <img
                        loading='lazy'
                        alt='Core Values Image'
                        className='relative rounded-[10px] transition-all duration-200'
                        src='https://cdn.futabus.vn/futa-busline-web-cms-prod/Artboard_4_3x_44277bbc3b/Artboard_4_3x_44277bbc3b.png'
                     />
                  </div>
               </div>
               <div className='flex-1'>
                  <div className='text-orange mb-6 text-[22px] font-semibold sm:text-[42px] sm:leading-[50px]'>
                     GIÁ TRỊ CỐT LÕI
                  </div>
                  <div className='content-editor ck-content'>
                     <p style={{columnCount: 1}}>
                        Giá trị cốt lõi –{" "}
                        <strong>
                           <span style={{color: "rgb(230, 77, 77)"}}>Phương Trang</span>
                        </strong>
                     </p>
                     <ul>
                        <li>
                           <p style={{columnCount: 1}}>
                              <strong>
                                 <span style={{color: "rgb(230, 77, 77)"}}>Phương:</span>
                              </strong>{" "}
                              chữ “Phương” trong tiếng Hán nghĩa là Vuông, vật gì hình thể ngay thẳng đều gọi là phương.
                              thể hiện sự chính trực, phẩm chất đạo đức tốt đẹp. Mọi hành động của Phương Trang luôn thể
                              hiện sự minh bạch, công bằng chính trực với đồng nghiệp, khách hàng, đối tác.
                           </p>
                        </li>
                        <li>
                           <p style={{columnCount: 1}}>
                              <strong>
                                 <span style={{color: "rgb(230, 77, 77)"}}>Trang:</span>
                              </strong>{" "}
                              mang nghĩa To lớn, Tráng lệ. Hướng tới sự thành công vượt bậc, thể hiện ý chí, khát vọng
                              thực hiện những mục tiêu lớn, đem lại giá trị lớn cho cộng đồng, cho xã hội.&nbsp;
                           </p>
                        </li>
                        <li>
                           <p style={{columnCount: 1}}>
                              <strong>
                                 <span style={{color: "rgb(230, 77, 77)"}}>Phương Trang </span>
                              </strong>
                              với hàm nghĩa càng phát triển, càng to lớn lại càng phải “CHÍNH TRỰC”. Luôn là biểu tượng
                              của sự phát triển dựa trên những giá trị đạo đức tốt đẹp nhất.
                           </p>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CompanyOverview;
