import { Sequelize } from "sequelize";
import config from "../config/index";

const db = new Sequelize(config.name, "", "", {
    host: config.host,
    logging: false,
    dialect: 'postgres'
});

export default db;