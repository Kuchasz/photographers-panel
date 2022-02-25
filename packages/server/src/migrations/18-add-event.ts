import { Knex } from 'knex';
import { tableExists } from '../core/db';

export const run = async (connection: Knex): Promise<boolean> => {
    try {
        if (await tableExists('Event', connection)) {
            return false;
        }

        await connection.schema.createTable('Event', (builder) => {
            builder.increments('Id').primary().notNullable();
            builder.string('User', 25).notNullable();
            builder.integer('Type', 8).notNullable();
            builder.dateTime('OccuredOn').notNullable();
        });

        return true;
    } catch (err) {
        return Promise.reject(err);
    }
};
