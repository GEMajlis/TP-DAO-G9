import React from "react";

export default function AlquileresDetail({ Alquiler, Volver, Finalizar }) {
    if (!Alquiler) return null;

    const formatFecha = (fecha) => {
        return fecha ? new Date(fecha).toLocaleDateString("es-AR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : "-";
    };

    const calcularTotal = () => {
        const base = parseFloat(Alquiler.desglose?.costo_base || 0);
        const multas = parseFloat(Alquiler.desglose?.total_multas || 0);
        const danios = parseFloat(Alquiler.desglose?.total_danios || 0);
        return base + multas + danios;
    };

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="text-primary fw-bold">
                            <i className="fa-solid fa-file-contract me-2"></i>
                            Detalle del Alquiler #{Alquiler.id}
                        </h3>
                        <div className="d-flex gap-2">
                            {Alquiler.activo && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => Finalizar(Alquiler)}
                                >
                                    <i className="fa-solid fa-check me-2"></i>
                                    Finalizar Alquiler
                                </button>
                            )}
                            <button
                                className="btn btn-secondary"
                                onClick={Volver}
                            >
                                <i className="fa-solid fa-arrow-left me-2"></i>
                                Volver
                            </button>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className={`badge ${Alquiler.activo ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
                            {Alquiler.activo ? 'Activo' : 'Finalizado'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Cards Responsivos */}
            <div className="row g-4">
                
                {/* Cliente */}
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">
                                <i className="fa-solid fa-user me-2"></i>
                                Cliente
                            </h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-2">
                                <strong>Nombre:</strong> {Alquiler.cliente_nombre}
                            </p>
                            <p className="mb-2">
                                <strong>DNI:</strong> {Alquiler.cliente_dni}
                            </p>
                            <p className="mb-0">
                                <strong>Teléfono:</strong> {Alquiler.cliente_telefono}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vehículo */}
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">
                                <i className="fa-solid fa-car me-2"></i>
                                Vehículo
                            </h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-2">
                                <strong>Marca:</strong> {Alquiler.vehiculo_marca}
                            </p>
                            <p className="mb-2">
                                <strong>Modelo:</strong> {Alquiler.vehiculo_modelo}
                            </p>
                            <p className="mb-2">
                                <strong>Patente:</strong> {Alquiler.vehiculo_patente}
                            </p>
                            <p className="mb-0">
                                <strong>Color:</strong> {Alquiler.vehiculo_color}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fechas y Empleado */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">
                                <i className="fa-solid fa-calendar me-2"></i>
                                Información
                            </h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-2">
                                <strong>Empleado:</strong> {Alquiler.empleado_nombre}
                            </p>
                            <p className="mb-2">
                                <strong>Reserva:</strong> {Alquiler.reserva_id || "Sin reserva"}
                            </p>
                            <p className="mb-2">
                                <strong>Inicio:</strong> {formatFecha(Alquiler.fecha_inicio)}
                            </p>
                            <p className="mb-0">
                                <strong>Fin:</strong> {formatFecha(Alquiler.fecha_fin)}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Desglose de Costos */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-warning">
                            <h5 className="mb-0">
                                <i className="fa-solid fa-calculator me-2"></i>
                                Desglose de Costos
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 col-lg-3 mb-3">
                                    <div className="text-center p-3 border rounded">
                                        <small className="text-muted d-block">Días Alquilados</small>
                                        <h4 className="mb-0">{Alquiler.desglose?.dias || 0}</h4>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3 mb-3">
                                    <div className="text-center p-3 border rounded">
                                        <small className="text-muted d-block">Costo Base</small>
                                        <h4 className="mb-0 text-primary">
                                            ${parseFloat(Alquiler.desglose?.costo_base || 0).toFixed(2)}
                                        </h4>
                                        <small className="text-muted">
                                            ({Alquiler.desglose?.dias} días × ${Alquiler.vehiculo_precio_dia})
                                        </small>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3 mb-3">
                                    <div className="text-center p-3 border rounded">
                                        <small className="text-muted d-block">Total Multas</small>
                                        <h4 className="mb-0 text-danger">
                                            ${parseFloat(Alquiler.desglose?.total_multas || 0).toFixed(2)}
                                        </h4>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3 mb-3">
                                    <div className="text-center p-3 border rounded">
                                        <small className="text-muted d-block">Total Daños</small>
                                        <h4 className="mb-0 text-danger">
                                            ${parseFloat(Alquiler.desglose?.total_danios || 0).toFixed(2)}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="alert alert-success text-center mb-0">
                                        <h3 className="mb-0">
                                            <strong>Total a Pagar: ${calcularTotal().toFixed(2)}</strong>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tablas de Multas y Daños */}
            <div className="row mt-4 g-4">
                
                {/* Multas */}
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0">
                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                Multas ({Alquiler.multas?.length || 0})
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            {Alquiler.multas && Alquiler.multas.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Motivo</th>
                                                <th className="text-end">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Alquiler.multas.map(multa => (
                                                <tr key={multa.id}>
                                                    <td>{multa.id}</td>
                                                    <td>{multa.motivo}</td>
                                                    <td className="text-end">${parseFloat(multa.monto).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    No hay multas registradas
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Daños */}
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-warning">
                            <h5 className="mb-0">
                                <i className="fa-solid fa-wrench me-2"></i>
                                Daños ({Alquiler.danios?.length || 0})
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            {Alquiler.danios && Alquiler.danios.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Descripción</th>
                                                <th className="text-end">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Alquiler.danios.map(danio => (
                                                <tr key={danio.id}>
                                                    <td>{danio.id}</td>
                                                    <td>{danio.descripcion}</td>
                                                    <td className="text-end">${parseFloat(danio.monto).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    No hay daños registrados
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
