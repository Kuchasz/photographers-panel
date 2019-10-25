import { createConnection } from "mysql";
import { db } from "../config";

export const connection = createConnection(db);
