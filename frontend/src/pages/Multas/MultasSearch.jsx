import React from "react";

export default function MultasSearch({ 
    Alquiler, 
    setAlquiler, 
    IdMulta, 
    setIdMulta, 
    Buscar 
}) {
    return (
        <form
            onSubmit={(e) => {
    e.preventDefault();
    Buscar(Alquiler, IdMulta);
}}
            className="bg-light p-3 rounded-3 border mb-4"
        >
            <div className="row g-3 align-items-center">

                {/* Campo para ID Alquiler */}
                <div className="col-12 col-md">
                    <div className="d-flex align-items-center">
                        <label className="col-form-label fw-bold text-secondary me-2" style={{ minWidth: "100px" }}>
                            ID Alquiler
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            value={Alquiler}
                            onChange={(e) => setAlquiler(e.target.value)}
                            placeholder="Buscar por alquiler..."
                        />
                    </div>
                </div>

                {/* Nuevo Campo para ID Multa */}
                <div className="col-12 col-md">
                    <div className="d-flex align-items-center">
                        <label className="col-form-label fw-bold text-secondary me-2" style={{ minWidth: "100px" }}>
                            ID Multa
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            value={IdMulta}
                            onChange={(e) => setIdMulta(e.target.value)}
                            placeholder="Buscar por multa..."
                        />
                    </div>
                </div>

                {/* Botón de Búsqueda */}
                <div className="col-12 col-md-auto text-center">
                    <button type="submit" className="btn btn-primary fw-bold px-3">
                        <i className="fa fa-search"></i> Buscar
                    </button>
                </div>

            </div>
        </form>
    );
}