// @flow

type ContextReceiveBreadCrumb = {
    type: 'CONTEXT_RECIEVE_BREADCRUMB',
    payload: string
};

export type Action = ContextReceiveBreadCrumb;

export const recieveBreadCrumb = (
    breadCrumb: string
): ContextReceiveBreadCrumb => ({
    type: 'CONTEXT_RECIEVE_BREADCRUMB',
    payload: breadCrumb
});
