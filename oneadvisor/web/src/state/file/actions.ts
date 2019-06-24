import { saveFile } from '@/app/file';
import { appendQueryString } from '@/app/query';
import { ApiAction } from '@/app/types';
import { downloadFileApi } from '@/config/api/file';

type TOnComplete = () => void;

export const downloadFile = (fileName: string, url: string, onComplete: TOnComplete): ApiAction => {
    let api = downloadFileApi;
    api = appendQueryString(api, [{ key: "url", value: url }]);

    return {
        type: "API",
        endpoint: api,
        onSuccessBlob: blob => {
            saveFile(blob, fileName);
            onComplete();
        },
    };
};
