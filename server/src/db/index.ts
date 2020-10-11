import { Connection, createConnection } from "mysql2/promise";
import { db } from "../config";

(async () => {
    connection = await createConnection(db);
})();

export let connection: Connection;