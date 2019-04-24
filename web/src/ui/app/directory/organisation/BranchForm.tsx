import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { Branch } from '@/state/app/directory/branches';
import { Button, Form, FormField, FormInput } from '@/ui/controls';

type Props = {
    branch: Branch;
    validationResults: ValidationResult[];
    onSave: (branch: Branch) => void;
    onCancel: () => void;
};

type State = {
    branch: Branch;
};

class BranchForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            branch: props.branch,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.branch != prevProps.branch)
            this.setState({
                branch: this.props.branch,
            });
    }

    handleChange = (fieldName: keyof Branch, value: string) => {
        const branch = {
            ...this.state.branch,
            [fieldName]: value,
        };
        this.setState({
            branch: branch,
        });
    };

    render() {
        const { validationResults } = this.props;
        const { branch } = this.state;

        return (
            <Form layout="inline">
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={branch.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
                <FormField className="mr-0">
                    <Button onClick={() => this.props.onCancel()}>
                        Cancel
                    </Button>
                </FormField>
                <FormField>
                    <Button
                        onClick={() => this.props.onSave(this.state.branch)}
                        type="primary"
                    >
                        {this.props.branch.id ? "Update Branch" : "Add Branch"}
                    </Button>
                </FormField>
            </Form>
        );
    }
}

export default BranchForm;
