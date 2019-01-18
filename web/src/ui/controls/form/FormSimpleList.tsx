import { List, Popconfirm } from 'antd';
import update from 'immutability-helper';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { formatValue, getValidationError, ValidationResult } from '@/app/validation';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';

import { Button, FormInput } from '../';
import { Form } from './Form';
import { FormField } from './FormField';

type Props = {
    values: string[];
    fieldName: string;
    displayName: string;
    onChange: (values: string[]) => void;
    validationResults?: ValidationResult[];
    editUseCase?: string;
    useCases: string[];
};

type Mode = 'add' | 'edit';

type State = {
    values: string[];
    editing: boolean;
    editValue: string;
    editIndex: number | null;
    mode: Mode;
};

class FormSimpleListComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            values: props.values,
            editing: false,
            editValue: '',
            editIndex: null,
            mode: 'add'
        };
    }

    add = () => {
        this.setState({
            editing: true,
            editValue: '',
            editIndex: null,
            mode: 'add'
        });
    };

    edit = (value: string, index: number) => {
        this.setState({
            editing: true,
            editValue: value,
            editIndex: index,
            mode: 'edit'
        });
    };

    remove = (index: number) => {
        const values = update(this.state.values, { $splice: [[index, 1]] });
        this.setState(
            {
                values: values
            },
            () => this.props.onChange(values)
        );
    };

    cancel = () => {
        this.setState({
            editing: false,
            editValue: '',
            editIndex: null
        });
    };

    update = (value: string) => {
        this.setState({
            editValue: value
        });
    };

    save = () => {
        let values: string[] = [];
        if (this.state.editIndex === null)
            values = update(this.state.values, {
                $push: [this.state.editValue]
            });
        else
            values = update(this.state.values, {
                [this.state.editIndex]: {
                    $set: this.state.editValue
                }
            });

        this.setState(
            {
                values: values,
                editing: false,
                editValue: '',
                editIndex: null
            },
            () => this.props.onChange(values)
        );
    };

    getErrorMessage = (value: string, index: number) => {
        const result = getValidationError(
            `${this.props.fieldName}[${index}]` || '',
            this.props.validationResults || []
        );

        console.log(value, index, this.props.validationResults, result);

        //There is no validation error
        if (!result) return null;

        //If the value has changed then dont show message
        if (formatValue(result.attemptedValue) !== formatValue(value))
            return null;

        return result.errorMessage;
    };

    getActions = (value: string, index: number) => {
        if (
            this.props.editUseCase &&
            !hasUseCase(this.props.editUseCase, this.props.useCases)
        )
            return [];

        return [
            <a onClick={() => this.edit(value, index)}>edit</a>,
            <Popconfirm
                title="Are you sure remove this record?"
                onConfirm={() => this.remove(index)}
                okText="Yes"
                cancelText="No"
            >
                <a href="#">remove</a>
            </Popconfirm>
        ];
    };

    render() {
        return (
            <>
                {!this.state.editing && (
                    <Form layout="inline">
                        <FormField>
                            <Button
                                icon="plus"
                                type="dashed"
                                onClick={this.add}
                                noLeftMargin={true}
                                requiredUseCase={this.props.editUseCase}
                            >
                                Add {this.props.displayName}
                            </Button>
                        </FormField>
                    </Form>
                )}

                {this.state.editing && (
                    <Form layout="inline">
                        <FormInput
                            fieldName={this.props.fieldName}
                            label={this.props.displayName}
                            value={this.state.editValue}
                            onChange={(fieldName: string, value: string) =>
                                this.update(value)
                            }
                            focus={true}
                        />
                        <FormField>
                            <Button onClick={() => this.cancel()}>
                                Cancel
                            </Button>
                        </FormField>
                        <FormField>
                            <Button
                                onClick={this.save}
                                type="primary"
                                disabled={!this.state.editValue}
                            >
                                {this.state.mode === 'edit'
                                    ? `Update ${this.props.displayName}`
                                    : `Add ${this.props.displayName}`}
                            </Button>
                        </FormField>
                    </Form>
                )}

                <List
                    bordered
                    className="mt-1"
                    dataSource={this.state.values}
                    renderItem={(value: string, index: any) => (
                        <List.Item actions={this.getActions(value, index)}>
                            <List.Item.Meta
                                title={
                                    <span className="font-weight-normal">
                                        {value}
                                    </span>
                                }
                                description={
                                    <span className="text-error">
                                        {this.getErrorMessage(value, index)}
                                    </span>
                                }
                            />
                        </List.Item>
                    )}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const identityState = identitySelector(state);

    return {
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

const FormSimpleList = connect(mapStateToProps)(FormSimpleListComponent);

export { FormSimpleList };
