import { Application } from '@/state/context/types';

export const DIRECTORY_ID = 'DIRECTORY';
export const MEMBER_ID = 'MEMBER';

export const DEFAULT_APPLICATION_ID = DIRECTORY_ID;

//https://coolors.co/f1f2eb-cc3f0c-001528-009ffd-2a2a72

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
        '#cc3f0c',
        '/directory',
        'safety'
    ),
    createApplication(MEMBER_ID, 'Member', '#009ffd', '/member', 'user')
];
