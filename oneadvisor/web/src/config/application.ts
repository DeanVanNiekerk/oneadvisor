import { Application } from '@/state/context/types';

export const DIRECTORY_ID = "DIRECTORY";
export const CLIENT_ID = "CLIENT";
export const COMMISSION_ID = "COMMISSION";

export const DEFAULT_APPLICATION_ID = CLIENT_ID;

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
    isCurrent: false,
});

export const applications: Application[] = [
    createApplication(
        DIRECTORY_ID,
        "Directory",
        "#cc3f0c",
        "/directory",
        "safety"
    ),
    createApplication(CLIENT_ID, "Client", "#009ffd", "/client", "user"),
    createApplication(
        COMMISSION_ID,
        "Commission",
        "#2A2A72",
        "/commission",
        "dollar"
    ),
];
