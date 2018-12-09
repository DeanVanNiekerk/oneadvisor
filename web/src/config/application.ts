
import { Application } from '@/state/context/types';

export const DIRECTORY_ID = 'DIRECTORY';
export const MEMBER_ID = 'MEMBER';

export const DEFAULT_APPLICATION_ID = DIRECTORY_ID;

const createApplication = (
    id: string,
    name: string,
    color: string,
    relativePath: string,
    icon: string
): Application => ({
    id,
    name,
    color,
    relativePath,
    icon,
    isCurrent: false
});

export const applications: Application[] = [
    createApplication(
        DIRECTORY_ID,
        'Directory',
        '#607D8B',
        '/directory',
        'safety'
    ),
    createApplication(MEMBER_ID, 'Member', '#2962FF', '/member', 'user')
];
