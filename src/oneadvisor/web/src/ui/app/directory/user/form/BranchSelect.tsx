import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { ValidationResult } from "@/app/validation/types";
import { RootState } from "@/state";
import { Branch, getBranches } from "@/state/directory/branches";
import { FormSelect } from "@/ui/controls";

type Props = {
    branchId: string | null;
    organisationId: string | null;
    validationResults: ValidationResult[];
    onChange: (branchId: string) => void;
    readonly?: boolean;
} & PropsFromDispatch;

const BranchSelect: React.FC<Props> = (props) => {
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        loadBranches();
    }, [props.organisationId]);

    const loadBranches = () => {
        if (!props.organisationId) {
            setBranches([]);
            return;
        }

        props.getBranches({ organisationId: [props.organisationId] }, (result) => {
            setBranches(result.items);
        });
    };

    return (
        <FormSelect
            layout="horizontal"
            fieldName="branchId"
            label="Branch"
            value={props.branchId || ""}
            onChange={(_fieldName: string, value: string) => {
                props.onChange(value);
            }}
            validationResults={props.validationResults}
            options={branches}
            optionsValue="id"
            optionsText="name"
            defaultActiveFirstOption={false}
            readonly={props.readonly}
        />
    );
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ getBranches }, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(BranchSelect);

/*
componentDidMount() {
        this.loadBranchList(this.props.branchId);
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.props.branchId != prevProps.branchId &&
            this.props.branchId != this.state.branchId
        ) {
            this.loadBranchList(this.props.branchId);
        }
    }

    loadBranchList = (branchId: string) => {
        //Update state
        this.setState({
            branchId: branchId,
        });

        //Organisation already correct
        const branch = this.props.branches.find((b) => b.id === branchId);
        if (branch && branch.organisationId === this.state.organisationId) return;

        //If no branch, just set the first org id in the list
        if (!branchId) {
            this.setOrganisationId(this.props.organisations[0].id);
            return;
        }

        //First get the branch org id
        this.props.dispatch(
            fetchBranch(branchId, (branch: Branch) => {
                this.setOrganisationId(branch.organisationId);
            })
        );
    };

    setOrganisationId = (organisationId: string) => {
        this.setState({
            organisationId: organisationId,
        });
        this.props.dispatch(fetchBranches({ organisationId: [organisationId] }));
    };

    handleOrganisationChange = (fieldName: string, organisationId: string) => {
        this.props.dispatch(fetchBranches({ organisationId: [organisationId] }));
        this.props.onChange("");
        this.setState({
            branchId: "",
            organisationId: organisationId,
        });
    };
    */
