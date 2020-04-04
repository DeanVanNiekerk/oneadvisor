import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import { RootState } from "@/state";
import {
    insertPolicyProductType,
    PolicyProductTypeEdit,
    policyProductTypeSelector,
    updatePolicyProductType,
} from "@/state/client/lookups";
import { Button, ContentLoader, Drawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import PolicyProductTypeForm from "./PolicyProductTypeForm";

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    policyProductType: PolicyProductTypeEdit | null;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    policyProductTypeEdited: PolicyProductTypeEdit | null;
};

class EditPolicyProductType extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policyProductTypeEdited: props.policyProductType,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policyProductType != prevProps.policyProductType)
            this.setState({
                policyProductTypeEdited: this.props.policyProductType,
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.policyProductType, this.state.policyProductTypeEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (!this.state.policyProductTypeEdited) {
            this.close();
            return;
        }

        if (this.state.policyProductTypeEdited.id) {
            this.props.dispatch(
                updatePolicyProductType(this.state.policyProductTypeEdited, this.close)
            );
        } else {
            this.props.dispatch(
                insertPolicyProductType(this.state.policyProductTypeEdited, this.close)
            );
        }
    };

    onChange = (policyProductType: PolicyProductTypeEdit) => {
        this.setState({
            policyProductTypeEdited: policyProductType,
        });
    };

    isLoading = () => {
        return this.props.updating;
    };

    getTitle = () => {
        const { policyProductType } = this.props;

        if (policyProductType && policyProductType.id)
            return `Policy Product Type: ${policyProductType.name}`;

        return "New Policy Product Type";
    };

    render() {
        const { policyProductType, validationResults, visible } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                iconName="database"
                visible={visible}
                onClose={this.confirmCancel}
                footer={
                    <React.Fragment>
                        <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
                            Cancel
                        </Button>
                        <Button onClick={this.save} type="primary" disabled={this.isLoading()}>
                            Save
                        </Button>
                    </React.Fragment>
                }
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {policyProductType && (
                        <PolicyProductTypeForm
                            policyProductType={policyProductType}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policyProductTypeState = policyProductTypeSelector(state);

    return {
        policyProductType: policyProductTypeState.policyProductType,
        updating: policyProductTypeState.updating,
        validationResults: policyProductTypeState.validationResults,
    };
};

export default connect(mapStateToProps)(EditPolicyProductType);
