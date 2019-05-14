import { Icon, List, Popconfirm, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import update from 'immutability-helper';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { hasUseCase } from '@/app/identity';
import { ApiOnFailure, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { statementTemplatesApi } from '@/config/api/commission';
import { CommissionType as LookupCommissionType, commissionTypesSelector } from '@/state/app/commission/lookups';
import {
    commissionStatementTemplateFieldNamesSelector
} from '@/state/app/commission/lookups/commissionStatementTemplateFieldNames';
import { CommissionType, CommissionTypes } from '@/state/app/commission/templates';
import { tokenSelector, useCaseSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button, Form, FormErrors, FormInput, FormItemIcon, FormSelect } from '@/ui/controls';
import { showMessage } from '@/ui/feedback/notifcation';

type Props = {
    token: string;
    commissionTypes: CommissionTypes;
    commissionStatementTemplateId: string | null;
    validationResults: ValidationResult[];
    onChange: (commissionTypes: CommissionTypes) => void;
    useCases: string[];
    lookupCommissionTypes: LookupCommissionType[];
    saveTemplate: (
        onSuccess?: ApiOnSuccess,
        onFailure?: ApiOnFailure,
        disableSuccessMessage?: boolean
    ) => void;
} & DispatchProp;

type State = {
    commissionTypes: CommissionTypes;
    hasUseCase: boolean;
    syncingCommissionTypes: boolean;
};

class CommissionTypesForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commissionTypes: props.commissionTypes,
            hasUseCase: hasUseCase(
                "com_edit_commission_statement_templates",
                props.useCases
            ),
            syncingCommissionTypes: false,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commissionTypes != prevProps.commissionTypes)
            this.setState({
                commissionTypes: this.props.commissionTypes,
            });
    }

    remove = (index: number) => {
        const types = update(this.state.commissionTypes.types, {
            $splice: [[index, 1]],
        });
        this.setTypesState(types);
    };

    add = (value: string = "") => {
        const types = update(this.state.commissionTypes.types, {
            $push: [
                {
                    commissionTypeCode: "",
                    value: value,
                },
            ],
        });
        this.setTypesState(types);
    };

    update = (index: number, type: CommissionType) => {
        const types = update(this.state.commissionTypes.types, {
            [index]: {
                $set: type,
            },
        });
        this.setTypesState(types);
    };

    onTypesChange = (fieldName: string, value: string, index: number) => {
        const type = {
            ...this.state.commissionTypes.types[index],
            [fieldName]: value,
        };
        this.update(index, type);
    };

    onChange = (fieldName: string, value: string) => {
        const commissionTypes = {
            ...this.state.commissionTypes,
            [fieldName]: value,
        };
        this.setCommissionTypesState(commissionTypes);
    };

    setTypesState = (types: CommissionType[]) => {
        const commissionTypes = {
            ...this.state.commissionTypes,
            types: types,
        };
        this.setCommissionTypesState(commissionTypes);
    };

    setCommissionTypesState = (commissionTypes: CommissionTypes) => {
        this.setState({
            commissionTypes: commissionTypes,
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
            </Popconfirm>,
        ];
    };

    syncCommissionTypes = (values: string[]) => {
        const existingValues = this.state.commissionTypes.types.map(t =>
            t.value.toLowerCase()
        );

        values.forEach(value => {
            if (existingValues.find(v => v === value.toLowerCase())) return;
            this.add(value);
        });
    };

    onFileUpload = (info: UploadChangeParam) => {
        if (info.file.status === "done") {
            showMessage("success", "Commission Types Sync Successful", 5);
            this.syncCommissionTypes(info.file.response);
            this.setState({ syncingCommissionTypes: false });
        } else if (info.file.status === "error") {
            showMessage(
                "error",
                "Commission Types sync failed, check data is valid",
                10
            );
            this.setState({ syncingCommissionTypes: false });
        }
    };

    onBeforeFileUpload = () => {
        this.setState({ syncingCommissionTypes: true });

        return new Promise((resolve, reject) => {
            this.props.saveTemplate(
                //Success
                resolve,
                //Failure
                () => {
                    this.setState({ syncingCommissionTypes: false });
                    reject();
                },
                true
            );
        });
    };

    render() {
        const { validationResults } = this.props;
        const { commissionTypes } = this.state;

        return (
            <>
                <FormErrors validationResults={validationResults} />

                <Form editUseCase="com_edit_commission_statement_templates">
                    <FormSelect
                        fieldName="defaultCommissionTypeCode"
                        label="Default Commission Type"
                        value={commissionTypes.defaultCommissionTypeCode}
                        onChange={this.onChange}
                        validationResults={validationResults}
                        options={this.props.lookupCommissionTypes}
                        optionsValue="code"
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
                    onClick={() => this.add()}
                    noLeftMargin={true}
                    visible={this.state.hasUseCase}
                >
                    {`Add Mapping`}
                </Button>

                {this.props.commissionStatementTemplateId && (
                    <Upload
                        name="file"
                        listType="text"
                        className="pull-right"
                        beforeUpload={this.onBeforeFileUpload}
                        onChange={this.onFileUpload}
                        action={`${statementTemplatesApi}/${
                            this.props.commissionStatementTemplateId
                            }/excel/uniqueCommissionTypes`}
                        headers={{
                            Authorization: "Bearer " + this.props.token,
                        }}
                        showUploadList={false}
                        disabled={
                            !this.state.hasUseCase ||
                            this.state.syncingCommissionTypes
                        }
                    >
                        <Button loading={this.state.syncingCommissionTypes}>
                            {!this.state.syncingCommissionTypes && (
                                <Icon type="upload" />
                            )}
                            Sync Commission Types
                        </Button>
                    </Upload>
                )}

                <List
                    bordered
                    className="mt-1"
                    dataSource={commissionTypes.types}
                    renderItem={(type: CommissionType, index: any) => (
                        <List.Item
                            key={index}
                            actions={[this.getActions(type, index)]}
                        >
                            <Form
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
                                    width="320px"
                                />
                                <FormItemIcon type="arrow-right" />
                                <FormSelect
                                    fieldName="commissionTypeCode"
                                    validationFieldName={`types[${index}].commissionTypeCode`}
                                    label="Type"
                                    value={type.commissionTypeCode}
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
    }
}

const mapStateToProps = (state: RootState) => {
    const fieldNamesState = commissionStatementTemplateFieldNamesSelector(
        state
    );
    const lookupCommissionTypesState = commissionTypesSelector(state);
    const tokenState = tokenSelector(state);

    return {
        token: tokenState.token,
        lookupCommissionTypes: lookupCommissionTypesState.items,
        fieldNames: fieldNamesState.items,
        useCases: useCaseSelector(state),
    };
};

export default connect(mapStateToProps)(CommissionTypesForm);
