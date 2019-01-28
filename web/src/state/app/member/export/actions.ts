import moment from 'moment';

import { saveFile } from '@/app/file';
import { DATE_FORMAT } from '@/app/parsers';
import { ApiAction } from '@/app/types';
import { membersExportApi } from '@/config/api/member';

type TOnComplete = () => void;

export const exportMembers = (onComplete: TOnComplete): ApiAction => ({
    type: 'API',
    endpoint: `${membersExportApi}`,
    onSuccessBlob: blob => {
        saveFile(blob, `Members_${moment().format(DATE_FORMAT)}.csv`);
        onComplete();
    }
});
