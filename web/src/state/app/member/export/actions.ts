import moment from 'moment';

import { saveFile } from '@/app/file';
import { ApiAction } from '@/app/types';
import { DATE_FORMAT } from '@/app/utils';
import { membersExportApi } from '@/config/api/member';

type TOnComplete = () => void;

export const exportMemberPolicyAggregates = (
    onComplete: TOnComplete
): ApiAction => ({
    type: "API",
    endpoint: `${membersExportApi}/policyAggregates/csv`,
    onSuccessBlob: blob => {
        saveFile(
            blob,
            `MemberPolicyAggregates_${moment().format(DATE_FORMAT)}.csv`
        );
        onComplete();
    },
});

export const exportMemberPolicies = (onComplete: TOnComplete): ApiAction => ({
    type: "API",
    endpoint: `${membersExportApi}/policies/csv`,
    onSuccessBlob: blob => {
        saveFile(blob, `MemberPolicies_${moment().format(DATE_FORMAT)}.csv`);
        onComplete();
    },
});
