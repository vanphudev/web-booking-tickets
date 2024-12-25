import React, {useState} from "react";
import {Form, Input, Select, Button, Modal, message, Spin} from "antd";
import {SaveOutlined, CloseOutlined} from "@ant-design/icons";
import AddressApi from "../../api/addressApi";
import UserApi from "../../api/userApi";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import AuthApi from "../../api/authApi";

const {Option} = Select;

const Address = () => {
   const [form] = Form.useForm();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [formValues, setFormValues] = useState(null);
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const userInfo = useSelector((state) => state.auth.userInfo);
   const address = userInfo?.address
      ? typeof userInfo.address === "string"
         ? JSON.parse(userInfo.address)
         : userInfo.address
      : {};
   const [isInitialized, setIsInitialized] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
   const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

   const onFinish = (values) => {
      setFormValues(values);
      setIsModalOpen(true);
   };

   const handleModalOk = async () => {
      try {
         setLoading(true);
         const data = {
            province_id: formValues?.province,
            district_id: formValues?.district,
            ward_id: formValues?.ward,
            address: formValues?.addressDetail,
         };
         const res = await UserApi.updateAddress(data);
         if (res.status === 200 || res.status === 201) {
            setIsModalOpen(false);
            setIsSuccessModalOpen(true);
            await AuthApi.fetchMe({customerId: userInfo?.userId});
         } else {
            setIsModalOpen(false);
            setIsErrorModalOpen(true);
         }
      } finally {
         setLoading(false);
      }
   };

   const handleProvinceChange = async (value) => {
      form.setFieldsValue({district: undefined, ward: undefined});
      setDistricts([]);
      const res = await AddressApi.getDistrictsByProvinceId({province_id: value});
      if (res.status === 200 || res.status === 201) {
         setDistricts(res.metadata?.districts || []);
      }
      setWards([]);
   };

   const handleDistrictChange = async (value) => {
      form.setFieldsValue({ward: undefined});
      setWards([]);
      const res = await AddressApi.getWardsByDistrictId({district_id: value});
      if (res.status === 200 || res.status === 201) {
         setWards(res.metadata?.wards || []);
      }
   };

   useEffect(() => {
      const getProvinces = async () => {
         setIsLoading(true);
         console.log("address", address.province_id);
         console.log("isInitialized", !isInitialized);
         const res = await AddressApi.getProvinces();
         if (res.status === 200 || res.status === 201) {
            setProvinces(res.metadata?.provinces || []);
            if (address?.province_id && !isInitialized) {
               form.setFieldValue("province", address?.province_id);
               handleProvinceChange(address?.province_id);
            } else {
               setIsLoading(false);
            }
         }
      };
      getProvinces();
   }, []);

   useEffect(() => {
      if (districts.length > 0 && address?.district_id && !isInitialized) {
         form.setFieldValue("district", address?.district_id);
         handleDistrictChange(address?.district_id);
      } else if (districts.length > 0 && !address?.district_id) {
         setIsLoading(false);
      }
   }, [districts]);

   useEffect(() => {
      if (wards.length > 0 && address?.ward_id && !isInitialized) {
         form.setFieldsValue({
            ward: address?.ward_id,
            addressDetail: address?.address,
         });
         setIsInitialized(true);
         setIsLoading(false);
      } else if (wards.length > 0 && !address?.ward_id) {
         setIsLoading(false);
      }
   }, [wards]);

   const resetToInitialValues = async () => {
      setIsLoading(true);
      setIsInitialized(false);
      form.resetFields();

      if (address?.province_id) {
         form.setFieldValue("province", address?.province_id);
         const provinceRes = await AddressApi.getDistrictsByProvinceId({province_id: address.province_id});
         if (provinceRes.status === 200 || provinceRes.status === 201) {
            setDistricts(provinceRes.metadata?.districts || []);
         }
      }

      if (address?.district_id) {
         form.setFieldValue("district", address?.district_id);
         const districtRes = await AddressApi.getWardsByDistrictId({district_id: address.district_id});
         if (districtRes.status === 200 || districtRes.status === 201) {
            setWards(districtRes.metadata?.wards || []);
         }
      }

      if (address?.ward_id) {
         form.setFieldsValue({
            ward: address?.ward_id,
            addressDetail: address?.address,
         });
      }

      setIsInitialized(true);
      setIsLoading(false);
   };

   return (
      <div style={{margin: "0 auto"}}>
         <h2 className='mb-2 text-2xl font-semibold'>Cập nhật địa chỉ</h2>
         <p className='text-gray-500 mb-6'>Địa chỉ của bạn sẽ được sử dụng để nhập nhanh địa điểm đón và trả khách</p>

         {isLoading ? (
            <div className='flex min-h-[400px] items-center justify-center'>
               <div className='text-center'>
                  <div className='flex min-h-[200px] items-center justify-center'>
                     <Spin size='large' tip='Đang tải dữ liệu...' />
                  </div>
               </div>
            </div>
         ) : (
            <Form
               form={form}
               layout='horizontal'
               onFinish={onFinish}
               autoComplete='off'
               labelCol={{span: 4}}
               wrapperCol={{span: 20}}>
               <Form.Item
                  label='Tỉnh/Thành phố'
                  name='province'
                  rules={[{required: true, message: "Vui lòng chọn Tỉnh/Thành phố!"}]}>
                  <Select size='large' placeholder='Chọn Tỉnh/Thành phố' onChange={handleProvinceChange}>
                     {provinces?.map((province) => (
                        <Option key={province.province_id} value={province.province_id} label={province.province_name}>
                           {province.province_name}
                        </Option>
                     ))}
                  </Select>
               </Form.Item>
               <Form.Item
                  label='Quận/Huyện'
                  name='district'
                  rules={[{required: true, message: "Vui lòng chọn Quận/Huyện!"}]}>
                  <Select
                     size='large'
                     placeholder='Chọn Quận/Huyện'
                     onChange={handleDistrictChange}
                     disabled={!form.getFieldValue("province")}>
                     {districts?.map((district) => (
                        <Option key={district.district_id} value={district.district_id} label={district.district_name}>
                           {district.district_name}
                        </Option>
                     ))}
                  </Select>
               </Form.Item>
               <Form.Item label='Phường/Xã' name='ward' rules={[{required: true, message: "Vui lòng chọn Phường/Xã!"}]}>
                  <Select size='large' placeholder='Chọn Phường/Xã' disabled={!form.getFieldValue("district")}>
                     {wards?.map((ward) => (
                        <Option key={ward.ward_id} value={ward.ward_id} label={ward.ward_name}>
                           {ward.ward_name}
                        </Option>
                     ))}
                  </Select>
               </Form.Item>
               <Form.Item
                  label='Địa chỉ chi tiết'
                  name='addressDetail'
                  rules={[
                     {required: true, message: "Vui lòng nhập địa chỉ chi tiết!"},
                     {min: 5, message: "Địa chỉ phải có ít nhất 5 ký tự!"},
                  ]}>
                  <Input.TextArea size='large' placeholder='Nhập số nhà, tên đường...' rows={4} />
               </Form.Item>
               <Form.Item wrapperCol={{offset: 16, span: 8}}>
                  <div className='mt-5 flex justify-end gap-4'>
                     <Button size='large' onClick={resetToInitialValues} icon={<CloseOutlined />}>
                        Hủy
                     </Button>
                     <Button size='large' type='primary' htmlType='submit' icon={<SaveOutlined />}>
                        Cập nhật
                     </Button>
                  </div>
               </Form.Item>
            </Form>
         )}

         <Modal
            title='Xác nhận'
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={() => setIsModalOpen(false)}
            okText='Đồng ý'
            cancelText='Hủy'
            confirmLoading={loading}
            okButtonProps={{className: "bg-orange-500"}}>
            <p>Bạn có chắc chắn muốn cập nhật thông tin địa chỉ này?</p>
         </Modal>

         <Modal
            title='Thông báo'
            open={isSuccessModalOpen}
            onOk={() => setIsSuccessModalOpen(false)}
            onCancel={() => setIsSuccessModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{style: {display: "none"}}}
            okButtonProps={{className: "bg-orange-500"}}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#00613D]'>✓</div>
               <h3 className='text-lg font-semibold'>Thành công!</h3>
               <p>Cập nhật địa chỉ thành công</p>
            </div>
         </Modal>

         <Modal
            title='Thông báo'
            open={isErrorModalOpen}
            onOk={() => setIsErrorModalOpen(false)}
            onCancel={() => setIsErrorModalOpen(false)}
            okText='Đóng'
            cancelButtonProps={{style: {display: "none"}}}
            okButtonProps={{className: "bg-orange-500"}}>
            <div className='py-4 text-center'>
               <div className='mb-2 text-2xl text-[#bd0f0f]'>✕</div>
               <h3 className='text-lg font-semibold'>Lỗi!</h3>
               <p>Đã có lỗi xảy ra khi cập nhật địa chỉ</p>
            </div>
         </Modal>
      </div>
   );
};

export default Address;
