import { Badge, Icon } from 'antd';
import update from 'immutability-helper';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getValidationSubSet, ValidationResult } from '@/app/validation';
import { CommissionStatementTemplateEdit, DataStart } from '@/state/app/commission/templates';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Form, FormInput, FormSelect, TabPane, Tabs } from '@/ui/controls';

import DataStartForm from './config/DataStartForm';

type TabKey = 'details_tab' | 'config_data_start';

type Props = {
    template: CommissionStatementTemplateEdit;
    validationResults: ValidationResult[];
    onChange: (template: CommissionStatementTemplateEdit) => void;
    companies: Company[];
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
            activeTab: 'details_tab'
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.template != prevProps.template)
            this.setState({
                template: this.props.template
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const template = {
            ...this.state.template,
            [fieldName]: value
        };
        this.setTemplateState(template);
    };

    setTemplateState = (template: CommissionStatementTemplateEdit) => {
        this.setState({
            template: template
        });
        this.props.onChange(template);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    onDataStartChange = (dataStart: DataStart) => {
        const template = update(this.state.template, {
            config: {
                dataStart: {
                    $set: dataStart
                }
            }
        });
        this.setTemplateState(template);
    };

    getDataStartTabTitle = () => {
        return this.getTabTitle('Data Start', 'config.dataStart');
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
                    tab={this.getDataStartTabTitle()}
                    key="config_data_start"
                >
                    <DataStartForm
                        dataStart={template.config.dataStart}
                        validationResults={getValidationSubSet(
                            'config.dataStart',
                            validationResults
                        )}
                        onChange={this.onDataStartChange}
                    />
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const companiesState = companiesSelector(state);

    return {
        companies: companiesState.items
    };
};

export default connect(mapStateToProps)(TemplateForm);
