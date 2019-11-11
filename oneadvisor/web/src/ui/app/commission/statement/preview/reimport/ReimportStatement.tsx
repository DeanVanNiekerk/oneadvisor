import { Alert, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Filters } from "@/app/table";
import { reimportCommissions, Statement } from "@/state/app/commission/statements";
import {
    commissionStatementTemplatesSelector,
    fetchCommissionStatementTemplates,
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormSelect } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

const confirm = Modal.confirm;

type Props = {
    statement: Statement;
    onReimported: () => void;
} & PropsFromState &
    PropsFromDispatch;

const ReimportStatement: React.FC<Props> = (props: Props) => {
    const [templateId, setTemplateId] = useState<string>();
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        const filters = {
            date: [props.statement.date],
            companyId: [props.statement.companyId],
        };
        props.fetchCommissionStatementTemplates(filters);
    }, []);

    const reimportCommissions = () => {
        if (!templateId) return;

        confirm({
            title: "Are you sure you want to reimport all commission entries?",
            content:
                "All existing commission entries including any errors will be deleted before import, are you sure you wish to continue?",
            onOk: () => {
                if (!templateId) return;
                showMessage("loading", "Reimporting commission entries", 60);
                setUploading(true);
                props.reimportCommissions(
                    props.statement.id,
                    templateId,
                    //Success
                    () => {
                        setUploading(false);
                        showMessage("success", "Commission entries successfully imported", 5, true);
                        props.onReimported();
                    },
                    //Failure
                    () => {
                        setUploading(false);
                        showMessage("error", "Error importing commission entries", 5, true);
                    }
                );
            },
        });
    };

    if (!props.fetchingTemplates && props.templates.length === 0)
        <Alert message="Unable to import. There are no valid templates for this statement." type="error" />;

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
            />
            <Button
                type="primary"
                onClick={reimportCommissions}
                disabled={!templateId || uploading}
                className="pull-right"
            >
                Reimport
            </Button>
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const templatesState = commissionStatementTemplatesSelector(state);

    return {
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
        reimportCommissions: (
            commissionStatementId: string,
            commissionStatementTemplateId: string,
            onSuccess: () => void,
            onFailure: () => void
        ) => {
            dispatch(reimportCommissions(commissionStatementId, commissionStatementTemplateId, onSuccess, onFailure));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReimportStatement);
