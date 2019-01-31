import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import {
    CommissionEdit, commissionSelector, insertCommission, receiveCommission, updateCommission
} from '@/state/app/commission/commissions';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import CommissionForm from './CommissionForm';

type Props = {
    onClose: (cancelled: boolean) => void;
    commission: CommissionEdit | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    commissionEdited: CommissionEdit | null;
};
class EditCommission extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commissionEdited: props.commission
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commission != prevProps.commission) {
            this.setState({
                commissionEdited: this.props.commission
            });
        }
    }

    close = (cancelled: boolean = false) => {
        this.props.dispatch(receiveCommission(null));
        this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (this.props.commission != this.state.commissionEdited)
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.commissionEdited) {
            this.close();
            return;
        }

        if (this.state.commissionEdited.id) {
            this.props.dispatch(
                updateCommission(this.state.commissionEdited, () =>
                    this.close()
                )
            );
        } else {
            this.props.dispatch(
                insertCommission(this.state.commissionEdited, () =>
                    this.close()
                )
            );
        }
    };

    onChange = (commission: CommissionEdit) => {
        this.setState({
            commissionEdited: commission
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return 'Loading Commission';

        const { commission } = this.props;

        if (commission && commission.id) return `Edit Commission`;

        return 'New Commission';
    };

    render() {
        const { commission, fetching, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                visible={!!commission || fetching}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {commission && (
                        <CommissionForm
                            commission={commission}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button
                        onClick={this.confirmCancel}
                        disabled={this.isLoading()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.save}
                        type="primary"
                        disabled={this.isLoading()}
                        requiredUseCase="com_edit_commissions"
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionState = commissionSelector(state);

    return {
        commission: commissionState.commission,
        fetching: commissionState.fetching,
        updating: commissionState.updating,
        validationResults: commissionState.validationResults
    };
};

export default connect(mapStateToProps)(EditCommission);
