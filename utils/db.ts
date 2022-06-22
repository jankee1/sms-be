import  {createPool} from "mysql2/promise";
import {config} from '../config/config'

export const pool = createPool({
    host: config.DB_HOSTNAME,
    user: config.DB_USER,
    database: config.DB_NAME,
    port: config.DB_PORT,
    namedPlaceholders: true,
    decimalNumbers: true,
});
