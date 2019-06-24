import { Dispatch } from 'redux';

import { ApiAction } from '@/app/types';
import config from '@/config/config';

import { signOut } from '../auth';
import { getVersion, setVersion } from '../storage';
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
        onSuccess: (result: AppInfo, dispatch: Dispatch) => {
            const currentVersion = getVersion();
            setVersion(result.version);
            if (currentVersion != null && currentVersion != result.version) {
                //If version has changed, sign the user out and force reload
                dispatch(signOut());
                setTimeout(() => {
                    location.reload(true);
                }, 500);
            }
        },
    };
};
