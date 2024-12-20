import db from '@nangohq/database';
import connectionService from '../services/connection.service.js';
import type { NangoConnection } from '../models/Connection.js';
import type { AuthCredentials } from '../models/Auth.js';
import type { DBEnvironment, EndUser } from '@nangohq/types';
import { linkConnection } from '../services/endUser.service.js';

export const createConnectionSeeds = async (env: DBEnvironment): Promise<number[]> => {
    const connectionIds = [];

    for (let i = 0; i < 4; i++) {
        const name = Math.random().toString(36).substring(7);
        const result = await connectionService.upsertConnection({
            connectionId: `conn-${name}`,
            providerConfigKey: `provider-${name}`,
            provider: 'google',
            parsedRawCredentials: {} as AuthCredentials,
            connectionConfig: {},
            environmentId: env.id,
            accountId: 0
        });
        connectionIds.push(...result.map((res) => res.connection.id!));
    }
    return connectionIds;
};

export const createConnectionSeed = async (
    env: DBEnvironment,
    provider: string,
    endUser?: EndUser,
    rest?: {
        connectionId?: string;
        rawCredentials?: AuthCredentials;
        connectionConfig?: any;
    }
): Promise<NangoConnection> => {
    const name = rest?.connectionId ? rest.connectionId : Math.random().toString(36).substring(7);
    const result = await connectionService.upsertConnection({
        connectionId: name,
        providerConfigKey: provider,
        provider: provider,
        parsedRawCredentials: rest?.rawCredentials || ({} as AuthCredentials),
        connectionConfig: rest?.connectionConfig || {},
        environmentId: env.id,
        accountId: 0
    });

    if (!result || result[0] === undefined) {
        throw new Error('Could not create connection seed');
    }
    if (endUser) {
        await linkConnection(db.knex, { endUserId: endUser.id, connection: result[0].connection });
    }

    return { id: result[0].connection.id!, connection_id: name, provider_config_key: provider, environment_id: env.id };
};

export const deleteAllConnectionSeeds = async (): Promise<void> => {
    await db.knex.raw('TRUNCATE TABLE _nango_connections CASCADE');
};
