// Là hàm chuyển đổi chuỗi thành chuỗi URL
export const normalizeToURL = (str) => {
   return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
};

// Hàm chuyển đổi số thành chuỗi định dạng tiền tệ
export const formatCurrency = (value) => {
   return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
   }).format(value);
};

// Hàm chuyển đổi ngày tháng thành chuỗi định dạng ngày tháng
export const formatDateTime = (value) => {
   return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "full",
      timeStyle: "short",
   }).format(new Date(value));
};

// Hàm chuyển đổi ngày tháng thành chuỗi ISO
export const formatDateTimeToISO = (value) => {
   return new Date(value).toISOString();
};

// Hàm chuyển đổi chuỗi thành chuỗi viết hoa chữ cái đầu tiên
export const capitalizeWords = (str) => {
   return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};
