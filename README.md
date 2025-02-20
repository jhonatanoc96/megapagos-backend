# BACKEND PRUEBA DE INGRESO

# Versiones:
Node JS: 22.13.1
Express: 4.19.2

# Dirección IP Servidor de Despliegue (EC2 - AWS):
http://3.129.172.159/

# Base de datos utilizada:
PostgreSQL (RDS - AWS)

# Instrucciones para despliegue local:
Ejecutar los siguientes comandos en el terminal
git clone https://github.com/jhonatanoc96/megapagos-backend.git
npm install
npm start

# Nota:
En el archivo src/index.ts se configura la conexión con la base de datos
utilizando Sequelize y el levantamiento del API.