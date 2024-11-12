import requests from "./httpService";

const ServiceCustomer = {
  userLogin: async (body) => {
    return requests.post(`/customer/login`, body);
  },
  changePassword: async (body) => {
    return requests.put(`/customer/change-password`, body);
  },
  userSignup: async (body) => {
    return requests.post(`/customer/create`, body);
  },
  getAllUser: async (body) => {
    return requests.get(`/customer/`);
  },
  getUser: async (body) => {
    return requests.post(`/cts`, body)
  },
  delectUser: async (body) => {
    return requests.delete(`/customer/${body}`)
  },
  editUser: async (id,body) => {
    return requests.put(`/customer/edit/${id}`, body);
  },
  changePasswordDefault: async (body) => {
    return requests.put(`/customer/reset-password/${body}`)
  },
};

export default ServiceCustomer;
