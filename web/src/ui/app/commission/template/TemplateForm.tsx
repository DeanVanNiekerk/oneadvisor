import { Badge, Icon } from 'antd';
import update from 'immutability-helper';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ApiOnFailure, ApiOnSuccess } from '@/app/types';
import { getValidationSubSet, ValidationResult } from '@/app/validation';
import {
    CommissionStatementTemplateEdit, CommissionTypes, Field, HeaderIdentifier
} from '@/state/app/commission/templates';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Form, FormInput, FormSelect, TabPane, Tabs } from '@/ui/controls';

import CommissionTypesForm from './config/CommissionTypesForm';
import FieldsForm from './config/FieldsForm';
import HeaderIdentifierForm from './config/HeaderIdentifierForm';
import RawConfig from './config/RawConfig';

type TabKey =
    | "details_tab"
    | "config_header_identifier"
    | "config_fields"
    | "config_commission_types"
    | "config_raw";

type Props = {
    template: CommissionStatementTemplateEdit;
    validationResults: ValidationResult[];
    onChange: (template: CommissionStatementTemplateEdit) => void;
    companies: Company[];
    saveTemplate: (
        onSuccess?: ApiOnSuccess,
        onFailure?: ApiOnFailure,
        disableSuccessMessage?: boolean
    ) => void;
};

type State = {
    template: CommissionStatementTemplateEdit;
    activeTab: TabKey;
};

class TemplateForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            template: props.template,
            activeTab: "details_tab",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.template != prevProps.template)
            this.setState({
                template: this.props.template,
            });
    }

    handleChange = (
        fieldName: keyof CommissionStatementTemplateEdit,
        value: any
    ) => {
        const template = {
            ...this.state.template,
            [fieldName]: value,
        };
        this.setTemplateState(template);
    };

    setTemplateState = (template: CommissionStatementTemplateEdit) => {
        this.setState({
            template: template,
        });
        this.props.onChange(template);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    onHeaderIdentifierChange = (headerIdentifier: HeaderIdentifier) => {
        const template = update(this.state.template, {
            config: {
                headerIdentifier: {
                    $set: headerIdentifier,
                },
            },
        });
        this.setTemplateState(template);
    };

    onFieldsChange = (fields: Field[]) => {
        const template = update(this.state.template, {
            config: {
                fields: {
                    $set: fields,
                },
            },
        });
        this.setTemplateState(template);
    };

    onCommissionTypesChange = (commissionTypes: CommissionTypes) => {
        const template = update(this.state.template, {
            config: {
                commissionTypes: {
                    $set: commissionTypes,
                },
            },
        });
        this.setTemplateState(template);
    };

    getHeaderIdentifierTabTitle = () => {
        return this.getTabTitle("Header Identifier", "config.headerIdentifier");
    };

    getFieldsTabTitle = () => {
        return this.getTabTitle("Fields", "config.fields");
    };

    getCommissionTypesTabTitle = () => {
        return this.getTabTitle("Commission Types", "config.commissionTypes");
    };

    getTabTitle = (title: string, prefix: string) => {
        const count = getValidationSubSet(prefix, this.props.validationResults)
            .length;
        return (
            <Badge count={count} offset={[10, -2]}>
                {title}
            </Badge>
        );
    };

    render() {
        const { validationResults } = this.props;
        const { template } = this.state;

        return (
            <Tabs
                onChange={this.onTabChange}
                activeKey={this.state.activeTab}
                sticky={true}
            >
                <TabPane tab="Details" key="details_tab">
                    <Form editUseCase="com_edit_commission_statement_templates">
                        <FormInput
                            fieldName="name"
                            label="Name"
                            value={template.name}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            autoFocus={true}
                        />
                        <FormSelect
                            fieldName="companyId"
                            label="Company"
                            value={template.companyId}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            options={this.props.companies}
                            optionsValue="id"
                            optionsText="name"
                        />
                    </Form>
                </TabPane>
                <TabPane
                    tab={this.getHeaderIdentifierTabTitle()}
                    key="config_header_identifier"
                >
                    <HeaderIdentifierForm
                        headerIdentifier={template.config.headerIdentifier}
                        validationResults={getValidationSubSet(
                            "config.headerIdentifier",
                            validationResults
                        )}
                        onChange={this.onHeaderIdentifierChange}
                    />
                </TabPane>
                <TabPane tab={this.getFieldsTabTitle()} key="config_fields">
                    <FieldsForm
                        fields={template.config.fields}
                        validationResults={getValidationSubSet(
                            "config.fields",
                            validationResults,
                            true
                        )}
                        onChange={this.onFieldsChange}
                    />
                </TabPane>
                <TabPane
                    tab={this.getCommissionTypesTabTitle()}
                    key="config_commission_types"
                >
                    <CommissionTypesForm
                        template={template}
                        commissionTypes={template.config.commissionTypes}
                        validationResults={getValidationSubSet(
                            "config.commissionTypes",
                            validationResults
                        )}
                        onChange={this.onCommissionTypesChange}
                        saveTemplate={this.props.saveTemplate}
                    />
                </TabPane>
                <TabPane tab="Raw Config" key="config_raw">
                    <RawConfig template={template} />
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);

    return {
        companies: companiesState.items,
    };
};

export default connect(mapStateToProps)(TemplateForm);
