import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Split } from "@/state/commission/splitRules";
import { brokersSelector, UserSimple } from "@/state/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormField, FormInputNumber, FormSelect } from "@/ui/controls";

type Props = {
    split: Split;
    users: UserSimple[];
    onSave: (split: Split) => void;
    onCancel: () => void;
};

type State = {
    split: Split;
};

class SplitForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            split: props.split,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.split != prevProps.split)
            this.setState({
                split: this.props.split,
            });
    }

    handleChange = (fieldName: keyof Split, value: number | string | undefined) => {
        const split = update(this.state.split, { [fieldName]: { $set: value } });
        this.setState({
            split: split,
        });
    };

    render() {
        const { split } = this.state;

        return (
            <Form className="my-1" layout="inline" editUseCase="com_edit_commission_split_rules">
                <FormSelect<string>
                    defaultActiveFirstOption={true}
                    fieldName="userId"
                    label="User"
                    value={split.userId}
                    onChange={this.handleChange}
                    options={this.props.users}
                    optionsValue="id"
                    optionsText="fullName"
                    autoFocus={true}
                />
                <FormInputNumber
                    fieldName="percentage"
                    label="Percentage"
                    value={split.percentage}
                    onChange={this.handleChange}
                    min={0}
                    max={100}
                    precision={0}
                />
                <FormField className="mr-0">
                    <Button onClick={() => this.props.onCancel()}>Cancel</Button>
                </FormField>
                <FormField>
                    <Button
                        onClick={() => this.props.onSave(this.state.split)}
                        type="primary"
                        disabled={
                            !split.userId ||
                            !split.percentage ||
                            split.percentage < 1 ||
                            split.percentage > 100
                        }
                    >
                        Add Split
                    </Button>
                </FormField>
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        users: brokersSelector(state),
    };
};

export default connect(mapStateToProps)(SplitForm);
