import { Ok } from '@nangohq/utils';
import type { NodeProvider } from './node_provider';

export const noopNodeProvider: NodeProvider = {
    start: () => {
        return Promise.resolve(Ok(undefined));
    },
    terminate: () => {
        return Promise.resolve(Ok(undefined));
    },
    verifyUrl: () => {
        return Promise.resolve(Ok(undefined));
    }
};
