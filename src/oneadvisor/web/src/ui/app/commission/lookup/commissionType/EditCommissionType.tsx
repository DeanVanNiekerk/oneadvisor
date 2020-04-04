import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import { RootState } from "@/state";
import {
    CommissionTypeEdit,
    commissionTypeSelector,
    insertCommissionType,
    updateCommissionType,
} from "@/state/commission/lookups";
import { Button, ContentLoader, Drawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import CommissionTypeForm from "./CommissionTypeForm";

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    commissionType: CommissionTypeEdit | null;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    commissionTypeEdited: CommissionTypeEdit | null;
};

class EditCommissionType extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commissionTypeEdited: props.commissionType,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commissionType != prevProps.commissionType)
            this.setState({
                commissionTypeEdited: this.props.commissionType,
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.commissionType, this.state.commissionTypeEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (!this.state.commissionTypeEdited) {
            this.close();
            return;
        }

        if (this.state.commissionTypeEdited.id) {
            this.props.dispatch(updateCommissionType(this.state.commissionTypeEdited, this.close));
        } else {
            this.props.dispatch(insertCommissionType(this.state.commissionTypeEdited, this.close));
        }
    };

    onChange = (commissionType: CommissionTypeEdit) => {
        this.setState({
            commissionTypeEdited: commissionType,
        });
    };

    isLoading = () => {
        return this.props.updating;
    };

    getTitle = () => {
        const { commissionType } = this.props;

        if (commissionType && commissionType.id) return `Commission Type: ${commissionType.name}`;

        return "New Commission Type";
    };

    render() {
        const { commissionType, validationResults, visible } = this.props;

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
                    {commissionType && (
                        <CommissionTypeForm
                            commissionType={commissionType}
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
    const commissionTypeState = commissionTypeSelector(state);

    return {
        commissionType: commissionTypeState.commissionType,
        updating: commissionTypeState.updating,
        validationResults: commissionTypeState.validationResults,
    };
};

export default connect(mapStateToProps)(EditCommissionType);
