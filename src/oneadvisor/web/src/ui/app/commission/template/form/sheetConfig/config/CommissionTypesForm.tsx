import { List, Popconfirm, Popover } from "antd";
import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { commissionTypesSelector } from "@/state/app/commission/lookups";
import {
    commissionStatementTemplateCommissionTypesConfigSelector,
    commissionStatementTemplateConfigValidationResultsSelector,
    CommissionType,
    CommissionTypes,
    modifyCommissionStatementTemplateCommissionTypes,
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormErrors, FormInput, FormItemIcon, FormSelect } from "@/ui/controls";
import { ArrowRightOutlined, InfoCircleOutlined } from "@ant-design/icons";

import SyncCommissionTypes from "./SyncCommissionTypes";

type Props = PropsFromState & PropsFromDispatch;

const CommissionTypesForm: React.FC<Props> = (props: Props) => {
    if (!props.commissionTypes) return <React.Fragment />;

    const { commissionTypes, validationResults, lookupCommissionTypes } = props;

    const onChange = (fieldName: keyof CommissionTypes, value: string) => {
        props.handleChange(commissionTypes, fieldName, value);
    };

    const onTypesChange = (fieldName: string, value: string, index: number) => {
        const type = {
            ...commissionTypes.types[index],
            [fieldName]: value,
        };
        props.updateType(index, type, commissionTypes);
    };

    const getActions = (index: number) => {
        return [
            <Popconfirm
                key="remove_mapping"
                title="Are you sure remove this mapping?"
                onConfirm={() => props.removeType(index, commissionTypes)}
                okText="Yes"
                cancelText="No"
            >
                <a href="#">remove</a>
            </Popconfirm>,
        ];
    };

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
                    options={lookupCommissionTypes}
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
                            <InfoCircleOutlined />
                        </Popover>
                    }
                />
            </Form>

            <Button
                icon="plus"
                type="dashed"
                onClick={() => props.addType(commissionTypes)}
                noLeftMargin={true}
            >
                {`Add Mapping`}
            </Button>

            <SyncCommissionTypes />

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
                            <FormItemIcon icon={ArrowRightOutlined} />
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
    return {
        commissionTypes: commissionStatementTemplateCommissionTypesConfigSelector(state),
        lookupCommissionTypes: commissionTypesSelector(state).items,
        validationResults: getValidationSubSet(
            `commissionTypes`,
            commissionStatementTemplateConfigValidationResultsSelector(state)
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        updateType: (index: number, type: CommissionType, commissionTypes: CommissionTypes) => {
            const modifiedCommissionTypes = update(commissionTypes, {
                types: {
                    [index]: {
                        $set: type,
                    },
                },
            });
            dispatch(modifyCommissionStatementTemplateCommissionTypes(modifiedCommissionTypes));
        },
        addType: (commissionTypes: CommissionTypes) => {
            const modifiedCommissionTypes = update(commissionTypes, {
                types: {
                    $push: [
                        {
                            commissionTypeCode: "",
                            value: "",
                        },
                    ],
                },
            });
            dispatch(modifyCommissionStatementTemplateCommissionTypes(modifiedCommissionTypes));
        },
        removeType: (index: number, commissionTypes: CommissionTypes) => {
            const modifiedCommissionTypes = update(commissionTypes, {
                types: {
                    $splice: [[index, 1]],
                },
            });
            dispatch(modifyCommissionStatementTemplateCommissionTypes(modifiedCommissionTypes));
        },
        handleChange: (
            commissionTypes: CommissionTypes,
            fieldName: keyof CommissionTypes,
            value: string
        ) => {
            const commissionTypesModified = update(commissionTypes, {
                [fieldName]: { $set: value },
            });
            dispatch(modifyCommissionStatementTemplateCommissionTypes(commissionTypesModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommissionTypesForm);
