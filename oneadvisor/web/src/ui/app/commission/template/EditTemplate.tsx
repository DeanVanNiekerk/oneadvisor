import { Dropdown, Icon, Menu } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { ApiOnFailure, ApiOnSuccess } from "@/app/types";
import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import {
    CommissionStatementTemplateEdit, commissionStatementTemplateSelector, insertCommissionStatementTemplate,
    receiveCommissionStatementTemplate, updateCommissionStatementTemplate
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Drawer, DrawerFooter, DropdownButton } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";
import { showMessage } from "@/ui/feedback/notifcation";

import TemplateForm from "./TemplateForm";

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    template: CommissionStatementTemplateEdit | null;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    templateEdited: CommissionStatementTemplateEdit | null;
};

class EditTemplate extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            templateEdited: props.template,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.template != prevProps.template) {
            this.setState({
                templateEdited: this.props.template,
            });
        }
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.template, this.state.templateEdited)) return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = (
        updateUnknownCommissionTypes: boolean,
        onSuccess?: ApiOnSuccess,
        onFailure?: ApiOnFailure,
        disableSuccessMessage?: boolean
    ) => {
        if (!this.state.templateEdited) {
            //this.close();
            return;
        }

        if (this.state.templateEdited.id) {
            this.props.dispatch(
                updateCommissionStatementTemplate(
                    this.state.templateEdited,
                    updateUnknownCommissionTypes,
                    (result, dispatch) => {
                        if (!disableSuccessMessage) {
                            showMessage("success", "Template Successfully Saved", 3);
                        }
                        this.props.dispatch(receiveCommissionStatementTemplate(this.state.templateEdited));
                        if (onSuccess) onSuccess(result, dispatch);
                    },
                    onFailure
                )
            );
        } else {
            this.props.dispatch(
                insertCommissionStatementTemplate(
                    this.state.templateEdited,
                    (result, dispatch) => {
                        this.close();
                        if (onSuccess) onSuccess(result, dispatch);
                    },
                    onFailure
                )
            );
        }
    };

    onChange = (template: CommissionStatementTemplateEdit) => {
        this.setState({
            templateEdited: template,
        });
    };

    isLoading = () => {
        return this.props.updating;
    };

    getTitle = () => {
        const { template } = this.props;

        if (template && template.id) return `Template: ${template.name}`;

        return "New Template";
    };

    handleMenuClick = e => {
        console.log("click", e);
    };

    render() {
        const { template, validationResults, visible } = this.props;

        const menu = (
            <Menu>
                <Menu.Item key="save_and_update" onClick={() => this.save(true)}>
                    <Icon type="tool" />
                    Save {"&"} Update Unknown Commission Types
                </Menu.Item>
            </Menu>
        );

        return (
            <Drawer
                title={this.getTitle()}
                icon="block"
                visible={visible}
                onClose={this.confirmCancel}
                noTopPadding={true}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {template && (
                        <TemplateForm
                            template={template}
                            validationResults={validationResults}
                            onChange={this.onChange}
                            saveTemplate={(
                                onSuccess?: ApiOnSuccess,
                                onFailure?: ApiOnFailure,
                                disableSuccessMessage?: boolean
                            ) => this.save(false, onSuccess, onFailure, disableSuccessMessage)}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
                        Close
                    </Button>

                    <DropdownButton
                        type="primary"
                        overlay={menu}
                        icon={<Icon type="down" />}
                        onClick={() => this.save(false)}
                        requiredUseCase="com_edit_commission_statement_templates"
                    >
                        Save
                    </DropdownButton>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const templateState = commissionStatementTemplateSelector(state);

    return {
        template: templateState.template,
        updating: templateState.updating || templateState.fetching,
        validationResults: templateState.validationResults,
    };
};

export default connect(mapStateToProps)(EditTemplate);
