import axios from "axios";
import { Modal } from "antd";
import Cookies from "universal-cookie";
import useAsync from "../hook/useAsync";

const cookies = new Cookies();

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 600000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let modalVisible = false;

instance.interceptors.request.use((config) => {
  const token = cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      const errorMessage = error.response.data.detail;
      if (
        errorMessage === "Token không hợp lệ hoặc đã hết hạn!" &&
        !modalVisible
      ) {
        modalVisible = true;
        Modal.warning({
          title: "Session Expired",
          content: "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại",
          okText: "OK",
          centered: true,
          onOk: () => {
            modalVisible = false;
            cookies.remove("token");
            window.location.href = "/"; // Sử dụng window.location để điều hướng
          },
          maskClosable: false, // Ngăn không cho đóng modal bằng cách click ra ngoài
          closable: false, // Ngăn không cho đóng modal bằng cách click nút đóng
        });
        
        setTimeout(() => {
          modalVisible = false;
          cookies.remove("token");
          window.location.href = "/"; // Tự động điều hướng sau 10 giây
        }, 10000); // Logout tự động sau 5 giây
      }
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, { params: body, headers }).then(responseBody),
  post: (url, body) => instance.post(url, body).then(responseBody),
  put: (url, body, headers) =>
    instance.put(url, body, { headers }).then(responseBody),
  patch: (url, body) => instance.patch(url, body).then(responseBody),
  delete: (url, body) =>
    instance.delete(url, { data: body }).then(responseBody),
};

export default requests;
