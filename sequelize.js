const { Sequelize } = require("sequelize");
require('dotenv').config();

/*import { Sequelize } from "sequelize";
import dotenvPkg from "dotenv";
const fs = require('fs');
const { dotenv } = dotenvPkg;
dotenv.config();*/

const sslOptions = process.env.DB_SSL === 'true' ? {
    ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: fs.readFileSync(process.env.DB_SSL_CA || '').toString(),
        key: fs.readFileSync(process.env.DB_SSL_KEY || '').toString(),
        cert: fs.readFileSync(process.env.DB_SSL_CERT || '').toString()
    }
} : {};

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        dialectOptions: sslOptions
    }
);

sequelize.authenticate()
.then(() => console.log("Connexion à postgresql reussie"))
.catch((err) => console.error("Erreur : " + err));

module.exports = sequelize;
// export { sequelize };
// export default sequelize;