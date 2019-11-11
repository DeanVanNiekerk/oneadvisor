import { Alert, Icon, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Filters } from "@/app/table";
import { commissionsImportApi } from "@/config/api/commission";
import { Statement } from "@/state/app/commission/statements";
import {
    commissionStatementTemplatesSelector,
    fetchCommissionStatementTemplates,
} from "@/state/app/commission/templates";
import { tokenSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormField, FormSelect } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

type Props = {
    statement: Statement;
    onUploaded: () => void;
} & PropsFromState &
    PropsFromDispatch;

const UploadStatementForm: React.FC<Props> = (props: Props) => {
    const [templateId, setTemplateId] = useState<string>();
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        const filters = {
            date: [props.statement.date],
            companyId: [props.statement.companyId],
        };
        props.fetchCommissionStatementTemplates(filters);
    }, []);

    const onChange = (info: UploadChangeParam) => {
        if (info.file.status !== "uploading") {
            setUploading(true);
        }

        if (info.file.status === "done") {
            if (info.file.response.results.length === 0)
                showMessage("warning", "There where no commission entries imported, please check commission file.", 10);
            else showMessage("success", "Commission Statement Imported Successfully", 5);

            props.onUploaded();
            setUploading(false);
        } else if (info.file.status === "error") {
            showMessage("error", "Commission Statement Imported Failed", 5);
            setUploading(false);
        }
    };

    if (!props.fetchingTemplates && props.templates.length === 0)
        return <Alert message="Unable to import. There are no valid templates for this statement." type="error" />;

    return (
        <Form editUseCase="com_import_commissions">
            <FormSelect
                fieldName="templateId"
                label="Template"
                value={templateId}
                onChange={(fieldName: string, value: string) => {
                    setTemplateId(value);
                }}
                options={props.templates}
                optionsValue="id"
                optionsText="name"
                loading={props.fetchingTemplates}
                placeholder="Select Template"
                disabled={uploading}
            />
            <FormField label="File">
                <Upload
                    name="file"
                    listType="text"
                    onChange={onChange}
                    action={`${commissionsImportApi}/${props.statement.id}?commissionStatementTemplateId=${templateId}`}
                    headers={{
                        Authorization: "Bearer " + props.token,
                    }}
                    disabled={props.fetchingTemplates || !templateId || uploading}
                    accept=".xlsx"
                >
                    <Button noLeftMargin={true} type="primary">
                        <Icon type="upload" /> Click to Upload
                    </Button>
                </Upload>
            </FormField>
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const templatesState = commissionStatementTemplatesSelector(state);
    const tokenState = tokenSelector(state);
    return {
        token: tokenState.token,
        fetchingTemplates: templatesState.fetching,
        templates: templatesState.items,
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
