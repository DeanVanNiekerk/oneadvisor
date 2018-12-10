import { PageOptions } from '@/state/types';

export const appendPageOptionQuery = (
    api: string,
    options: PageOptions
): string => {
    return `${api}?pageNumber=${options.number}&pageSize=${options.size}`;
};