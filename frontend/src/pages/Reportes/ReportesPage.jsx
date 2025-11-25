/* global Chart */
import React, { useState, useEffect, useRef } from "react"; 
import * as reportesService from "../../services/reportesService";
import { format } from 'date-fns'; 
import "../../styles/PageLayout.css";
import "../../styles/ReportesPage.css"; 


// Componente para el Reporte de Vehículos Más Alquilados
const ReporteVehiculos = ({ vehiculos }) => (
    <div className="report-section card shadow-sm p-4 fade-in">
        <h5 className="text-primary mb-3"><i className="fa-solid fa-car-side me-2"></i>Vehículos Más Alquilados ({vehiculos.length} vehículos)</h5>
        <div className="table-responsive">
            <table className="table table-sm table-striped table-hover align-middle">
                <thead className="table-secondary">
                    <tr>
                        <th>Patente</th>
                        <th>Marca y Modelo</th>
                        <th>Color</th>
                        <th className="text-center">Cant. Alquileres</th>
                    </tr>
                </thead>
                <tbody>
                    {vehiculos.map((v, index) => (
                        <tr key={v.patente}>
                            <td className="fw-bold">{v.patente}</td>
                            <td>{v.marca} - {v.modelo}</td>
                            <td>{v.color}</td>
                            <td className="text-center fw-bold">{v.cantidad_alquileres}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// Componente Reporte de Facturación (CON GRÁFICO DE BARRAS)
const ReporteFacturacion = ({ facturacion }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null); 

    useEffect(() => {
        // Aseguramos que Chart.js esté cargado y tengamos datos
        if (typeof Chart === 'undefined' || !chartRef.current || !facturacion || facturacion.length === 0) return;

        // Limpiar la instancia anterior antes de crear una nueva
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        
        // 1. Preparar los datos
        const labels = facturacion.map(f => f.mes);
        const dataValues = facturacion.map(f => f.monto);

        // 2. Crear la nueva instancia del gráfico
        chartInstance.current = new Chart(ctx, {
            type: 'bar', // Tipo de gráfico: barras
            data: {
                labels: labels,
                datasets: [{
                    label: 'Facturación (€)',
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Azul primario
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Ingresos por Mes'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Monto (€)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Mes del Año'
                        }
                    }
                }
            }
        });

        // Función de limpieza al desmontar el componente
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [facturacion]);


    return (
        <div className="report-section card shadow-sm p-4 fade-in">
            <h5 className="text-primary mb-3"><i className="fa-solid fa-money-bill-transfer me-2"></i>Facturación Mensual (Año en Curso)</h5>
            
            <div className="chart-container"> 
                {/* Aquí es donde Chart.js dibujará el gráfico */}
                <canvas ref={chartRef} id="facturacionChart"></canvas>
            </div>
            
            <div className="table-responsive mt-4">
                <h6 className="text-muted border-bottom pb-1">Datos Detallados</h6>
                <table className="table table-sm table-striped align-middle">
                    <thead className="table-secondary">
                        <tr>
                            <th>Mes</th>
                            <th className="text-end">Monto Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturacion.map((f, index) => (
                            <tr key={f.mes}>
                                <td>{f.mes}</td>
                                <td className="text-end fw-bold">${f.monto.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// Componente para el Reporte de Alquileres por Período
const ReporteAlquileres = ({ alquilerePeriodo, buscarReporte, loading, error }) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const [fechaInicio, setFechaInicio] = useState(today);
    const [fechaFin, setFechaFin] = useState(today);
    const [busquedaError, setBusquedaError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setBusquedaError(null);
        
        if (fechaInicio > fechaFin) {
            setBusquedaError("La fecha de inicio no puede ser posterior a la fecha de fin.");
            return;
        }

        buscarReporte(fechaInicio, fechaFin);
    };

    return (
        <div className="report-section fade-in">
            <h5 className="text-primary mb-3"><i className="fa-solid fa-calendar-alt me-2"></i>Alquileres por Período</h5>
            
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label htmlFor="fechaInicio" className="form-label">Fecha de Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaInicio"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="fechaFin" className="form-label">Fecha de Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaFin"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Cargando...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-magnifying-glass me-2"></i>
                                    Generar Reporte
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {busquedaError && (
                <div className="alert alert-warning mb-3">{busquedaError}</div>
            )}
            
            {error && (
                <div className="alert alert-danger mb-3"><strong>Error al buscar:</strong> {error}</div>
            )}

            {alquilerePeriodo && (
                <div className="alquileres-results mt-4">
                    <p className="fw-bold">
                        Resultados encontrados: <span className="text-primary">{alquilerePeriodo.length}</span>
                    </p>
                    <div className="table-responsive">
                        <table className="table table-sm table-striped table-hover align-middle">
                            <thead className="table-secondary">
                                <tr>
                                    <th>ID</th>
                                    <th>DNI Cliente</th>
                                    <th>Patente</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                    <th className="text-end">Total Pagado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alquilerePeriodo.map((a) => (
                                    <tr key={a.id_alquiler}>
                                        <td className="fw-bold">{a.id_alquiler}</td>
                                        <td>{a.cliente_dni}</td>
                                        <td>{a.vehiculo_patente}</td>
                                        <td>{a.empleado_dni}</td>
                                        <td>{a.fecha_inicio}</td>
                                        <td>{a.fecha_fin}</td>
                                        <td className="text-end fw-bold">${a.total_pago ? a.total_pago.toFixed(2) : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente Principal de la Página de Reportes
export default function ReportesPage() {
    
    // Carga del CDN de Chart.js
    useEffect(() => {
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);
    // ------------------------------------------------
    
    // 1. Estados de carga inicial y errores
    const [loadingInicial, setLoadingInicial] = useState(true);
    const [errorInicial, setErrorInicial] = useState(null);

    // 2. Estados para los 3 reportes
    const [vehiculosReporte, setVehiculosReporte] = useState([]);
    const [facturacionReporte, setFacturacionReporte] = useState([]);
    const [alquileresPeriodoReporte, setAlquileresPeriodoReporte] = useState(null);
    
    // 3. Estado de carga y error para la búsqueda por período
    const [loadingPeriodo, setLoadingPeriodo] = useState(false);
    const [errorPeriodo, setErrorPeriodo] = useState(null);

    // Función que carga los reportes 1 y 2 al inicio
    const fetchReportesIniciales = async () => {
        setLoadingInicial(true);
        setErrorInicial(null);
        try {
            // Carga Reporte 1: Vehículos
            const vehiculos = await reportesService.getReporteVehiculosMasAlquileres();
            setVehiculosReporte(vehiculos);

            // Carga Reporte 2: Facturación
            const facturacion = await reportesService.getReporteFacturacionMensual();
            setFacturacionReporte(facturacion);

        } catch (err) {
            console.error("Error al cargar reportes iniciales:", err);
            setErrorInicial("Error al cargar los reportes iniciales: " + err.message);
        } finally {
            setLoadingInicial(false);
        }
    };

    // Función que carga el Reporte 3 de forma dinámica
    const fetchReportePeriodo = async (fechaInicio, fechaFin) => {
        setLoadingPeriodo(true);
        setErrorPeriodo(null);
        setAlquileresPeriodoReporte(null); // Limpiar resultados anteriores
        try {
            const alquileres = await reportesService.getReporteAlquileresPorPeriodo(fechaInicio, fechaFin);
            setAlquileresPeriodoReporte(alquileres);

        } catch (err) {
            console.error("Error al buscar alquileres por período:", err);
            setErrorPeriodo(err.message);
            setAlquileresPeriodoReporte([]);
        } finally {
            setLoadingPeriodo(false);
        }
    };

    // Carga inicial de los reportes 1 y 2 al montar el componente
    useEffect(() => {
        fetchReportesIniciales();
        // Carga un reporte de período por defecto (ej. el mes actual) al inicio
        const today = new Date();
        const firstDayOfMonth = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd');
        const lastDayOfMonth = format(today, 'yyyy-MM-dd');
        fetchReportePeriodo(firstDayOfMonth, lastDayOfMonth);

    }, []);

    return (
        <div className="page-container reportes-page-container">
            <h2 className="page-title"><i className="fa-solid fa-chart-line me-2"></i>Dashboard de Reportes</h2>
            <p className="page-subtitle">
                Análisis de la flota, facturación e historial de alquileres.
            </p>

            {errorInicial && (
                <div className="alert alert-danger fade-in" role="alert">
                    <strong>Error Crítico:</strong> {errorInicial}
                </div>
            )}

            {loadingInicial && (
                <div className="text-center p-5 fade-in">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando reportes...</span>
                    </div>
                    <p className="mt-2 text-muted">Cargando datos principales de la flota...</p>
                </div>
            )}

            {!loadingInicial && !errorInicial && (
                <div className="reportes-grid fade-in">
                    {/* Sección Superior: Vehículos y Facturación */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <ReporteVehiculos vehiculos={vehiculosReporte} />
                        </div>
                        <div className="col-md-6">
                            <ReporteFacturacion facturacion={facturacionReporte} />
                        </div>
                    </div>

                    {/* Sección Inferior: Alquileres por Período */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow-sm p-4">
                                <ReporteAlquileres 
                                    alquilerePeriodo={alquileresPeriodoReporte}
                                    buscarReporte={fetchReportePeriodo}
                                    loading={loadingPeriodo}
                                    error={errorPeriodo}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}