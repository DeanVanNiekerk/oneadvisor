import { saveFile } from "@/app/file";
import { ApiAction, ApiOnAlways, ApiOnFailure } from "@/app/types";

import { buildFileUrl } from "./";

type TOnComplete = () => void;
type TOnGetComplete = (base64String: string) => void;

export const downloadFile = (
    fileName: string,
    url: string,
    onComplete?: TOnComplete
): ApiAction => {
    const api = buildFileUrl(url);
    return {
        type: "API",
        endpoint: api,
        onSuccessBlob: (blob) => {
            saveFile(blob, fileName);
            if (onComplete) onComplete();
        },
    };
};

export const getFileAsDataUrl = (
    url: string,
    onComplete: TOnGetComplete,
    onFailure?: ApiOnFailure
): ApiAction => {
    const api = buildFileUrl(url);
    return {
        type: "API",
        endpoint: api,
        onSuccessBlob: (blob) => {
            const reader = new FileReader();
            reader.onload = function () {
                const dataUrl = reader.result;
                if (typeof dataUrl == "string") {
                    //var base64 = dataUrl.split(",")[1]; //Split if you want as pure base64
                    onComplete(dataUrl);
                }
            };
            reader.readAsDataURL(blob);
        },
        onFailure: onFailure,
    };
};
