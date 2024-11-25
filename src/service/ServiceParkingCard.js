import requests from "./httpService";

const ServiceParkingCard = {
  createParkingCrad: async (body) => {
    return requests.post(`/card`, body);
  },
  getAllPakingCard: async () => {
    return requests.get(`/card`);
  },
  getParkingCard: async (id) => {
    return requests.get(`/card/${id}/detail`);
  },
  delectParkingCard: async (id) => {
    return requests.delete(`/card/${id}`);
  },
  editCard: async (id, body) => {
    return requests.put(`/card/${id}/role`, body);
  },
  detectVehicle: async (formData) => {
    // Sử dụng formData trực tiếp
    console.log(formData);

    return requests.put(`/card/detect`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateExitCard: async (id, body) => {
    return requests.put(`/card/${id}/exit`, body);
  },
  editVehicleCard: async (id, body) => {
    return requests.put(`/card/${id}/add_vehicle`, body);
  },
  removeVehicleCard: async (id, body) => {
    return requests.put(`/card/${id}/remove_vehicle`, body);
  },
};

export default ServiceParkingCard;
