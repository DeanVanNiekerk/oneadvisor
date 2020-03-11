import { Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import update from "immutability-helper";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { statementTemplatesApi } from "@/config/api/commission";
import {
    commissionStatementTemplateCommissionTypesConfigSelector,
    commissionStatementTemplateSelector,
    commissionStatementTemplateSheetSelector,
    CommissionType,
    CommissionTypes,
    modifyCommissionStatementTemplateCommissionTypes,
    saveCommissionStatementTemplate,
} from "@/state/app/commission/templates";
import { tokenSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";
import { UploadOutlined } from "@ant-design/icons";

type Props = PropsFromState & PropsFromDispatch;

const SyncCommissionTypes: React.FC<Props> = (props: Props) => {
    const [syncingCommissionTypes, setSyncingCommissionTypes] = useState<boolean>(false);

    if (!props.sheet || !props.commissionTypes) return <React.Fragment />;

    const { templateId, sheet, commissionTypes, token } = props;

    const syncCommissionTypes = (values: string[]) => {
        const existingValues = commissionTypes.types.map(t => t.value.toLowerCase());

        const newCommissionTypes = values
            .filter(value => {
                return !existingValues.find(v => v === value.toLowerCase());
            })
            .map(value => ({
                commissionTypeCode: "",
                value: value,
            }));

        props.insertTypes(newCommissionTypes, commissionTypes);
    };

    const onFileUpload = (info: UploadChangeParam) => {
        if (info.file.status === "done") {
            showMessage("success", "Commission Types Sync Successful", 5);
            syncCommissionTypes(info.file.response);
            setSyncingCommissionTypes(false);
        } else if (info.file.status === "error") {
            showMessage("error", "Commission Types sync failed, check data is valid", 10);
            setSyncingCommissionTypes(false);
        }
    };

    const onBeforeFileUpload = (): PromiseLike<void> => {
        setSyncingCommissionTypes(true);

        return new Promise((resolve, reject) => {
            props.saveTemplate(
                //Success
                resolve,
                //Failure
                () => {
                    setSyncingCommissionTypes(false);
                    reject();
                }
            );
        });
    };

    return (
        <Upload
            name="file"
            listType="text"
            className="pull-right"
            beforeUpload={onBeforeFileUpload}
            onChange={onFileUpload}
            action={`${statementTemplatesApi}/${templateId}/${sheet.position}/excel/uniqueCommissionTypes`}
            headers={{
                Authorization: "Bearer " + token,
            }}
            showUploadList={false}
            disabled={syncingCommissionTypes}
        >
            <Button loading={syncingCommissionTypes}>
                {!syncingCommissionTypes && <UploadOutlined />}
                Sync Commission Types
            </Button>
        </Upload>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const templateState = commissionStatementTemplateSelector(state);

    return {
        token: tokenSelector(state),
        templateId: templateState.template ? templateState.template.id : null,
        commissionTypes: commissionStatementTemplateCommissionTypesConfigSelector(state),
        sheet: commissionStatementTemplateSheetSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        saveTemplate: (onSaved: () => void, onFailure: () => void) => {
            dispatch(saveCommissionStatementTemplate(false, showMessage, onSaved, onFailure, true));
        },
        insertTypes: (types: CommissionType[], commissionTypes: CommissionTypes) => {
            const modifiedCommissionTypes = update(commissionTypes, {
                types: {
                    $push: [...types],
                },
            });
            dispatch(modifyCommissionStatementTemplateCommissionTypes(modifiedCommissionTypes));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncCommissionTypes);
