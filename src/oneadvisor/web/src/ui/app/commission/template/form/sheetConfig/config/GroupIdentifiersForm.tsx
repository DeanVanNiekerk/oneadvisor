import { Icon, List, Popconfirm, Tooltip } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";

import { ValidationResult } from "@/app/validation";
import { Identifier } from "@/state/app/commission/templates";
import { Button, Form, FormErrors, FormInput } from "@/ui/controls";

type Props = {
    identifiers: Identifier[];
    validationResults: ValidationResult[];
    onChange: (identifiers: Identifier[]) => void;
};

class GroupIdentifiersForm extends Component<Props> {
    remove = (index: number) => {
        const identifiers = update(this.props.identifiers, { $splice: [[index, 1]] });
        this.props.onChange(identifiers);
    };

    add = () => {
        const identifiers = update(this.props.identifiers, {
            $push: [
                {
                    column: "",
                    value: "",
                },
            ],
        });
        this.props.onChange(identifiers);
    };

    update = (index: number, identifier: Identifier) => {
        const identifiers = update(this.props.identifiers, {
            [index]: {
                $set: identifier,
            },
        });
        this.props.onChange(identifiers);
    };

    onChange = (fieldName: string, value: string, index: number) => {
        const field = {
            ...this.props.identifiers[index],
            [fieldName]: value,
        };
        this.update(index, field);
    };

    getActions = (index: number) => {
        return [
            <Popconfirm
                title="Are you sure remove this identifier?"
                onConfirm={() => this.remove(index)}
                okText="Yes"
                cancelText="No"
                key="group-identifier-remove"
            >
                <a href="#">remove</a>
            </Popconfirm>,
        ];
    };

    render() {
        const { validationResults, identifiers } = this.props;

        return (
            <>
                <FormErrors validationResults={validationResults} />

                <Button icon="plus" type="dashed" onClick={this.add} noLeftMargin={true}>
                    {`Add Identifier`}
                </Button>

                <List
                    bordered
                    className="mt-1"
                    dataSource={identifiers}
                    renderItem={(identifier: Identifier, index: number) => (
                        <List.Item actions={[this.getActions(index)]}>
                            <Form key={index} layout="inline">
                                <FormInput
                                    fieldName="column"
                                    validationFieldName={`[${index}].column`}
                                    label="Column"
                                    value={identifier.column}
                                    onChange={(fieldName: string, value: string) => {
                                        this.onChange(fieldName, value, index);
                                    }}
                                    validationResults={validationResults}
                                    width="100px"
                                />
                                <FormInput
                                    fieldName="value"
                                    validationFieldName={`[${index}].value`}
                                    label="Value"
                                    value={identifier.value}
                                    onChange={(fieldName: string, value: string) => {
                                        this.onChange(fieldName, value, index);
                                    }}
                                    validationResults={validationResults}
                                    width="200px"
                                    addonAfter={
                                        <Tooltip title="This is a regular expression used to evaluate the match condition">
                                            <Icon type="info-circle" />
                                        </Tooltip>
                                    }
                                />
                            </Form>
                        </List.Item>
                    )}
                />
            </>
        );
    }
}

export default GroupIdentifiersForm;
