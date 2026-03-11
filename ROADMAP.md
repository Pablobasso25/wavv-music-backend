# Roadmap de la Aplicación Backend

Este documento describe cómo funciona la aplicación backend y cómo se conecta con el frontend.

---

## 📌 Arquitectura general

- **Stack:** Node.js con Express.
- **Estructura principal:** rutas (`src/routes`), controladores (`src/controllers`), modelos (`src/models`), middlewares (`src/middlewares`) y esquemas de validación (`src/schemas`).

---

## 📦 Componentes clave

1. **Entrypoint**
   - `src/index.js` / `src/app.js` inicializa Express, registra middlewares, configura rutas y arranca el servidor.

2. **Rutas**
   - Cada recurso (usuarios, canciones, álbumes, playlists, etc.) tiene su propio archivo de rutas.
   - Ejemplo: `src/routes/playlist.routes.js` define endpoints como `GET /playlists` y delega a funciones en el controlador.

3. **Controladores**
   - Ubicados en `src/controllers`.
   - Contienen la lógica para manejar peticiones (crear, leer, actualizar, eliminar).
   - Interactúan con los modelos para consultar o modificar la base de datos y utilizan librerías/conexiones (Cloudinary, JWT, etc.).

4. **Modelos**
   - Definen los esquemas de datos (probablemente con Mongoose) en `src/models`.
   - Corresponden a colecciones/tablas en la base de datos (usuarios, canciones, playlists, etc.).

5. **Middlewares**
   - Controlan autorización, validaciones, subida de archivos, etc.
   - Ejemplos: `validateToken.js`, `isAdmin.js`, `checkSubscription.js`, `upload.js`, `validator.middleware.js`.

6. **Schemas de validación**
   - Archivos en `src/schemas` (Joi/Yup) que definen la forma de los datos esperados en las peticiones.
   - Utilizados por el middleware de validación.

7. **Librerías internas**
   - Helpers como `jwt.js`, `cloudinary.js`, `initAdmin.js` y otros utilitarios personalizados.

8. **Jobs**
   - Tareas programadas dentro de `src/jobs`, como `subscriptionChecker.js` para revisión periódica de suscripciones.

---

## 🔗 Comunicación con el frontend

1. **API REST**
   - El backend expone rutas HTTP que el frontend consume con `fetch` o `axios`.
   - Ejemplos:
     - `POST /auth/login` → devuelve JWT.
     - `GET /songs` → lista de canciones.
     - `POST /playlists` (requiere token) → crea una playlist.

2. **Autenticación**
   - El frontend envía credenciales, recibe un token JWT y lo almacena (local storage o cookies).
   - En llamadas subsecuentes, el token se incluye en el header `Authorization: Bearer <token>`.

3. **Protección de rutas**
   - Middlewares (`validateToken`, `isAdmin`, `checkSubscription`) verifican el token y el rol o estado de suscripción.
   - El frontend gestiona estados de usuario para habilitar/deshabilitar vistas según permisos.

4. **Subida de archivos**
   - El frontend envía `FormData` con archivos; el backend usa `upload.js` y Cloudinary para procesarlos y devuelve URLs públicas.

5. **Pagos / Suscripciones**
   - Lógica en `payment.controller.js` que interactúa con un proveedor de pagos (por ejemplo Stripe o similar).
   - El frontend presenta los formularios de pago y obtiene confirmaciones para enviar al backend.

6. **Email / Notificaciones**
   - `email.controller.js` maneja envíos de correos (confirmaciones, restablecimiento de contraseña, etc.).
   - Estas rutas son llamadas por el frontend según el flujo de usuario.

---

## 🛠️ Flujo típico de uso

1. **Inicio de sesión/registro**
   - Frontend envía los datos al backend que crea el usuario y devuelve un token.
   - El frontend guarda el token y habilita rutas protegidas.

2. **Operaciones CRUD**
   - El frontend solicita datos con `GET`.
   - Formularios envían `POST`, `PUT` o `DELETE` y el backend realiza la acción correspondiente.

3. **Gestión de multimedia**
   - Usuario sube imágenes o audio: frontend envía archivos; backend guarda en Cloudinary y retorna URLs.

4. **Suscripción**
   - Usuario elige un plan, completa el pago en frontend; backend registra la suscripción.
   - Un job revisa periódicamente la expiración y actualiza el estado del usuario si es necesario.

---

## ✅ Conclusión

Este roadmap ofrece un panorama completo de la aplicación backend y su conexión con el frontend. Sirve como referencia para desarrolladores que necesiten entender o ampliar el proyecto. Si deseas un diagrama o más detalles sobre algún endpoint específico, házmelo saber.
