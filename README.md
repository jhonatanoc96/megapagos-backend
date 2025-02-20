# BACKEND PRUEBA DE INGRESO

# Versiones:
Node JS: 22.13.1 \
Express: 4.19.2

# Dirección IP Servidor de Despliegue (EC2 - AWS):
http://3.129.172.159/

# Base de datos utilizada:
PostgreSQL (RDS - AWS)

# Instrucciones para despliegue local:
Ejecutar los siguientes comandos en el terminal \
git clone https://github.com/jhonatanoc96/megapagos-backend.git \
npm install \
npm start

# Nota:
En el archivo src/index.ts se configura la conexión con la base de datos
utilizando Sequelize y el levantamiento del API.


# Sentencias SQL
Las tablas en la base de datos fueron creadas con los siguientes queries. \

CREATE TABLE IF NOT EXISTS administradores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS proyectos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      descripcion TEXT,
      administrador_id INTEGER,
      FOREIGN KEY (administrador_id) REFERENCES administradores(id)
    )

CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      rol VARCHAR(50) NOT NULL,
      administrador_id INTEGER,
      FOREIGN KEY (administrador_id) REFERENCES administradores(id)
    )


CREATE TABLE IF NOT EXISTS usuario_proyectos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    proyecto_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
    );# megapagos-frontend
