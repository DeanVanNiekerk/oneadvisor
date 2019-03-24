import { ApiAction } from '@/app/types';
import config from '@/config/config';

import { AppInfo } from './types';

type ReceiveAppInfoAction = {
    type: "CONTEXT_APP_INFO_RECEIVE";
    payload: AppInfo;
};

export type ContextActions = ReceiveAppInfoAction;

export const fetchAppInfo = (): ApiAction => {
    return {
        type: "API",
        endpoint: `${config.baseApi}`,
        dispatchPrefix: "CONTEXT_APP_INFO",
    };
};
