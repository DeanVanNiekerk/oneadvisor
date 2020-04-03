import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
    BranchEdit,
    branchIsLoadingSelector,
    branchSelector,
    branchVisible,
    receiveBranch,
} from "@/state/directory/branches";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Form, FormField } from "@/ui/controls";

import BranchForm from "./BranchForm";

type Props = {
    organisationId: string;
    onSaved?: (contact: BranchEdit) => void;
} & PropsFromState &
    PropsFromDispatch;

const EditBranch: React.FC<Props> = (props: Props) => {
    return (
        <ContentLoader isLoading={props.loading}>
            {props.visible && <BranchForm onSaved={props.onSaved} />}
            {!props.visible && (
                <Form layout="inline">
                    <FormField>
                        <Button
                            iconName="plus"
                            type="dashed"
                            onClick={() => props.newBranch(props.organisationId)}
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
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const branchState = branchSelector(state);
    return {
        loading: branchIsLoadingSelector(state),
        visible: branchState.visible,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        newBranch: (organisationId: string) => {
            dispatch(
                receiveBranch({
                    id: null,
                    name: "",
                    organisationId: organisationId,
                })
            );
            dispatch(branchVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBranch);
