import { Badge, Col, Row, Select } from 'antd';
import update from 'immutability-helper';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ApiOnFailure, ApiOnSuccess } from '@/app/types';
import { getValidationSubSet, ValidationResult } from '@/app/validation';
import { CommissionStatementTemplateEdit, Sheet, SheetConfig } from '@/state/app/commission/templates';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Form, FormInput, FormSelect, TabPane, Tabs } from '@/ui/controls';

import RawConfig from './sheet/config/RawConfig';
import EditSheetConfig from './sheet/EditSheetConfig';
import SheetList from './sheet/SheetList';

type TabKey =
    | "details"
    | "sheets"
    | "sheet_config"
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
    selectedSheetIndex: number;
};

class TemplateForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            template: props.template,
            activeTab: "details",
            selectedSheetIndex: 0,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.template != prevProps.template)
            this.setState({
                template: this.props.template,
                activeTab: "details",
                selectedSheetIndex: 0,
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

    onSheetsChange = (sheets: Sheet[]) => {
        const template = {
            ...this.state.template,
            config: {
                sheets: sheets
            }
        }
        this.setTemplateState(template);

        this.setState({
            selectedSheetIndex: 0,
        });
    };

    getConfigTabTitle = () => {
        return this.getTabTitle("Config", "config");
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

    onSelectSheetChange = (index: number) => {
        this.setState({
            selectedSheetIndex: index,
        });
    };

    onSheetConfigChange = (sheetConfig: SheetConfig) => {

        const sheet: Sheet = {
            ...this.state.template.config.sheets[this.state.selectedSheetIndex],
            config: sheetConfig
        };

        const sheets = update(this.state.template.config.sheets, {
            [this.state.selectedSheetIndex]: {
                $set: sheet,
            },
        });

        const config = {
            ...this.state.template.config,
            sheets: sheets
        }

        this.handleChange("config", config);
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
                <TabPane tab="Details" key="details">
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
                    tab="Sheets"
                    key="sheets"
                >
                    <SheetList
                        sheets={template.config.sheets}
                        onChange={this.onSheetsChange}
                    />
                </TabPane>
                <TabPane
                    tab={this.getConfigTabTitle()}
                    key="sheet_config"
                >
                    {/* <Row type="flex" justify="center">
                        <Col>
                            <Select style={{ width: 150 }} onChange={this.onSelectSheetChange} value={this.state.selectedSheetIndex}>
                                {template.config.sheets.map((s, index) => {
                                    return <Select.Option value={index}>{`Sheet ${s.position}`}</Select.Option>
                                })}
                            </Select>
                        </Col>
                    </Row> */}


                    <EditSheetConfig
                        config={template.config.sheets[this.state.selectedSheetIndex].config}
                        template={template}
                        selectedSheetIndex={this.state.selectedSheetIndex}
                        onSelectSheetChange={this.onSelectSheetChange}
                        validationResults={getValidationSubSet(
                            `config.sheets[${this.state.selectedSheetIndex}].config`,
                            validationResults
                        )}
                        onChange={this.onSheetConfigChange}
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
