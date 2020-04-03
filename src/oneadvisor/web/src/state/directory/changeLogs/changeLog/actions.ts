import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { changeLogsApi } from "@/config/api/directory";

import { ChangeLogEdit } from "../types";

type ChangeLogReceiveAction = {
    type: "CHANGELOGS_CHANGELOG_RECEIVE";
    payload: ChangeLogEdit | null;
};

type ChangeLogUpdatedAction = {
    type: "CHANGELOGS_CHANGELOG_EDIT_RECEIVE";
};
type ChangeLogUpdatingAction = {
    type: "CHANGELOGS_CHANGELOG_EDIT_FETCHING";
};
type ChangeLogUpdatingErrorAction = {
    type: "CHANGELOGS_CHANGELOG_EDIT_FETCHING_ERROR";
};
type ChangeLogValidationErrorAction = {
    type: "CHANGELOGS_CHANGELOG_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type ChangeLogAction =
    | ChangeLogReceiveAction
    | ChangeLogUpdatedAction
    | ChangeLogUpdatingAction
    | ChangeLogUpdatingErrorAction
    | ChangeLogValidationErrorAction;

export const receiveChangeLog = (changeLog: ChangeLogEdit | null): ChangeLogReceiveAction => ({
    type: "CHANGELOGS_CHANGELOG_RECEIVE",
    payload: changeLog,
});

export const updateChangeLog = (changeLog: ChangeLogEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${changeLogsApi}/${changeLog.id}`,
    method: "POST",
    payload: changeLog,
    onSuccess: onSuccess,
    dispatchPrefix: "CHANGELOGS_CHANGELOG_EDIT",
});

export const insertChangeLog = (changeLog: ChangeLogEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${changeLogsApi}`,
    method: "POST",
    payload: changeLog,
    onSuccess: onSuccess,
    dispatchPrefix: "CHANGELOGS_CHANGELOG_EDIT",
});
