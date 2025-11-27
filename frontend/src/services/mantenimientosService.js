const API = "http://127.0.0.1:8000";

const handle = async (r) => {
    let text = await r.text();
    try {
        const data = JSON.parse(text);
        if (!r.ok) throw new Error(data.error || "Error en el servidor");
        return data;
    } catch {
        console.error("Respuesta no JSON:", text);
        throw new Error("Error del servidor: " + text);
    }
};

export const crearMantenimiento = async (data) => {
    const response = await fetch(`${API}/mantenimientos/nuevo/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dni_empleado: data.dni_empleado,
            patente: data.patente,
        }),
    });

    return handle(response);
};

export const finalizarMantenimiento = async (patente) => {
    const response = await fetch(`${API}/mantenimientos/finalizar/${patente}/`, {
        method: "PUT",
    });

    return handle(response);
};

export const obtenerActivos = async () => {
    const response = await fetch(`${API}/mantenimientos/activos/`);
    const data = await handle(response);
    return data.mantenimientos_activos; // <--- LISTA REAL
};

export const obtenerTodos = async () => {
    const response = await fetch(`${API}/mantenimientos/`);
    const data = await handle(response);
    return data.mantenimientos; // <--- LISTA REAL
};

export const obtenerPorId = async (id) => {
    const response = await fetch(`${API}/mantenimientos/${id}/`);
    return handle(response); // este endpoint devuelve un único objeto
};
