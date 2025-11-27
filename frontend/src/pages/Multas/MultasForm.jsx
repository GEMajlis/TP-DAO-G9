import React, { useState, useEffect } from "react";
import { obtenerAlquileres } from "../../services/alquileresService";

export default function MultasForm({ Multa, Guardar, Cancelar, loading }) {
    
    // 1. Verificamos si es edición (¡Ahora 'Multa' también tendrá 'id_multa'!)
    const esEdicion = Multa && Multa.id_multa;

    // Estado para almacenar alquileres activos
    const [alquileres, setAlquileres] = useState([]);

    // 2. AÑADIMOS 'id_multa' al estado inicial del formulario
    const [form, setForm] = useState({
        id_multa: Multa?.id_multa || "",
        alquiler: Multa?.alquiler || "",
        motivo: Multa?.motivo || "",
        monto: Multa?.monto || "",
    });

    // Cargar alquileres activos
    useEffect(() => {
        const fetchAlquileres = async () => {
            try {
                const data = await obtenerAlquileres(1, 100, "", "Activo");
                setAlquileres(data.alquileres);
            } catch (err) {
                console.error("Error al cargar alquileres:", err);
            }
        };
        fetchAlquileres();
    }, []);

    // 3. AÑADIMOS 'id_multa' al useEffect
    useEffect(() => {
        // Si 'Multa' (la prop) cambia, actualizamos el estado del formulario
        if (Multa) {
            setForm({
                id_multa: Multa.id_multa || "", // <-- CAMBIO: Guardamos el ID
                alquiler: Multa.alquiler || "",
                motivo: Multa.motivo || "",
                monto: Multa.monto || "",
            });
        } else {
            // Reseteo si no hay prop (aunque 'MultasPage' no debería hacer esto)
            setForm({
                id_multa: "",
                alquiler: "",
                motivo: "",
                monto: "",
            });
        }
    }, [Multa]); // Dependemos de la prop 'Multa'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- INICIO DE LA CORRECCIÓN ---
        // Preparamos los datos para enviar.
        // Los inputs (incluso type="number") devuelven strings.
        // El backend espera números (int/float) para 'alquiler' y 'monto'.
        const datosParaGuardar = {
            ...form, // Copiamos todo (como 'motivo' que es string)
            
            // Convertimos los campos numéricos a NÚMEROS
            alquiler: parseInt(form.alquiler, 10),
            monto: parseFloat(form.monto),
            
            // id_multa solo se convierte si existe (no es un string vacío)
            id_multa: form.id_multa ? parseInt(form.id_multa, 10) : null
        };

        // Validamos que las conversiones no fallen (NaN - Not a Number)
        if (isNaN(datosParaGuardar.alquiler) || isNaN(datosParaGuardar.monto)) {
            // (Idealmente, aquí mostrarías un error en la UI, 
            // pero un alert funciona para validar)
            alert("Error: El ID de Alquiler y el Monto deben ser números válidos.");
            return; 
        }
        
        // Enviamos el objeto con los tipos de datos corregidos
        Guardar(datosParaGuardar);
        // --- FIN DE LA CORRECCIÓN ---
    };

    const labelStyle = { backgroundColor: "transparent" };

    return (
        <>
            <div
                className="card shadow-lg border-0 w-100 formulario-container"
                style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "12px" }}
            >
                <div className="card-header bg-white border-bottom-0 pt-3 pb-1" style={{ borderRadius: "12px" }}>
                    <h4 className="card-title mb-0 text-primary fw-bold">
                        <i className={`fa-solid ${esEdicion ? "fa-pen-to-square" : "fa-plus"} me-2`}></i>
                        {esEdicion ? "Modificar Multa" : "Registrar Nueva Multa"}
                    </h4>
                    <p className="text-muted small mb-0 mt-1 ms-4">
                        {esEdicion 
                            ? `Modificando la multa ID: ${form.id_multa} (Alquiler: ${form.alquiler})`
                            : `Complete los datos para la nueva multa.` /* <-- CORRECCIÓN DE TEXTO */
                        }
                    </p>
                </div>

                <div className="card-body p-4 pt-2">
                    <form onSubmit={handleSubmit}>

                        {/* Alquiler */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-file-contract"></i>
                                    </span>
                                    <div className="form-floating">
                                        <select
                                            className="form-select border-start-0 ps-2"
                                            id="inputAlquiler"
                                            name="alquiler"
                                            value={form.alquiler}
                                            onChange={handleChange}
                                            required
                                            disabled={esEdicion || loading}
                                            style={{ zIndex: 0 }}
                                        >
                                            <option value="">Seleccione un alquiler</option>
                                            {alquileres.map(alq => (
                                                <option key={alq.id} value={alq.id}>
                                                    ID {alq.id} - {alq.cliente_nombre} - {alq.vehiculo_modelo} ({alq.vehiculo_patente})
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="inputAlquiler" style={labelStyle} className="ps-2">
                                            Alquiler {esEdicion && <span className="text-muted">(bloqueado)</span>}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Monto */}
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-money-bill"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control border-start-0 ps-2"
                                            id="inputMonto"
                                            name="monto"
                                            placeholder="Monto"
                                            value={form.monto}
                                            onChange={handleChange}
                                            required
                                            disabled={loading} // <-- CORRECCIÓN: Deshabilitado si carga
                                            style={{ zIndex: 0 }}
                                        />
                                        <label htmlFor="inputMonto" style={labelStyle} className="ps-2">
                                            Monto
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Motivo */}
                        <div className="row g-3 mb-4">
                            <div className="col-12">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-pen"></i>
                                    </span>
                                    <div className="form-floating">
                                        <textarea
                                            className="form-control border-start-0 ps-2"
                                            id="inputMotivo"
                                            name="motivo"
                                            placeholder="Motivo"
                                            value={form.motivo}
                                            onChange={handleChange}
                                            required
                                            disabled={loading} // <-- CORRECCIÓN: Deshabilitado si carga
                                            style={{ height: "100px", resize: "none", zIndex: 0 }}
                                        ></textarea>
                                        <label htmlFor="inputMotivo" style={labelStyle} className="ps-2">
                                            Motivo
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="d-flex justify-content-center gap-3 pt-3 pb-2 border-top">
                            <button
                                type="button"
                                className="btn btn-secondary px-4 fw-bold" // Clase 'btn' agregada
                                onClick={Cancelar}
                                disabled={loading} // Deshabilitado mientras guarda
                            >
                                <i className="fa-solid fa-times me-2"></i>
                                Cancelar
                            </button>

                            <button 
                                type="submit" 
                                className="btn btn-primary px-4 fw-bold" // Clase 'btn' agregada
                                disabled={loading} // Deshabilitado mientras guarda
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                ) : (
                                    <i className="fa-solid fa-save me-2"></i>
                                )}
                                {esEdicion ? "Guardar" : "Registrar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}