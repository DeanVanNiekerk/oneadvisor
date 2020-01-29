import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    Branch,
    branchSelector,
    branchVisible,
    confirmCancelBranch,
    modifyBranch,
    saveBranch,
} from "@/state/app/directory/branches";
import { fetchBranchesSimple } from "@/state/app/directory/branchesSimple";
import { RootState } from "@/state/rootReducer";
import { Button, Form, FormField, FormInput } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

type Props = {
    onSaved?: (branch: Branch) => void;
} & PropsFromState &
    PropsFromDispatch;

const BranchForm: React.FC<Props> = (props: Props) => {
    const { branch, validationResults } = props;

    if (!branch) return <React.Fragment />;

    const close = () => props.setVisible(false);

    const onChange = (fieldName: keyof Branch, value: string) => {
        props.handleChange(branch, fieldName, value);
    };

    return (
        <Form layout="inline">
            <FormInput
                fieldName="name"
                label="Name"
                value={branch.name}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
            <FormField className="mr-0">
                <Button
                    onClick={() => {
                        props.confirmCancel(close);
                    }}
                >
                    Cancel
                </Button>
            </FormField>
            <FormField>
                <Button
                    onClick={() => {
                        props.saveBranch(props.onSaved);
                    }}
                    type="primary"
                >
                    {branch.id ? "Update Branch" : "Add Branch"}
                </Button>
            </FormField>
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const branchState = branchSelector(state);
    return {
        branch: branchState.branch,
        validationResults: branchState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (branch: Branch, fieldName: keyof Branch, value: string) => {
            const branchModified = update(branch, { [fieldName]: { $set: value } });
            dispatch(modifyBranch(branchModified));
        },
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelBranch(showConfirm, onCancelled));
        },
        saveBranch: (onSaved?: (branch: Branch) => void) => {
            dispatch(
                saveBranch((branchSaved: Branch) => {
                    if (onSaved) onSaved(branchSaved);
                    dispatch(branchVisible(false));
                    dispatch(fetchBranchesSimple());
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(branchVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BranchForm);
