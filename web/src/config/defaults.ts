import config from '@/config/config';
import { PageOptions } from '@/state/types';

export const defaultPageOptions = (): PageOptions => {
    return {
        number: 1,
        size: config.ui.pageSize
    };
};
