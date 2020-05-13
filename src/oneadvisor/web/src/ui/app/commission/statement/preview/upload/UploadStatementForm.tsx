import { Alert } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Filters } from "@/app/table";
import { commissionsImportApi } from "@/config/api/commission";
import { RootState } from "@/state";
import { tokenSelector } from "@/state/auth";
import { ImportResult, Statement } from "@/state/commission/statements";
import {
    commissionStatementTemplatesSelector,
    fetchCommissionStatementTemplates,
} from "@/state/commission/templates";
import { brokersSelector } from "@/state/lookups/directory";
import { Form, FormField, FormSelect } from "@/ui/controls";
import { Upload } from "@/ui/controls/common/Upload";
import { showMessage } from "@/ui/feedback/notifcation";

type Props = {
    statement: Statement;
    onUploaded: () => void;
} & PropsFromState &
    PropsFromDispatch;

const UploadStatementForm: React.FC<Props> = (props: Props) => {
    const [templateId, setTemplateId] = useState<string | undefined>();
    const [userId, setUserId] = useState<string | undefined>();

    useEffect(() => {
        const filters = {
            date: [props.statement.date],
            companyId: [props.statement.companyId],
        };
        props.fetchCommissionStatementTemplates(filters);
    }, []);

    const isBrokerSpecific = (): boolean => {
        if (!templateId) return false;

        const template = props.templates.find((t) => t.id === templateId);

        if (!template) return false;

        return template.brokerSpecific;
    };

    const canUpload = () => {
        if (props.fetchingTemplates) return false;

        if (!templateId) return false;

        if (isBrokerSpecific() && !userId) return false;

        return true;
    };

    const onUploaded = (result: ImportResult) => {
        if (result.results.length === 0)
            showMessage(
                "warning",
                "There where no commission entries imported, please check commission file.",
                10
            );
        else showMessage("success", "Commission Statement Imported Successfully", 5);

        props.onUploaded();
    };

    if (!props.fetchingTemplates && props.templates.length === 0)
        return (
            <Alert
                message="Unable to import. There are no valid templates for this statement."
                type="error"
            />
        );

    return (
        <Form editUseCase="com_import_commissions">
            <FormSelect
                fieldName="templateId"
                label="Template"
                value={templateId || ""}
                onChange={(fieldName: string, value: string) => {
                    setTemplateId(value);
                }}
                options={props.templates}
                optionsValue="id"
                optionsText="name"
                loading={props.fetchingTemplates}
                placeholder="Select Template"
            />
            {isBrokerSpecific() && (
                <FormSelect
                    fieldName="userId"
                    label="Broker"
                    value={userId || ""}
                    onChange={(fieldName: string, value: string) => {
                        setUserId(value);
                    }}
                    options={props.users}
                    optionsValue="id"
                    optionsText="fullName"
                    placeholder="Select Broker"
                />
            )}
            <FormField label="File">
                <Upload
                    listType="text"
                    editUseCase="com_import_commissions"
                    action={`${commissionsImportApi}/${
                        props.statement.id
                    }?commissionStatementTemplateId=${templateId}&userId=${userId ? userId : ""}`}
                    onUploaded={onUploaded}
                    onError={() => showMessage("error", "Commission Statement Imported Failed", 5)}
                    buttonText="Click to Upload"
                    accept=".xlsx"
                    readonly={!canUpload()}
                />
            </FormField>
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const templatesState = commissionStatementTemplatesSelector(state);
    const token = tokenSelector(state);
    return {
        token: token,
        fetchingTemplates: templatesState.fetching,
        templates: templatesState.items,
        users: brokersSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchCommissionStatementTemplates: (filters: Filters) => {
            dispatch(fetchCommissionStatementTemplates(filters));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadStatementForm);
