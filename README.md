# WavvMusic Backend

WavvMusic Backend es la API que da soporte a la plataforma WavvMusica, encargada de la gestión de usuarios, autenticación, playlists y control de suscripciones bajo un modelo freemium. Está desarrollada con Node.js, Express y MongoDB, implementando validaciones estrictas y reglas de negocio bien definidas.

---

## Descripción General

El backend proporciona una arquitectura robusta orientada a:

- Autenticación segura basada en JWT.
- Validación estricta de datos mediante Zod.
- Gestión de playlists con reglas diferenciadas para usuarios Free y Premium.
- Protección de rutas y control de acceso.
- Persistencia de datos en MongoDB utilizando Mongoose.

---

## Funcionalidades Principales

### Autenticación y Seguridad

- Registro y login de usuarios con validación de datos de entrada.
- Encriptación segura de contraseñas.
- Generación y validación de tokens JWT.
- Esquemas preparados para recuperación y restablecimiento de contraseña.
- Reglas estrictas de complejidad de contraseña:
  - Mínimo 8 caracteres.
  - Al menos una mayúscula.
  - Al menos una minúscula.
  - Al menos un número.
  - Al menos un símbolo.
  - Sin espacios ni caracteres potencialmente peligrosos como < o >.

---

### Gestión de Playlists

- Agregado de canciones:
  - Soporte para canciones internas (por ID).
  - Creación dinámica de canciones externas si no existen en la base de datos.
- Prevención de canciones duplicadas dentro de una misma playlist.
- Obtención de playlists con datos completos de canciones mediante populate.
- Eliminación de canciones específicas por ID.

#### Modelo Freemium

- Usuarios Free:
  - Límite máximo de 5 canciones por playlist.
- Usuarios Premium:
  - Sin límite de canciones.

Las restricciones se validan directamente en la lógica del servidor.

---

### Gestión de Usuarios

- Actualización de perfil (username y email).
- Cambio seguro de contraseña.
- Gestión del estado de suscripción (free o premium).

---

## Tecnologías Utilizadas

- Runtime: Node.js
- Framework: Express.js
- Base de Datos: MongoDB
- ODM: Mongoose
- Validación de Datos: Zod
- Autenticación: JSON Web Tokens (JWT)

---

## Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js (v14 o superior)
- MongoDB (instancia local o MongoDB Atlas)

---

## Instalación y Configuración

### 1. Clonar el repositorio

git clone <url-de-tu-repositorio>  
cd WavvMusicaBackend  

### 2. Instalar dependencias

npm install  

### 3. Configurar variables de entorno

Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

PORT=3000  
MONGODB_URI=mongodb://localhost:27017/wavvmusica  
JWT_SECRET=tu_secreto_super_seguro  

### 4. Iniciar el servidor

Modo producción:

npm start  

Modo desarrollo:

npm run dev  

---

## Endpoints Principales

### Playlist

Método | Endpoint | Descripción
-------|----------|------------
POST | /playlist/add | Agrega una canción validando límite Free vs Premium.
GET | /playlist | Obtiene la playlist del usuario autenticado.
DELETE | /playlist/:songId | Elimina una canción de la playlist.

---

### Autenticación y Usuarios

Método | Endpoint | Descripción
-------|----------|------------
POST | /auth/register | Registro de nuevo usuario.
POST | /auth/login | Inicio de sesión.
PUT | /user/update | Actualiza datos del perfil.
PUT | /user/change-password | Cambia la contraseña actual.

---

## Reglas de Validación (Zod)

El proyecto utiliza esquemas estrictos para garantizar la integridad y seguridad de los datos:

- Username:
  - Entre 2 y 30 caracteres.
  - Solo caracteres alfanuméricos.

- Password:
  - Entre 8 y 20 caracteres.
  - Requiere mayúscula, minúscula, número y símbolo.
  - No permite espacios.
  - Bloquea caracteres potencialmente peligrosos como < y >.

---

## Arquitectura

La estructura del proyecto sigue una separación clara de responsabilidades:

- Controladores para la lógica de negocio.
- Modelos de Mongoose para la definición de esquemas.
- Middlewares para autenticación y validaciones.
- Rutas organizadas por dominio (auth, user, playlist).

---

## Licencia

Proyecto desarrollado con fines educativos y de práctica profesional.
