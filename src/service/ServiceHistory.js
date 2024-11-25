import requests from "./httpService";

const ServiceHistory = {
  getAllHistory: async () => {
    return requests.get(`/history`);
  },
  getHistory: async (id) => {
    return requests.get(`/history/${id}/detail`);
  }
};

export default ServiceHistory;
