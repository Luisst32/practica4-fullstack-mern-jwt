# Frontend React - SPA con Autenticación JWT y CRUD Transaccional

**Universidad Estatal de Milagro (UNEMI)**  
**Carrera:** Ingeniería de Software  
**Asignatura:** Desarrollo Web  
**Práctica:** Nº 4 - G004-S14-SOFTWARE2019-PRESENCIAL-DESARROLLO WEB-A1  
**Autor:** Luis Enrique Peñafiel Frías  

---

## 📌 1. Descripción del Proyecto
Aplicación Frontend SPA desarrollada con **React** y **Vite**, que interactúa con la API RESTful de Node.js y MongoDB. Proporciona una interfaz moderna, responsiva e intuitiva para:
- Flujo completo de Registro e Inicio de sesión con autenticación basada en **JWT**.
- Almacenamiento seguro del token en cliente y gestión del estado global mediante **React Context API**.
- Interceptor HTTP de **Axios** para adjuntar automáticamente el encabezado `Authorization: Bearer <token>` en todas las peticiones protegidas.
- Vistas protegidas mediante componentes `ProtectedRoute` que restringen acceso a rutas privadas y controlan permisos según el rol del usuario (Administrador vs. Estudiante/Usuario).
- Módulo de Catálogo y CRUD Transaccional con validaciones en tiempo real y reportería estadística detallada.

---

## 🚀 2. Tecnologías Utilizadas
- **Librería UI:** React 18
- **Herramienta de compilación:** Vite 6
- **Enrutamiento:** React Router DOM v6
- **Cliente HTTP:** Axios (con interceptores de solicitud y respuesta)
- **Iconografía:** Lucide React
- **Estilos:** CSS3 modular y moderno con variables CSS personalizadas

---

## ⚙️ 3. Instalación y Ejecución
1. Navegar al directorio `frontend`:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación se levantará en `http://localhost:3000`.

4. Construir versión para producción:
   ```bash
   npm run build
   ```

---

## 🔒 4. Funcionalidades Implementadas
- **Autenticación JWT:** Inicio de sesión y registro con emisión y decodificación de tokens. Botones de credenciales de demostración rápida (*Demo Admin* y *Demo Usuario*).
- **Rutas Protegidas:** Redirección automática al login si el usuario intenta acceder a la reportería sin token o si el token expiró.
- **Control de Roles (RBAC):**
  - **Administrador:** Permisos totales para crear productos, modificar precios/stock y eliminar artículos.
  - **Usuario Estándar:** Vista de catálogo en solo lectura y acceso a consulta de métricas de reportería.
- **Manejo de Errores y Validaciones:** Notificaciones visuales de respuesta ante códigos HTTP 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden) y 404 (Not Found).
