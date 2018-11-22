import config from '@/config/config';
import type { PageOptions } from '@/state/types';

export const defaultPageOptions = (): PageOptions => {
    return {
        number: 1,
        size: config.ui.pageSize
    };
};
