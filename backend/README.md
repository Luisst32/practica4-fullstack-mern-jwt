# Backend API REST - Autenticación JWT y CRUD Transaccional con MongoDB

**Universidad Estatal de Milagro (UNEMI)**  
**Carrera:** Ingeniería de Software en Modalidad Presencial  
**Asignatura:** Desarrollo Web  
**Práctica:** Nº 4 - G004-S14-SOFTWARE2019-PRESENCIAL-DESARROLLO WEB-A1  
**Autor:** Luis Enrique Peñafiel Frías  

---

## 📌 1. Propósito del Proyecto
Desarrollo de una API RESTful robusta y segura construida sobre **Node.js**, **Express** y **MongoDB**, orientada a la gestión transaccional de un catálogo de productos e inventario. Implementa un sistema completo de autenticación y autorización basado en tokens **JSON Web Tokens (JWT)**, cifrado de contraseñas con **bcrypt** y control de acceso basado en roles (**RBAC** - Admin y Usuario).

---

## 🚀 2. Tecnologías Utilizadas
- **Entorno de ejecución:** Node.js (v20+)
- **Framework Web:** Express.js 4.x
- **Base de Datos NoSQL:** MongoDB con Mongoose ODM
- **Autenticación y Seguridad:** JSON Web Token (JWT) y bcryptjs
- **Gestión de variables de entorno:** dotenv
- **Mecanismo de fallback para pruebas:** mongodb-memory-server (ejecución sin requerir daemon externo instalado)
- **Control de versiones:** Git & GitHub

---

## 🗄️ 3. Elección y Justificación de la Base de Datos
Se eligió **MongoDB** debido a su flexibilidad en el modelado de documentos JSON (BSON), escalabilidad horizontal y excelente integración con el ecosistema JavaScript / Node.js a través de Mongoose. Permite manejar documentos embebidos y referencias relacionales (`populate`) de manera eficiente para usuarios, transacciones y catálogo de productos.

---

## ⚙️ 4. Requisitos Previos e Instalación
### Requisitos:
- Node.js versión 18 o superior.
- NPM versión 9 o superior.
- MongoDB (local, en la nube mediante MongoDB Atlas o memoria embebida).

### Instalación:
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Luisst32/practica4-backend-jwt.git
   cd practica4-backend-jwt
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copiar `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

---

## 🔑 5. Variables de Entorno
| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto de escucha del servidor | `5000` |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) | `development` |
| `MONGO_URI` | Cadena de conexión MongoDB (local / Atlas) | Opcional (usa servidor embebido si está vacío) |
| `JWT_SECRET` | Clave secreta para firma criptográfica de JWT | `unemi_desarrollo_web_jwt_super_secret_key_2026` |
| `JWT_EXPIRES_IN` | Tiempo de vida del token emitido | `24h` |

---

## 👤 6. Inicialización de Datos y Cuentas por Defecto (Seed)
Al iniciar la aplicación por primera vez se inicializan automáticamente los usuarios y el catálogo de muestra:
- **Administrador:**
  - Correo: `admin@unemi.edu.ec`
  - Contraseña: `AdminPassword123*`
  - Rol: `admin` (acceso a CRUD completo y reportería)
- **Usuario Estándar:**
  - Correo: `estudiante@unemi.edu.ec`
  - Contraseña: `UserPassword123*`
  - Rol: `usuario` (solo lectura de catálogo y consulta de reportería)

---

## 📡 7. Catálogo de Rutas y Endpoints

### Autenticación (`/api/auth`)
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Registra usuario estándar con contraseña cifrada (bcrypt). |
| `POST` | `/api/auth/login` | Público | Valida credenciales y emite un token JWT con expiración. |
| `GET` | `/api/auth/perfil` | Privado (JWT) | Retorna datos del usuario autenticado sin contraseña. |

### Catálogo y CRUD Transaccional (`/api/productos`)
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/productos` | Público | Listado de productos con filtros por categoría y búsqueda. |
| `GET` | `/api/productos/:id` | Público | Detalle de un producto por su identificador único. |
| `POST` | `/api/productos` | Admin | Crea producto y registra evento transaccional de stock. |
| `PUT` | `/api/productos/:id` | Admin | Actualiza datos y registra ajustes transaccionales. |
| `DELETE` | `/api/productos/:id` | Admin | Elimina producto y registra baja en historial. |

### Reportería y Estadísticas (`/api/reporteria`)
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/reporteria/resumen` | Privado (JWT) | Métricas agregadas: total ítems, valor inventario, categorías. |
| `GET` | `/api/reporteria/exportar`| Privado (JWT) | Exporta transacciones y detalle completo en JSON. |

---

## 🧪 8. Ejecución y Pruebas
- **Iniciar servidor en producción:**
  ```bash
  npm start
  ```
- **Iniciar servidor en modo desarrollo (nodemon):**
  ```bash
  npm run dev
  ```
- **Ejecutar suite de pruebas automatizadas:**
  ```bash
  npm test
  ```
