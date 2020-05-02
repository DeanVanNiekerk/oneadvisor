import { appendFiltersQuery } from "@/app/query";
import { PagedItems } from "@/app/table";
import { ApiAction, ApiOnSuccess } from "@/app/types";
import { organisationsApi } from "@/config/api/directory";

import { Organisation } from "../types";

export const getOrganisationByBranchId = (
    branchId: string,
    onComplete: (organisation: Organisation | null) => void
): ApiAction => {
    let api = organisationsApi;
    api = appendFiltersQuery(api, { branchId: [branchId] });

    const onSuccess: ApiOnSuccess<PagedItems<Organisation>> = (result) => {
        if (result.items.length > 0) onComplete(result.items[0]);
        else onComplete(null);
    };

    return {
        type: "API",
        endpoint: api,
        onSuccess: onSuccess,
        onFailure: () => onComplete(null),
    };
};
