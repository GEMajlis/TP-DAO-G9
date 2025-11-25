import React from "react";

export default function DaniosSearch({ Patente, setPatente, Buscar }) {
    return (
        <form
            name="FormBusquedaDanios"
            onSubmit={(e) => {
                e.preventDefault();
                Buscar(1); // siempre busca desde la página 1
            }}
            className="bg-light p-3 rounded-3 border mb-4"
        >
            <div className="row align-items-center g-3">

                {/* Patente */}
                <div className="col-12 col-md d-flex align-items-center">
                    <label
                        className="col-form-label fw-bold text-secondary me-2 text-center"
                        style={{ minWidth: "100px" }}
                    >
                        Vehículo
                    </label>
                    <div className="input-group flex-grow-1">
                        <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setPatente(e.target.value)}
                            value={Patente}
                            placeholder="Ingrese patente..."
                            maxLength="55"
                            autoFocus
                        />
                    </div>
                </div>

            </div>
        </form>
    );
}
