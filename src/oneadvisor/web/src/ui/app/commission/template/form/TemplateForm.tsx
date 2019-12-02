import React, { useState } from "react";

import { TabPane, Tabs } from "@/ui/controls";

import TemplateDetails from "./details/TemplateDetails";
import RawConfig from "./rawConfig/RawConfig";
import SheetList from "./sheetList/SheetList";
import TemplateTabTitle from "./TemplateTabTitle";

const TemplateForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState("details_tab");

    return (
        <Tabs onChange={setActiveTab} activeKey={activeTab} sticky={true}>
            <TabPane tab="Details" key="details_tab">
                <TemplateDetails />
            </TabPane>
            <TabPane
                tab={<TemplateTabTitle title="Sheet" prefix="config.sheets" exactMatch={true} />}
                key="sheets"
            >
                <SheetList />
            </TabPane>
            {/* 
            <TabPane tab={this.getConfigTabTitle()} key="sheet_config">
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
            */}
            <TabPane tab="Raw Config" key="config_raw">
                <RawConfig />
            </TabPane>
        </Tabs>
    );
};

/*

constructor(props: Props) {
        super(props);

        this.state = {
            template: props.template,
            activeTab: "details",
            selectedSheetIndex: 0,
        };
    }

type State = {
    template: CommissionStatementTemplateEdit;
    activeTab: TabKey;
    selectedSheetIndex: number;
};

handleChange = (
    fieldName: keyof CommissionStatementTemplateEdit,
    value: string | Pick<Config, "sheets">
) => {
    const template = update(this.state.template, { [fieldName]: { $set: value } });
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
            sheets: sheets,
        },
    };
    this.setTemplateState(template);

    this.setState({
        selectedSheetIndex: 0,
    });
};

getConfigTabTitle = () => {
    return this.getTabTitle("Config", "config.sheets");
};

getSheetsTabTitle = () => {
    return this.getTabTitle("Sheets", "config.sheets", true);
};

getTabTitle = (title: string, prefix: string, exactMatch = false) => {
    const count = getValidationSubSet(prefix, this.props.validationResults, true, exactMatch)
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
        config: sheetConfig,
    };

    const sheets = update(this.state.template.config.sheets, {
        [this.state.selectedSheetIndex]: {
            $set: sheet,
        },
    });

    const config = {
        ...this.state.template.config,
        sheets: sheets,
    };

    this.handleChange("config", config);
};
*/

export default TemplateForm;
