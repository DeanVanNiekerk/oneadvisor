import { PageOptions, SortDirection, SortOptions } from '@/app/types';
import config from '@/config/config';

export const defaultPageOptions = (): PageOptions => {
    return {
        number: 1,
        size: config.ui.pageSize
    };
};

export const defaultSortOptions = (
    column: string = '',
    direction: SortDirection = 'asc'
): SortOptions => {
    return {
        column: column,
        direction: direction
    };
};
