import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import {
    AllocationEdit,
    allocationSelector,
    insertAllocation,
    receiveAllocation,
    updateAllocation,
} from "@/state/commission/allocations";
import { RootState } from "@/state/rootReducer";
import { Button, ClientName, ContentLoader, Drawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import AllocationForm from "./AllocationForm";

type Props = {
    onClose: (cancelled: boolean) => void;
    allocation: AllocationEdit | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    allocationEdited: AllocationEdit | null;
};
class EditAllocation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            allocationEdited: props.allocation,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.allocation != prevProps.allocation) {
            this.setState({
                allocationEdited: this.props.allocation,
            });
        }
    }

    close = (cancelled = false) => {
        this.props.dispatch(receiveAllocation(null));
        this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.allocation, this.state.allocationEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.allocationEdited) {
            this.close();
            return;
        }

        if (this.state.allocationEdited.id) {
            this.props.dispatch(updateAllocation(this.state.allocationEdited, () => this.close()));
        } else {
            this.props.dispatch(insertAllocation(this.state.allocationEdited, () => this.close()));
        }
    };

    onChange = (allocation: AllocationEdit) => {
        this.setState({
            allocationEdited: allocation,
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading Allocation";

        const { allocation } = this.props;

        let prefix = "New Allocation to ";
        if (allocation && allocation.id) prefix = "Edit Allocation to ";

        return (
            <ClientName
                prefix={prefix}
                clientId={this.props.allocation ? this.props.allocation.toClientId : ""}
            />
        );
    };

    render() {
        const { allocation, fetching, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                iconName="share-alt"
                visible={!!allocation || fetching}
                onClose={this.confirmCancel}
                noTopPadding={true}
                footer={
                    <React.Fragment>
                        <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.save}
                            type="primary"
                            disabled={this.isLoading()}
                            requiredUseCase="com_edit_commission_allocations"
                        >
                            Save
                        </Button>
                    </React.Fragment>
                }
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {allocation && (
                        <AllocationForm
                            allocation={allocation}
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
    const allocationState = allocationSelector(state);

    return {
        allocation: allocationState.allocation,
        fetching: allocationState.fetching,
        updating: allocationState.updating,
        validationResults: allocationState.validationResults,
    };
};

export default connect(mapStateToProps)(EditAllocation);
