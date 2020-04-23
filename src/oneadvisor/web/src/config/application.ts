import { IconName } from "@/app/types";
import { RootNavigationItem } from "@/state/context/types";

export const DIRECTORY_ID = "66c3b4e8-8a30-4a4b-be4d-3928d12fefe9";
export const CLIENT_ID = "605ea52c-3627-48e2-8f7c-4819c5ea555b";
export const COMMISSION_ID = "2fca4500-9142-4940-aaf4-b18925c96d66";
export const COMPLIANCE_ID = "ef1bb77d-981a-743f-9543-ec36f396536c";
export const INVEST_ID = "ca35b7ac-351a-0ff1-5d45-9bee6de9e051";

export const DEFAULT_APPLICATION_ID = CLIENT_ID;

//https://coolors.co/f1f2eb-cc3f0c-001528-009ffd-2a2a72

const createRootNavigationItem = (
    applicationId: string,
    name: string,
    relativePath: string,
    icon: IconName
): RootNavigationItem => ({
    applicationId,
    name,
    relativePath,
    icon,
    color: "#FFFFFF",
    isCurrent: false,
});

export const rootNavigationItems: RootNavigationItem[] = [
    createRootNavigationItem(DIRECTORY_ID, "Directory", "/directory", "setting"),
    createRootNavigationItem(CLIENT_ID, "Client", "/client", "user"),
    createRootNavigationItem(COMMISSION_ID, "Commission", "/commission", "dollar"),
    createRootNavigationItem(COMPLIANCE_ID, "Compliance", "/compliance", "safety"),
    createRootNavigationItem(INVEST_ID, "Invest", "#AE1827", "dollar"),
];
