import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import { insertPolicy, PolicyEdit, policySelector, receivePolicy, updatePolicy } from '@/state/app/member/policies';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import PolicyForm from './PolicyForm';

type Props = {
    onClose: (cancelled: boolean) => void;
    policy: PolicyEdit | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    policyEdited: PolicyEdit | null;
};
class EditPolicy extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policyEdited: props.policy
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policy != prevProps.policy) {
            this.setState({
                policyEdited: this.props.policy
            });
        }
    }

    close = (cancelled: boolean = false) => {
        this.props.dispatch(receivePolicy(null));
        this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.policy, this.state.policyEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.policyEdited) {
            this.close();
            return;
        }

        if (this.state.policyEdited.id) {
            this.props.dispatch(
                updatePolicy(this.state.policyEdited, () => this.close())
            );
        } else {
            this.props.dispatch(
                insertPolicy(this.state.policyEdited, () => this.close())
            );
        }
    };

    onChange = (policy: PolicyEdit) => {
        this.setState({
            policyEdited: policy
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return 'Loading Policy';

        const { policy } = this.props;

        if (policy && policy.id) return `Policy: ${policy.number}`;

        return 'New Policy';
    };

    render() {
        const { policy, fetching, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                visible={!!policy || fetching}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {policy && (
                        <PolicyForm
                            policy={policy}
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
                        requiredUseCase="mem_edit_policies"
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policyState = policySelector(state);

    return {
        policy: policyState.policy,
        fetching: policyState.fetching,
        updating: policyState.updating,
        validationResults: policyState.validationResults
    };
};

export default connect(mapStateToProps)(EditPolicy);
