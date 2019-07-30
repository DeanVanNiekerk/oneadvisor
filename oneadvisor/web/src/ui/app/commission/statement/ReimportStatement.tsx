import { Alert, Modal } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { reimportCommissions, Statement } from "@/state/app/commission/statements";
import {
    CommissionStatementTemplate, commissionStatementTemplatesSelector, fetchCommissionStatementTemplates
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormSelect } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

const confirm = Modal.confirm;

type Props = {
    templates: CommissionStatementTemplate[];
    onSuccess: () => void;
    statement: Statement;
    fetchingTemplates: boolean;
    companyId: string;
} & DispatchProp;

type State = {
    loading: boolean;
    templateId: string | undefined;
    reimportingCommissionEntries: boolean;
};

class ReimportStatement extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            reimportingCommissionEntries: false,
            templateId: undefined,
        };
    }

    componentDidMount() {
        this.loadTemplates();
    }

    loadTemplates = () => {
        const filters = {
            date: [this.props.statement.date],
            companyId: [this.props.companyId],
        };
        this.props.dispatch(fetchCommissionStatementTemplates(filters));
    };

    handleTemplateChange = async (fieldName: string, value: any) => {
        this.setState({
            templateId: value,
        });
    };

    reimportCommissions = () => {
        if (!this.state.templateId) return;

        confirm({
            title: "Are you sure you want to reimport all commission entries?",
            content:
                "All existing commission entries including any errors will be deleted before import, are you sure you wish to continue?",
            onOk: () => {
                if (!this.state.templateId) return;
                showMessage("loading", "Reimporting commission entries", 60);
                this.setState({ reimportingCommissionEntries: true });
                this.props.dispatch(
                    reimportCommissions(
                        this.props.statement.id,
                        this.state.templateId,
                        //Success
                        () => {
                            this.setState({ reimportingCommissionEntries: false });
                            showMessage("success", "Commission entries successfully imported", 5, true);
                            this.props.onSuccess();
                        },
                        //Failure
                        () => {
                            this.setState({ reimportingCommissionEntries: false });
                            showMessage("error", "Error importing commission entries", 5, true);
                        }
                    )
                );
            },
        });
    };

    render() {
        let uploadForm = (
            <Form editUseCase="com_import_commissions">
                <FormSelect
                    fieldName="templateId"
                    label="Template"
                    value={this.state.templateId}
                    onChange={this.handleTemplateChange}
                    options={this.props.templates}
                    optionsValue="id"
                    optionsText="name"
                    loading={this.props.fetchingTemplates}
                    placeholder="Select Template"
                />
                <Button
                    type="primary"
                    onClick={this.reimportCommissions}
                    disabled={!this.state.templateId || this.state.reimportingCommissionEntries}
                    className="pull-right"
                >
                    Reimport
                </Button>
            </Form>
        );

        if (!this.props.fetchingTemplates && !this.state.loading && this.props.templates.length === 0)
            uploadForm = (
                <Alert message="Unable to import. There are no valid templates for this statement." type="error" />
            );

        return uploadForm;
    }
}

const mapStateToProps = (state: RootState) => {
    const templatesState = commissionStatementTemplatesSelector(state);

    return {
        fetchingTemplates: templatesState.fetching,
        templates: templatesState.items,
    };
};

export default connect(mapStateToProps)(ReimportStatement);
