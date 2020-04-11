import { appendQueryString } from "@/app/query";
import { downloadFileApi } from "@/config/api/file";

export const buildFileUrl = (url: string): string => {
    const api = downloadFileApi;
    return appendQueryString(api, [{ key: "url", value: url }]);
};
