import { ApiAction } from '@/app/types';
import { statementsApi } from '@/config/api/commission';
import { FileInfo } from '@/state/types';

type StatementFilesListReceiveAction = {
    type: "STATEMENTS_FILES_LIST_RECEIVE";
    payload: FileInfo[];
};
type StatementFilesListFetchingAction = {
    type: "STATEMENTS_FILES_LIST_FETCHING";
};
type StatementFilesListFetchingErrorAction = {
    type: "STATEMENTS_FILES_LIST_FETCHING_ERROR";
};

export type StatementFilesListAction =
    | StatementFilesListReceiveAction
    | StatementFilesListFetchingAction
    | StatementFilesListFetchingErrorAction;

export const fetchStatementFiles = (
    commissionStatementId: string
): ApiAction => {
    return {
        type: "API",
        endpoint: `${statementsApi}/${commissionStatementId}/files`,
        dispatchPrefix: "STATEMENTS_FILES_LIST",
    };
};
