import requests from "./httpService";

const ServiceFee = {
  getAllFee: async () => {
    return requests.get(`/fee`);
  },
  getFee: async (id) => {
    return requests.get(`/fee/${id}`);
  },
  createFee: async (body) => {
    return requests.post(`/fee/`, body);
  },
  editFee: async (id, body) => {
    return requests.put(`/fee/${id}`, body);
  },
  deleteFee: async (id) => {
    return requests.delete(`/fee/${id}`);
  },
};

export default ServiceFee;
