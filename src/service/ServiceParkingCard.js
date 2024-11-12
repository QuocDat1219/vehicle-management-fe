import requests from "./httpService";

const ServiceParkingCard = {
  createParkingCrad: async (body) => {
    return requests.post(`/card`, body);
  },
  getAllPakingCard: async () => {
    return requests.get(`/card`);
  },
  getParkingCard: async (id) => {
    return requests.post(`/card/${id}`)
  },
  delectParkingCard: async (id) => {
    return requests.delete(`/card/${id}`)
  },
  editCard: async (id,body) => {
    return requests.put(`/card/${id}/role`, body);
  },
  updateEntryCard: async (id,body) => {
    return requests.put(`/card/${id}/entry`, body);
  },
  updateExitCard: async (id,body) => {
    return requests.put(`/card/${id}/exit`, body);
  },

};

export default ServiceParkingCard;
