import { Application } from "@/state/context/types";

export const DIRECTORY_ID = "66c3b4e8-8a30-4a4b-be4d-3928d12fefe9";
export const CLIENT_ID = "605ea52c-3627-48e2-8f7c-4819c5ea555b";
export const COMMISSION_ID = "2fca4500-9142-4940-aaf4-b18925c96d66";

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
    createApplication(DIRECTORY_ID, "Directory", "#cc3f0c", "/directory", "safety"),
    createApplication(CLIENT_ID, "Client", "#009ffd", "/client", "user"),
    createApplication(COMMISSION_ID, "Commission", "#2A2A72", "/commission", "dollar"),
];
