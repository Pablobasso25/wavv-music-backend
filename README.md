# Wavv Music - Backend API

Bienvenido al repositorio oficial del Backend de **Wavv Music**. Esta API RESTful robusta y escalable es el motor de nuestra plataforma de streaming musical, diseñada bajo el patrón de arquitectura MVC y orientada a ofrecer un alto rendimiento y seguridad.

---

## Características Principales

- **Arquitectura MVC**: Separación clara de responsabilidades (`controllers`, `middlewares`, `models`, `routes`, `schemas`).
- **Autenticación Segura**: Implementación de JsonWebToken (JWT) almacenado en cookies HTTP-only.
- **Autorización por Roles**: Protección de rutas y recursos según el perfil del usuario (Admin / User).
- **Gestión de Suscripciones Premium**: Integración con MercadoPago vía Webhooks para automatizar pagos y ascensos de cuenta.
- **Automatización de Tareas**: Revisión periódica de suscripciones expiradas utilizando `node-cron`.
- **Validación de Datos**: Esquemas estrictos de validación en las peticiones mediante `Zod`.
- **Gestión Multimedia**: Subida y optimización de avatares y audios integrados con Cloudinary.
- **Comunicaciones Automáticas**: Envío de correos electrónicos transaccionales (como recuperación de contraseñas) a través de **Nodemailer**.

---

## Endpoints Principales (Resumen)

- **Auth:** `/api/auth/register`, `/login`, `/logout`, `/forgot-password`, `/reset-password`
- **Usuarios:** Perfiles de usuario, gestión de datos, altas/bajas lógicas.
- **Canciones:** CRUD de canciones, obtención de _Trending tracks_, e integración externa con la **API de iTunes** para búsquedas.
- **Álbumes:** Creación y visualización de álbumes y sus colecciones.
- **Playlists:** Creación y gestión de listas de reproducción personales con límites basados en el plan del usuario.
- **Pagos:** Generación de preferencias de pago y recepción de Webhooks de MercadoPago.

---

## Stack Tecnológico

- **Entorno:** Node.js
- **Framework:** Express.js
- **Base de Datos:** MongoDB & Mongoose (ODM)
- **Herramientas & Librerías:** Zod, JsonWebToken, Cloudinary, Nodemailer, MercadoPago SDK, Node-cron, Bcryptjs.

---

## Instalación Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/Backend-Wavv-Music.git
   cd Backend-Wavv-Music
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en un `.env.example`. Necesitarás configurar las siguientes variables clave:

   ```env
   MONGODB_URI=tu_conexion_a_mongodb
   PORT=4000
   TOKEN_SECRET=tu_secreto_jwt
   MP_ACCESS_TOKEN=tu_token_de_prueba_de_mercadopago
   CLOUDINARY_URL=tu_url_de_cloudinary
   EMAIL_USER=tu_correo_smtp@gmail.com
   EMAIL_PASS=tu_contraseña_de_aplicacion
   FRONTEND_URL=http://localhost:5173
   ```

4. **Ejecutar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor estará corriendo en `http://localhost:4000`.

---

## Equipo de Desarrollo

Este proyecto fue creado y es mantenido por:

- Pablo Basso - @Pablobasso25
- Tomás Gómez - @tomasgomez18
- Luhana Jakubowicz - @JLuhanaJakubowicz
- Juan Ferreyra - @JuanFerreyra18

---

## Licencia

Este proyecto está bajo la Licencia **MIT**. Eres libre de usar, modificar y distribuir este software. Consulta el archivo `LICENSE` para más detalles.
