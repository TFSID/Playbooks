import { Sequelize } from "sequelize";
 
const db = new Sequelize('starting', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;