import React, { useState, useEffect } from "react";
import { Spin, Modal, Pagination } from "antd";
import CouponItem from "../coupon/coupon-item";
import voucher from "../../assets/images/voucher.png";
import VoucherApi from "../../api/voucherApi";
import { useSelector } from "react-redux";

const Voucher = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [loading, setLoading] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
   const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const pageSize = 2;
   const [voucherList, setVoucherList] = useState([]);
   const userInfo = useSelector((state) => state.auth.userInfo);


   useEffect(() => {
      const fetchVouchers = async () => {
         const customerId = userInfo?.userId;
         const phone = userInfo?.phone;
         if (customerId && phone) {
            await VoucherApi.getByCustomer({ customerId, phone }).then((res) => {
               if (res?.status === 200) {
                  setVoucherList(res?.metadata?.vouchers);
               }
            });
         }
      };

      fetchVouchers();
   }, [userInfo]);

   const handleConfirm = () => {
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   const handlePageChange = (page) => {
      setCurrentPage(page);
   };

   if (isLoading) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
               <div className='flex min-h-[200px] items-center justify-center'>
                  <Spin size='large' tip='Đang tải dữ liệu...' />
               </div>
            </div>
         </div>
      );
   }

   const data = [
      {
         _id: "1",
         title: "Mã giảm giá 1",
         logo: voucher,
         discountPercentage: 10,
         startDate: "2024-12-01T00:00:00",
         endDate: "2024-12-01T00:00:00",
         code: "1234567890",
         description: "Mã giảm giá 10% cho tất cả sản phẩm",
      },
      {
         _id: "2",
         title: "Mã giảm giá 2",
         logo: voucher,
         discountPercentage: 10,
         startDate: "2024-12-01T00:00:00",
         endDate: "2024-12-01T00:00:00",
         code: "1234567890",
         description: "Mã giảm giá 10% cho tất cả sản phẩm",
      },

   ];

   return (
      <div style={{ margin: "0 auto" }}>
         <h2 className='mb-2 text-2xl font-semibold'>Mã giảm giá</h2>
         <p className='text-gray-500 mb-6'>Danh sách mã giảm giá của bạn</p>
         <div className='flex flex-wrap gap-4'>
            <div className='profile-container-slick bg-gray-200 w-full rounded-lg p-4'>
               <div className='grid grid-cols-2 gap-20 sm:grid-cols-2 md:grid-cols-2'>
                  {voucherList.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((voucher, index) => (
                     <CouponItem
                        key={voucher.voucher_id || index}
                        code={voucher.voucher_code}
                        startDate={voucher.voucher_valid_from}
                        endDate={voucher.voucher_valid_to}
                        discount_percentage={voucher.voucher_discount_percentage}
                     />
                  ))}
               </div>
            </div>
         </div>
         <div className="flex justify-center mt-4">
            <Pagination
               current={currentPage}
               total={voucherList.length}
               pageSize={pageSize}
               onChange={handlePageChange}
               showSizeChanger={false}
            />
         </div>
         <Modal
            size='large'
            title='Xác nhận cập nhật'
            open={isModalOpen}
            onOk={handleConfirm}
            onCancel={handleCancel}
            confirmLoading={loading}
            okText='Xác nhận'
            cancelText='Hủy'
            okButtonProps={{ className: "bg-orange-500" }}>
            <p>Bạn có chắc chắn muốn cập nhật thông tin?</p>
         </Modal>
         <Modal
            title='Thông báo'
            open={isSuccessModalOpen}
            onOk={() => setIsSuccessModalOpen(false)}
            onCancel={() => setIsSuccessModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ className: "bg-orange-500" }}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#00613D]'>✓</div>
               <h3 className='text-lg font-semibold'>Thành công!</h3>
               <p>Cập nhật thông tin thành công</p>
            </div>
         </Modal>
         <Modal
            title='Thông báo'
            open={isErrorModalOpen}
            onOk={() => setIsErrorModalOpen(false)}
            onCancel={() => setIsErrorModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ className: "bg-orange-500" }}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#bd0f0f]'>✕</div>
               <h3 className='text-lg font-semibold'>Lỗi!</h3>
               <p>Đã có lỗi xảy ra khi cập nhật thông tin</p>
               <p>{errorMessage}</p>
            </div>
         </Modal>
      </div>
   );
};

export default Voucher;
