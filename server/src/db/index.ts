import { knex } from 'knex';
import { db } from '../config';

export const connection = knex({
    client: 'pg',
    connection: db,
    searchPath: 'jarvis_pstudio',
});
