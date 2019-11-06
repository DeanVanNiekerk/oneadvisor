import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import {
    insertSplitRule,
    receiveSplitRule,
    SplitRule,
    splitRuleSelector,
    updateSplitRule,
} from "@/state/app/commission/splitRules";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Drawer, DrawerFooter } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import SplitRuleForm from "./SplitRuleForm";

type Props = {
    onClose: (cancelled: boolean) => void;
    splitRule: SplitRule | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    splitRuleEdited: SplitRule | null;
};
class EditSplitRule extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            splitRuleEdited: props.splitRule,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.splitRule != prevProps.splitRule) {
            this.setState({
                splitRuleEdited: this.props.splitRule,
            });
        }
    }

    close = (cancelled: boolean = false) => {
        this.props.dispatch(receiveSplitRule(null));
        this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.splitRule, this.state.splitRuleEdited)) return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.splitRuleEdited) {
            this.close();
            return;
        }

        if (this.state.splitRuleEdited.id) {
            this.props.dispatch(updateSplitRule(this.state.splitRuleEdited, () => this.close()));
        } else {
            this.props.dispatch(insertSplitRule(this.state.splitRuleEdited, () => this.close()));
        }
    };

    onChange = (splitRule: SplitRule) => {
        this.setState({
            splitRuleEdited: splitRule,
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading Commission Split Rule";

        const { splitRule } = this.props;

        if (splitRule && splitRule.id) return "Edit Commission Split Rule";

        return "New Commission Split Rule";
    };

    render() {
        const { splitRule, fetching, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                icon="apartment"
                visible={!!splitRule || fetching}
                onClose={this.confirmCancel}
                noTopPadding={true}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {splitRule && (
                        <SplitRuleForm
                            splitRule={splitRule}
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
                        requiredUseCase="com_edit_commission_split_rules"
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const splitRuleState = splitRuleSelector(state);

    return {
        splitRule: splitRuleState.splitRule,
        fetching: splitRuleState.fetching,
        updating: splitRuleState.updating,
        validationResults: splitRuleState.validationResults,
    };
};

export default connect(mapStateToProps)(EditSplitRule);
