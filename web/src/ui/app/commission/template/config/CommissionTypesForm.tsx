import { List, Popconfirm } from 'antd';
import update from 'immutability-helper';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { ValidationResult } from '@/app/validation';
import { CommissionType, CommissionTypes } from '@/state/app/commission/templates';
import { CommissionType as LookupCommissionType, commissionTypesSelector } from '@/state/app/directory/lookups';
import {
    commissionStatementTemplateFieldNamesSelector
} from '@/state/app/directory/lookups/commissionStatementTemplateFieldNames';
import { authSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button, Form, FormErrors, FormInput, FormItemIcon, FormSelect } from '@/ui/controls';

type Props = {
    commissionTypes: CommissionTypes;
    validationResults: ValidationResult[];
    onChange: (commissionTypes: CommissionTypes) => void;
    useCases: string[];
    lookupCommissionTypes: LookupCommissionType[];
};

type State = {
    commissionTypes: CommissionTypes;
    hasUseCase: boolean;
};

class CommissionTypesForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commissionTypes: props.commissionTypes,
            hasUseCase: hasUseCase(
                'com_edit_commission_statement_templates',
                props.useCases
            )
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commissionTypes != prevProps.commissionTypes)
            this.setState({
                commissionTypes: this.props.commissionTypes
            });
    }

    remove = (index: number) => {
        const types = update(this.state.commissionTypes.types, {
            $splice: [[index, 1]]
        });
        this.setTypesState(types);
    };

    add = () => {
        const types = update(this.state.commissionTypes.types, {
            $push: [
                {
                    commissionTypeId: '',
                    value: ''
                }
            ]
        });
        this.setTypesState(types);
    };

    update = (index: number, type: CommissionType) => {
        const types = update(this.state.commissionTypes.types, {
            [index]: {
                $set: type
            }
        });
        this.setTypesState(types);
    };

    onTypesChange = (fieldName: string, value: string, index: number) => {
        const type = {
            ...this.state.commissionTypes.types[index],
            [fieldName]: value
        };
        this.update(index, type);
    };

    onChange = (fieldName: string, value: string) => {
        const commissionTypes = {
            ...this.state.commissionTypes,
            [fieldName]: value
        };
        this.setCommissionTypesState(commissionTypes);
    };

    setTypesState = (types: CommissionType[]) => {
        const commissionTypes = {
            ...this.state.commissionTypes,
            types: types
        };
        this.setCommissionTypesState(commissionTypes);
    };

    setCommissionTypesState = (commissionTypes: CommissionTypes) => {
        this.setState({
            commissionTypes: commissionTypes
        });
        this.props.onChange(commissionTypes);
    };

    getActions = (type: CommissionType, index: number) => {
        if (!this.state.hasUseCase) return [];

        return [
            <Popconfirm
                title="Are you sure remove this mapping?"
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
        const { commissionTypes } = this.state;

        return (
            <>
                <FormErrors validationResults={validationResults} />

                <Form editUseCase="com_edit_commission_statement_templates">
                    <FormSelect
                        fieldName="defaultCommissionTypeId"
                        label="Default Commission Type"
                        value={commissionTypes.defaultCommissionTypeId}
                        onChange={this.onChange}
                        validationResults={validationResults}
                        options={this.props.lookupCommissionTypes}
                        optionsValue="id"
                        optionsText="name"
                    />
                    <FormInput
                        fieldName="mappingTemplate"
                        label="Mapping Template"
                        value={commissionTypes.mappingTemplate}
                        onChange={this.onChange}
                        validationResults={validationResults}
                    />
                </Form>

                <Button
                    icon="plus"
                    type="dashed"
                    onClick={this.add}
                    noLeftMargin={true}
                    visible={this.state.hasUseCase}
                >
                    {`Add Mapping`}
                </Button>

                <List
                    bordered
                    className="mt-1"
                    dataSource={commissionTypes.types}
                    renderItem={(type: CommissionType, index: any) => (
                        <List.Item actions={[this.getActions(type, index)]}>
                            <Form
                                key={index}
                                editUseCase="com_edit_commission_statement_templates"
                                layout="inline"
                            >
                                <FormInput
                                    fieldName="value"
                                    validationFieldName={`types[${index}].value`}
                                    label="Value"
                                    value={type.value}
                                    onChange={(
                                        fieldName: string,
                                        value: string
                                    ) => {
                                        this.onTypesChange(
                                            fieldName,
                                            value,
                                            index
                                        );
                                    }}
                                    validationResults={validationResults}
                                    width="225px"
                                />
                                <FormItemIcon type="arrow-right" />
                                <FormSelect
                                    fieldName="commissionTypeId"
                                    validationFieldName={`types[${index}].commissionTypeId`}
                                    label="Commission Type"
                                    value={type.commissionTypeId}
                                    onChange={(
                                        fieldName: string,
                                        value: string
                                    ) => {
                                        this.onTypesChange(
                                            fieldName,
                                            value,
                                            index
                                        );
                                    }}
                                    validationResults={validationResults}
                                    options={this.props.lookupCommissionTypes}
                                    optionsValue="id"
                                    optionsText="name"
                                    width="230px"
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
    const lookupCommissionTypesState = commissionTypesSelector(state);

    return {
        lookupCommissionTypes: lookupCommissionTypesState.items,
        fieldNames: fieldNamesState.items,
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

export default connect(mapStateToProps)(CommissionTypesForm);
