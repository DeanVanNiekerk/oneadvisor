import moment from "moment";

import { saveFile } from "@/app/file";
import { ApiAction } from "@/app/types";
import { DATE_FORMAT } from "@/app/utils";
import { clientsExportApi } from "@/config/api/client";

type TOnComplete = () => void;

export const exportClientPolicyAggregates = (onComplete: TOnComplete): ApiAction => ({
    type: "API",
    endpoint: `${clientsExportApi}/policyAggregates/csv`,
    onSuccessBlob: (blob) => {
        saveFile(blob, `ClientPolicyAggregates_${moment().format(DATE_FORMAT)}.csv`);
        onComplete();
    },
});

export const exportClientPolicies = (onComplete: TOnComplete): ApiAction => ({
    type: "API",
    endpoint: `${clientsExportApi}/policies/csv`,
    onSuccessBlob: (blob) => {
        saveFile(blob, `ClientPolicies_${moment().format(DATE_FORMAT)}.csv`);
        onComplete();
    },
});
