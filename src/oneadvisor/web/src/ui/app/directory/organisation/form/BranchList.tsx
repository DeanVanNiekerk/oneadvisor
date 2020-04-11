import { List } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { hasUseCase } from "@/app/identity";
import { RootState } from "@/state";
import { useCaseSelector } from "@/state/auth";
import {
    Branch,
    branchesSelector,
    branchVisible,
    clearBranch,
    fetchBranch,
    fetchBranches,
} from "@/state/directory/branches";
import { organisationIdSelector } from "@/state/directory/organisations";

import EditBranch from "./EditBranch";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const BranchList: React.FC<Props> = (props) => {
    useEffect(() => {
        if (props.organisationId) props.fetchBranches(props.organisationId);
    }, [props.organisationId]);

    const onSaved = () => {
        if (props.onSaved) props.onSaved();
        if (props.organisationId) props.fetchBranches(props.organisationId);
    };

    const getActions = (branch: Branch) => {
        if (!hasUseCase("dir_edit_branches", props.useCases)) return [];

        return [
            <a key={"1"} onClick={() => props.editBranch(branch.id)}>
                edit
            </a>,
        ];
    };

    if (!props.organisationId) return <React.Fragment />;

    return (
        <>
            <EditBranch onSaved={onSaved} organisationId={props.organisationId} />
            <List
                bordered
                className="mt-1"
                dataSource={props.branches}
                loading={props.fetching}
                renderItem={(branch: Branch) => (
                    <List.Item actions={getActions(branch)}>{branch.name}</List.Item>
                )}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const branchesState = branchesSelector(state);

    return {
        branches: branchesState.items,
        fetching: branchesState.fetching,
        useCases: useCaseSelector(state),
        organisationId: organisationIdSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        fetchBranches: (organisationId: string) => {
            const filters = { organisationId: [organisationId] };
            dispatch(fetchBranches(filters));
            dispatch(clearBranch());
            dispatch(branchVisible(false));
        },
        editBranch: (branchId: string) => {
            dispatch(fetchBranch(branchId));
            dispatch(branchVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BranchList);
