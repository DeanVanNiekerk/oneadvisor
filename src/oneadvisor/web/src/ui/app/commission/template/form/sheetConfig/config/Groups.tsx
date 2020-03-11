import { Card, Popconfirm, Tooltip } from "antd";
import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { commissionStatementTemplateGroupFieldNamesSelector } from "@/state/app/commission/lookups";
import {
    commissionStatementTemplateConfigValidationResultsSelector,
    commissionStatementTemplateGroupsConfigSelector,
    Group,
    Identifier,
    modifyCommissionStatementTemplateGroups,
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormErrors, FormInput, FormSelect, FormSwitch } from "@/ui/controls";
import { InfoCircleOutlined } from "@ant-design/icons";

import GroupIdentifiersForm from "./GroupIdentifiersForm";

type Props = PropsFromState & PropsFromDispatch;

const Groups: React.FC<Props> = (props: Props) => {
    const { groups, validationResults, fieldNames } = props;

    const onChange = (
        group: Group,
        fieldName: string,
        value: string | boolean | Identifier[],
        index: number
    ) => {
        props.update(group, fieldName, value, index, groups);
    };

    const getActions = (index: number) => {
        return [
            <Popconfirm
                title="Are you sure remove this group?"
                onConfirm={() => props.remove(index, groups)}
                okText="Yes"
                cancelText="No"
                key="remove-group"
            >
                <a href="#">remove</a>
            </Popconfirm>,
        ];
    };

    return (
        <>
            <FormErrors validationResults={validationResults} />

            <Button icon="plus" type="dashed" onClick={() => props.add(groups)} noLeftMargin={true}>
                {`Add Group`}
            </Button>

            {groups.map((group, index) => {
                return (
                    <Card
                        title={`Group ${index + 1}`}
                        size="small"
                        extra={getActions(index)}
                        style={{ width: "100%" }}
                        className="mt-1"
                        key={`group-${index}`}
                    >
                        <Form key={index} className="mb-1" layout="inline">
                            <FormSelect
                                fieldName="fieldName"
                                validationFieldName={`[${index}].fieldName`}
                                label="Field"
                                value={group.fieldName}
                                onChange={(fieldName: string, value: string) => {
                                    onChange(group, fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                options={fieldNames}
                                optionsValue="id"
                                optionsText="name"
                                width="150px"
                            />
                            <FormInput
                                fieldName="column"
                                validationFieldName={`[${index}].column`}
                                label="Column"
                                value={group.column}
                                onChange={(fieldName: string, value: string) => {
                                    onChange(group, fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                width="60px"
                            />
                            <FormInput
                                fieldName="formatter"
                                validationFieldName={`[${index}].formatter`}
                                label="Formatter"
                                value={group.formatter}
                                onChange={(fieldName: string, value: string) => {
                                    onChange(group, fieldName, value, index);
                                }}
                                validationResults={validationResults}
                                width="180px"
                                addonAfter={
                                    <Tooltip title="This is a regular expression used to format the value">
                                        <InfoCircleOutlined />
                                    </Tooltip>
                                }
                            />
                            <FormSwitch
                                fieldName="reverseOrder"
                                label="Rev. Order"
                                value={group.reverseOrder}
                                onChange={(fieldName: string, value: boolean) => {
                                    onChange(group, fieldName, value, index);
                                }}
                            />
                        </Form>

                        <GroupIdentifiersForm
                            identifiers={group.identifiers}
                            validationResults={getValidationSubSet(
                                `[${index}].identifiers`,
                                validationResults,
                                true
                            )}
                            onChange={(identifiers: Identifier[]) => {
                                onChange(group, "identifiers", identifiers, index);
                            }}
                        />
                    </Card>
                );
            })}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        groups: commissionStatementTemplateGroupsConfigSelector(state),
        validationResults: getValidationSubSet(
            `groups`,
            commissionStatementTemplateConfigValidationResultsSelector(state),
            true
        ),
        fieldNames: commissionStatementTemplateGroupFieldNamesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        update: (
            group: Group,
            fieldName: string,
            value: string | boolean | Identifier[],
            index: number,
            groups: Group[]
        ) => {
            const groupModified = update(group, {
                [fieldName]: { $set: value },
            });
            const modifiedGroups = update(groups, {
                [index]: {
                    $set: groupModified,
                },
            });
            dispatch(modifyCommissionStatementTemplateGroups(modifiedGroups));
        },
        add: (groups: Group[]) => {
            const modifiedGroups = update(groups, {
                $push: [
                    {
                        fieldName: "",
                        column: "",
                        formatter: "",
                        reverseOrder: false,
                        identifiers: [] as Identifier[],
                    },
                ],
            });
            dispatch(modifyCommissionStatementTemplateGroups(modifiedGroups));
        },
        remove: (index: number, groups: Group[]) => {
            const modifiedGroups = update(groups, {
                $splice: [[index, 1]],
            });
            dispatch(modifyCommissionStatementTemplateGroups(modifiedGroups));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
