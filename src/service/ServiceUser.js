import requests from "./httpService";

const ServiceUser = {
  createUser: async (body) => {
    return requests.post(`/user`, body);
  },
  getAllUser: async () => {
    return requests.get(`/user/`);
  },
  getUser: async (id) => {
    return requests.get(`/user/${id}`);
  },
  delectUser: async (id) => {
    return requests.delete(`/user/${id}`);
  },
  editUser: async (id, body) => {
    return requests.put(`/user/${id}`, body);
  },
  editVehicleUser: async (id, body) => {
    return requests.put(`/user/${id}/add_vehicle`, body);
  },
  removeVehicleUser: async (id, body) => {
    return requests.put(`/user/${id}/remove_vehicle`, body);
  },
  changePasswordDefault: async (body) => {
    return requests.put(`/customer/reset-password/${body}`);
  },
};

export default ServiceUser;
