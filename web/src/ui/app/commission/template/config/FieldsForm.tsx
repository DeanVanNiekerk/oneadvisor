import { List, Popconfirm } from 'antd';
import update from 'immutability-helper';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { getErrorMessage, ValidationResult } from '@/app/validation';
import { Field } from '@/state/app/commission/templates';
import {
    CommissionStatementTemplateFieldName, commissionStatementTemplateFieldNamesSelector
} from '@/state/app/directory/lookups/commissionStatementTemplateFieldNames';
import { authSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button, Form, FormErrors, FormInput, FormSelect } from '@/ui/controls';

type Props = {
    fields: Field[];
    validationResults: ValidationResult[];
    onChange: (fields: Field[]) => void;
    useCases: string[];
    fieldNames: CommissionStatementTemplateFieldName[];
};

type State = {
    fields: Field[];
    hasUseCase: boolean;
};

class FieldsForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            fields: props.fields,
            hasUseCase: hasUseCase(
                'com_edit_commission_statement_templates',
                props.useCases
            )
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.fields != prevProps.fields)
            this.setState({
                fields: this.props.fields
            });
    }

    remove = (index: number) => {
        const fields = update(this.state.fields, { $splice: [[index, 1]] });
        this.setFieldsState(fields);
    };

    add = () => {
        const fields = update(this.state.fields, {
            $push: [
                {
                    name: '',
                    column: ''
                }
            ]
        });
        this.setFieldsState(fields);
    };

    update = (index: number, field: Field) => {
        const fields = update(this.state.fields, {
            [index]: {
                $set: field
            }
        });
        this.setFieldsState(fields);
    };

    onChange = (fieldName: string, value: string, index: number) => {
        const field = {
            ...this.state.fields[index],
            [fieldName]: value
        };
        this.update(index, field);
    };

    setFieldsState = (fields: Field[]) => {
        this.setState({
            fields: fields
        });
        this.props.onChange(fields);
    };

    getActions = (field: Field, index: number) => {
        if (!this.state.hasUseCase) return [];

        return [
            <Popconfirm
                title="Are you sure remove this field?"
                onConfirm={() => this.remove(index)}
                okText="Yes"
                cancelText="No"
            >
                <a href="#">remove</a>
            </Popconfirm>
        ];
    };

    render() {
        const { validationResults } = this.props;
        const { fields } = this.state;

        console.log(validationResults);

        return (
            <>
                <FormErrors validationResults={validationResults} />

                <Button
                    icon="plus"
                    type="dashed"
                    onClick={this.add}
                    noLeftMargin={true}
                    visible={this.state.hasUseCase}
                >
                    {`Add Field`}
                </Button>

                <List
                    bordered
                    className="mt-1"
                    dataSource={fields}
                    renderItem={(field: Field, index: any) => (
                        <List.Item actions={[this.getActions(field, index)]}>
                            <Form
                                editUseCase="com_edit_commission_statement_templates"
                                layout="inline"
                            >
                                <FormSelect
                                    fieldName="name"
                                    validationFieldName={`[${index}].name`}
                                    label="Field"
                                    value={field.name}
                                    onChange={(
                                        fieldName: string,
                                        value: string
                                    ) => {
                                        this.onChange(fieldName, value, index);
                                    }}
                                    validationResults={validationResults}
                                    options={this.props.fieldNames}
                                    optionsValue="id"
                                    optionsText="name"
                                    minWidth="250px"
                                />
                                <FormInput
                                    fieldName="column"
                                    validationFieldName={`[${index}].column`}
                                    label="Column"
                                    value={field.column}
                                    onChange={(
                                        fieldName: string,
                                        value: string
                                    ) => {
                                        this.onChange(fieldName, value, index);
                                    }}
                                    validationResults={validationResults}
                                />
                            </Form>
                        </List.Item>
                    )}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const identityState = authSelector(state);
    const fieldNamesState = commissionStatementTemplateFieldNamesSelector(
        state
    );

    return {
        fieldNames: fieldNamesState.items,
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

export default connect(mapStateToProps)(FieldsForm);