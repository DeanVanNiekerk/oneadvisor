import { Icon, List, Popconfirm, Popover, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import update from "immutability-helper";
import React, { useState } from "react";
import { connect } from "react-redux";

import { ApiOnFailure, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { statementTemplatesApi } from "@/config/api/commission";
import { commissionTypesSelector } from "@/state/app/commission/lookups";
import { CommissionType, CommissionTypes, Sheet } from "@/state/app/commission/templates";
import { tokenSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormErrors, FormInput, FormItemIcon, FormSelect } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

type Props = {
    commissionTypes: CommissionTypes;
    commissionStatementTemplateId: string | null;
    validationResults: ValidationResult[];
    onChange: (commissionTypes: CommissionTypes) => void;
    saveTemplate: (
        onSuccess?: ApiOnSuccess,
        onFailure?: ApiOnFailure,
        disableSuccessMessage?: boolean
    ) => void;
    selectedSheet: Sheet;
} & PropsFromState;

const CommissionTypesForm: React.FC<Props> = (props: Props) => {
    const [syncingCommissionTypes, setSyncingCommissionTypes] = useState<boolean>(false);

    const remove = (index: number) => {
        const types = update(props.commissionTypes.types, {
            $splice: [[index, 1]],
        });
        setTypesState(types);
    };

    const add = (value = "") => {
        const types = update(props.commissionTypes.types, {
            $push: [
                {
                    commissionTypeCode: "",
                    value: value,
                },
            ],
        });
        setTypesState(types);
    };

    const updateType = (index: number, type: CommissionType) => {
        const types = update(props.commissionTypes.types, {
            [index]: {
                $set: type,
            },
        });
        setTypesState(types);
    };

    const onTypesChange = (fieldName: string, value: string, index: number) => {
        const type = {
            ...props.commissionTypes.types[index],
            [fieldName]: value,
        };
        updateType(index, type);
    };

    const onChange = (fieldName: string, value: string) => {
        const commissionTypes = {
            ...props.commissionTypes,
            [fieldName]: value,
        };
        props.onChange(commissionTypes);
    };

    const setTypesState = (types: CommissionType[]) => {
        const commissionTypes = {
            ...props.commissionTypes,
            types: types,
        };
        props.onChange(commissionTypes);
    };

    const getActions = (index: number) => {
        return [
            <Popconfirm
                key="remove_mapping"
                title="Are you sure remove this mapping?"
                onConfirm={() => remove(index)}
                okText="Yes"
                cancelText="No"
            >
                <a href="#">remove</a>
            </Popconfirm>,
        ];
    };

    const syncCommissionTypes = (values: string[]) => {
        const existingValues = props.commissionTypes.types.map(t => t.value.toLowerCase());

        values.forEach(value => {
            if (existingValues.find(v => v === value.toLowerCase())) return;
            add(value);
        });
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
                },
                true
            );
        });
    };

    const { commissionTypes, validationResults } = props;

    return (
        <>
            <FormErrors validationResults={validationResults} />

            <Form>
                <FormSelect
                    fieldName="defaultCommissionTypeCode"
                    label="Default Commission Type"
                    value={commissionTypes.defaultCommissionTypeCode}
                    onChange={onChange}
                    validationResults={validationResults}
                    options={props.lookupCommissionTypes}
                    optionsValue="code"
                    optionsText="name"
                />
                <FormInput
                    fieldName="mappingTemplate"
                    label="Mapping Template"
                    value={commissionTypes.mappingTemplate}
                    onChange={onChange}
                    validationResults={validationResults}
                    addonAfter={
                        <Popover title="Format" content={<MappingInfo />} placement="left">
                            <Icon type="info-circle" />
                        </Popover>
                    }
                />
            </Form>

            <Button icon="plus" type="dashed" onClick={() => add()} noLeftMargin={true}>
                {`Add Mapping`}
            </Button>

            {props.commissionStatementTemplateId && (
                <Upload
                    name="file"
                    listType="text"
                    className="pull-right"
                    beforeUpload={onBeforeFileUpload}
                    onChange={onFileUpload}
                    action={`${statementTemplatesApi}/${props.commissionStatementTemplateId}/${props.selectedSheet.position}/excel/uniqueCommissionTypes`}
                    headers={{
                        Authorization: "Bearer " + props.token,
                    }}
                    showUploadList={false}
                    disabled={syncingCommissionTypes}
                >
                    <Button loading={syncingCommissionTypes}>
                        {!syncingCommissionTypes && <Icon type="upload" />}
                        Sync Commission Types
                    </Button>
                </Upload>
            )}

            <List
                bordered
                className="mt-1"
                dataSource={commissionTypes.types}
                renderItem={(type: CommissionType, index: number) => (
                    <List.Item key={index} actions={[getActions(index)]}>
                        <Form layout="inline">
                            <FormInput
                                fieldName="value"
                                validationFieldName={`types[${index}].value`}
                                label="Value"
                                value={type.value}
                                onChange={(fieldName: string, value: string) => {
                                    onTypesChange(fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                width="320px"
                            />
                            <FormItemIcon type="arrow-right" />
                            <FormSelect
                                fieldName="commissionTypeCode"
                                validationFieldName={`types[${index}].commissionTypeCode`}
                                label="Type"
                                value={type.commissionTypeCode}
                                onChange={(fieldName: string, value: string) => {
                                    onTypesChange(fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                options={props.lookupCommissionTypes}
                                optionsValue="code"
                                optionsText="name"
                                width="230px"
                            />
                        </Form>
                    </List.Item>
                )}
            />
        </>
    );
};

const MappingInfo: React.FC = () => {
    return (
        <div>
            <p>{`{'Column'(start-end) | GRP_CT}`};</p>
            <p>
                <b>Examples</b>
            </p>
            <p>A;B;D</p>
            <p>GRP_CT;C;D</p>
            <p>A(1-3);B;D</p>
            <p>
                <small>
                    <i>* GRP_CT = Commission Type Group</i>
                </small>
                <br />
                <small>
                    <i>* (start-end) = Set to pull out a specific part of the column only</i>
                </small>
            </p>
        </div>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const lookupCommissionTypesState = commissionTypesSelector(state);
    const tokenState = tokenSelector(state);

    return {
        token: tokenState.token,
        lookupCommissionTypes: lookupCommissionTypesState.items,
    };
};

export default connect(mapStateToProps)(CommissionTypesForm);
