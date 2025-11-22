import axios from "axios";

const API_URL = "http://127.0.0.1:8000/vehiculos/";

export const obtenerVehiculos = async (page = 1, pageSize = 5) => {
    const response = await axios.get(`${API_URL}?page=${page}&page_size=${pageSize}`);
    return response.data;
};

export const obtenerVehiculo = async (patente) => {
    const response = await axios.get(`${API_URL}patente/${patente}/`);
    return response.data;
};

export const crearVehiculo = async (data) => {
    return await axios.post(`${API_URL}nuevo/`, data);
};

export const actualizarVehiculo = async (patente, data) => {
    return await axios.put(`${API_URL}editar/${patente}/`, data);
};

export const eliminarVehiculo = async (patente) => {
    return await axios.delete(`${API_URL}eliminar/${patente}/`);
};