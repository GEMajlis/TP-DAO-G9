# TP-DAO-G9


---

## 🔧 Commits y ramas

**Prefijos de commit**:

| Prefijo     | Uso                                         | Ejemplo                                                     |
| ----------- | ------------------------------------------- | ----------------------------------------------------------- |
| `docs:`     | Altas/cambios en documentación              | `docs: agregar ...`                                         |
| `fix:`      | Correcciones de nombres, typos, links       | `fix: corregir ...`                                         |
| `feat:`     | Altas en funcionalidades                    | `feat: agregar ...`                                         |
| `refactor:` | Reorganizar sin cambiar contenido académico | `refactor: separar ...`                                     |

**Ramas**

* Base: `main`.
* Nomenclatura: `<Prefijo>/<Descripcion-tarea>`
* Los prefijos son los mismos utilizados para los commits

  * `feat/agrego-funcionalida-busqueda`
  * `docs/agrego-enunciados`
  * `fix/correcion-nombre-vehiculo`

**Pull Requests**

* Todo cambio mediante PR.
* Describir **qué** + **por qué**.
* Tras merge, borrar la rama remota.

---


## 🔁 Flujo de trabajo

1. **Crear** rama desde `main` con el nombre indicado.
2. **Agregar** cambios y **nombrar** siguiendo la convención.
3. **Commit** con el prefijo y descripcion adecuada.
4. **Push** y abrir **PR**.

---
## 🗂️ Estructura del repositorio

```text
TP-DAO-G9/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Llamadas a API
│   │   ├── utils/           # Funciones utilitarias
│   │   ├── styles/          # Estilos globales
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Aplicación Django
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/              # Configuración principal
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/                # Apps de Django
│   ├── migrations/
│   └── utils/               # Funciones compartidas
│
├── .gitignore
└── README.md
```

---
