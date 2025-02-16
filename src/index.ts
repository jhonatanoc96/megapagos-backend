import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from '@config/logger';
import api from '@src/api';
import config from '@src/config';
import { Sequelize } from 'sequelize-typescript';
import { Administrador } from '@models/administrador.model';
import { Usuario } from '@models/usuario.model';
import { Proyecto } from '@models/proyecto.model';
import { UsuarioProyectos } from '@models/usuario-proyecto.model';


const { port, env } = config;

// Load environment variables
const envFile = env === 'test' ? '.env.test' : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['*'],
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(helmet());

/**
 * API routes
 */
app.use('/api', api);

if (!port) {
    console.error('PORT is not defined in .env file');
    process.exit(1);
}

/**
 * Error handling
 */
Error.stackTraceLimit = 10;

// Connect to MongoDB
async function connectToDb() {
    const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSTGRES_PORT } = process.env;

    if (!POSTGRES_USER || !POSTGRES_HOST || !POSTGRES_PASSWORD || !POSTGRES_DATABASE || !POSTGRES_PORT) {
        console.error('One or more PostgreSQL environment variables are not defined');
        return;
    }

    const sequelize = new Sequelize(POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, {
        host: POSTGRES_HOST,
        port: Number(POSTGRES_PORT),
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        models: [
            Administrador,
            Usuario,
            Proyecto,
            UsuarioProyectos,
        ],
    });


    try {
        await sequelize.authenticate();
        logger.info('Connected to PostgreSQL with Sequelize ');

        // Sync all models
        await sequelize.sync(); // Use { force: true } to drop and recreate tables on every sync
        logger.info('All models were synchronized successfully.');

    } catch (error) {
        logger.error('Error connecting to PostgreSQL with Sequelize', error);
        process.exit(1);
    }
}

// Start the server
async function startServer() {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// Execute
(async function () {
    await connectToDb();
    startServer();
})();