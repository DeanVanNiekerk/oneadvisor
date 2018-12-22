import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { Branch, branchesSelector, fetchBranch, fetchBranches, receiveBranch } from '@/state/app/directory/branches';
import { Organisation } from '@/state/app/directory/organisations';
import { RootState } from '@/state/rootReducer';
import { FormSelect } from '@/ui/controls';

type Props = {
    branchId: string;
    organisations: Organisation[];
    branches: Branch[];
    validationResults: ValidationResult[];
    onChange: (branchId: string) => void;
} & DispatchProp;

type State = {
    branchId: string;
    organisationId: string;
};

class BranchSelect extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            branchId: '',
            organisationId: ''
        };
    }

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
            branchId: branchId
        });

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
            organisationId: organisationId
        });
        this.props.dispatch(fetchBranches(organisationId));
    };

    handleOrganisationChange = (fieldName: string, value: string) => {
        this.props.dispatch(fetchBranches(value));
        this.props.onChange('');
        this.setState({
            branchId: '',
            organisationId: value
        });
    };

    render() {
        return (
            <>
                <FormSelect
                    layout="horizontal"
                    fieldName="organisationId"
                    label="Organisation"
                    value={this.state.organisationId}
                    onChange={this.handleOrganisationChange}
                    validationResults={this.props.validationResults}
                    options={this.props.organisations}
                    optionsValue="id"
                    optionsText="name"
                />
                <FormSelect
                    layout="horizontal"
                    fieldName="branchId"
                    label="Branch"
                    value={this.state.branchId}
                    onChange={(fieldName: string, value: string) => {
                        this.props.onChange(value);
                    }}
                    validationResults={this.props.validationResults}
                    options={this.props.branches}
                    optionsValue="id"
                    optionsText="name"
                    defaultActiveFirstOption={false}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const branchesState = branchesSelector(state);

    return {
        branches: branchesState.items
    };
};

export default connect(mapStateToProps)(BranchSelect);
