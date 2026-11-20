const { app, startServer } = require('../src/server');
const http = require('http');

let server;
const BASE_URL = 'http://localhost:5000/api';

const makeRequest = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 ===================================================');
  console.log('🧪 EJECUTANDO SUITE DE PRUEBAS DE INTEGRACIÓN BACKEND');
  console.log('🧪 ===================================================\n');

  server = await startServer();

  let adminToken = '';
  let userToken = '';
  let createdProductId = '';
  const results = [];

  const assert = (title, condition, extra = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${title} ${extra}`);
      results.push({ test: title, status: 'PASSED', extra });
    } else {
      console.error(`❌ [FAIL] ${title} ${extra}`);
      results.push({ test: title, status: 'FAILED', extra });
    }
  };

  try {
    // 1. Health check
    const r1 = await makeRequest('/health');
    assert('1. Health Check Endpoint (GET /api/health)', r1.status === 200);

    // 2. Login Admin
    const r2 = await makeRequest('/auth/login', 'POST', {
      email: 'admin@unemi.edu.ec',
      password: 'AdminPassword123*'
    });
    assert('2. Login de Administrador (POST /api/auth/login)', r2.status === 200 && r2.body.token);
    adminToken = r2.body.token;

    // 3. Login Usuario Estándar
    const r3 = await makeRequest('/auth/login', 'POST', {
      email: 'estudiante@unemi.edu.ec',
      password: 'UserPassword123*'
    });
    assert('3. Login de Usuario Estándar (POST /api/auth/login)', r3.status === 200 && r3.body.token);
    userToken = r3.body.token;

    // 4. Registro de nuevo usuario
    const testEmail = `test_${Date.now()}@unemi.edu.ec`;
    const r4 = await makeRequest('/auth/register', 'POST', {
      name: 'Usuario Prueba Registro',
      email: testEmail,
      password: 'PruebaPassword123*'
    });
    assert('4. Registro de Usuario Público (POST /api/auth/register)', r4.status === 201 && r4.body.user.role === 'usuario');

    // 5. Rechazo de correo duplicado
    const r5 = await makeRequest('/auth/register', 'POST', {
      name: 'Usuario Duplicado',
      email: testEmail,
      password: 'PruebaPassword123*'
    });
    assert('5. Rechazo de correo duplicado (400 Bad Request)', r5.status === 400);

    // 6. Rechazo de credenciales incorrectas
    const r6 = await makeRequest('/auth/login', 'POST', {
      email: 'admin@unemi.edu.ec',
      password: 'PasswordIncorrecto999*'
    });
    assert('6. Rechazo de credenciales inválidas (401 Unauthorized)', r6.status === 401);

    // 7. Acceso a perfil protegido con token válido
    const r7 = await makeRequest('/auth/perfil', 'GET', null, adminToken);
    assert('7. Acceso a ruta protegida con token válido (GET /api/auth/perfil)', r7.status === 200 && r7.body.user.email === 'admin@unemi.edu.ec');

    // 8. Rechazo a ruta protegida sin token
    const r8 = await makeRequest('/auth/perfil', 'GET');
    assert('8. Rechazo de ruta protegida sin token (401 Unauthorized)', r8.status === 401);

    // 9. Consulta pública de productos
    const r9 = await makeRequest('/productos');
    assert('9. Consulta pública de catálogo de productos (GET /api/productos)', r9.status === 200 && Array.isArray(r9.body.data));

    // 10. Creación de producto por ADMIN
    const r10 = await makeRequest('/productos', 'POST', {
      name: 'Disco SSD NVMe 2TB Samsung 990 Pro',
      description: 'Velocidad de lectura hasta 7450 MB/s con disipador térmico',
      category: 'Electrónica',
      price: 219.99,
      stock: 15,
      sku: `SSD-990-PRO-${Date.now().toString().slice(-4)}`
    }, adminToken);
    assert('10. Creación de producto con rol Admin (POST /api/productos - 201)', r10.status === 201 && r10.body.data._id);
    if (r10.body.data) createdProductId = r10.body.data._id;

    // 11. Intentar crear producto con rol USUARIO (Debe retornar 403 Forbidden)
    const r11 = await makeRequest('/productos', 'POST', {
      name: 'Intento no autorizado',
      description: 'Debe ser bloqueado por el middleware de rol',
      category: 'Software',
      price: 50.0,
      stock: 5,
      sku: `UNAUTH-${Date.now().toString().slice(-4)}`
    }, userToken);
    assert('11. Bloqueo de creación con rol de usuario estándar (403 Forbidden)', r11.status === 403);

    // 12. Edición de producto con rol ADMIN
    if (createdProductId) {
      const r12 = await makeRequest(`/productos/${createdProductId}`, 'PUT', {
        name: 'Disco SSD NVMe 2TB Samsung 990 Pro (Actualizado)',
        price: 199.99,
        stock: 20
      }, adminToken);
      assert('12. Actualización de producto por Admin (PUT /api/productos/:id - 200)', r12.status === 200 && r12.body.data.price === 199.99);
    }

    // 13. Consulta de Reportería Resumen (Ruta protegida)
    const r13 = await makeRequest('/reporteria/resumen', 'GET', null, adminToken);
    assert('13. Consulta de métricas y reportería (GET /api/reporteria/resumen)', r13.status === 200 && r13.body.data.totalProducts > 0);

    // 14. Eliminación de producto por ADMIN
    if (createdProductId) {
      const r14 = await makeRequest(`/productos/${createdProductId}`, 'DELETE', null, adminToken);
      assert('14. Eliminación de producto por Admin (DELETE /api/productos/:id - 200)', r14.status === 200);
    }

    console.log('\n===================================================');
    console.log(`📊 RESULTADO FINAL: ${results.filter(r => r.status === 'PASSED').length}/${results.length} PRUEBAS EXITOSAS`);
    console.log('===================================================\n');

  } catch (err) {
    console.error('Error durante las pruebas:', err);
  } finally {
    if (server) {
      server.close();
      console.log('Servidor de pruebas detenido.');
    }
    process.exit(0);
  }
};

runTests();
