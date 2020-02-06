import update from "immutability-helper";
import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

import { ValidationResult } from "@/app/validation";
import { ChangeLogEdit } from "@/state/app/directory/changeLogs";
import { Form, FormDate, FormInput, FormSwitch, FormTextArea, TabPane, Tabs } from "@/ui/controls";

type TabKey = "details_tab" | "preview_tab";

type Props = {
    changeLog: ChangeLogEdit;
    validationResults: ValidationResult[];
    onChange: (changeLog: ChangeLogEdit) => void;
};

type State = {
    changeLog: ChangeLogEdit;
    activeTab: TabKey;
};

class ChangeLogForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            changeLog: props.changeLog,
            activeTab: "details_tab",
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.changeLog != prevProps.changeLog)
            this.setState({
                changeLog: this.props.changeLog,
                activeTab: "details_tab", //Reset the tab
            });
    }

    handleChange = (fieldName: keyof ChangeLogEdit, value: string | boolean) => {
        const changeLog = update(this.state.changeLog, { [fieldName]: { $set: value } });
        this.updateState(changeLog);
    };

    updateState = (changeLog: ChangeLogEdit) => {
        this.setState({
            changeLog: changeLog,
        });
        this.props.onChange(changeLog);
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        const { validationResults } = this.props;
        const { changeLog } = this.state;

        return (
            <Tabs
                onChange={this.onTabChange}
                activeKey={this.state.activeTab}
                sticky={true}
                clearTabsTopPadding={true}
            >
                <TabPane tab="Details" key="details_tab">
                    <Form>
                        <FormInput
                            fieldName="versionNumber"
                            label="Version Number"
                            value={changeLog.versionNumber}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                        />
                        <FormDate
                            fieldName="releaseDate"
                            label="Release Date"
                            value={changeLog.releaseDate}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                        />
                        <FormSwitch
                            fieldName="published"
                            label="Published"
                            value={changeLog.published}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                        />
                        <FormTextArea
                            fieldName="log"
                            label="Log"
                            value={changeLog.log}
                            onChange={this.handleChange}
                            validationResults={validationResults}
                            rows={17}
                        />
                    </Form>
                </TabPane>
                <TabPane tab="Preview" key="preview_tab">
                    <ReactMarkdown source={changeLog.log} escapeHtml={false} />
                </TabPane>
            </Tabs>
        );
    }
}

export default ChangeLogForm;
