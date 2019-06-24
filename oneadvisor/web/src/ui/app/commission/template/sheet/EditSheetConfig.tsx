import { Badge, Select } from 'antd';
import update from 'immutability-helper';
import React, { Component } from 'react';

import { ApiOnFailure, ApiOnSuccess } from '@/app/types';
import { getValidationSubSet, ValidationResult } from '@/app/validation';
import {
    CommissionStatementTemplateEdit, CommissionTypes, Field, HeaderIdentifier, SheetConfig
} from '@/state/app/commission/templates';
import { TabPane, Tabs } from '@/ui/controls';

import CommissionTypesForm from './config/CommissionTypesForm';
import FieldsForm from './config/FieldsForm';
import HeaderIdentifierForm from './config/HeaderIdentifierForm';

type TabKey =
    | "config_header_identifier"
    | "config_fields"
    | "config_commission_types";

type Props = {
    config: SheetConfig;
    template: CommissionStatementTemplateEdit;
    onSelectSheetChange: (index: number) => void;
    selectedSheetIndex: number;
    validationResults: ValidationResult[];
    onChange: (config: SheetConfig) => void;
    saveTemplate: (
        onSuccess?: ApiOnSuccess,
        onFailure?: ApiOnFailure,
        disableSuccessMessage?: boolean
    ) => void;
};

type State = {
    config: SheetConfig;
    activeTab: TabKey;
};

class EditSheetConfig extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            config: props.config,
            activeTab: "config_header_identifier",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.config != prevProps.config)
            this.setState({
                config: this.props.config,
            });
    }

    setConfigState = (config: SheetConfig) => {
        this.setState({
            config: config,
        });
        this.props.onChange(config);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    onHeaderIdentifierChange = (headerIdentifier: HeaderIdentifier) => {
        const config = update(this.state.config, {
            headerIdentifier: {
                $set: headerIdentifier,
            },
        });
        this.setConfigState(config);
    };

    onFieldsChange = (fields: Field[]) => {
        const config = update(this.state.config, {
            fields: {
                $set: fields,
            },
        });
        this.setConfigState(config);
    };

    onCommissionTypesChange = (commissionTypes: CommissionTypes) => {
        const config = update(this.state.config, {
            commissionTypes: {
                $set: commissionTypes,
            },
        });
        this.setConfigState(config);
    };

    getHeaderIdentifierTabTitle = () => {
        return this.getTabTitle("Header Identifier", "headerIdentifier");
    };

    getFieldsTabTitle = () => {
        return this.getTabTitle("Fields", "fields");
    };

    getCommissionTypesTabTitle = () => {
        return this.getTabTitle("Commission Types", "commissionTypes");
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
        const { validationResults, template } = this.props;
        const { config } = this.state;

        const sheetDropdown = (
            <Select style={{ width: 150 }} onChange={this.props.onSelectSheetChange} value={this.props.selectedSheetIndex}>
                {template.config.sheets.map((s, index) => {
                    return <Select.Option value={index}>{`Sheet ${s.position}`}</Select.Option>
                })}
            </Select>
        );

        return (
            <Tabs
                onChange={this.onTabChange}
                activeKey={this.state.activeTab}
                sticky={true}
                tabBarExtraContent={sheetDropdown}
                size="small"
                type="card"
            >
                <TabPane
                    tab={this.getHeaderIdentifierTabTitle()}
                    key="config_header_identifier"
                >
                    <HeaderIdentifierForm
                        headerIdentifier={config.headerIdentifier}
                        validationResults={getValidationSubSet(
                            "headerIdentifier",
                            validationResults
                        )}
                        onChange={this.onHeaderIdentifierChange}
                    />
                </TabPane>
                <TabPane tab={this.getFieldsTabTitle()} key="config_fields">
                    <FieldsForm
                        fields={config.fields}
                        validationResults={getValidationSubSet(
                            "fields",
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
                        commissionStatementTemplateId={this.props.template.id}
                        commissionTypes={config.commissionTypes}
                        validationResults={getValidationSubSet(
                            "commissionTypes",
                            validationResults
                        )}
                        onChange={this.onCommissionTypesChange}
                        saveTemplate={this.props.saveTemplate}
                        selectedSheet={this.props.template.config.sheets[this.props.selectedSheetIndex]}
                    />
                </TabPane>
            </Tabs>
        );
    }
}

export default EditSheetConfig;
