import axios from "axios";

const API_URL = "http://127.0.0.1:8000/danios/";

export const obtenerDanios = async (page = 1, pageSize = 5, patente = "") => {
    let url = `${API_URL}?page=${page}&page_size=${pageSize}`;
    if (patente) url += `&patente=${patente}`;
    const response = await axios.get(url);
    return response.data;
};

export const obtenerDaniosPorAlquiler = async (idAlquiler) => {
    const response = await axios.get(`${API_URL}${idAlquiler}/`);
    return response.data;
};

export const crearDanio = async ({ id_alquiler, descripcion, monto }) => {
    return await axios.post(`${API_URL}nuevo/`, { id_alquiler, descripcion, monto });
};

export const actualizarDanio = async (id_alquiler, id_danio, { descripcion, monto }) => {
    return await axios.put(`${API_URL}${id_alquiler}/${id_danio}/`, { descripcion, monto });
};
