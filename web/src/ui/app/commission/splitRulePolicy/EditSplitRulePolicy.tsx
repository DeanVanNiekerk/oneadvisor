import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import {
    insertSplitRulePolicy, receiveSplitRulePolicy, SplitRulePolicy, SplitRulePolicyInfo, splitRulePolicySelector,
    updateSplitRulePolicy
} from '@/state/app/commission/splitRulePolicies';
import { fetchSplitRules, SplitRule, splitRulesSelector } from '@/state/app/commission/splitRules';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import SplitRulePolicyForm from './SplitRulePolicyForm';

type Props = {
    onClose: (cancelled: boolean) => void;
    splitRulePolicyInfo: SplitRulePolicyInfo | null;
    splitRulePolicy: SplitRulePolicy | null;
    splitRules: SplitRule[];
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    splitRulePolicyEdited: SplitRulePolicy | null;
};
class EditSplitRulePolicy extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            splitRulePolicyEdited: props.splitRulePolicy,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.splitRulePolicy != prevProps.splitRulePolicy) {
            this.setState({
                splitRulePolicyEdited: this.props.splitRulePolicy,
            });
        }

        if (this.props.splitRulePolicyInfo != null && this.props.splitRulePolicyInfo != prevProps.splitRulePolicyInfo) {
            const filters = {
                userId: [this.props.splitRulePolicyInfo.policyUserId],
            };
            this.props.dispatch(fetchSplitRules(filters));
        }
    }

    close = (cancelled: boolean = false) => {
        this.props.dispatch(receiveSplitRulePolicy(null));
        this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.splitRulePolicy, this.state.splitRulePolicyEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.splitRulePolicyEdited) {
            this.close();
            return;
        }

        if (this.state.splitRulePolicyEdited.id) {
            this.props.dispatch(updateSplitRulePolicy(this.state.splitRulePolicyEdited, () => this.close()));
        } else {
            this.props.dispatch(insertSplitRulePolicy(this.state.splitRulePolicyEdited, () => this.close()));
        }
    };

    onChange = (splitRulePolicy: SplitRulePolicy) => {
        this.setState({
            splitRulePolicyEdited: splitRulePolicy,
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading Commission Split Rule";

        return "Commission Split Rule";
    };

    render() {
        const { splitRulePolicy, fetching, validationResults, splitRules, splitRulePolicyInfo } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                icon="apartment"
                visible={!!splitRulePolicyInfo || fetching}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {splitRulePolicy && splitRulePolicyInfo && (
                        <SplitRulePolicyForm
                            splitRulePolicy={splitRulePolicy}
                            splitRulePolicyInfo={splitRulePolicyInfo}
                            splitRules={splitRules}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
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
    const splitRulePolicyState = splitRulePolicySelector(state);
    const splitRulesState = splitRulesSelector(state);

    return {
        splitRulePolicy: splitRulePolicyState.splitRulePolicy,
        fetching: splitRulePolicyState.fetching || splitRulePolicyState.fetching,
        updating: splitRulePolicyState.updating,
        validationResults: splitRulePolicyState.validationResults,
        splitRules: splitRulesState.items,
    };
};

export default connect(mapStateToProps)(EditSplitRulePolicy);
