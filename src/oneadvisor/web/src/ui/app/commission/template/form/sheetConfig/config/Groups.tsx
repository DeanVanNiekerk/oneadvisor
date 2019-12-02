import { Card, Icon, Popconfirm, Tooltip } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { getValidationSubSet, ValidationResult } from "@/app/validation";
import {
    CommissionStatementTemplateGroupFieldName,
    commissionStatementTemplateGroupFieldNamesSelector,
} from "@/state/app/commission/lookups";
import { Group, Identifier } from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormErrors, FormInput, FormSelect, FormSwitch } from "@/ui/controls";

import GroupIdentifiersForm from "./GroupIdentifiersForm";

type Props = {
    groups: Group[];
    validationResults: ValidationResult[];
    onChange: (groups: Group[]) => void;
    fieldNames: CommissionStatementTemplateGroupFieldName[];
};

class Groups extends Component<Props> {
    remove = (index: number) => {
        const groups = update(this.props.groups, { $splice: [[index, 1]] });
        this.setGroupsState(groups);
    };

    add = () => {
        const group: Group = {
            fieldName: "",
            column: "",
            formatter: "",
            reverseOrder: false,
            identifiers: [] as Identifier[],
        };
        const groups = update(this.props.groups, {
            $push: [group],
        });
        this.setGroupsState(groups);
    };

    update = (index: number, group: Group) => {
        const groups = update(this.props.groups, {
            [index]: {
                $set: group,
            },
        });
        this.setGroupsState(groups);
    };

    onChange = (fieldName: string, value: boolean | string | Identifier[], index: number) => {
        const group = {
            ...this.props.groups[index],
            [fieldName]: value,
        };
        this.update(index, group);
    };

    setGroupsState = (groups: Group[]) => {
        this.setState({
            groups: groups,
        });
        this.props.onChange(groups);
    };

    getActions = (group: Group, index: number) => {
        return [
            <Popconfirm
                title="Are you sure remove this group?"
                onConfirm={() => this.remove(index)}
                okText="Yes"
                cancelText="No"
                key="remove-group"
            >
                <a href="#">remove</a>
            </Popconfirm>,
        ];
    };

    render() {
        const { groups, validationResults } = this.props;

        return (
            <>
                <FormErrors validationResults={validationResults} />

                <Button icon="plus" type="dashed" onClick={this.add} noLeftMargin={true}>
                    {`Add Group`}
                </Button>

                {groups.map((group, index) => {
                    return (
                        <Card
                            title={`Group ${index + 1}`}
                            size="small"
                            extra={this.getActions(group, index)}
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
                                        this.onChange(fieldName, value, index);
                                    }}
                                    validationResults={validationResults}
                                    options={this.props.fieldNames}
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
                                        this.onChange(fieldName, value, index);
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
                                        this.onChange(fieldName, value, index);
                                    }}
                                    validationResults={validationResults}
                                    width="180px"
                                    addonAfter={
                                        <Tooltip title="This is a regular expression used to format the value">
                                            <Icon type="info-circle" />
                                        </Tooltip>
                                    }
                                />
                                <FormSwitch
                                    fieldName="reverseOrder"
                                    label="Rev. Order"
                                    value={group.reverseOrder}
                                    onChange={(fieldName: string, value: boolean) => {
                                        this.onChange(fieldName, value, index);
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
                                    this.onChange("identifiers", identifiers, index);
                                }}
                            />
                        </Card>
                    );
                })}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const fieldNamesState = commissionStatementTemplateGroupFieldNamesSelector(state);

    return {
        fieldNames: fieldNamesState.items,
    };
};

export default connect(mapStateToProps)(Groups);
