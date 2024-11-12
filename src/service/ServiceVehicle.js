import requests from "./httpService";

const ServiceVehicle = {
    getAllvehicle: async () => {
        return requests.get(`/vehicle/`);
    },
    getVehicle: async (id) => {
        return requests.get(`/vehicle/${id}`);
    },
    createVehicle: async (body) => {
        return requests.post(`/vehicle/`, body);
    },
    editVehicle: async (body, id) => {
        return requests.put(`/vehicle/${id}`, body);
    },
    deleteVehicle: async (id) => {
        return requests.delete(`/vehicle/${id}`);
    }
}

export default ServiceVehicle;