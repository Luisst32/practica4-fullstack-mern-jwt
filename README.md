# UNEMI - Práctica 4: Full Stack MERN con Autenticación JWT y Roles

**Universidad Estatal de Milagro (UNEMI)**  
**Facultad de Ciencias e Ingeniería**  
**Carrera:** Ingeniería de Software (Modalidad Presencial)  
**Asignatura:** Desarrollo Web [ISO08DW]  
**Docente:** Ing. Mariana Madeleine Almache Sanisaca  
**Periodo Académico:** 2026-2027  

### Integrantes (Grupo 5):
* Kevin Paul Dávila Naveda
* Melanie Anahí Bermeo Gutiérrez
* Luis Enrique Peñafiel Frías
* Dyanne Christina Moina Párraga

---

## 📌 Descripción del Proyecto
Este repositorio contiene la solución completa e integrada de la **Práctica 4: Desarrollo e Integración Full Stack utilizando la pila MERN (MongoDB, Express, React, Node.js)** con autenticación sin estado mediante **JSON Web Tokens (JWT)** y control estricto de acceso basado en roles (**RBAC: Admin / Usuario**).

El proyecto está estructurado bajo la modalidad de **Monorepo**, conteniendo de forma desacoplada y modular:
* `/backend`: API RESTful construida sobre Node.js, Express, MongoDB (Mongoose ODM) y suites de pruebas automatizadas.
* `/frontend`: Single Page Application (SPA) desarrollada con React 18, Vite, React Router v6, Context API y Axios con interceptores de autorización.

---

## 📁 Estructura del Repositorio
```text
practica4-fullstack-mern-jwt/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexión a MongoDB (con fallback MongoMemoryServer)
│   │   ├── controllers/     # Controladores de Auth, Productos, Reportería
│   │   ├── middlewares/     # Middlewares de JWT (protect) y Roles (authorize)
│   │   ├── models/          # Esquemas Mongoose (User, Product, Transaction)
│   │   ├── routes/          # Rutas RESTful modularizadas
│   │   ├── utils/           # Datos semilla para inicialización
│   │   ├── app.js           # Configuración del servidor Express y CORS
│   │   └── server.js        # Punto de entrada y arranque del servidor
│   ├── test/
│   │   └── api.test.js      # Suite de 14 pruebas de integración automatizadas
│   ├── .env.example         # Plantilla de variables de entorno del servidor
│   ├── package.json         # Dependencias y scripts de backend
│   └── README.md            # Documentación técnica del backend
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ModalProducto, ProtectedRoute
│   │   ├── context/         # AuthContext (Estado global de sesión y rol)
│   │   ├── pages/           # Login, Registro, Catalogo, Reportes, NoAutorizado
│   │   ├── services/        # Cliente Axios con interceptor Authorization: Bearer
│   │   ├── App.jsx          # Enrutamiento de la SPA
│   │   ├── main.jsx         # Renderizado de React DOM
│   │   └── index.css        # Estilos responsivos
│   ├── index.html           # HTML base de Vite
│   ├── vite.config.js       # Configuración de compilación de Vite
│   ├── .env.example         # Plantilla de variables de entorno del cliente
│   ├── package.json         # Dependencias y scripts de frontend
│   └── README.md            # Documentación técnica del frontend
├── Practica4_MERN_JWT.postman_collection.json # Colección de pruebas de Postman
├── .gitignore               # Exclusión estricta de dependencias y temporales
└── README.md                # Documentación principal del monorepo
```

---

## 🚀 Requisitos Previos
* **Node.js**: v18.0.0 o superior
* **npm**: v9.0.0 o superior
* **MongoDB**: Instancia local de MongoDB o clúster en MongoDB Atlas *(Opcional: el backend incorpora `mongodb-memory-server` como mecanismo automático de tolerancia a fallos en caso de no tener daemon local activo)*.

---

## ⚙️ Instrucciones de Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/Luisst32/practica4-fullstack-mern-jwt.git
cd practica4-fullstack-mern-jwt
```

### 2. Configurar y levantar el Backend (API REST)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
> El servidor iniciará en `http://localhost:5000` y cargará automáticamente los datos semilla si la base de datos está vacía.

Para ejecutar la suite de 14 pruebas de integración:
```bash
npm test
```

### 3. Configurar y levantar el Frontend (React SPA)
En una nueva terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
> La aplicación web iniciará en `http://localhost:5173`.

---

## 👤 Usuarios de Prueba Preconfigurados (Seed Data)
| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@unemi.edu.ec` | `Admin1234*` | Acceso total: CRUD de productos, panel analítico de reportes |
| **Usuario Estándar** | `usuario@unemi.edu.ec` | `User1234*` | Lectura de catálogo, perfil; bloqueado (403) para CRUD y reportes |

---

## 🌿 Estrategia de Ramas en Git
El repositorio sigue el estándar de flujo de trabajo GitFlow:
* `main`: Rama de producción estable.
* `develop`: Rama principal de integración y desarrollo.
* `feature/auth-jwt`: Implementación de esquemas, hashing bcrypt, middlewares y controladores de autenticación JWT.
* `feature/crud-transaccional`: Implementación del catálogo, operaciones transaccionales y reportería analítica.
* `feature/frontend-ui`: Construcción de componentes React, Context API, interceptores Axios y vistas protegidas.
