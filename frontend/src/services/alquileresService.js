import axios from "axios";

const API_URL = "http://127.0.0.1:8000/alquileres/";

export const obtenerAlquileres = async (page = 1, pageSize = 5, filtroPatente = "") => {
    let url = `${API_URL}?page=${page}&page_size=${pageSize}`;

    if (filtroPatente) url += `&vehiculo=${filtroPatente}`;

    const response = await axios.get(url);  
    return response.data;
};

export const obtenerAlquiler = async (id) => {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
};

export const crearAlquiler = async (data) => {
    const response = await axios.post(`${API_URL}nuevo/`, data);
    return response.data;
};

export const finalizarAlquiler = async (id) => {
    const response = await axios.post(`${API_URL}${id}/finalizar/`);
    return response.data;
};
