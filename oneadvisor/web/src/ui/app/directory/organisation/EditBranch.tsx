import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { ValidationResult } from "@/app/validation";
import { Branch, branchSelector, insertBranch, receiveBranch, updateBranch } from "@/state/app/directory/branches";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Form, FormField } from "@/ui/controls";

import BranchForm from "./BranchForm";

type Props = {
    branch: Branch | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
    organisationId: string;
    onSave: () => void;
} & DispatchProp;

class EditBranch extends Component<Props> {
    save = (branch: Branch) => {
        if (branch.id) {
            this.props.dispatch(updateBranch(branch, this.props.onSave));
        } else {
            this.props.dispatch(insertBranch(branch, this.props.onSave));
        }
    };

    cancel = () => {
        this.props.dispatch(receiveBranch(null));
    };

    newBranch = () => {
        this.props.dispatch(
            receiveBranch({
                id: "",
                organisationId: this.props.organisationId,
                name: "",
            })
        );
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    render() {
        const { branch, validationResults } = this.props;

        return (
            <ContentLoader isLoading={this.isLoading()}>
                {branch && (
                    <BranchForm
                        branch={branch}
                        validationResults={validationResults}
                        onSave={this.save}
                        onCancel={this.cancel}
                    />
                )}
                {!branch && (
                    <Form layout="inline">
                        <FormField>
                            <Button
                                icon="plus"
                                type="dashed"
                                onClick={this.newBranch}
                                noLeftMargin={true}
                                requiredUseCase="dir_edit_branches"
                            >
                                Add Branch
                            </Button>
                        </FormField>
                    </Form>
                )}
            </ContentLoader>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const branchState = branchSelector(state);

    return {
        branch: branchState.branch,
        fetching: branchState.fetching,
        updating: branchState.updating,
        validationResults: branchState.validationResults,
    };
};

export default connect(mapStateToProps)(EditBranch);
